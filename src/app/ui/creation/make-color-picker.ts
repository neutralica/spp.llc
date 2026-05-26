import { hson } from "hson-live"
import { _create_pkg } from "../../site/prairie/creator"
import { hsl } from "../../site/prairie/prairie-helpers"
import { cssOVERLAY, cssSTAGE_PRAIRIE } from "../../core/consts/main.css";
import type { OklchColor, RgbaColor } from "../colors/colors.types";

const cssConsoleFrame = {
    ///
}

const cssContentBox = {
    ///
}

const cssInputDiv = {
    ///
}

export const make_color_picker = (colors: (OklchColor | RgbaColor)[]) => {
    const tree = hson.liveTree.create.div().css.setMany(cssOVERLAY);

    const x = tree.create.canvas();

    const frame = tree.create.div().css.setMany(cssConsoleFrame);
    const content = tree.create.div().css.setMany(cssContentBox);
    // colors are references to let vars?  ie, in the color consts file, re-export a color:
    // ~~~ `export let $scroll_color = OKLCH_FLEURS.mossGreen;`
    const mkInput = (col: OklchColor | RgbaColor) => {
        const inpBox = content.create.div().css.setMany(cssInputDiv);
        // ~~~ if is_oklch(col)
        // create input for each value labelled l/c/h/a
        // ~~~ else
            // create input for each value labelled r/g/b/a
        //
        // and then here in make_color_picker, parse value from each input, rewrite & format, apply to $scroll_color. Have whatever we are adjusting import $scroll_color instead of, in this hypothetical, OKLCH_FLEURS.mossGreen
        // this should be in realtime, reflected whereever across the page, as well as displayed in a swatch in the console picker. Will probably need to debounce and throttle.
        
    }
    colors.forEach(c => mkInput(c))

}