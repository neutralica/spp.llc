import { hson } from "hson-live";
import { OKLCH_ACID_WASHED } from "../core/consts/oklch";
import { _TXT } from "../core/consts/ui-consts";
import { set_alpha } from "../core/helpers/color-helpers";
import { mk_div_cls } from "../utils/makers";
import { main } from "../../main";

 const frameBase = {
  strokeWidth: "1",
  vectorEffect: "non-scaling-stroke",
} as const;


export function makeContentBox() {
 const box = hson.liveTree.create.div()
  .classlist.set("content box")
  .css.setMany({
    display: "flex",
    flexDirection: "column",
    position: "relative",
    gridColumn: "2",
    width: "100%",
    height: "100%",
    minWidth: "0",
    minHeight: "0",
  });

const frame = box.create.svg()
  .attr.setMany({
    viewBox: "0 0 100 100",
    preserveAspectRatio: "none",
  })
  .css.setMany({
    position: "absolute",
    inset: "0",
    width: "100%",
    height: "100%",
    pointerEvents: "none",
    overflow: "visible",
    backdropFilter:  "blur(15px)",
    // backdropFilter: "saturate(100%)"
  });

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
      ...frameBase,
      fill: "none",
      stroke: set_alpha(OKLCH_ACID_WASHED.straw, 0.9),
    });

  frame.create.path()
    .attr.setMany({
      d: path,
      ...frameBase,
      fill: "none",
      stroke: set_alpha(OKLCH_ACID_WASHED.straw, 0.5),
      transform: "translate(-0.6 -0.6)",
    });

  frame.create.path()
    .attr.setMany({
      d: path,
      ...frameBase,
      fill: "none",
      stroke: set_alpha(OKLCH_ACID_WASHED.straw, 0.3),
      transform: "translate(0.8 0.8)",
    });

  const header = mk_div_cls(box, "box-header")
    .css.setMany({
      position: "absolute",
      textAlign: "center",
      top: "2rem",
      justifySelf: "center",
      fontSize: _TXT.subheading,
      color: OKLCH_ACID_WASHED.straw,
      fontWeight: "600",
      left: "50%",
      transform: "translateX(-50%)",
    });
  
  const content = mk_div_cls(box, "box-content")
    .css.setMany({
      position: "absolute",
      // top: "4rem",
      // bottom: "16rem",
      // left: "50%",
      // transform: "translateX(-50%)",
inset: "100px 50px",
      // width: "min(60ch, calc(100% - 10rem))",
      overflowY: "auto",
      mixBlendMode: "color-dodge",

      // maxHeight: "500px",
      // marginTop: "3rem",
      // marginBottom: "3rem",
      letterSpacing: "1.9px",
      fontFamily: "serif",
      color: OKLCH_ACID_WASHED.straw,
      fontSize: _TXT.main,
    });


  const hide = () => { box.css.set.display("none"); };
  const unhide = () => { box.css.set.display("flex"); };

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
  return { box, setContent, setText, setBackColor, hide, unhide };

}
