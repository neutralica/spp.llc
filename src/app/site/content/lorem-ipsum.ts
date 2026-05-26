/* content.ts */

import { _rng_xs32 } from "../../utils/helpers";
import { MENU_OPTS, type MenuOpts } from "../prairie/mount-prairie";
import { rng360 } from "../prairie/prairie-helpers";

/* holder for text and assets/instructions for assembling content/rendering */
export const longasstext = () => {
    let ix = 0;
    return `lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   lorem ipsem  ${ix++}.   `;

}
const isEven = (n: number): boolean => {
  return n % 2 === 0;
};
const rngHundred = () => { return Math.floor(Math.random() * 100); }
export const _rand_ix = (len: number) => { return Math.floor(Math.random() * len); }
const capFirst = (s: string): string => {
  const st = s.trim()
    const first = st.charAt(0);
  if (first === "") return st;
  return first.toUpperCase() + st.slice(1);
};

const getSnippet = (): string => {
    const chunks = [
        " such objectionable content regarding and such pursuant to same,",
        " concerns as to the preceding, nevermore will we allow the ",
        " with the understanding that under no circumstances",
        " shall in time and place",
        " designated slime removal requiring specialized equipment and follow-up therapy",
        " for the appreciable future--assuming of course the quality of tallow be insufficient--then off with the",
        " are available and ripe, if I may make so unfathomably bold. Nevertheless. It strikes me that",
        " replacing the entirety of the blancmange I tell you! The smell of the ",
        " and--ah. Well. Not for nothing to they call him The Dauber. His ",
        " making large amounts of... so forth and such. You know. It will all be provided and our fees are most reasonable. Still I would caution against it",
        " as they say, commence. You can always tell by the elbows. Furthermore they",
        " basically equate to lorem ipsum and such. It's true. Lorem ipsum lorem ipsum lorem ipsum. That's all you ever see nowadays. Except for ",
        " mean you're under the misapprehension",
        " such rhubarb for",
        " atavistic mild attempts to bring us all down to ",

    ] as const;

    const ix = Math.floor(Math.random() * chunks.length);

    return chunks[ix] ?? chunks[0];
};

const createContentString = (length: number, key: MenuOpts): string => {
    const array: string[] = [];
    const inKey = (): string => isEven(rngHundred()) ? ` ${key}` : "";
    for (let ix = 0; ix < length; ix++) {
        const k: string = inKey();
        array.push(k, getSnippet());
    }
    return capFirst(array.join(" "));
}

export const _content = {
    shop: {
        head: "SHOP CONTENT HEAD",
        txt: createContentString(rngHundred(), "shop")
    },
    about: {
        head: "ABOUT CONTENT HEAD",
        txt: createContentString(rngHundred(), "about")
    },
    tour: {
        head: "TOUR CONTENT HEAD",
        txt: createContentString(rngHundred(), "tour")
    },
    terroir: {
        head: "TERROIR CONTENT HEAD",
        txt: createContentString(rngHundred(), "terroir")
    }

}

