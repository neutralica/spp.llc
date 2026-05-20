// mount-prairie-phase.ts

import { CssManager, LiveTree } from "hson-live";
import { prairie_factory } from "./prairie.js";
import { mk_div_id, mk_span_cls, mk_span_cls_txt, mk_span_id, mk_span_txt } from "../../utils/makers.js";
import { _TXT, SYS_SERIFfont } from "../../core/consts/ui-consts.js";
import { cssCONTROL_PANEL, cssGILT_TEXT, cssHSON_BYLINE, cssLINK_BOX, cssLOGO, cssMENU_BOX, cssMENU_BTN_TXT, cssPAGE_HOST, cssPANEL, cssPRAIRIE_HOST, cssPRAIRIE_MASK, cssSCENE } from "../../core/consts/main.css.js";
import { keys_of } from "../../utils/helpers.js";
import { relay, type OutcomeAsync } from "intrastructure";
import { _content } from "../content/lorem-ipsum.js";
import { makeContentBox } from "../../ui/make-content-box.js";
import { makeSocialBox } from "../../ui/make-social.js";
import { set_global_css } from "./global-css.js";
import { _create, type CreationPkg } from "./creator.js";


export type MenuOpts = "shop" | "terroir" | "tour" | "about";

export const MENU_OPTS: Record<MenuOpts, MenuOpts> = { shop: "shop", terroir: "terroir", tour: "tour", about: "about" };

const prrMskPkg: CreationPkg = { el: "div", id: "prairie-mask", css: cssPRAIRIE_MASK };
const prrHost: CreationPkg = { el: "div", id: "prairie-host", css: cssPRAIRIE_HOST }
const pgHost: CreationPkg = { el: "div", id: "page-host", css: cssPAGE_HOST };
const mnPnl: CreationPkg = { el: "div", id: "menu-panel", css: cssPANEL }
const cntPnl: CreationPkg = { el: "div", id: "content-panel", css: cssPANEL };
const mnBx: CreationPkg = { el: "div", id: "menu-box", css: cssMENU_BOX };
const sppLgo: CreationPkg = { el: "div", id: "spp-logo", txt: "spp.", css: cssLOGO };
const lnkBx: CreationPkg = { id: "link-box", el: "span", css: cssLINK_BOX }
const hsnTxt: CreationPkg = { el: "div", id: "hson-byline", txt: "~ made in hson-live ~", css: cssHSON_BYLINE }
const btn: CreationPkg = { el: "span", cls: "menu-link", css: cssMENU_BTN_TXT };

export async function mount_prairie(stage: LiveTree): OutcomeAsync<void> {
  let view: MenuOpts | null = null;
  stage.empty().css.setMany(cssSCENE)

  /* prairie svg host */
  const prairieHost = _create(stage, prrHost);
  prairie_factory(prairieHost);

  const prairieMask = _create(prairieHost, prrMskPkg);
  /* ui container */
  const pageHost = _create(stage, pgHost);

  /* logo & menu */
  const menuPanel = _create(pageHost, mnPnl);
  const contentPanel = _create(pageHost, cntPnl);
  const menuBox = _create(menuPanel, mnBx);
  const logo = _create(menuBox, sppLgo);

  /* social & content containers */
  const contentBox = makeContentBox();
  contentBox.hide();
  contentPanel.append(contentBox.tree);
  pageHost.append(makeSocialBox());

  /* menu buttons */
  const linkBox = _create(menuBox, lnkBx);
  const hsonByline = _create(stage, hsnTxt);

  const btns: Record<MenuOpts, LiveTree> = {
    shop: _create(linkBox, btn).text.set("shop"),
    about: _create(linkBox, btn).text.set("about"),
    tour: _create(linkBox, btn).text.set("tour"),
    terroir: _create(linkBox, btn).text.set("terroir"),
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

