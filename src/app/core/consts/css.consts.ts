import type { CssMap } from "hson-live/types";
import { _COLS, _TXT, SYS_MONOfont, SYS_SANSfont } from "./ui-consts";

export const FONT_FAM_MONO: CssMap = {
    fontFamily: SYS_MONOfont,
    fontSize: _TXT.main,
    fontWeight: "200",
    letterSpacing: "0.5px",
    lineHeight: "1.6rem",
}
export const FONT_FAM_SANS: CssMap = {
    fontFamily: SYS_SANSfont,
    fontSize: _TXT.sansMain,
    fontWeight: "500",
    letterSpacing: "0.2px",
    lineHeight: "2em",
}


export const STAGE_CSS: CssMap = {
  position: "fixed",
  top: "0",
  left: "0",
  width: "100vw",
  height: "100vh",
  backgroundColor: _COLS.backlo
}