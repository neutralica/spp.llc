// mount-prairie-phase.ts

import { LiveTree } from "hson-live";
import { prairie_factory } from "./prairie.js";
import { cssBLURB_PANEL, cssHSON_BYLINE, cssLINK_BOX, cssLOGO_MAIN, cssMENU_BOX, cssMENU_BTN_TXT, cssPAGE_HOST, cssPANEL, cssPRAIRIE_HOST, cssPRAIRIE_MASK, cssSTAGE_PRAIRIE, cssVINES } from "../../core/consts/main.css.js";
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
import type { MenuOpts } from "../../core/types/core.types.js";


type PrairieContentView = Readonly<{
  tree: LiveTree;
  setContent(head: string, body: string): void;
  fadeOutPrairie(): void;
  restorePrairie(): void;
  bindChrome(menuPanel: LiveTree, logo: LiveTree, blurbPanel: LiveTree, btns: Record<MenuOpts, LiveTree>): void;
}>;

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
const blurbPkg: CreatePkg = { el: "div", id: "blurb-pkg", css: cssBLURB_PANEL };

const vineCurtainHostPkg: CreatePkg = {el: "div",  id: "vine-curtain-host",  css: cssVINES,};

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
  const wash = mk_section_cls(host, "prairie content-box").css.setMany(CONTENT_WASHcss);
  const reading = mk_section_id(wash, "prairie-content-reading").css.setMany(CONTENT_READINGcss);

  const head = mk_div_id(reading, "prairie-content-head")
    .css.setMany(CONTENT_HEADcss);


  const body = mk_div_id(reading, "prairie-content-body");
  body.css.setMany(CONTENT_BODYcss);


  let menu: LiveTree | undefined;
  let logo: LiveTree | undefined;
  let btns: Record<MenuOpts, LiveTree> | undefined;
  let blurb: LiveTree | undefined;

  const setMenuContentMode = (on: boolean): void => {
    if (!menu || !logo || !blurb || !btns) return;

    if (on) {
      menu.style.setMany(MENU_OVER_WASHcss);
      logo.style.setMany(LOGO_OVER_WASHcss);
      blurb.style.set.display("none");

      for (const b of keys_of(btns)) {
        btns[b].style.setMany(MENU_BTN_OVER_WASHcss);
        btns[b].style.set.visibility("visible");
      }
      return;
    }

    // CHANGED: splash state is now centralized here. The menu buttons are hidden
    // anywhere the prairie view is restored, and the intro blurb returns.
    menu.style.clear();
    logo.css.setMany(cssLOGO_MAIN);
    logo.style.clear();
    blurb.style.clear();
    blurb.style.set.display("grid");

    for (const b of keys_of(btns)) {
      btns[b].style.clear();
      btns[b].style.set.visibility("hidden");
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

    bindChrome(menuPanelTree: LiveTree, logoTree: LiveTree, blurbPanelTree: LiveTree, btnTrees: Record<MenuOpts, LiveTree>): void {
      menu = menuPanelTree;
      logo = logoTree;
      blurb = blurbPanelTree;
      btns = btnTrees;
      setMenuContentMode(false);
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
  const blurbPanel = _create_pkg(menuBox, blurbPkg);
  blurbPanel.create.div().text.set("Seasonal local botanicals");
  blurbPanel.create.div().text.set("St. Paul, MN");


  /* social & content containers */
  const contentView = makePrairieContentView(pageHost);
  // CHANGED: makePrairieContentView already creates/appends its root under
  // pageHost via mk_section_cls(host, ...). Appending it again duplicates the
  // same LiveTree/quid-backed content box in the DOM.
  pageHost.append(makeSocialBox());
  const vineCurtainHost = _create_pkg(pageHost, vineCurtainHostPkg);
  const vines = make_vines(vineCurtainHost, {
    seed: Math.random() * 10_000,
    count: 16,
    side: "top",
    // CHANGED: let `make_vines` measure/use the full viewport host dimensions.
    // Do not pass fixed width/height here; the generator needs the full SVG span
    // so canopy fill and right-aligned curtain placement can separate correctly.
    curtainAlign: "right",
    curtainWidthRatio: 0.42,
    sproutOverhangRatio: 0.5,
  });
  vines.hide();

  const restorePrairieView = (): void => {
    // CHANGED: one restore endpoint for corner clicks and menu toggles.
    contentView.restorePrairie();
    vines.hide();
    view = null;
  };

  const openContentView = (nextView: MenuOpts): void => {
    // CHANGED: one open endpoint for page clicks and menu clicks. Button clicks
    // add content before calling this; page clicks only open the wash/chrome.
    if (_content[nextView]) {
      contentView.setContent(_content[nextView].head, _content[nextView].txt);
      view = nextView;
    }
    vines.show();
    contentView.fadeOutPrairie();
  };

  stage.listen.onPointerDown((ev) => {
    if (eventPathHasClass(ev, "menu-link")) return;

    if (isViewportCornerHit(ev)) {
      restorePrairieView();
      return;
    }

    vines.show();
    contentView.fadeOutPrairie();
  });

  /* menu buttons */
  const linkBox = _create_pkg(menuBox, linkBoxPkg);
  _create_pkg(stage, hsonTxtPkg);

  const btns: Record<MenuOpts, LiveTree> = {
    about: _create_pkg(linkBox, buttonPkg).text.set("about"),
    shop: _create_pkg(linkBox, buttonPkg).text.set("shop"),
    tour: _create_pkg(linkBox, buttonPkg).text.set("tour"),
    friends: _create_pkg(linkBox, buttonPkg).text.set("friends"),
  };

  contentView.bindChrome(menuPanel, logo, blurbPanel, btns);

  keys_of(btns).forEach(b => {
    btns[b].listen.onPointerDown((ev) => {
      ev.stopPropagation();

      if (view !== b) {
        openContentView(b);
      } else {
        restorePrairieView();
      }
    })
  });


  set_global_css();
  // makeFrame(stage);
  return relay.ok();
}
