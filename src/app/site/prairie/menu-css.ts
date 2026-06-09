import type { CssMap } from "hson-live/types";
import { cssLOGO_BASE_TEXT, cssLOGO_MAIN } from "../../core/consts/main.css";
import { OKLCH_FOREST, OKLCH_NEUTRALS, OKLCH_ACID_WASHED, OKLCH_VIBRANT } from "../../core/consts/oklch";
import { SPP_MENUfont } from "../../core/consts/ui.consts";
import { set_alpha } from "../../ui/colors/color-helpers";

export const CONTENT_WASH_OPENcss: CssMap = {
  opacity: "1",
};
export const CONTENT_READINGcss: CssMap = {
  maxWidth: "68ch",
  margin: "clamp(8rem, 18vh, 14rem) auto 0",
  padding: "5rem clamp(2rem, 7vw, 6rem)",
  color: OKLCH_FOREST.laurelShadow,
  fontFamily: SPP_MENUfont,
  pointerEvents: "auto",
};
export const CONTENT_HEADcss: CssMap = {
  margin: "0 0 1.6rem",
  fontSize: "clamp(1.2rem, 5vw, 3rem)",
  lineHeight: "0.95",
  fontWeight: "700",
  letterSpacing: "0.02em",
  color: OKLCH_FOREST.laurelShadow,
};
export const CONTENT_BODYcss: CssMap = {
  margin: "0",
  fontSize: "clamp(1.1rem, 1.9vw, 1.65rem)",
  lineHeight: "1.45",
  letterSpacing: "0.04em",
  color: OKLCH_FOREST.laurelShadow,
  whiteSpace: "pre-wrap",
};
export const MENU_OVER_WASHcss: CssMap = {
  color: OKLCH_FOREST.laurelShadow,
  position: "relative",
  zIndex: "8",
};
export const LOGO_OVER_WASHcss: CssMap = {
  // position: "relative",
  zIndex: "8",
  color: OKLCH_FOREST.laurelShadow,
  background: "none",
  backgroundImage: "none",
  textShadow: `
  -1px -1px 0.5px ${OKLCH_VIBRANT.yellowCanary},
  1px 1px 1px ${OKLCH_VIBRANT.plumBruised}
  `
};
export const MENU_BTN_OVER_WASHcss: CssMap = {
  position: "relative",
  zIndex: "8",
  color: OKLCH_FOREST.laurelShadow,
  visibility: "visible",
  // CHANGED: keep button text behavior aligned with the logo if inherited
  // text-fill effects are present.
  // textShadow: `0 1px 0 ${set_alpha(OKLCH_NEUTRALS.paper, 0.42)}`,
};


export const CONTENT_WASHcss: CssMap = {
  position: "absolute",
  inset: "0",
  zIndex: "4",
  pointerEvents: "none",
  opacity: "0",
  transition: "opacity 420ms ease",
  color: OKLCH_FOREST.laurelShadow,
  background: `
  radial-gradient(circle at 18% 20%, ${set_alpha(OKLCH_NEUTRALS.paper, 0.88)}, transparent 34%),
  radial-gradient(circle at 82% 12%, ${set_alpha(OKLCH_NEUTRALS.paper, 0.78)}, transparent 28%),
  linear-gradient(180deg, ${set_alpha(OKLCH_NEUTRALS.paper, 0.92)}, ${set_alpha(OKLCH_NEUTRALS.paper, 0.80)})
`,
  boxShadow: `
  inset 0 0 2.5rem ${set_alpha(OKLCH_FOREST.deepMossBlack, 0.20)},
  inset 0 0 0 1px ${set_alpha(OKLCH_NEUTRALS.paper, 0.18)}
`,
};
