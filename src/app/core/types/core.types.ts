// core.types.ts

import type { LETTER_CAPS, LETTER_LOWS } from "../consts/config.consts";


export type PhaseId = "intro" | "splash";

export type AppEnv = {
  readonly mountId: string;
  readonly dev: boolean;
};

export type Phase = {
  readonly id: PhaseId;
  readonly render: (ctx: PhaseCtx) => void;
  readonly dispose?: () => void;
};

export type PhaseCtx = {
  readonly env: AppEnv;
  readonly nav: (to: PhaseId) => void;
};

export type App = {
  readonly start: () => void;
};

export type LetterKey = (typeof LETTER_LOWS)[number];
export type LetterCaps = (typeof LETTER_CAPS)[number];
export type Fmt = "json" | "hson" | "html";
// // misc-helpers.ts
// import type { CreatePkg } from "./pkg.js";
// import { cssHSON_BYLINE, cssLINK_BOX, cssMENU_BOX, cssMENU_BTN_TXT, cssPAGE_HOST, cssPANEL, cssPRAIRIE_HOST, cssPRAIRIE_MASK } from "../../core/consts/main.css.js";

export type MenuOpts = "shop" | "friends" | "tour" | "about";
