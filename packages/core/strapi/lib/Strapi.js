'use strict';

const Koa = require('koa');
const Router = require('koa-router');
const _ = require('lodash');
const { createLogger } = require('@strapi/logger');
const { Database } = require('@strapi/database');

const loadConfiguration = require('./core/app-configuration');
const { createHTTPServer } = require('./server');
const { createContainer } = require('./container');
const loadModules = require('./core/load-modules');
const utils = require('./utils');
const bootstrap = require('./core/bootstrap');
const initializeMiddlewares = require('./middlewares');
const createStrapiFs = require('./core/fs');
const createEventHub = require('./services/event-hub');
const createWebhookRunner = require('./services/webhook-runner');
const { webhookModel, createWebhookStore } = require('./services/webhook-store');
const { createCoreStore, coreStoreModel } = require('./services/core-store');
const createEntityService = require('./services/entity-service');
const entityValidator = require('./services/entity-validator');
const createTelemetry = require('./services/metrics');
const createUpdateNotifier = require('./utils/update-notifier');
const createStartupLogger = require('./utils/startup-logger');
const ee = require('./utils/ee');

const LIFECYCLES = {
  REGISTER: 'register',
  BOOTSTRAP: 'bootstrap',
};

class Strapi {
  constructor(opts = {}) {
    this.container = createContainer(this);

    this.dir = opts.dir || process.cwd();
    this.config = loadConfiguration(this.dir, opts);

    this.reload = this.reload();

    // Expose `koa`.
    this.app = new Koa();
    this.router = new Router();

    this.server = createHTTPServer(this, this.app);

    this.app.proxy = this.config.get('server.proxy');

    // Logger.
    const loggerUserConfiguration = this.config.get('logger', {});
    this.log = createLogger(loggerUserConfiguration);

    this.isLoaded = false;

    // internal services.
    this.fs = createStrapiFs(this);
    this.eventHub = createEventHub();
    this.startupLogger = createStartupLogger(this);

    createUpdateNotifier(this).notify();
  }

  get EE() {
    return ee({ dir: this.dir, logger: this.log });
  }

  async start() {
    try {
      if (!this.isLoaded) {
        await this.load();
      }

      this.app.use(this.router.routes()).use(this.router.allowedMethods());

      // Launch server.
      await this.listen();

      return this;
    } catch (error) {
      return this.stopWithError(error.message);
    }
  }

  async destroy() {
    await this.server.destroy();

    await Promise.all(
      Object.values(this.plugins).map(plugin => {
        if (_.has(plugin, 'destroy') && typeof plugin.destroy === 'function') {
          return plugin.destroy();
        }
      })
    );

    if (_.has(this, 'admin')) {
      await this.admin.destroy();
    }

    this.eventHub.removeAllListeners();

    if (_.has(this, 'db')) {
      await this.db.destroy();
    }

    this.telemetry.destroy();

    delete global.strapi;
  }

  sendStartupTelemetry() {
    // Get database clients
    const databaseClients = _.map(this.config.get('connections'), _.property('settings.client'));

    // Emit started event.
    // do not await to avoid slower startup
    this.telemetry.send('didStartServer', {
      database: databaseClients,
      plugins: this.config.installedPlugins,
      providers: this.config.installedProviders,
    });
  }

  async openAdmin({ isInitialized }) {
    const shouldOpenAdmin =
      this.config.environment === 'development' &&
      this.config.get('server.admin.autoOpen', true) !== false;

    if (shouldOpenAdmin || !isInitialized) {
      await utils.openBrowser(this.config);
    }
  }

  async postListen() {
    const isInitialized = await utils.isInitialized(this);

    this.startupLogger.logStartupMessage({ isInitialized });

    this.sendStartupTelemetry();
    this.openAdmin({ isInitialized });
  }

  /**
   * Add behaviors to the server
   */
  async listen() {
    return new Promise((resolve, reject) => {
      const onListen = async error => {
        if (error) {
          return reject(error);
        }

        try {
          await this.postListen();

          resolve();
        } catch (error) {
          reject(error);
        }
      };

      const listenSocket = this.config.get('server.socket');

      if (listenSocket) {
        return this.server.listen(listenSocket, onListen);
      }

      const { host, port } = this.config.get('server');
      return this.server.listen(port, host, onListen);
    });
  }

  stopWithError(err, customMessage) {
    this.log.debug(`⛔️ Server wasn't able to start properly.`);
    if (customMessage) {
      this.log.error(customMessage);
    }

    this.log.error(err);
    return this.stop();
  }

  stop(exitCode = 1) {
    this.server.destroy();

    if (this.config.autoReload) {
      process.send('stop');
    }

    // Kill process
    process.exit(exitCode);
  }

  loadAdmin() {
    this.admin = require('@strapi/admin/strapi-server');

    // TODO: rename into just admin and ./config/admin.js
    const userAdminConfig = strapi.config.get('server.admin');
    this.config.set('server.admin', _.merge(this.admin.config, userAdminConfig));
  }

  async load() {
    this.app.use(async (ctx, next) => {
      if (ctx.request.url === '/_health' && ['HEAD', 'GET'].includes(ctx.request.method)) {
        ctx.set('strapi', 'You are so French!');
        ctx.status = 204;
      } else {
        await next();
      }
    });

    const modules = await loadModules(this);

    this.loadAdmin();

    this.api = modules.api;
    this.components = modules.components;
    this.plugins = modules.plugins;
    this.middleware = modules.middlewares;
    this.hook = modules.hook;

    await bootstrap(this);

    // init webhook runner
    this.webhookRunner = createWebhookRunner({
      eventHub: this.eventHub,
      logger: this.log,
      configuration: this.config.get('server.webhooks', {}),
    });

    await this.runLifecyclesFunctions(LIFECYCLES.REGISTER);

    const contentTypes = [
      coreStoreModel,
      webhookModel,
      ...Object.values(strapi.contentTypes),
      ...Object.values(strapi.components),
    ];

    this.db = await Database.init({
      ...this.config.get('database'),
      models: Database.transformContentTypes(contentTypes),
    });

    await this.db.schema.sync();

    this.store = createCoreStore({
      environment: this.config.environment,
      db: this.db,
    });

    this.webhookStore = createWebhookStore({ db: this.db });

    await this.startWebhooks();

    this.entityValidator = entityValidator;

    this.entityService = createEntityService({
      strapi: this,
      db: this.db,
      eventHub: this.eventHub,
      entityValidator: this.entityValidator,
    });

    this.telemetry = createTelemetry(this);

    // Initialize middlewares.
    await initializeMiddlewares.call(this);

    await this.runLifecyclesFunctions(LIFECYCLES.BOOTSTRAP);

    this.isLoaded = true;
    return this;
  }

  async startWebhooks() {
    const webhooks = await this.webhookStore.findWebhooks();
    webhooks.forEach(webhook => this.webhookRunner.add(webhook));
  }

  reload() {
    const state = {
      shouldReload: 0,
    };

    const reload = function() {
      if (state.shouldReload > 0) {
        // Reset the reloading state
        state.shouldReload -= 1;
        reload.isReloading = false;
        return;
      }

      if (this.config.autoReload) {
        this.server.destroy();
        process.send('reload');
      }
    };

    Object.defineProperty(reload, 'isWatching', {
      configurable: true,
      enumerable: true,
      set: value => {
        // Special state when the reloader is disabled temporarly (see GraphQL plugin example).
        if (state.isWatching === false && value === true) {
          state.shouldReload += 1;
        }
        state.isWatching = value;
      },
      get: () => {
        return state.isWatching;
      },
    });

    reload.isReloading = false;
    reload.isWatching = true;

    return reload;
  }

  async runLifecyclesFunctions(lifecycleName) {
    const execLifecycle = async fn => {
      if (!fn) {
        return;
      }

      return fn();
    };

    const configPath = `functions.${lifecycleName}`;

    // plugins
    await Promise.all(
      Object.keys(this.plugins).map(plugin => {
        const pluginFunc = _.get(this.plugins[plugin], `config.${configPath}`);

        return execLifecycle(pluginFunc).catch(err => {
          strapi.log.error(`${lifecycleName} function in plugin "${plugin}" failed`);
          console.error(err);
          strapi.stop();
        });
      })
    );

    // user
    await execLifecycle(_.get(this.config, configPath));

    // admin
    const adminFunc = _.get(this.admin.config, configPath);
    return execLifecycle(adminFunc).catch(err => {
      strapi.log.error(`${lifecycleName} function in admin failed`);
      console.error(err);
      strapi.stop();
    });
  }

  getModel(uid) {
    return this.contentTypes[uid] || this.components[uid];
  }

  /**
   * Binds queries with a specific model
   * @param {string} uid
   * @returns {}
   */
  query(uid) {
    return this.db.query(uid);
  }
}

module.exports = options => {
  const strapi = new Strapi(options);
  global.strapi = strapi;
  return strapi;
};

module.exports.Strapi = Strapi;
