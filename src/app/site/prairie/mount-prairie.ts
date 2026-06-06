// mount-prairie-phase.ts

import { LiveTree } from "hson-live";
import { prairie_factory } from "./prairie.js";
import { _TXT, SPP_MENUfont } from "../../core/consts/ui.consts.js";
import { cssCONTROL_PANEL, cssGILT_TEXT, cssHSON_BYLINE, cssLINK_BOX, cssLOGO, cssMENU_BOX, cssMENU_BTN_TXT, cssPAGE_HOST, cssPANEL, cssPRAIRIE_HOST, cssPRAIRIE_MASK, cssSTAGE_PRAIRIE } from "../../core/consts/main.css.js";
import { keys_of } from "../../utils/helpers.js";
import { relay, type OutcomeAsync } from "intrastructure";
import { _content } from "../content/lorem-ipsum.js";
import { makeSocialBox } from "../../ui/creation/make-social.js";
import { set_global_css } from "./global-css.js";
import { _create_pkg, type CreatePkg } from "./creator.js";
import { make_frame } from "../../ui/creation/make-frame.js";
import type { CssMap } from "hson-live/types";
import { OKLCH_ACID_WASHED, OKLCH_FOREST, OKLCH_NEUTRALS } from "../../core/consts/oklch.js";
import { set_alpha } from "../../ui/colors/color-helpers.js";


export type MenuOpts = "shop" | "terroir" | "tour" | "about";

export const MENU_OPTS: Record<MenuOpts, MenuOpts> = { shop: "shop", terroir: "terroir", tour: "tour", about: "about" };

/* _create pkg objects */
const prairieMaskPkg: CreatePkg = { el: "div", id: "prairie-mask", css: cssPRAIRIE_MASK };
const prairieHostPkg: CreatePkg = { el: "div", id: "prairie-host", css: cssPRAIRIE_HOST }
const pgHost: CreatePkg = { el: "div", id: "page-host", css: cssPAGE_HOST };
const menuPanelPkg: CreatePkg = { el: "div", id: "menu-panel", css: cssPANEL }
const menuBoxPkg: CreatePkg = { el: "div", id: "menu-box", css: cssMENU_BOX };
const sppLogoPkg: CreatePkg = { el: "div", id: "spp-logo", txt: "spp.", css: cssLOGO };
const linkBoxPkg: CreatePkg = { id: "link-box", el: "span", css: cssLINK_BOX }
const hsonTxtPkg: CreatePkg = { el: "div", id: "hson-byline", txt: "~ made in hson-live ~", css: cssHSON_BYLINE }
const buttonPkg: CreatePkg = { el: "span", cls: "menu-link", css: cssMENU_BTN_TXT };



function eventPathHasClass(ev: PointerEvent, className: string): boolean {
  return ev.composedPath().some((node) => {
    return node instanceof Element && node.classList.contains(className);
  });
}


function isViewportCornerHit(ev: PointerEvent): boolean {
  // CHANGED: derive the corner restore target from pointer coordinates instead
  // of relying on a transparent fixed overlay that can fight the page/menu UI.
  const cornerSize = Math.min(
    Math.max(window.innerWidth * 0.14, 88),
    160,
    window.innerWidth * 0.5,
    window.innerHeight * 0.5,
  );

  const left = ev.clientX <= cornerSize;
  const right = ev.clientX >= window.innerWidth - cornerSize;
  const top = ev.clientY <= cornerSize;
  const bottom = ev.clientY >= window.innerHeight - cornerSize;

  return (left || right) && (top || bottom);
}

const CONTENT_WASHcss: CssMap = {
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

const CONTENT_WASH_OPENcss: CssMap = {
  opacity: "1",
};

const CONTENT_READINGcss: CssMap = {
  maxWidth: "68ch",
  margin: "clamp(8rem, 18vh, 14rem) auto 0",
  padding: "0 clamp(2rem, 7vw, 6rem)",
  color: OKLCH_FOREST.laurelShadow,
  fontFamily: SPP_MENUfont,
  pointerEvents: "auto",
};

const CONTENT_HEADcss: CssMap = {
  margin: "0 0 1.6rem",
  fontSize: "clamp(2.2rem, 5vw, 5rem)",
  lineHeight: "0.95",
  fontWeight: "700",
  letterSpacing: "0.02em",
  color: OKLCH_FOREST.laurelShadow,
};

const CONTENT_BODYcss: CssMap = {
  margin: "0",
  fontSize: "clamp(1.1rem, 1.9vw, 1.65rem)",
  lineHeight: "1.45",
  letterSpacing: "0.04em",
  color: OKLCH_FOREST.laurelShadow,
  whiteSpace: "pre-wrap",
};

const MENU_OVER_WASHcss: CssMap = {
  color: OKLCH_FOREST.laurelShadow,
  position: "relative",
  zIndex: "8",
};

const LOGO_OVER_WASHcss: CssMap = {
  position: "relative",
  zIndex: "8",
  color: OKLCH_FOREST.laurelShadow,
  background: "none",
  backgroundImage: "none",
  textShadow: `
  0 1px 0 ${set_alpha(OKLCH_NEUTRALS.paper, 0.5)},
  0 -1px 0 ${set_alpha(OKLCH_ACID_WASHED.straw, 0.82)}
`
};

const MENU_BTN_OVER_WASHcss: CssMap = {
  position: "relative",
  zIndex: "8",
  color: OKLCH_FOREST.laurelShadow,
  // CHANGED: keep button text behavior aligned with the logo if inherited
  // text-fill effects are present.
  textShadow: `0 1px 0 ${set_alpha(OKLCH_NEUTRALS.paper, 0.42)}`,
};

type PrairieContentView = Readonly<{
  tree: LiveTree;
  setContent(head: string, body: string): void;
  fadeOutPrairie(): void;
  restorePrairie(): void;
  bindMenuChrome(menuPanel: LiveTree, logo: LiveTree, btns: Record<MenuOpts, LiveTree>): void;
}>;

function makePrairieContentView(host: LiveTree): PrairieContentView {
  const wash = host.create.tag("section");
  wash.id.set("prairie-content-wash");
  wash.css.setMany(CONTENT_WASHcss);

  const reading = wash.create.tag("section");
  reading.id.set("prairie-content-reading");
  reading.css.setMany(CONTENT_READINGcss);

  const head = reading.create.tag("div");
  head.id.set("prairie-content-head");
  head.css.setMany(CONTENT_HEADcss);


  const body = reading.create.tag("div");
  body.id.set("prairie-content-body");
  body.css.setMany(CONTENT_BODYcss);


  let boundMenuPanel: LiveTree | undefined;
  let boundLogo: LiveTree | undefined;
  let boundBtns: Record<MenuOpts, LiveTree> | undefined;

  const setMenuContentMode = (on: boolean): void => {
    if (!boundMenuPanel || !boundLogo || !boundBtns) return;

    if (on) {
      boundMenuPanel.css.setMany(MENU_OVER_WASHcss);
      boundLogo.style.setMany(LOGO_OVER_WASHcss);
      for (const b of keys_of(boundBtns)) {
        boundBtns[b].style.setMany(MENU_BTN_OVER_WASHcss);
      }
      return;
    }

    boundMenuPanel.css.setMany(cssPANEL);
    boundLogo.css.setMany(cssLOGO);
    boundLogo.style.clear();
    for (const b of keys_of(boundBtns)) {
      boundBtns[b].style.clear();
    }
  };

  return {
    tree: wash,

    setContent(nextHead: string, nextBody: string): void {
      head.text.set(nextHead);
      body.text.set(nextBody);
    },

    fadeOutPrairie(): void {
      // CHANGED: fade the pale wash in over the prairie only when requested.
      wash.css.setMany(CONTENT_WASH_OPENcss);
      setMenuContentMode(true);
    },

    restorePrairie(): void {
      // CHANGED: return to the fully visible prairie state.
      wash.css.setMany(CONTENT_WASHcss);
      setMenuContentMode(false);
    },

    bindMenuChrome(menuPanelTree: LiveTree, logoTree: LiveTree, btnTrees: Record<MenuOpts, LiveTree>): void {
      boundMenuPanel = menuPanelTree;
      boundLogo = logoTree;
      boundBtns = btnTrees;
    },
  };
}


export async function mount_prairie(stage: LiveTree): OutcomeAsync<void> {
  let view: MenuOpts | null = null;
  stage.empty().css.setMany(cssSTAGE_PRAIRIE)

  /* prairie svg host */
  const prairieHost = _create_pkg(stage, prairieHostPkg);
  prairie_factory(prairieHost);
  make_frame(prairieHost);
  const prairieMask = _create_pkg(prairieHost, prairieMaskPkg);
  /* ui container */
  const pageHost = _create_pkg(stage, pgHost);

  /* logo & menu */
  const menuPanel = _create_pkg(pageHost, menuPanelPkg);
  const menuBox = _create_pkg(menuPanel, menuBoxPkg);
  const logo = _create_pkg(menuBox, sppLogoPkg);

  /* social & content containers */
  const contentView = makePrairieContentView(pageHost);
  pageHost.append(contentView.tree);
  pageHost.append(makeSocialBox());
  const restorePrairieView = (): void => {
    contentView.restorePrairie();
    view = null;
  };

  stage.listen.onPointerDown((ev) => {
    if (eventPathHasClass(ev, "menu-link")) return;

    if (isViewportCornerHit(ev)) {
      restorePrairieView();
      return;
    }

    contentView.fadeOutPrairie();
  });

  /* menu buttons */
  const linkBox = _create_pkg(menuBox, linkBoxPkg);
  _create_pkg(stage, hsonTxtPkg);

  const btns: Record<MenuOpts, LiveTree> = {
    shop: _create_pkg(linkBox, buttonPkg).text.set("shop"),
    about: _create_pkg(linkBox, buttonPkg).text.set("about"),
    tour: _create_pkg(linkBox, buttonPkg).text.set("tour"),
    terroir: _create_pkg(linkBox, buttonPkg).text.set("terroir"),
  };

  contentView.bindMenuChrome(menuPanel, logo, btns);

  keys_of(btns).forEach(b => {
    btns[b].listen.onPointerDown((ev) => {
      ev.stopPropagation();

      if (view !== b) {
        contentView.setContent(_content[b].head, _content[b].txt);
        contentView.fadeOutPrairie();
        view = b;
      } else {
        contentView.restorePrairie();
        view = null;
      }
    })
  });


  set_global_css();
  // makeFrame(stage);
  return relay.ok();
}
