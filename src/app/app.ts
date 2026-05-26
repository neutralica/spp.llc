// app.ts

import { type LiveTree } from "hson-live";
import { _sleep } from "../app/utils/helpers";
import { mk_div_id } from "../app/utils/makers";
import { outcome, relay, relay_data, type Outcome, type OutcomeAsync } from "intrastructure";

import { _COLS } from "./core/consts/ui.consts";
import { OKLCH_NEUTRALS, OKLCH_VIBRANT } from "./core/consts/oklch";
import { log_oklch_palette } from "./utils/swatch-logger";
import { STAGE_CSS } from "./core/consts/css.consts";
import { mount_prairie } from "./site/prairie/mount-prairie";




export async function run_app(root: LiveTree): OutcomeAsync<void> {
  root.empty();
  log_oklch_palette(OKLCH_NEUTRALS, "neutrals");
  log_oklch_palette(OKLCH_VIBRANT, "brighter");

  const app = mk_div_id(root, "app")
    .classlist.set("app")
    .css.set.backgroundColor(_COLS.backlo);

  const stage = mk_div_id(app, "stage")
    .classlist.add("stage")
    .css.setMany(STAGE_CSS);

  try {

    // --- phase 3: feature demo ---
    {
      const demoRes = await mount_prairie(stage);
      if (outcome.isErr(demoRes)) return demoRes;
    }

    return relay.ok();
  } catch (e) {
    return relay.err(e instanceof Error ? e.message : `${e}`)
  }
}
