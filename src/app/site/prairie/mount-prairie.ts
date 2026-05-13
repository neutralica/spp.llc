// mount-prairie-phase.ts

import { hson, LiveTree } from "hson-live";
import { prairie_factory } from "./prairie.js";
import { mk_div_id, mk_span_cls, mk_span_txt } from "../../utils/makers.js";
import { _TXT, SYS_SERIFfont } from "../../core/consts/ui-consts.js";
import { OKLCH_ACID_WASHED, OKLCH_FLEURS } from "../../core/consts/oklch.js";
import type { CssMap } from "hson-live/types";
import { _rng_xs32, keys_of } from "../../utils/helpers.js";
import { $insta_d, $insta_icon, $threads_d, $threads_icon } from "../../ui/icon-svg-helpers.js";
import { relay, type OutcomeAsync } from "intrastructure";
import { _content } from "../content/content.js";
import { makeContentBox } from "../../ui/make-content-box.js";


const rn = _rng_xs32(Math.random() * 9999);
const rng360 = rn() * 360;
type menuOpts = "shop" | "terroir" | "tour" | "about";

/* svg attrs & css */
export const frameBase = {
  strokeWidth: "1",
  vectorEffect: "non-scaling-stroke",
} as const;

export const menuFxCss: CssMap = {
  userSelect: "none",
  textShadow: "0 0 5px " + OKLCH_FLEURS.pollen,
}

/* menu, content panels */
const panelCss = {
  position: "relative",
  alignSelf: "start",
  height: "100%",
  justifySelf: "stretch",
  inset: "0",
  padding: "10%"
}

const logoCss = {
  ...menuFxCss,
  fontSize: _TXT.heading,
  fontFamily: SYS_SERIFfont,
  color: OKLCH_ACID_WASHED.straw,
  fontStyle: "italic",
};

const menuTxtCss: CssMap = {
  ...menuFxCss,
  marginLeft: "3rem",
  letterSpacing: "1.9px",
  fontSize: _TXT.main,
  fontFamily: "Serif",
  color: OKLCH_ACID_WASHED.straw,
  cursor: "pointer",
  lineHeight: "1.5rem ",
  _hover: {
    borderTop: "2px solid " + OKLCH_ACID_WASHED.straw,
    borderBottom: "2px solid " + OKLCH_ACID_WASHED.straw,
  }

};

const skyColor = "hsl(210 45% 12%)";
const skyColor2 = `linear-gradient(${rng360}deg, hsl(210 45% 22%), hsl(210 45% 12%))`;

export async function mount_prairie(stage: LiveTree): OutcomeAsync<void> {
  stage.empty();
  let view: menuOpts | null = null;
  
  /* prairie svg host */
  const prairieHost = mk_div_id(stage, "prairie-host")
    .css.setMany({
      position: "relative",
      width: "100%",
      height: "100%",
      overflow: "hidden",
      background: skyColor2,

    });
  prairie_factory(prairieHost);

  /* ui layout */
  const pageHost = mk_div_id(stage, "page-host")
    .css.setMany({
      position: "absolute",
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      inset: "0",
    });

  /* logo & menu */
  const menuPanel = mk_div_id(pageHost, "menu-panel").css.setMany(panelCss);
  const contentPanel = mk_div_id(pageHost, "content-panel").css.setMany(panelCss);
  const box = mk_div_id(menuPanel, "menu-box");
  const logo = box.create.span().text.set("spp.").css.setMany(logoCss);
  const contentBox = makeContentBox();
  contentPanel.append(contentBox.box);

  pageHost.append(makeSocialBox());

  const aboutBtn = mk_span_txt(box, "about").css.setMany(menuTxtCss);
  const shopBtn = mk_span_txt(box, "shop").css.setMany(menuTxtCss);
  const tourBtn = mk_span_txt(box, "tour").css.setMany(menuTxtCss);
  const terroirBtn = mk_span_txt(box, "terroir").css.setMany(menuTxtCss);
  const btns: Record<menuOpts, LiveTree> = { shop: shopBtn, about: aboutBtn, tour: tourBtn, terroir: terroirBtn };
  keys_of(btns).forEach(b => {
    btns[b].listen.onPointerDown(() => {
      if (view !== b) {
        contentBox.setContent(b, _content[b].txt);
        view = b;
      } else {
        contentBox.hide();
        view = null;
     }
    })
  })

  stage.create.div().text.set("~ made in hson-live ~").css.setMany({
    position: "fixed",
    bottom: "1rem",
    right: "1rem",
    display: "flex",
    alignSelf: "end",
    marginLeft: "6rem",
    fontSize: _TXT.smol,
    fontFamily: SYS_SERIFfont,
    color: skyColor,
    letterSpacing: "2px",
    opacity: "0.4",
    fontStyle: "italic",
  });

  return relay.ok();
}

function getContent(b: string) {


}

function makeSocialBox() {

  const socialHost = hson.liveTree.create.div()
    .id.set("social-host")
    .css.setMany({
      display: "flex",
      position: "fixed",
      bottom: "1rem",
      left: "1rem",
      height: "32px",
      width: "100px",
    });
  socialHost.create.svg().attr.setMany({ viewBox: "0 0 640 640", })
    .create.path().attr.setMany({
      d: $insta_d,
      fill: OKLCH_ACID_WASHED.straw,
      // stroke: OKLCH_ACID_WASHED.straw,
    })
    .css.setMany(frameBase);

  socialHost.create.svg().attr.setMany({ viewBox: "0 0 640 640", })
    .create.path().attr.setMany({
      d: $threads_d,
      fill: OKLCH_ACID_WASHED.straw,
      // stroke: OKLCH_ACID_WASHED.straw,
    })
    .css.setMany(frameBase);

  return socialHost;
}