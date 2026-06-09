// mount-prairie-phase.ts

import { LiveTree } from "hson-live";
import { prairie_factory } from "./prairie.js";
import { cssHSON_BYLINE, cssLINK_BOX, cssLOGO_MAIN, cssMENU_BOX, cssMENU_BTN_TXT, cssPAGE_HOST, cssPANEL, cssPRAIRIE_HOST, cssPRAIRIE_MASK, cssSTAGE_PRAIRIE } from "../../core/consts/main.css.js";
import { keys_of } from "../../utils/helpers.js";
import { relay, type OutcomeAsync } from "intrastructure";
import { _content } from "../content/lorem-ipsum.js";
import { makeSocialBox } from "../../ui/creation/make-social.js";
import { set_global_css } from "./global-css.js";
import { _create_pkg, type CreatePkg } from "./pkg.js";
import { make_frame } from "../../ui/creation/make-frame.js";
import { mk_div_id, mk_section_cls, mk_section_id } from "../../utils/makers.js";
import { CONTENT_READINGcss, CONTENT_HEADcss, CONTENT_BODYcss, MENU_OVER_WASHcss, LOGO_OVER_WASHcss, MENU_BTN_OVER_WASHcss, CONTENT_WASH_OPENcss, CONTENT_WASHcss } from "./menu-css.js";
import { make_vines } from "../../ui/vines.js";


export type MenuOpts = "shop" | "terroir" | "tour" | "about";
type PrairieContentView = Readonly<{
  tree: LiveTree;
  setContent(head: string, body: string): void;
  fadeOutPrairie(): void;
  restorePrairie(): void;
  bindMenu(menuPanel: LiveTree, logo: LiveTree, btns: Record<MenuOpts, LiveTree>): void;
}>;

export const MENU_OPTS: Record<MenuOpts, MenuOpts> = { shop: "shop", terroir: "terroir", tour: "tour", about: "about" };

/* _create pkg objects */
const prairieMaskPkg: CreatePkg = { el: "div", id: "prairie-mask", css: cssPRAIRIE_MASK };
const prairieHostPkg: CreatePkg = { el: "div", id: "prairie-host", css: cssPRAIRIE_HOST }
const pgHost: CreatePkg = { el: "div", id: "page-host", css: cssPAGE_HOST };
const menuPanelPkg: CreatePkg = { el: "div", id: "menu-panel", css: cssPANEL }
const menuBoxPkg: CreatePkg = { el: "div", id: "menu-box", css: cssMENU_BOX };
const sppLogoPkg: CreatePkg = { el: "div", id: "spp-logo", txt: "spp.", css: cssLOGO_MAIN };

const linkBoxPkg: CreatePkg = { id: "link-box", el: "span", css: cssLINK_BOX }
const hsonTxtPkg: CreatePkg = { el: "div", id: "hson-byline", txt: "~ made in hson-live ~", css: cssHSON_BYLINE }
const buttonPkg: CreatePkg = { el: "span", cls: "menu-link", css: cssMENU_BTN_TXT };

const vineCurtainHostPkg: CreatePkg = {
  el: "div",
  id: "vine-curtain-host",
  css: {
    position: "absolute",
    top: "0",
    right: "-0.75rem",
    // CHANGED: fixed SVG viewport dimensions keep the procedural vine geometry
    // from stretching/skewing as the browser width changes. The host stays
    // anchored to the right edge and clips through the page host instead.
    width: "620px",
    height: "720px",
    pointerEvents: "none",
    zIndex: "7",
    overflow: "visible",
  },
};

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

function makePrairieContentView(host: LiveTree): PrairieContentView {
  const wash = mk_section_cls(host, "prairie content-wash").css.setMany(CONTENT_WASHcss);
  const reading = mk_section_id(wash, "prairie-content-reading").css.setMany(CONTENT_READINGcss);

  const head = mk_div_id(reading, "prairie-content-head")
    .css.setMany(CONTENT_HEADcss);


  const body = mk_div_id(reading, "prairie-content-body");
  body.css.setMany(CONTENT_BODYcss);


  let menu: LiveTree | undefined;
  let logo: LiveTree | undefined;
  let btns: Record<MenuOpts, LiveTree> | undefined;

  const setMenuContentMode = (on: boolean): void => {
    if (!menu || !logo || !btns) return;

    if (on) {
      menu.style.setMany(MENU_OVER_WASHcss);
      logo.style.setMany(LOGO_OVER_WASHcss);
      for (const b of keys_of(btns)) {
        btns[b].style.setMany(MENU_BTN_OVER_WASHcss);
      }
      return;
    }

    menu.css.setMany(cssPANEL);
    logo.css.setMany(cssLOGO_MAIN);
    logo.style.clear();
    for (const b of keys_of(btns)) {
      btns[b].style.clear();
    }
  };

  return {
    tree: wash,

    setContent(nextHead: string, nextBody: string): void {
      head.text.set(nextHead);
      body.text.set(nextBody);
    },

    fadeOutPrairie(): void {
      wash.css.setMany(CONTENT_WASH_OPENcss);
      setMenuContentMode(true);
    },

    restorePrairie(): void {
      wash.css.setMany(CONTENT_WASHcss);
      setMenuContentMode(false);
    },

    bindMenu(menuPanelTree: LiveTree, logoTree: LiveTree, btnTrees: Record<MenuOpts, LiveTree>): void {
      menu = menuPanelTree;
      logo = logoTree;
      btns = btnTrees;
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
  const vineCurtainHost = _create_pkg(pageHost, vineCurtainHostPkg);
  const vines = make_vines(vineCurtainHost, {
    seed: Math.random() * 10_000,
    count: 16,
    side: "top",
    width: 620,
    height: 720,
  });
  vines.hide();
  const restorePrairieView = (): void => {
    contentView.restorePrairie();
    view = null;
  };

  stage.listen.onPointerDown((ev) => {
    if (eventPathHasClass(ev, "menu-link")) return;

    if (isViewportCornerHit(ev)) {
      restorePrairieView();
      vines.hide();
      return;
    }
    vines.show();
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

  contentView.bindMenu(menuPanel, logo, btns);

  keys_of(btns).forEach(b => {
    btns[b].listen.onPointerDown((ev) => {
      ev.stopPropagation();

      if (view !== b) {
        contentView.setContent(_content[b].head, _content[b].txt);
        contentView.fadeOutPrairie();
        vines.show();
        view = b;
      } else {
        contentView.restorePrairie();
        vines.hide();
        view = null;
      }
    })
  });


  set_global_css();
  // makeFrame(stage);
  return relay.ok();
}
