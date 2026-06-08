import type { CssMap } from "hson-live/types";
import { cssLOGO_BASE_TEXT, cssLOGO_MAIN } from "../../core/consts/main.css";
import { OKLCH_FOREST, OKLCH_NEUTRALS, OKLCH_ACID_WASHED } from "../../core/consts/oklch";
import { SPP_MENUfont } from "../../core/consts/ui.consts";
import { set_alpha } from "../../ui/colors/color-helpers";

export const CONTENT_WASH_OPENcss: CssMap = {
  opacity: "1",
};
export const CONTENT_READINGcss: CssMap = {
  maxWidth: "68ch",
  margin: "clamp(8rem, 18vh, 14rem) auto 0",
  padding: "0 clamp(2rem, 7vw, 6rem)",
  color: OKLCH_FOREST.laurelShadow,
  fontFamily: SPP_MENUfont,
  pointerEvents: "auto",
};
export const CONTENT_HEADcss: CssMap = {
  margin: "0 0 1.6rem",
  fontSize: "clamp(2.2rem, 5vw, 5rem)",
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
  0 1px 0 ${set_alpha(OKLCH_NEUTRALS.paper, 1)},
  0 -1px 0 ${set_alpha(OKLCH_ACID_WASHED.straw, 1)}
`
};
export const MENU_BTN_OVER_WASHcss: CssMap = {
  position: "relative",
  zIndex: "8",
  color: OKLCH_FOREST.laurelShadow,
  // CHANGED: keep button text behavior aligned with the logo if inherited
  // text-fill effects are present.
  textShadow: `0 1px 0 ${set_alpha(OKLCH_NEUTRALS.paper, 0.42)}`,
};
export const LOGO_SHADOW_HOSTcss: CssMap = {
  gridColumn: "1",
  gridRow: "1",
  display: "grid",
  position: "relative",
  width: "fit-content",
  justifySelf: "center",
  alignSelf: "center",
  pointerEvents: "none",
  zIndex: "7",
  visibility: "hidden",
};



export const LOGO_ECHO_ECHOcss: CssMap = {
  ...cssLOGO_BASE_TEXT,
  top: "auto",
  left: "auto",
  // alignSelf: "center",
  color: OKLCH_FOREST.bottleGlass,
  opacity: "1",
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
  radial-gradient(circle at 18% 20%, ${set_alpha(OKLCH_NEUTRALS.paper, 0.38)}, transparent 34%),
  radial-gradient(circle at 82% 12%, ${set_alpha(OKLCH_NEUTRALS.paper, 0.28)}, transparent 28%),
  linear-gradient(180deg, ${set_alpha(OKLCH_NEUTRALS.paper, 0.62)}, ${set_alpha(OKLCH_NEUTRALS.paper, 0.50)})
`,
  boxShadow: `
  inset 0 0 2.5rem ${set_alpha(OKLCH_FOREST.deepMossBlack, 0.20)},
  inset 0 0 0 1px ${set_alpha(OKLCH_NEUTRALS.paper, 0.18)}
`,
};
