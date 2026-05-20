import type { CssMap } from "hson-live/types";
import { cssSCROLL } from "../core/consts/main.css";
import { OKLCH_ACID_WASHED } from "../core/consts/oklch";
import { _TXT, TXTcol_ALT } from "../core/consts/ui-consts";


export const cssCONTENT_BOX: CssMap = {
  display: "flex",
  flexDirection: "column",
  gridColumn: "2",
  height: "100%",
  width: "100%",
};

export const cssCONTENT_HEADER: CssMap = {
  position: "absolute",
  textAlign: "center",
  top: "2rem",
  alignSelf: "center",
  fontSize: _TXT.subheading,
  color: OKLCH_ACID_WASHED.straw,
  fontWeight: "600",
  width: "90%",
};

export const cssCONTENT_TXT: CssMap = {
  position: "absolute",
  inset: "100px 50px",
  overflowY: "auto",
  mixBlendMode: "color-dodge",
  fontWeight: "100",
  letterSpacing: "1.9px",
  fontFamily: "'Cormorant'",
  color: TXTcol_ALT,
  fontSize: _TXT.main,
  ...cssSCROLL,
};

export const cssCONTENT_BACK: CssMap = {
  position: "absolute",
  inset: "0",
  pointerEvents: "none",
  overflow: "hidden",
  opacity: "0.6",
};

export const cssFRAME: CssMap = {
  position: "absolute",
  inset: "0",
  width: "100%",
  height: "100%",
  pointerEvents: "none",
  overflow: "visible",
}