import type { CssMap } from "hson-live/types";
import { OKLCH_ACID_WASHED, OKLCH_FLEURS, OKLCH_NEUTRALS } from "../../core/consts/oklch";

const priceRe = /\$[0-9]+(?:\.[0-9]{2})?/g;
const handleRe = /@[a-zA-Z0-9_.-]+/g;
const softAccentRe = /~([^~]+)~/g;

export const SPP_MD_HRcss: CssMap = {
    width: "100%",
    height: "1px",
    margin: "1.15rem 0",
    background: `
    linear-gradient(
      to right,
      transparent,
      ${OKLCH_FLEURS.oliveCore},
      ${OKLCH_FLEURS.fadedGold},
      ${OKLCH_FLEURS.dustyLeaf},
      transparent
    )
  `,
};

export const SPP_MD_HEADERcss = (level: 1 | 2 | 3 | 4): CssMap => {
    const sizes = {
        1: "clamp(2.4rem, 6vw, 5rem)",
        2: "clamp(1.55rem, 3vw, 2.6rem)",
        3: "clamp(1.08rem, 1.7vw, 1.35rem)",
        4: "0.92rem",
    } as const;

    const tracking = {
        1: "0.08em",
        2: "0.06em",
        3: "0.08em",
        4: "0.12em",
    } as const;

    return {
        margin: level === 1 ? "0 0 0.75rem" : "1.05rem 0 0.38rem",
        color: "#d8c77c",
        fontFamily: `"Cormorant Garamond", "Times New Roman", serif`,
        fontSize: sizes[level],
        fontWeight: level <= 2 ? "500" : "600",
        lineHeight: "0.95",
        letterSpacing: tracking[level],
        textTransform: level >= 3 ? "uppercase" : "none",
        textShadow: `
      0 1px 0 ${OKLCH_ACID_WASHED.straw}, 
      0 0 10px ${OKLCH_FLEURS.brass},
      0 7px 18px  ${OKLCH_NEUTRALS.charcoal}
    `,
    };
};

export const SPP_MD_PARAGRAPHcss: CssMap = {
    margin: "0 0 0.78rem",
    color: OKLCH_NEUTRALS.slate,
    fontFamily: `"Cormorant", Georgia, serif`,
    fontSize: "clamp(1rem, 1.08vw, 1.16rem)",
    fontWeight: "400",
    lineHeight: "1.5",
    letterSpacing: "0.018em",
    textShadow: "0 1px 0 " + OKLCH_NEUTRALS.paper,
};

export const SPP_MD_LISTcss: CssMap = {
  display: "grid",
  gap: "0.36rem",
  margin: "0.6rem 0 0.9rem",
  padding: "0",
};

export const SPP_MD_LIST_ITEMcss: CssMap = {
  position: "relative",
  paddingLeft: "1.15rem",
  color: "rgba(36, 52, 31, 0.92)",
  fontSize: "clamp(0.98rem, 1vw, 1.1rem)",
  lineHeight: "1.42",

  __before: {
    content: '"✦"',
    position: "absolute",
    left: "0",
    top: "0.02em",
    color: "rgba(180, 144, 54, 0.86)",
    fontSize: "0.8em",
    textShadow: "0 0 8px rgba(255, 232, 150, 0.38)",
  },
};

export const SPP_MD_ANTI_LIST_ITEMcss: CssMap = {
  position: "relative",
  paddingLeft: "1.15rem",
  color: OKLCH_NEUTRALS.charcoal,
  fontSize: "clamp(0.98rem, 1vw, 1.1rem)",
  lineHeight: "1.42",
  opacity: "0.86",

  __before: {
    content: '"—"',
    position: "absolute",
    left: "0",
    top: "0",
    color: OKLCH_NEUTRALS.ash,
  },
};

export const SPP_MD_WARNINGcss: CssMap = {
  position: "relative",
  margin: "0.95rem 0",
  padding: "0.72rem 0.9rem",
  background: "rgba(255, 247, 214, 0.42)",
  border: "1px solid rgba(189, 158, 75, 0.45)",
  boxShadow: `
    inset 0 0 0 1px rgba(255, 252, 224, 0.32),
    0 8px 22px rgba(0, 0, 0, 0.10)
  `,
  color: "rgba(44, 48, 28, 0.92)",
  fontStyle: "italic",
};

export const SPP_MD_LINK_LINEcss: CssMap = {
  display: "inline-block",
  margin: "0.5rem 0",
  color: "rgba(122, 91, 31, 0.95)",
  textDecoration: "none",
  borderBottom: "1px solid rgba(178, 146, 63, 0.42)",
  fontWeight: "500",
  letterSpacing: "0.035em",

  _hover: {
    color: "rgba(80, 60, 22, 1)",
    borderBottomColor: "rgba(230, 202, 108, 0.88)",
    textShadow: "0 0 8px rgba(255, 238, 170, 0.42)",
  },
};

export const SPP_MD_COPY_LINEcss: CssMap = {
  marginTop: "1.2rem",
  paddingTop: "0.7rem",
  borderTop: "1px solid rgba(130, 112, 64, 0.22)",
  color: "rgba(61, 64, 48, 0.62)",
  fontSize: "0.78rem",
  letterSpacing: "0.08em",
  textTransform: "uppercase",
};

export const SPP_INLINE_PRICEcss: CssMap = {
  color: "rgba(104, 74, 18, 0.96)",
  fontWeight: "600",
  textShadow: "0 1px 0 rgba(255, 245, 190, 0.42)",
};

export const SPP_INLINE_HANDLEcss: CssMap = {
  color: "rgba(63, 82, 54, 0.96)",
  fontWeight: "600",
  letterSpacing: "0.035em",
};

export const SPP_INLINE_SOFT_ACCENTcss: CssMap = {
  color: "rgba(128, 91, 118, 0.92)",
  fontStyle: "italic",
};

