// ui-consts.ts


import { set_alpha } from "../helpers/color-helpers";
import { $gry_, ACID_WASH_RGBA, bckColor, bcklight, deepBack } from "./colors.consts";
import { OKLCH_ACID_WASHED, OKLCH_FLEURS, OKLCH_NEUTRALS, OKLCH_VIBRANT } from "./oklch";
import type { Fmt } from "../types/core.types";
import { rng360 } from "../../site/prairie/prairie-helpers";

export const _TXT = {
  smol: "0.75rem",
  sansMain: "1.1rem",
  main: "1.1rem",
  subheading: "1.5rem",
  heading: "5.1rem",
} as const;


// export const TXTcol_MENU = OKLCH_VIBRANT.blueCobalt;
export const TXTcol_MENU = OKLCH_FLEURS.electricCyan;
export const TXTcol_MAIN = OKLCH_VIBRANT.yellowBrightEyesStaringSun;
export const TXTcol_CODE = OKLCH_VIBRANT.blueCobalt;
export const TXTcol_ALT = OKLCH_FLEURS.electricCyan;
const scrollA = "rgba(238, 220, 158, 0.82)"


/* markdown highlighting */
export const HEADERcol = OKLCH_FLEURS.greyLilac;
export const TOCcol = OKLCH_VIBRANT.mintIce;

/* code markdown */
export const CODE_PARENScol = OKLCH_ACID_WASHED.amber;
export const CODE_PARENS_INNERcol = OKLCH_VIBRANT.blueHorizon;
export const CODE_PUNCTcol = OKLCH_ACID_WASHED.ember;
export const CODE_QUOTEcol = OKLCH_ACID_WASHED.smokeRose;
export const CODE_EQUALScol = OKLCH_FLEURS.limeTint;
export const COMMENTScol = OKLCH_ACID_WASHED.fern;
export const CODE_BRACEcol = OKLCH_VIBRANT.violetIon;
export const LISTcol = OKLCH_FLEURS.greyLilac;


/* misc markdown */
export const COPYRITEcol = $gry_.dimmer;
export const URLcol = ACID_WASH_RGBA.softBlue;


export const SYS_SERIFfont = "'Cormorant', serif";
// export const SYS_SMOLfont = "'Tiny5', Trebuchet MS"
export const SYS_MONOfont = "'Inconsolata', Monaco, monospace";
export const SYS_SANSfont = "'IBM Plex Sans', sans-serif";
export const $SKYBACK_GRAD = `linear-gradient(${rng360()}deg, hsl(210 45% 22%), hsl(210 45% 12%))`;

export const GRID_GAPstr = "2px";
export const $CODE_FONT_SIZE = _TXT.main;
export const $PANEL_HIDDEN = 'panel-hidden';

// either do this or don't:
export const ABOUT_ROOT_ID = "about-root";

export const $svg_filter = `saturate(0.9) sepia(0.10)  contrast(0.9) brightness(1.04)`
export const FADE_1col = OKLCH_NEUTRALS.silver;


export const GRAFFITIcol = set_alpha(ACID_WASH_RGBA.mutedViolet, 0.2);

export const _COLS = {
  backlo: deepBack,
  backhi: bckColor,
  bcklight,
  scrollA
};

