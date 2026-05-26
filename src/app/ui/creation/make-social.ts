import { hson } from "hson-live";
import { OKLCH_ACID_WASHED } from "../../core/consts/oklch";
import { $insta_d, $threads_d } from "../icon-svg-strings";

 const strokeline = {
  strokeWidth: "1",
  vectorEffect: "non-scaling-stroke",
} as const;


export function makeSocialBox() {

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
    .css.setMany(strokeline);

  socialHost.create.svg().attr.setMany({ viewBox: "0 0 640 640", })
    .create.path().attr.setMany({
      d: $threads_d,
      fill: OKLCH_ACID_WASHED.straw,
      // stroke: OKLCH_ACID_WASHED.straw,
    })
    .css.setMany(strokeline);

  return socialHost;
}
