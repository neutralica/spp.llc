// prairie.ts
// animated grassy plain / curved-slope illusion

import { hson, type LiveTree } from "hson-live";
import { _clamp01, _clampLoHi, _lerp } from "../../utils/helpers";
import type { PrairieConfig, PrairieFlowerStatic, PrairieRowStatic, PrairieRuntime } from "./prairie.types";
import { make_rng } from "../../utils/rng";
import { depth_ease, hsl, default_prairie_config, row_wind_x } from "./prairie-helpers";
import { build_flower_cluster_path, ease_out_back, make_row_flowers } from "./prairie-flowers";
import type { SvgLiveTree } from "hson-live/types";
import { $svg_filter } from "../../core/consts/ui.consts";


const svgNs = "http://www.w3.org/2000/svg";

const PRAIRIE_MIN_WORLD_WIDTH = 2000;
const PRAIRIE_WORLD_WIDTH_MULTIPLIER = 2.4;
const PRAIRIE_MIN_WORLD_HEIGHT = 1400;
const PRAIRIE_HORIZON_SCREEN_RATIO = 0.39;
const PRAIRIE_WORLD_EXTRA_WIDTH = 360;
const PRAIRIE_PAN_PERIOD_SEC = 220;
const PRAIRIE_PAN_MAX_PX = 58;
const PRAIRIE_VERTICAL_BLEED = 80;
const PRAIRIE_BASE_DPR = window.devicePixelRatio || 1;

function prairieZoomFactor(): number {
  // CHANGED: compensate the SVG display size when browser zoom changes. The
  // prairie world is generated once; zoom should crop/reveal it, not rescale it.
  const now = window.devicePixelRatio || PRAIRIE_BASE_DPR;
  return Math.max(0.5, Math.min(3, now / PRAIRIE_BASE_DPR));
}

function prairieScreenPx(n: number): number {
  return n / prairieZoomFactor();
}

// -----------------------------
// row construction
// -----------------------------

function make_row_static(
  cfg: PrairieConfig,
  rowIndex: number,
  rand: () => number,
): PrairieRowStatic {
  // CHANGED: 0 near/bottom, 1 far/top
  const t = rowIndex / Math.max(1, cfg.rowCount - 1);

  // CHANGED: nonlinear depth placement
  const e = depth_ease(t, cfg.curvePower);

  // CHANGED: row baseline moves from bottom up to horizon
  const yBase = _lerp(cfg.height, cfg.horizonY, e);

  // CHANGED: silhouettes shrink toward horizon
  const bladeHeight = _lerp(cfg.nearBladeHeight, cfg.farBladeHeight, t);

  // CHANGED: farther rows can be sampled more coarsely
  const sampleStep = _lerp(cfg.nearSampleStep, cfg.farSampleStep, t);

  // CHANGED: nearer rows sway more
  const swayAmp = _lerp(cfg.nearSwayAmp, cfg.farSwayAmp, t);

  // CHANGED: slight per-row motion differences
  const swayFreq = _lerp(0.010, 0.022, rand());
  const swaySpeed = _lerp(0.7, 1.4, rand());
  const phase = rand() * Math.PI * 2;

  // CHANGED: row color shifts gently with depth
  const hue = cfg.hueBase + _lerp(-cfg.hueJitter, cfg.hueJitter, rand());
  const sat = _lerp(cfg.satNear, cfg.satFar, t);
  const light = _lerp(cfg.lightFar, cfg.lightNear, t);
  const fill = hsl(hue, sat, light);

  const xs: number[] = [];
  const jitter: number[] = [];

  for (let x = 0; x <= cfg.width + sampleStep; x += sampleStep) {
    xs.push(x);

    // CHANGED: cached local height jitter; nearer rows get more variation
    const localAmp = _lerp(1.0, 0.35, t);
    const j = _lerp(-1, 1, rand()) * bladeHeight * 0.35 * localAmp;
    jitter.push(j);
  }

  return {
    rowIndex,
    t,
    yBase,
    bladeHeight,
    sampleStep,
    swayAmp,
    swayFreq,
    swaySpeed,
    phase,
    xs,
    jitter,
    fill,
  };
}

// Builds one closed strip path.
function build_row_path_d(
  row: PrairieRowStatic,
  cfg: PrairieConfig,
  timeSec: number,
): string {
  if (row.xs.length === 0) return "";

  const points: Array<{ x: number; y: number }> = [];

  for (let i = 0; i < row.xs.length; i++) {
    const x = row.xs[i];
    if (x === undefined) continue;

    const local = row.jitter[i] ?? 0;

    const wind = row_wind_x(row, x, timeSec);
    const blade = Math.max(0.5, row.bladeHeight + local + wind);
    const yTop = row.yBase - blade;

    points.push({ x, y: yTop });
  }

  if (points.length === 0) return "";

  const first = points[0];
  const last = points[points.length - 1];
  if (!first || !last) return "";

  const yBottom = cfg.height + 2;

  const parts: string[] = [];
  parts.push(`M ${first.x.toFixed(2)} ${first.y.toFixed(2)}`);

  for (let i = 1; i < points.length; i++) {
    const p = points[i];
    if (!p) continue;
    parts.push(`L ${p.x.toFixed(2)} ${p.y.toFixed(2)}`);
  }

  parts.push(`L ${last.x.toFixed(2)} ${yBottom.toFixed(2)}`);
  parts.push(`L ${first.x.toFixed(2)} ${yBottom.toFixed(2)}`);
  parts.push("Z");

  return parts.join(" ");
}

// -----------------------------
// runtime
// -----------------------------

function create_svg(width: number, height: number): SvgLiveTree {
  const svg2 = hson.liveTree.create.svg()
    .css.setMany({
      display: "block",

      // Keep the prairie in its own fixed drawing world; the host clips it.
      width: `${width}px`,
      height: `${height}px`,
      maxWidth: "none",
      flex: "0 0 auto",
      willChange: "transform",
    })
    .attr.setMany({
      xmlns: svgNs,
      width: String(width),
      height: String(height),
      viewBox: `0 0 ${width} ${height}`,
      preserveAspectRatio: "none",
    });

  return svg2;
}


export function prairie_factory(host: LiveTree, config?: Partial<PrairieConfig>
): PrairieRuntime {
  const viewportWidth = Math.max(1, Math.round(host.dom.clientSize()?.width || 1200));
  const viewportHeight = Math.max(1, Math.round(host.dom.clientSize()?.height || 700));
  // Stable vertical world; position it so the horizon survives resize/zoom.
  const height = Math.max(
    PRAIRIE_MIN_WORLD_HEIGHT,
    viewportHeight + PRAIRIE_VERTICAL_BLEED,
  );
  const width = Math.max(
    PRAIRIE_MIN_WORLD_WIDTH,
    viewportWidth * PRAIRIE_WORLD_WIDTH_MULTIPLIER,
    viewportWidth + PRAIRIE_WORLD_EXTRA_WIDTH,
  );
  const cfg: PrairieConfig = {
    ...default_prairie_config(width, height),
    ...config,
  };
  const initialCssWorldWidth = prairieScreenPx(cfg.width);
  const initialSpareWidth = Math.max(0, initialCssWorldWidth - viewportWidth);
  const initialPanCenter = -initialSpareWidth * 0.5;
  const rand = make_rng(cfg.seed);
  const rows: PrairieRowStatic[] = [];
  const paths: SvgLiveTree[] = [];
  const svg = create_svg(cfg.width, cfg.height).css.setMany({
    filter: $svg_filter,
  });

  host.css.setMany({
    overflow: "hidden",
    position: "relative",
  });

  const flowerPaths: SvgLiveTree[] = [];
  const flowers: PrairieFlowerStatic[] = [];

  // far rows first, near rows last
  for (let i = cfg.rowCount - 1; i >= 0; i--) {
    const row = make_row_static(cfg, i, rand);
    rows.push(row);

    const rowPath = svg.create.path()
      .attr.setMany({
        xmlns: svgNs,
        fill: row.fill,
      });

    svg.append(rowPath);
    paths.push(rowPath);

    const rowFlowers = make_row_flowers(row, cfg, rand);

    for (const flower of rowFlowers) {
      const flowerPath = svg.create.path()
        .attr.setMany({
          xmlns: svgNs,
          fill: flower.color,
          opacity: "0",
        });

      svg.append(flowerPath);
      flowers.push(flower);
      flowerPaths.push(flowerPath);
    }
  }

  const rowByIndex = new Map<number, PrairieRowStatic>();
  for (const row of rows) rowByIndex.set(row.rowIndex, row);

  host.empty();
  host.append(svg);

  let rafId = 0;
  let stopped = false;
  let startMs: number | undefined;
  let lastZoomFactor = 0;

  const frame = (timeMs: number): void => {
    if (stopped) return;

    const timeSec = timeMs * 0.001;

    // Use elapsed local animation time so the prairie starts centered.
    startMs ??= timeMs;
    const elapsedSec = (timeMs - startMs) * 0.001;

    const visibleWidth = Math.max(1, Math.round(host.dom.clientSize()?.width || viewportWidth));
    const visibleHeight = Math.max(1, Math.round(host.dom.clientSize()?.height || viewportHeight));
    const zoomFactor = prairieZoomFactor();
    const cssWorldWidth = cfg.width / zoomFactor;
    const cssWorldHeight = cfg.height / zoomFactor;

    if (Math.abs(zoomFactor - lastZoomFactor) > 0.001) {
      lastZoomFactor = zoomFactor;
      svg.style.setMany({
        width: `${cssWorldWidth.toFixed(2)}px`,
        height: `${cssWorldHeight.toFixed(2)}px`,
      });
    }

    const spareWidth = Math.max(0, cssWorldWidth - visibleWidth);
    const panAmp = Math.min(PRAIRIE_PAN_MAX_PX / zoomFactor, spareWidth * 0.42);
    const panPhase = Math.sin((elapsedSec / PRAIRIE_PAN_PERIOD_SEC) * Math.PI * 2);
    const rawPanX = initialPanCenter + panPhase * panAmp;
    const minPanX = Math.min(0, visibleWidth - cssWorldWidth);
    const panX = _clampLoHi(rawPanX, minPanX, 0);
    // Keep the horizon visually stable under browser zoom.
    const desiredHorizonY = visibleHeight * PRAIRIE_HORIZON_SCREEN_RATIO;
    const displayedHorizonY = cfg.horizonY / zoomFactor;
    const rawPanY = desiredHorizonY - displayedHorizonY;
    const minPanY = Math.min(0, visibleHeight - cssWorldHeight);
    const panY = _clampLoHi(rawPanY, minPanY, 0);

    svg.style.set.transform(`translate3d(${panX.toFixed(2)}px, ${panY.toFixed(2)}px, 0)`);

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const path = paths[i];
      if (!row || !path) continue;
      const d = build_row_path_d(row, cfg, timeSec);
      if (d) path.attr.set("d", d);
    }

    for (let i = 0; i < flowers.length; i++) {
      const flower = flowers[i] as PrairieFlowerStatic;
      const flowerPath = flowerPaths[i];

      const row = rowByIndex.get(flower.rowIndex);
      if (!flowerPath || !row) continue;

      const bloomRaw = 1;
      const bloom = _clamp01(bloomRaw);

      if (bloom <= 0) {
        flowerPath.attr.setMany({
          opacity: "0",
          d: "",
        });
        continue;
      }

      const bloomScale = _clampLoHi(ease_out_back(bloom), 0, 1.14);
      const d = build_flower_cluster_path(flower, row, timeSec, bloomScale);

      flowerPath.attr.setMany({
        d,
        opacity: String(_lerp(0, 1, _clampLoHi(bloom * 1.25, 0, 1))),
      });
    }

    rafId = requestAnimationFrame(frame);
  };

  rafId = requestAnimationFrame(frame);

  return {
    host,
    svg,
    paths,
    flowerPaths,
    rows,
    flowers,
    config: cfg,
    stop: (): void => {
      stopped = true;
      cancelAnimationFrame(rafId);
    },
  };
}