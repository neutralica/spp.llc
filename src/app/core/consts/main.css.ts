import type { CssMap } from "hson-live/types";
import { OKLCH_ACID_WASHED, OKLCH_FLEURS } from "./oklch";
import { _TXT, $SKYBACK_GRAD, SYS_SERIFfont, _COLS, TXTcol_MAIN } from "./ui-consts";
import { set_alpha } from "../helpers/color-helpers";



const cssOVERLAY: CssMap = {
  position: "fixed",
  height: "100%",
  width: "100%",
  top: 0,
  left: 0,
};

export const cssPAGE_HOST: CssMap = {
  position: "absolute",
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  inset: "0",
};

export const cssPRAIRIE_HOST: CssMap = {
  position: "relative",
  width: "100%",
  height: "100%",
  overflow: "hidden",
  background: $SKYBACK_GRAD,
};

export const cssSCENE: CssMap = {
  position: "relative",
  filter: "saturate(0.92) sepia(0.10) contrast(0.96) brightness(1.04)",
  __after: {
    content: '""',
    position: "absolute",
    inset: "0",
    pointerEvents: "none",
    background: `
      radial-gradient(circle at 12% 8%, rgba(255, 246, 210, 0.14), transparent 34%),
      radial-gradient(circle at 92% 88%, rgba(255, 246, 210, 0.22), transparent 38%),
      linear-gradient(to bottom, rgba(8, 18, 32, 0.10), rgba(245, 224, 170, 0.08) 48%, rgba(42, 34, 18, 0.12))
    `,
    mixBlendMode: "soft-light",
  },
};


export const cssSCROLL: CssMap = {
  overflow: "auto",
  scrollbarWidth: "thin",
  scrollbarColor: "transparent transparent",

  _hover: {
    scrollbarColor: "rgba(238, 220, 158, 0.82) rgba(20, 40, 28, 0.18)",
  },

  "::-webkit-scrollbar": {
    width: "8px",
  },

  "::-webkit-scrollbar-track": {
    background: "transparent",
  },

  "::-webkit-scrollbar-thumb": {
    background: "transparent",
    borderRadius: "999px",
  },

  "&:hover::-webkit-scrollbar-thumb": {
    background: "rgba(238, 220, 158, 0.82)",
  },
};

export const cssCONTROL_PANEL: CssMap = {
  // inset: "0",
  // padding: "2rem",

};

export const cssGILT_TEXT: CssMap = {
  position: "relative",
  color: "#d8c77c",
  textShadow: `
    0 1px 0 rgba(255, 248, 190, 0.75),
    0 0 8px rgba(232, 211, 126, 0.38),
    0 8px 22px rgba(0, 0, 0, 0.42)
  `,
};

export const cssPRAIRIE_MASK: CssMap = {
  ...cssOVERLAY,
  __after: {
    content: '""',
    position: "absolute",
    inset: "0",
    pointerEvents: "none",
    background: `
      radial-gradient(
        ellipse 70vw 70vh at 0% 0%,
        ${set_alpha(_COLS.scrollA, 0.1)},
        transparent 99%
      ),
      radial-gradient(
        ellipse 70vw 70vh at 100% 0%,
        ${set_alpha(_COLS.scrollA, 0.1)},
        transparent 99%
      ),
      radial-gradient(
        ellipse 70vw 70vh at 100% 100%,
        ${set_alpha(_COLS.scrollA, 0.1)},
        transparent 99%
      ),
      radial-gradient(
        ellipse 70vh 70vh at 0% 100%,
        ${set_alpha(_COLS.scrollA, 0.1)},
        transparent 99%
      ),
      radial-gradient(
        ellipse 70vh 70vh at center,
        transparent,
        ${set_alpha(_COLS.scrollA, 0.2)} 160%
      )
    `,

    mixBlendMode: "soft-light",
  },
};

export const cssLINK_BOX: CssMap = {
  gridColumn: "2",
  gridRow: "1",
  display: "flex",
  justifyContent: "center",
}

/* svg attrs & css */
export const cssMENU_FX: CssMap = {
  userSelect: "none",
  textShadow: "0 0 5px " + OKLCH_FLEURS.pollen,
};


/* menu, content panels */
export const cssPANEL: CssMap = {
  position: "relative",
  alignSelf: "start",
  height: "100%",
  justifySelf: "stretch",
  inset: "0",
};

export const cssMENU_BOX: CssMap = {
  marginTop: "20vh",
  marginLeft: "2rem",
  display: "grid",
  gridTemplateColumns: "1fr 3fr 2fr"
};

export const cssLOGO: CssMap = {
  ...cssMENU_FX,
  ...cssGILT_TEXT,
  gridColumn: "1",
  gridRow: "1",
  fontSize: _TXT.heading,
  fontFamily: SYS_SERIFfont,
  color: OKLCH_ACID_WASHED.straw,
  width: "fit-content",
  justifySelf: "center",
};

export const cssMENU_BTN_TXT: CssMap = {
  ...cssMENU_FX,
  fontStyle: "italic",
  margin: "1rem",
  letterSpacing: "1.9px",
  fontSize: _TXT.main,
  fontFamily: SYS_SERIFfont,
  color: OKLCH_ACID_WASHED.straw,
  cursor: "pointer",
  alignSelf: "center",
  ...cssGILT_TEXT,
  _hover: {
    borderTop: "2px solid " + OKLCH_ACID_WASHED.straw,
    borderBottom: "2px solid " + OKLCH_ACID_WASHED.straw,
  }
};

export const cssHSON_BYLINE: CssMap = {
  position: "fixed",
  bottom: "1rem",
  right: "1rem",
  display: "flex",
  alignSelf: "end",
  marginLeft: "6rem",
  fontSize: _TXT.smol,
  fontFamily: SYS_SERIFfont,
  letterSpacing: "2px",
  opacity: "0.4",
  fontStyle: "italic",
};