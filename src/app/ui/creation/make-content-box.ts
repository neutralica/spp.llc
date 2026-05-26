import { hson } from "hson-live";
import { OKLCH_ACID_WASHED, OKLCH_NEUTRALS } from "../../core/consts/oklch";
import { set_alpha } from "./../colors/color-helpers";
import { _create_pkg, type CreatePkg } from "../../site/prairie/creator";
import { cssCONTENT_HEADER, cssCONTENT_TXT, cssCONTENT_BOX, cssCONTENT_BACK, cssFRAME } from "./../creation/content.css";

const frameBase = {
  strokeWidth: "1",
  vectorEffect: "non-scaling-stroke",
  fill: "none",
} as const;

const hdr: CreatePkg = { el: "div", cls: "box header", css: cssCONTENT_HEADER };  
const cntTxt: CreatePkg = { el: "div", cls: "content text", css: cssCONTENT_TXT };

export function makeContentBox() {
  const tree = hson.liveTree.create.div()
    .classlist.set("content box")
    .css.setMany(cssCONTENT_BOX);

  const frame = tree.create.svg()
    .attr.setMany({
      viewBox: "0 0 100 100",
      preserveAspectRatio: "none",
    })
    .css.setMany(cssFRAME);

  const path = `
      M 10 0
      H 90
      Q 90 10 100 10
      V 90
      Q 90 90 90 100
      H 10
      Q 10 90 0 90
      V 10
      Q 10 10 10 0
      Z
    `;

  frame.create.path()
    .attr.setMany({
      d: path,
      fill: OKLCH_NEUTRALS.smokedUmber,
      stroke: "none",
    })
    .css.setMany(cssCONTENT_BACK);
  frame.create.path()
    .attr.setMany({
      d: path,
      ...frameBase,
      stroke: set_alpha(OKLCH_ACID_WASHED.straw, 0.9),
    });

  frame.create.path()
    .attr.setMany({
      d: path,
      ...frameBase,
      stroke: set_alpha(OKLCH_ACID_WASHED.straw, 0.5),
      transform: "translate(-0.6 -0.6)",
    });

  frame.create.path()
    .attr.setMany({
      d: path,
      ...frameBase,
      stroke: set_alpha(OKLCH_ACID_WASHED.straw, 0.3),
      transform: "translate(0.8 0.8)",
    });

  const header = _create_pkg(tree, hdr);
  const content = _create_pkg(tree,cntTxt);


  const hide = () => { tree.css.set.display("none"); };
  const unhide = () => { tree.css.set.display("flex"); };

  const setHeader = (headtxt: string) => {
    unhide();
    header.text.set(headtxt);
  };
  const setText = (maintext: string) => {
    unhide();
    content.text.set(maintext);
  };

  const setContent = (headtxt: string, maintext: string) => {
    unhide();
    setText(maintext);
    setHeader(headtxt);
  };

  const setBackColor = (col: string) => {
    if (col === "off" || col === "none") { col = "transparent" }
    frame.css.set.background(col);
  }
  return { tree, setContent, setText, setBackColor, hide, unhide };

};
