// mount-prairie-phase.ts

import { CssManager, LiveTree } from "hson-live";
import { prairie_factory } from "./prairie.js";
import { mk_div_id, mk_span_cls, mk_span_cls_txt, mk_span_id, mk_span_txt } from "../../utils/makers.js";
import { _TXT, SYS_SERIFfont } from "../../core/consts/ui.consts.js";
import { cssCONTROL_PANEL, cssGILT_TEXT, cssHSON_BYLINE, cssLINK_BOX, cssLOGO, cssMENU_BOX, cssMENU_BTN_TXT, cssPAGE_HOST, cssPANEL, cssPRAIRIE_HOST, cssPRAIRIE_MASK, cssSTAGE_PRAIRIE } from "../../core/consts/main.css.js";
import { keys_of } from "../../utils/helpers.js";
import { relay, type OutcomeAsync } from "intrastructure";
import { _content } from "../content/lorem-ipsum.js";
import { makeContentBox } from "../../ui/creation/make-content-box.js";
import { makeSocialBox } from "../../ui/creation/make-social.js";
import { set_global_css } from "./global-css.js";
import { _create_pkg, type CreatePkg } from "./creator.js";


export type MenuOpts = "shop" | "terroir" | "tour" | "about";

export const MENU_OPTS: Record<MenuOpts, MenuOpts> = { shop: "shop", terroir: "terroir", tour: "tour", about: "about" };

/* _create pkg objects */
const prrMskPkg: CreatePkg = { el: "div", id: "prairie-mask", css: cssPRAIRIE_MASK };
const prrHost: CreatePkg = { el: "div", id: "prairie-host", css: cssPRAIRIE_HOST }
const pgHost: CreatePkg = { el: "div", id: "page-host", css: cssPAGE_HOST };
const mnPnl: CreatePkg = { el: "div", id: "menu-panel", css: cssPANEL }
const cntPnl: CreatePkg = { el: "div", id: "content-panel", css: cssPANEL };
const mnBx: CreatePkg = { el: "div", id: "menu-box", css: cssMENU_BOX };
const sppLgo: CreatePkg = { el: "div", id: "spp-logo", txt: "spp.", css: cssLOGO };
const lnkBx: CreatePkg = { id: "link-box", el: "span", css: cssLINK_BOX }
const hsnTxt: CreatePkg = { el: "div", id: "hson-byline", txt: "~ made in hson-live ~", css: cssHSON_BYLINE }
const btn: CreatePkg = { el: "span", cls: "menu-link", css: cssMENU_BTN_TXT };

export async function mount_prairie(stage: LiveTree): OutcomeAsync<void> {
  let view: MenuOpts | null = null;
  stage.empty().css.setMany(cssSTAGE_PRAIRIE)

  /* prairie svg host */
  const prairieHost = _create_pkg(stage, prrHost);
  prairie_factory(prairieHost);

  const prairieMask = _create_pkg(prairieHost, prrMskPkg);
  /* ui container */
  const pageHost = _create_pkg(stage, pgHost);

  /* logo & menu */
  const menuPanel = _create_pkg(pageHost, mnPnl);
  const contentPanel = _create_pkg(pageHost, cntPnl);
  const menuBox = _create_pkg(menuPanel, mnBx);
  const logo = _create_pkg(menuBox, sppLgo);

  /* social & content containers */
  const contentBox = makeContentBox();
  contentBox.hide();
  contentPanel.append(contentBox.tree);
  pageHost.append(makeSocialBox());
  /* menu buttons */
  const linkBox = _create_pkg(menuBox, lnkBx);
  const hsonByline = _create_pkg(stage, hsnTxt);

  const btns: Record<MenuOpts, LiveTree> = {
    shop: _create_pkg(linkBox, btn).text.set("shop"),
    about: _create_pkg(linkBox, btn).text.set("about"),
    tour: _create_pkg(linkBox, btn).text.set("tour"),
    terroir: _create_pkg(linkBox, btn).text.set("terroir"),
  };

  keys_of(btns).forEach(b => {
    btns[b].listen.onPointerDown(() => {
      if (view !== b) {
        contentBox.setContent(_content[b].head, _content[b].txt);
        view = b;
      } else {
        contentBox.hide();
        view = null;
      }
    })
  })

  set_global_css();
  return relay.ok();

}




function getContent(b: string) {


}

