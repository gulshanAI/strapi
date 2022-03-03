import React from 'react';
import { render } from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import { ThemeProvider, lightTheme } from '@strapi/design-system';
import { useTracking } from '@strapi/helper-plugin';
import MarketPlacePage from '../index';

jest.mock('@strapi/helper-plugin', () => ({
  pxToRem: jest.fn(),
  CheckPagePermissions: ({ children }) => children,
  useTracking: jest.fn(() => ({ trackUsage: jest.fn() })),
}));

const App = (
  <ThemeProvider theme={lightTheme}>
    <IntlProvider locale="en" messages={{}} textComponent="span">
      <MarketPlacePage />
    </IntlProvider>
  </ThemeProvider>
);

describe('Marketplace coming soon', () => {
  it('renders and matches the snapshot', () => {
    const {
      container: { firstChild },
    } = render(App);

    expect(firstChild).toMatchInlineSnapshot(`
      .c1 {
        padding-bottom: 56px;
      }

      .c4 {
        background: #f6f6f9;
        padding-top: 40px;
        padding-right: 56px;
        padding-bottom: 40px;
        padding-left: 56px;
      }

      .c9 {
        padding-right: 56px;
        padding-left: 56px;
      }

      .c0 {
        display: grid;
        grid-template-columns: 1fr;
      }

      .c2 {
        overflow-x: hidden;
      }

      .c5 {
        display: -webkit-box;
        display: -webkit-flex;
        display: -ms-flexbox;
        display: flex;
        -webkit-flex-direction: row;
        -ms-flex-direction: row;
        flex-direction: row;
        -webkit-box-pack: justify;
        -webkit-justify-content: space-between;
        -ms-flex-pack: justify;
        justify-content: space-between;
        -webkit-align-items: center;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
      }

      .c6 {
        display: -webkit-box;
        display: -webkit-flex;
        display: -ms-flexbox;
        display: flex;
        -webkit-flex-direction: row;
        -ms-flex-direction: row;
        flex-direction: row;
        -webkit-align-items: center;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
      }

      .c7 {
        color: #32324d;
        font-weight: 600;
        font-size: 2rem;
        line-height: 1.25;
      }

      .c8 {
        color: #666687;
        font-size: 1rem;
        line-height: 1.5;
      }

      .c17 {
        padding-top: 12px;
      }

      .c18 {
        display: -webkit-box;
        display: -webkit-flex;
        display: -ms-flexbox;
        display: flex;
        -webkit-flex-direction: row;
        -ms-flex-direction: row;
        flex-direction: row;
        -webkit-align-items: center;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
      }

      .c13 {
        padding-bottom: 32px;
      }

      .c10 {
        background: #ffffff;
        padding-top: 56px;
        padding-bottom: 56px;
        border-radius: 4px;
        box-shadow: 0px 1px 4px rgba(33,33,52,0.1);
      }

      .c21 {
        padding-top: 24px;
      }

      .c22 {
        display: -webkit-box;
        display: -webkit-flex;
        display: -ms-flexbox;
        display: flex;
        -webkit-flex-direction: row;
        -ms-flex-direction: row;
        flex-direction: row;
        -webkit-align-items: center;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
      }

      .c11 {
        display: -webkit-box;
        display: -webkit-flex;
        display: -ms-flexbox;
        display: flex;
        -webkit-flex-direction: column;
        -ms-flex-direction: column;
        flex-direction: column;
      }

      .c11 > * {
        margin-top: 0;
        margin-bottom: 0;
      }

      .c23 > * {
        margin-left: 0;
        margin-right: 0;
      }

      .c23 > * + * {
        margin-left: 8px;
      }

      .c28 {
        font-weight: 600;
        color: #32324d;
        font-size: 0.875rem;
        line-height: 1.43;
      }

      .c30 {
        padding-left: 8px;
      }

      .c25 {
        display: -webkit-box;
        display: -webkit-flex;
        display: -ms-flexbox;
        display: flex;
        cursor: pointer;
        padding: 8px;
        border-radius: 4px;
        background: #ffffff;
        border: 1px solid #dcdce4;
        position: relative;
        outline: none;
      }

      .c25 svg {
        height: 12px;
        width: 12px;
      }

      .c25 svg > g,
      .c25 svg path {
        fill: #ffffff;
      }

      .c25[aria-disabled='true'] {
        pointer-events: none;
      }

      .c25:after {
        -webkit-transition-property: all;
        transition-property: all;
        -webkit-transition-duration: 0.2s;
        transition-duration: 0.2s;
        border-radius: 8px;
        content: '';
        position: absolute;
        top: -4px;
        bottom: -4px;
        left: -4px;
        right: -4px;
        border: 2px solid transparent;
      }

      .c25:focus-visible {
        outline: none;
      }

      .c25:focus-visible:after {
        border-radius: 8px;
        content: '';
        position: absolute;
        top: -5px;
        bottom: -5px;
        left: -5px;
        right: -5px;
        border: 2px solid #4945ff;
      }

      .c24 {
        cursor: pointer;
      }

      .c26 {
        padding: 10px 16px;
        background: #4945ff;
        border: none;
        border-radius: 4px;
        border: 1px solid #4945ff;
        background: #4945ff;
        display: -webkit-inline-box;
        display: -webkit-inline-flex;
        display: -ms-inline-flexbox;
        display: inline-flex;
        -webkit-text-decoration: none;
        text-decoration: none;
      }

      .c26 .c29 {
        display: -webkit-box;
        display: -webkit-flex;
        display: -ms-flexbox;
        display: flex;
        -webkit-align-items: center;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
      }

      .c26 .c27 {
        color: #ffffff;
      }

      .c26[aria-disabled='true'] {
        border: 1px solid #dcdce4;
        background: #eaeaef;
      }

      .c26[aria-disabled='true'] .c27 {
        color: #666687;
      }

      .c26[aria-disabled='true'] svg > g,
      .c26[aria-disabled='true'] svg path {
        fill: #666687;
      }

      .c26[aria-disabled='true']:active {
        border: 1px solid #dcdce4;
        background: #eaeaef;
      }

      .c26[aria-disabled='true']:active .c27 {
        color: #666687;
      }

      .c26[aria-disabled='true']:active svg > g,
      .c26[aria-disabled='true']:active svg path {
        fill: #666687;
      }

      .c26:hover {
        border: 1px solid #7b79ff;
        background: #7b79ff;
      }

      .c26:active {
        border: 1px solid #4945ff;
        background: #4945ff;
      }

      .c26 svg > g,
      .c26 svg path {
        fill: #ffffff;
      }

      .c31 {
        padding: 10px 16px;
        background: #4945ff;
        border: none;
        border-radius: 4px;
        border: 1px solid #d9d8ff;
        background: #f0f0ff;
        display: -webkit-inline-box;
        display: -webkit-inline-flex;
        display: -ms-inline-flexbox;
        display: inline-flex;
        -webkit-text-decoration: none;
        text-decoration: none;
      }

      .c31 .c29 {
        display: -webkit-box;
        display: -webkit-flex;
        display: -ms-flexbox;
        display: flex;
        -webkit-align-items: center;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
      }

      .c31 .c27 {
        color: #ffffff;
      }

      .c31[aria-disabled='true'] {
        border: 1px solid #dcdce4;
        background: #eaeaef;
      }

      .c31[aria-disabled='true'] .c27 {
        color: #666687;
      }

      .c31[aria-disabled='true'] svg > g,
      .c31[aria-disabled='true'] svg path {
        fill: #666687;
      }

      .c31[aria-disabled='true']:active {
        border: 1px solid #dcdce4;
        background: #eaeaef;
      }

      .c31[aria-disabled='true']:active .c27 {
        color: #666687;
      }

      .c31[aria-disabled='true']:active svg > g,
      .c31[aria-disabled='true']:active svg path {
        fill: #666687;
      }

      .c31:hover {
        background-color: #ffffff;
      }

      .c31:active {
        background-color: #ffffff;
        border: 1px solid #4945ff;
      }

      .c31:active .c27 {
        color: #4945ff;
      }

      .c31:active svg > g,
      .c31:active svg path {
        fill: #4945ff;
      }

      .c31 .c27 {
        color: #271fe0;
      }

      .c31 svg > g,
      .c31 svg path {
        fill: #271fe0;
      }

      .c3:focus-visible {
        outline: none;
      }

      .c15 {
        color: #32324d;
        font-weight: 600;
        font-size: 2rem;
        line-height: 1.25;
      }

      .c16 {
        color: #271fe0;
        font-weight: 600;
        font-size: 2rem;
        line-height: 1.25;
      }

      .c19 {
        color: #666687;
        font-size: 1rem;
        line-height: 1.5;
      }

      .c20 {
        text-align: center;
      }

      .c14 {
        width: 11.875rem;
      }

      .c12 {
        -webkit-align-items: center;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
      }

      <div
        class="c0"
      >
        <div
          class="c1 c2"
        >
          <main
            aria-labelledby="main-content-title"
            class="c3"
            id="main-content"
            tabindex="-1"
          >
            <div
              style="height: 0px;"
            >
              <div
                class="c4"
                data-strapi-header="true"
              >
                <div
                  class="c5"
                >
                  <div
                    class="c6"
                  >
                    <h1
                      class="c7"
                    >
                      Marketplace
                    </h1>
                  </div>
                </div>
                <p
                  class="c8"
                >
                  Get more out of Strapi
                </p>
              </div>
            </div>
            <div
              class="c9"
            >
              <div
                class="c10 c11 c12"
              >
                <div
                  class="c13"
                >
                  <img
                    alt="marketplace illustration"
                    class="c14"
                    src="IMAGE_MOCK"
                  />
                </div>
                <span
                  class="c15"
                >
                  A new way to make Strapi awesome.
                </span>
                <span
                  class="c16"
                >
                  Finally here.
                </span>
                <div
                  class="c17 c18"
                >
                  <span
                    class="c19 c20"
                  >
                    The web marketplace helps you get the most of Strapi. In addition, we are working hard to offer the best experience to discover and install plugins, directly from the app.
                  </span>
                </div>
                <div
                  class="c21 c22 c23"
                  spacing="2"
                >
                  <a
                    aria-disabled="false"
                    class="c24 c25 c26"
                    href="https://market.strapi.io"
                    rel="noreferrer noopener"
                    target="_blank"
                  >
                    <span
                      class="c27 c28"
                    >
                      Visit the web marketplace
                    </span>
                    <div
                      aria-hidden="true"
                      class="c29 c30"
                    >
                      <svg
                        fill="none"
                        height="1em"
                        viewBox="0 0 24 24"
                        width="1em"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M16.235 2.824a1.412 1.412 0 010-2.824h6.353C23.368 0 24 .633 24 1.412v6.353a1.412 1.412 0 01-2.823 0V4.82l-8.179 8.178a1.412 1.412 0 01-1.996-1.996l8.178-8.178h-2.945zm4.942 10.588a1.412 1.412 0 012.823 0v9.176c0 .78-.632 1.412-1.412 1.412H1.412C.632 24 0 23.368 0 22.588V1.412C0 .632.632 0 1.412 0h9.176a1.412 1.412 0 010 2.824H2.824v18.353h18.353v-7.765z"
                          fill="#32324D"
                        />
                      </svg>
                    </div>
                  </a>
                  <a
                    aria-disabled="false"
                    class="c24 c25 c31"
                    href="https://market.strapi.io/submit-plugin"
                    rel="noreferrer noopener"
                    target="_blank"
                  >
                    <span
                      class="c27 c28"
                    >
                      Submit your plugin
                    </span>
                  </a>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    `);
  });

  it('sends an event when the user enters the marketplace', () => {
    const trackUsage = jest.fn();
    useTracking.mockImplementation(() => ({ trackUsage }));
    render(App);

    expect(trackUsage).toHaveBeenCalledWith('didGoToMarketplace');
  });
});
