import { css, Global } from "@emotion/react";
import React from "react";

import reset from "../reset";

const baseTheme = css`
  :root {
    --colors-white: #fff;
    --colors-black: #000;

    --colors-grey100: #f5f7fa;
    --colors-grey200: #f4e7eb;
    --colors-grey300: #9aa5b1;
    --colors-grey400: #7b8794;
    --colors-grey500: #616e7c;
    --colors-grey600: #52606d;
    --colors-grey700: #2e4c59;
    --colors-grey800: #323f4b;
    --colors-grey900: #1f2933;

    /* don't use this it's for the global bg only */
    --colors-grey1200: #10151a;

    /* https://maketintsandshades.com/ */
    --colors-green200: #33a195;
    --colors-green300: #1a9588;
    --colors-green400: #00897b;
    --colors-green500: #007b6f;
    --colors-green600: #006e62;

    --colors-amber400: #ffc233;
    --colors-amber500: #ffbb1a;
    --colors-amber600: #ffb300;
    --colors-amber700: #e6a100;
    --colors-amber800: #cc8f00;
    --colors-amber900: #b37d00;

    --colors-red600: #d15353;
    --colors-red700: #cc3e3e;
    --colors-red800: #c62828;
    --colors-red900: #b22424;
    --colors-red1000: #9e2020;

    --colors-bluegreen400: #61818d;
    --colors-bluegreen500: #4d727e;
    --colors-bluegreen600: #396270;
    --colors-bluegreen700: #335865;
    --colors-bluegreen800: #2e4e5a;

    --fonts-primaryHeader: "Maven Pro", sans-serif;
    --fonts-secondaryHeader: "Overpass Mono", monospace;
    --fonts-text: "Signika", sans-serif;

    --states-default: var(--colors-bluegreen600);
    /* hint applies a transparent darkening background */
    --states-hint: #00000057;
    --states-hint-secondary: #00000057;

    --states-info: var(--colors-bluegreen600);
    --states-info-secondary: var(--colors-bluegreen700);

    --states-error: var(--colors-red800);
    --states-error-secondary: var(--colors-red1000);

    --states-success: var(--colors-green400);
    --states-success-secondary: var(--colors-green600);

    --states-warning: var(--colors-amber600);
    --states-warning-secondary: var(--colors-amber700);

    --text-dark-bg: var(--colors-grey200);
    --text-light-bg: var(--colors-grey700);

    --border-radius: 4px;
    --height-std: 40px;
    --height-compact: 30px;
    --padding-std: 6px;
  }
`;

const darkTheme = css`
  :root,
  body[data-theme="dark"] {
    --global-bg: var(--colors-grey1200);

    --primary: var(--colors-grey800);
    --secondary: var(--colors-grey600);
    --tertiary: var(--colors-grey500);
    --text-primary: var(--colors-grey200);
    --text-secondary: var(--colors-grey400);
  }
`;

const lightTheme = css`
  body[data-theme="light"] {
    --global-bg: #fff;
    --primary: #f3f3f3;
    --secondary: #b6b6c5;
    --tertiary: #7e7e7e;
    --text-primary: #22262c;
    --text-secondary: #272b33;
  }
`;

function GlobalStyles() {
  return (
    <>
      <Global styles={[reset, baseTheme, darkTheme, lightTheme]} />

      <Global
        styles={css`
          body {
            margin: 0;
            background: var(--global-bg);
            font-family: var(--fonts-text);
            color: var(--text-primary);
          }

          * {
            box-sizing: border-box;
          }

          #root,
          #__next {
            height: 100%;
          }
        `}
      />
    </>
  );
}

export default React.memo(GlobalStyles);
