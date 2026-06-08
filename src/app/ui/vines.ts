// vines.ts
// Procedural SVG vine ornament layer.

import { hson, type LiveTree } from "hson-live";
import type { CssMap, SvgLiveTree } from "hson-live/types";
import { make_rng } from "../utils/rng.js";

const SVG_NS = "http://www.w3.org/2000/svg";

export type VineSide = "left" | "right" | "top" | "bottom";

export type VineLayerConfig = Readonly<{
  seed: number;
  width: number;
  height: number;
  count: number;
  side: VineSide;
  minLength: number;
  maxLength: number;
  minAmp: number;
  maxAmp: number;
  lengthAmpEase: number;
  nodeMinGap: number;
  nodeMaxGap: number;
  nodeJitter: number;
  baseTuftChance: number;
  leafPairChance: number;
  leaflessVineChance: number;
  bareVineCount: number;
  leafCadenceMin: number;
  leafCadenceMax: number;
  tendrilTurnsMin: number;
  tendrilTurnsMax: number;
  branchChance: number;
  branchMinLength: number;
  branchMaxLength: number;
  branchMinAngle: number;
  branchMaxAngle: number;
  branchStrokeScale: number;
  branchOpacityScale: number;
  minStep: number;
  maxStep: number;
  strokeMin: number;
  strokeMax: number;
  opacityBack: number;
  opacityFront: number;
  colorBack: string;
  colorFront: string;
  leafChance: number;
  curlChance: number;
  tendrilChance: number;
  leafMin: number;
  leafMax: number;
  curlMin: number;
  curlMax: number;
  taperEndScale: number;
  topSproutCount: number;
  topSproutMaxRatio: number;
  topCanopyLeafCount: number;
  topCanopyDepthRatio: number;
}>;

export type VineRuntime = Readonly<{
  host: LiveTree;
  svg: SvgLiveTree;
  config: VineLayerConfig;
  show(): void;
  hide(): void;
  remove(): void;
}>;

export const DEFAULT_VINE_LAYER: VineLayerConfig = {
  seed: 117,
  width: 420,
  height: 520,
  count: 7,
  side: "top",
  minLength: 190,
  maxLength: 470,
  minAmp: 5,
  maxAmp: 20,
  lengthAmpEase: 0.54,
  nodeMinGap: 78,
  nodeMaxGap: 132,
  nodeJitter: 0.035,
  baseTuftChance: 0.72,
  leafPairChance: 0.08,
  leaflessVineChance: 0.18,
  bareVineCount: 5,
  leafCadenceMin: 14,
  leafCadenceMax: 26,
  tendrilTurnsMin: 2.6,
  tendrilTurnsMax: 4.35,
  branchChance: 0.22,
  branchMinLength: 54,
  branchMaxLength: 142,
  branchMinAngle: 0.14,
  branchMaxAngle: 0.42,
  branchStrokeScale: 0.58,
  branchOpacityScale: 0.72,
  minStep: 38,
  maxStep: 76,
  strokeMin: 0.7,
  strokeMax: 1.75,
  opacityBack: 0.16,
  opacityFront: 0.42,
  colorBack: "oklch(20% 0.035 145)",
  colorFront: "oklch(34% 0.065 145)",
  leafChance: 0.94,
  curlChance: 0.14,
  tendrilChance: 0.18,
  leafMin: 4,
  leafMax: 11,
  curlMin: 6,
  curlMax: 18,
  taperEndScale: 0.48,
  topSproutCount: 18,
  topSproutMaxRatio: 0.4,
  topCanopyLeafCount: 128,
  topCanopyDepthRatio: 0.18,
};

export const VINE_LAYERcss: CssMap = {
  position: "absolute",
  inset: "0",
  width: "100%",
  height: "100%",
  pointerEvents: "none",
  overflow: "visible",
};

type Point = Readonly<{ x: number; y: number }>;

type VineSpec = Readonly<{
  start: Point;
  length: number;
  amp: number;
  step: number;
  phase: number;
  drift: number;
  nodes: readonly VineNode[];
  leafSites: readonly VineSite[];
  branches: readonly VineBranch[];
  flip: 1 | -1;
  color: string;
  opacity: number;
  stroke: number;
}>;

type VineNode = Readonly<{
  t: number;
  side: 1 | -1;
}>;

type VineSite = Readonly<{
  t: number;
  side: 1 | -1;
  rotate: 1 | -1;
  scale: number;
}>;

type VineBranch = Readonly<{
  t: number;
  side: 1 | -1;
  angle: number;
  length: number;
  amp: number;
  phase: number;
  stroke: number;
  opacity: number;
  leafSites: readonly VineSite[];
  nodes: readonly VineNode[];
}>;

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function clamp01(n: number): number {
  return Math.max(0, Math.min(1, n));
}

function pick(rand: () => number, min: number, max: number): number {
  return lerp(min, max, rand());
}

function maybe(rand: () => number, chance: number): boolean {
  return rand() <= clamp01(chance);
}

function svgNum(n: number): string {
  return n.toFixed(2);
}

function pointAt(spec: VineSpec, t: number): Point {
  const p = clamp01(t);
  const sideWave = Math.sin(spec.phase + p * Math.PI * 2.15) * spec.amp;
  const drift = spec.drift * p;

  if (spec.flip === 1) {
    return {
      x: spec.start.x + sideWave + drift,
      y: spec.start.y + spec.length * p,
    };
  }

  return {
    x: spec.start.x + spec.length * p,
    y: spec.start.y + sideWave + drift,
  };
}

function pointFrom(start: Point, angle: number, localX: number, localY: number): Point {
  const ca = Math.cos(angle);
  const sa = Math.sin(angle);

  return {
    x: start.x + localX * ca - localY * sa,
    y: start.y + localX * sa + localY * ca,
  };
}

function pointToward(start: Point, angle: number, distance: number): Point {
  return {
    x: start.x + Math.cos(angle) * distance,
    y: start.y + Math.sin(angle) * distance,
  };
}

function branchPointAt(parent: VineSpec, branch: VineBranch, t: number): Point {
  const p = clamp01(t);
  const origin = pointAt(parent, branch.t);
  // CHANGED: `pointFrom` treats `angle` as the local x-axis, while branch
  // length is applied on local y. Rotate the parent tangent back by 90deg so
  // branches hang with the vine's gravity instead of shooting sideways.
  const branchAxisAngle = tangentAngle(parent, branch.t) - Math.PI * 0.5 + branch.angle;
  const baseWave = Math.sin(branch.phase);
  const wave = Math.sin(branch.phase + p * Math.PI * 1.72) - baseWave;
  // CHANGED: multiplying by `p` guarantees every branch begins exactly at its
  // parent vine instead of appearing as a detached floating stroke.
  const sideWave = wave * branch.amp * p * (1 - p * 0.34);
  const gravitySag = branch.length * p * p * 0.24;

  return pointFrom(origin, branchAxisAngle, sideWave, branch.length * p + gravitySag);
}

function vineSegmentPath(spec: VineSpec, t0: number, t1: number): string {
  const start = pointAt(spec, t0);
  const a = pointAt(spec, t0 + (t1 - t0) * 0.34);
  const b = pointAt(spec, t0 + (t1 - t0) * 0.66);
  const end = pointAt(spec, t1);

  return `M ${svgNum(start.x)} ${svgNum(start.y)} C ${svgNum(a.x)} ${svgNum(a.y)}, ${svgNum(b.x)} ${svgNum(b.y)}, ${svgNum(end.x)} ${svgNum(end.y)}`;
}

function branchSegmentPath(parent: VineSpec, branch: VineBranch, t0: number, t1: number): string {
  const start = branchPointAt(parent, branch, t0);
  const a = branchPointAt(parent, branch, t0 + (t1 - t0) * 0.34);
  const b = branchPointAt(parent, branch, t0 + (t1 - t0) * 0.66);
  const end = branchPointAt(parent, branch, t1);

  return `M ${svgNum(start.x)} ${svgNum(start.y)} C ${svgNum(a.x)} ${svgNum(a.y)}, ${svgNum(b.x)} ${svgNum(b.y)}, ${svgNum(end.x)} ${svgNum(end.y)}`;
}


function leafPath(x: number, y: number, r: number, angle: number, flip: 1 | -1): string {
  const ca = Math.cos(angle);
  const sa = Math.sin(angle);

  const tx = (dx: number, dy: number): Point => ({
    x: x + dx * ca - dy * sa,
    y: y + dx * sa + dy * ca,
  });

  const p0 = tx(0, 0);
  const p1 = tx(flip * r * 0.72, -r * 0.44);
  const p2 = tx(flip * r * 1.16, r * 0.18);
  const p3 = tx(flip * r * 0.28, r * 0.92);
  const p4 = tx(flip * -r * 0.42, r * 0.42);
  const p5 = tx(flip * -r * 0.24, -r * 0.18);

  return [
    `M ${svgNum(p0.x)} ${svgNum(p0.y)}`,
    `C ${svgNum(p1.x)} ${svgNum(p1.y)}, ${svgNum(p2.x)} ${svgNum(p2.y)}, ${svgNum(p3.x)} ${svgNum(p3.y)}`,
    `C ${svgNum(p4.x)} ${svgNum(p4.y)}, ${svgNum(p5.x)} ${svgNum(p5.y)}, ${svgNum(p0.x)} ${svgNum(p0.y)}`,
    "Z",
  ].join(" ");
}

function curlPath(x: number, y: number, r: number, angle: number, flip: 1 | -1, turns: number): string {
  const ca = Math.cos(angle);
  const sa = Math.sin(angle);
  const steps = Math.max(26, Math.round(turns * 18));
  const parts: string[] = [];

  const tx = (dx: number, dy: number): Point => ({
    x: x + dx * ca - dy * sa,
    y: y + dx * sa + dy * ca,
  });

  const anchor = tx(0, 0);
  parts.push(`M ${svgNum(anchor.x)} ${svgNum(anchor.y)}`);

  for (let i = 1; i <= steps; i += 1) {
    const t = i / steps;
    const theta = t * Math.PI * 2 * turns;
    // CHANGED: compact cellulose-coil tendrils. The coil has many turns packed
    // into a narrow pendant column, distinct from the looser branch geometry.
    const radius = r * (1 - t * 0.36);
    const droop = t * r * 1.35;
    const p = tx(
      flip * Math.sin(theta) * radius * 0.34,
      droop + (1 - Math.cos(theta)) * radius * 0.18,
    );

    parts.push(`L ${svgNum(p.x)} ${svgNum(p.y)}`);
  }

  return parts.join(" ");
}

function tendrilPath(start: Point, angle: number, length: number, curl: number, flip: 1 | -1): string {
  const ca = Math.cos(angle);
  const sa = Math.sin(angle);

  const tx = (dx: number, dy: number): Point => ({
    x: start.x + dx * ca - dy * sa,
    y: start.y + dx * sa + dy * ca,
  });

  const end = tx(flip * length * 0.14, length);
  const c1 = tx(flip * length * 0.18, length * 0.22);
  const c2 = tx(flip * length * -0.08, length * 0.76);
  const curlEnd = tx(flip * (length * 0.14 + curl * 0.46), length * 0.88);

  return [
    `M ${svgNum(start.x)} ${svgNum(start.y)}`,
    `C ${svgNum(c1.x)} ${svgNum(c1.y)}, ${svgNum(c2.x)} ${svgNum(c2.y)}, ${svgNum(end.x)} ${svgNum(end.y)}`,
    `Q ${svgNum(curlEnd.x)} ${svgNum(curlEnd.y)}, ${svgNum(end.x)} ${svgNum(end.y)}`,
  ].join(" ");
}

function vineNodeList(cfg: VineLayerConfig, rand: () => number, length: number): readonly VineNode[] {
  const nodes: VineNode[] = [];
  let y = pick(rand, cfg.nodeMinGap * 0.72, cfg.nodeMaxGap);
  let side: 1 | -1 = rand() > 0.5 ? 1 : -1;

  while (y < length * 0.94) {
    nodes.push({
      t: clamp01((y / length) + pick(rand, -cfg.nodeJitter, cfg.nodeJitter)),
      side,
    });

    side = side === 1 ? -1 : 1;
    y += pick(rand, cfg.nodeMinGap, cfg.nodeMaxGap);
  }

  return nodes;
}
function alternatingLeafSites(sites: readonly VineSite[]): readonly VineSite[] {
  const sorted = [...sites].sort((a, b) => a.t - b.t);
  const first = sorted[0];
  if (!first) return sorted;

  let side = first.side;

  return sorted.map((site, index) => {
    // CHANGED: alternate side every leaf, but use a four-step rotation phase so
    // leaf shape orientation does not stay locked to vine side.
    const rotate: 1 | -1 = index % 4 === 0 || index % 4 === 3 ? 1 : -1;
    const next: VineSite = { ...site, side, rotate };
    side = side === 1 ? -1 : 1;
    return next;
  });
}

function vineLeafSites(cfg: VineLayerConfig, rand: () => number, length: number, nodes: readonly VineNode[]): readonly VineSite[] {
  const sites: VineSite[] = [];
  let y = pick(rand, cfg.leafCadenceMin * 0.4, cfg.leafCadenceMax);
  let side: 1 | -1 = rand() > 0.5 ? 1 : -1;

  while (y < length * 0.9) {
    const t = clamp01((y / length) + pick(rand, -0.015, 0.015));
    // CHANGED: leaves now keep a clearer left-right march down the vine,
    // with scale fading gradually toward the tip.
    const scale = lerp(1.0, 0.54, t) * pick(rand, 0.88, 1.1);
    sites.push({ t, side, rotate: 1, scale });

    if (maybe(rand, cfg.leafPairChance)) {
      sites.push({
        t: clamp01(t + pick(rand, -0.014, 0.014)),
        side: side === 1 ? -1 : 1,
        rotate: -1,
        scale: scale * pick(rand, 0.68, 0.88),
      });
    }

    side = side === 1 ? -1 : 1;
    y += pick(rand, cfg.leafCadenceMin, cfg.leafCadenceMax);
  }

  for (const node of nodes) {
    const nearest = sites.reduce<VineSite | undefined>((best, site) => {
      if (!best) return site;
      return Math.abs(site.t - node.t) < Math.abs(best.t - node.t) ? site : best;
    }, undefined);

    // CHANGED: ornament nodes should reinforce the footstep cadence instead of
    // throwing extra same-side clusters over the regular leaf march.
    sites.push({
      t: node.t,
      side: nearest ? (nearest.side === 1 ? -1 : 1) : node.side,
      rotate: -1,
      scale: lerp(0.92, 0.52, node.t) * pick(rand, 0.78, 0.98),
    });
  }

  return alternatingLeafSites(sites);
}
function renderTopCanopy(svg: SvgLiveTree, cfg: VineLayerConfig, rand: () => number): void {
  const count = Math.max(0, Math.round(cfg.topCanopyLeafCount));
  const depth = Math.max(1, cfg.height * cfg.topCanopyDepthRatio);

  for (let i = 0; i < count; i += 1) {
    const x = pick(rand, -cfg.width * 0.03, cfg.width * 1.03);
    const yBias = rand() ** 1.9;
    const y = pick(rand, -depth * 0.18, depth) * yBias;
    const side: 1 | -1 = i % 2 === 0 ? 1 : -1;
    const radius = pick(rand, cfg.leafMin * 0.82, cfg.leafMax * 1.34) * pick(rand, 0.72, 1.18);
    const angle = pick(rand, Math.PI * 0.18, Math.PI * 0.82) * side + pick(rand, -0.28, 0.28);
    const opacity = pick(rand, cfg.opacityBack * 0.34, cfg.opacityFront * 0.76);
    const color = rand() > 0.58 ? cfg.colorFront : cfg.colorBack;

    appendPath(svg, leafPath(x, y, radius, angle, side), {
      fill: color,
      opacity: String(opacity),
    });
  }
}

function tangentAngle(spec: VineSpec, t: number): number {
  const p0 = pointAt(spec, Math.max(0, t - 0.015));
  const p1 = pointAt(spec, Math.min(1, t + 0.015));
  return Math.atan2(p1.y - p0.y, p1.x - p0.x);
}

function orientAngle(spec: VineSpec, t: number, branchSide: 1 | -1): number {
  return tangentAngle(spec, t) + branchSide * Math.PI * 0.5;
}

function leafStemAngle(spec: VineSpec, t: number, side: 1 | -1, rotate: 1 | -1): number {
  const normal = orientAngle(spec, t, side);
  // CHANGED: `side` decides which side of the vine gets the leaf. `rotate`
  // now creates a visible independent tilt phase, rather than mirroring in
  // lockstep with the side value.
  return normal + rotate * 0.72 + Math.sin(t * Math.PI * 11) * 0.06;
}

function leafOutwardAnchor(origin: Point, stemAngle: number, side: 1 | -1, distance: number): Point {
  return pointToward(origin, stemAngle + side * 0.22, distance);
}

function branchOrientAngle(parent: VineSpec, branch: VineBranch, t: number, branchSide: 1 | -1): number {
  const p0 = branchPointAt(parent, branch, Math.max(0, t - 0.02));
  const p1 = branchPointAt(parent, branch, Math.min(1, t + 0.02));
  const tangent = Math.atan2(p1.y - p0.y, p1.x - p0.x);
  return tangent + branchSide * Math.PI * 0.5;
}

function branchLeafStemAngle(parent: VineSpec, branch: VineBranch, t: number, side: 1 | -1, rotate: 1 | -1): number {
  const p0 = branchPointAt(parent, branch, Math.max(0, t - 0.02));
  const p1 = branchPointAt(parent, branch, Math.min(1, t + 0.02));
  const tangent = Math.atan2(p1.y - p0.y, p1.x - p0.x);
  const normal = tangent + side * Math.PI * 0.5;
  return normal + rotate * 0.72 + Math.sin(t * Math.PI * 11) * 0.06;
}

function branchLeafOutwardAnchor(origin: Point, stemAngle: number, side: 1 | -1, distance: number): Point {
  return pointToward(origin, stemAngle + side * 0.22, distance);
}

function vineBranches(cfg: VineLayerConfig, rand: () => number, specLength: number, nodes: readonly VineNode[]): readonly VineBranch[] {
  const branches: VineBranch[] = [];

  for (const node of nodes) {
    // CHANGED: side growth is now biased toward the upper part of the vine.
    // Lower branches are shorter and much less likely, which reduces the
    // detached-hair effect while preserving a little natural irregularity.
    const heightBias = lerp(1.18, 0.18, node.t);
    if (!maybe(rand, cfg.branchChance * heightBias)) continue;

    const lowerScale = lerp(1, 0.42, node.t);
    const length = pick(
      rand,
      cfg.branchMinLength * 0.48,
      Math.min(cfg.branchMaxLength, specLength * 0.34) * lowerScale,
    );
    const branchNodes = vineNodeList(
      { ...cfg, nodeMinGap: cfg.nodeMinGap * 0.88, nodeMaxGap: cfg.nodeMaxGap * 0.96 },
      rand,
      length,
    );

    branches.push({
      t: node.t,
      side: node.side,
      angle: -node.side * pick(rand, cfg.branchMinAngle, cfg.branchMaxAngle) * lerp(1, 0.58, node.t),
      length,
      amp: pick(rand, cfg.minAmp * 0.34, cfg.maxAmp * 0.54) * lowerScale,
      phase: rand() * Math.PI * 2,
      stroke: cfg.branchStrokeScale * lerp(1, 0.72, node.t),
      opacity: cfg.branchOpacityScale * lerp(1, 0.64, node.t),
      nodes: branchNodes,
      leafSites: vineLeafSites(
        { ...cfg, leafCadenceMin: cfg.leafCadenceMin * 0.78, leafCadenceMax: cfg.leafCadenceMax * 0.86 },
        rand,
        length,
        branchNodes,
      ),
    });
  }

  return branches;
}

function makeVineSpec(cfg: VineLayerConfig, rand: () => number, index: number): VineSpec {
  const depth = cfg.count <= 1 ? 1 : index / (cfg.count - 1);
  const front = depth > 0.52;
  const spread = cfg.side === "top" || cfg.side === "bottom" ? cfg.width : cfg.height;
  const lane = spread * ((index + 0.5) / Math.max(1, cfg.count));
  const laneJitter = pick(rand, -spread * 0.075, spread * 0.075);
  const offset = lane + laneJitter;

  let start: Point;
  let flip: 1 | -1;

  if (cfg.side === "top") {
    start = { x: offset, y: pick(rand, -12, 18) };
    flip = 1;
  } else if (cfg.side === "bottom") {
    start = { x: offset, y: cfg.height + pick(rand, -18, 12) };
    flip = 1;
  } else if (cfg.side === "left") {
    start = { x: pick(rand, -12, 18), y: offset };
    flip = -1;
  } else {
    start = { x: cfg.width + pick(rand, -18, 12), y: offset };
    flip = -1;
  }

  const length = pick(rand, cfg.minLength, cfg.maxLength);
  const lengthT = clamp01((length - cfg.minLength) / Math.max(1, cfg.maxLength - cfg.minLength));
  const ampCeiling = lerp(cfg.maxAmp, cfg.minAmp, lengthT * cfg.lengthAmpEase);
  const nodes = vineNodeList(cfg, rand, length);
  const branches = vineBranches(cfg, rand, length, nodes);

  return {
    start,
    length,
    amp: pick(rand, cfg.minAmp, ampCeiling),
    step: pick(rand, cfg.minStep, cfg.maxStep),
    phase: rand() * Math.PI * 2,
    drift: pick(rand, -14, 14),
    nodes,
    leafSites: vineLeafSites(cfg, rand, length, nodes),
    branches,
    flip,
    color: front ? cfg.colorFront : cfg.colorBack,
    opacity: pick(rand, front ? cfg.opacityFront * 0.72 : cfg.opacityBack * 0.72, front ? cfg.opacityFront : cfg.opacityBack),
    stroke: pick(rand, cfg.strokeMin, cfg.strokeMax) * (front ? 1 : 0.82) * lerp(0.86, 1.18, lengthT),
  };
}

function appendPath(svg: SvgLiveTree, d: string, attrs: Record<string, string>): SvgLiveTree {
  return svg.create.path().attr.setMany({
    xmlns: SVG_NS,
    d,
    ...attrs,
  });
}

function createSvg(width: number, height: number): SvgLiveTree {
  return hson.liveTree.create.svg()
    .css.setMany(VINE_LAYERcss)
    .attr.setMany({
      xmlns: SVG_NS,
      width: String(width),
      height: String(height),
      viewBox: `0 0 ${width} ${height}`,
      preserveAspectRatio: "none",
    });
}

function renderTaperedVine(svg: SvgLiveTree, spec: VineSpec, cfg: VineLayerConfig): void {
  const segmentCount = Math.max(5, Math.ceil(spec.length / spec.step));

  for (let i = 0; i < segmentCount; i += 1) {
    const t0 = i / segmentCount;
    const t1 = (i + 1) / segmentCount;
    const tMid = (t0 + t1) * 0.5;
    // CHANGED: SVG has no native tapered stroke, so draw short path segments
    // with gradually shrinking stroke widths.
    const taper = lerp(1, cfg.taperEndScale, tMid);

    appendPath(svg, vineSegmentPath(spec, t0, t1), {
      fill: "none",
      stroke: spec.color,
      "stroke-width": String(spec.stroke * taper),
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      opacity: String(spec.opacity),
    });
  }
}

function renderTaperedBranch(svg: SvgLiveTree, parent: VineSpec, branch: VineBranch, cfg: VineLayerConfig): void {
  const segmentCount = Math.max(3, Math.ceil(branch.length / 32));

  for (let i = 0; i < segmentCount; i += 1) {
    const t0 = i / segmentCount;
    const t1 = (i + 1) / segmentCount;
    const tMid = (t0 + t1) * 0.5;
    const taper = lerp(1, cfg.taperEndScale, tMid);

    appendPath(svg, branchSegmentPath(parent, branch, t0, t1), {
      fill: "none",
      stroke: parent.color,
      "stroke-width": String(parent.stroke * branch.stroke * taper),
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      opacity: String(parent.opacity * branch.opacity),
    });
  }
}

export function make_vines(host: LiveTree, options: Partial<VineLayerConfig> = {}): VineRuntime {
  const size = host.dom.clientSize();
  const cfg: VineLayerConfig = {
    ...DEFAULT_VINE_LAYER,
    width: Math.max(1, Math.round(options.width ?? size?.width ?? DEFAULT_VINE_LAYER.width)),
    height: Math.max(1, Math.round(options.height ?? size?.height ?? DEFAULT_VINE_LAYER.height)),
    ...options,
  };

  const rand = make_rng(cfg.seed);
  const svg = createSvg(cfg.width, cfg.height);

  host.append(svg);

  for (let i = 0; i < cfg.count; i += 1) {
    const spec = makeVineSpec(cfg, rand, i);

    renderTaperedVine(svg, spec, cfg);

    // CHANGED: keep a minority of long trailing stems nearly leafless, like the
    // reference photos. The contrast makes the leafy vines read more clearly.
    const specLeafChance = maybe(rand, cfg.leaflessVineChance) ? cfg.leafChance * 0.08 : cfg.leafChance;

    for (const branch of spec.branches) {
      renderTaperedBranch(svg, spec, branch, cfg);

      for (const node of branch.nodes) {
        const p = branchPointAt(spec, branch, node.t);
        const side = node.side;
        const angle = branchOrientAngle(spec, branch, node.t, side) + pick(rand, -0.18, 0.18);

        appendPath(svg, curlPath(
          p.x,
          p.y,
          pick(rand, cfg.curlMin * 0.22, cfg.curlMax * 0.38),
          angle + pick(rand, -0.32, 0.32),
          side,
          pick(rand, cfg.tendrilTurnsMin, cfg.tendrilTurnsMax),
        ), {
          fill: "none",
          stroke: spec.color,
          "stroke-width": String(spec.stroke * branch.stroke * 0.58),
          "stroke-linecap": "round",
          "stroke-linejoin": "round",
          opacity: String(spec.opacity * branch.opacity * pick(rand, 0.42, 0.76)),
        });
      }

      for (const site of branch.leafSites) {
        if (!maybe(rand, specLeafChance * 0.92) && !branch.nodes.some((node) => Math.abs(node.t - site.t) < 0.001)) continue;

        const p = branchPointAt(spec, branch, site.t);
        const angle = branchLeafStemAngle(spec, branch, site.t, site.side, site.rotate) + pick(rand, -0.04, 0.04);
        const radius = pick(rand, cfg.leafMin * 0.82, cfg.leafMax * 0.96) * site.scale;
        const leafAnchor = branchLeafOutwardAnchor(p, angle, site.side, radius * 0.68);

        appendPath(svg, leafPath(leafAnchor.x, leafAnchor.y, radius, angle, 1), {
          fill: spec.color,
          opacity: String(spec.opacity * branch.opacity * pick(rand, 0.66, 1.08)),
        });
      }
    }

    const ornamentCount = spec.nodes.length;

    for (let j = 0; j < ornamentCount; j += 1) {
      const node = spec.nodes[j];
      if (!node) continue;
      const t = node.t;
      const side = node.side;
      const p = pointAt(spec, t);
      const angle = orientAngle(spec, t, side) + pick(rand, -0.22, 0.22);

      if (true) {
        appendPath(svg, curlPath(
          p.x,
          p.y,
          pick(rand, cfg.curlMin * 0.24, cfg.curlMax * 0.42),
          angle + pick(rand, -0.44, 0.44),
          side,
          pick(rand, cfg.tendrilTurnsMin, cfg.tendrilTurnsMax),
        ), {
          fill: "none",
          stroke: spec.color,
          "stroke-width": String(spec.stroke * 0.68),
          "stroke-linecap": "round",
          "stroke-linejoin": "round",
          opacity: String(spec.opacity * pick(rand, 0.45, 0.8)),
        });
      }

      if (true) {
        const len = pick(rand, 18, 68);
        const tendrilAngle = angle + pick(rand, -0.34, 0.34);

        appendPath(svg, tendrilPath(p, tendrilAngle, len, pick(rand, 3, 9), side), {
          fill: "none",
          stroke: spec.color,
          "stroke-width": String(spec.stroke * pick(rand, 0.22, 0.42)),
          "stroke-linecap": "round",
          "stroke-linejoin": "round",
          opacity: String(spec.opacity * pick(rand, 0.26, 0.54)),
        });
      }
    }

    for (const site of spec.leafSites) {
      if (!maybe(rand, specLeafChance) && !spec.nodes.some((node) => Math.abs(node.t - site.t) < 0.001)) continue;

      const p = pointAt(spec, site.t);
      const angle = leafStemAngle(spec, site.t, site.side, site.rotate) + pick(rand, -0.04, 0.04);
      const radius = pick(rand, cfg.leafMin * 1.02, cfg.leafMax * 1.12) * site.scale;
      const leafAnchor = leafOutwardAnchor(p, angle, site.side, radius * 0.74);

      appendPath(svg, leafPath(leafAnchor.x, leafAnchor.y, radius, angle, 1), {
        fill: spec.color,
        opacity: String(spec.opacity * pick(rand, 0.62, 1.08)),
      });
    }
  }

  const bareVineCount = Math.max(0, Math.round(cfg.bareVineCount));
  const bareCfg: VineLayerConfig = {
    ...cfg,
    seed: cfg.seed + 421,
    count: bareVineCount,
    minLength: cfg.minLength * 0.78,
    maxLength: cfg.maxLength * 1.04,
    minAmp: cfg.minAmp * 0.62,
    maxAmp: cfg.maxAmp * 0.82,
    strokeMin: cfg.strokeMin * 0.42,
    strokeMax: cfg.strokeMax * 0.62,
    opacityBack: cfg.opacityBack * 0.38,
    opacityFront: cfg.opacityFront * 0.54,
    branchChance: 0,
    leafChance: 0,
    leaflessVineChance: 1,
    topSproutCount: 0,
    topCanopyLeafCount: 0,
  };

  for (let i = 0; i < bareVineCount; i += 1) {
    // CHANGED: extra leafless strands add the fine trailing-vine contrast from
    // the reference photos without thickening the leafy canopy.
    const spec = makeVineSpec(bareCfg, rand, i);
    renderTaperedVine(svg, spec, bareCfg);
  }

  const sproutCount = Math.max(0, Math.round(cfg.topSproutCount));
  const sproutCfg: VineLayerConfig = {
    ...cfg,
    count: sproutCount,
    minLength: Math.min(cfg.minLength * 0.28, cfg.height * cfg.topSproutMaxRatio * 0.28),
    maxLength: Math.min(cfg.maxLength * 0.38, cfg.height * cfg.topSproutMaxRatio * 0.74),
    minAmp: cfg.minAmp * 0.84,
    maxAmp: cfg.maxAmp * 1.18,
    strokeMin: cfg.strokeMin * 0.58,
    strokeMax: cfg.strokeMax * 0.72,
    opacityBack: cfg.opacityBack * 0.58,
    opacityFront: cfg.opacityFront * 0.68,
    branchChance: cfg.branchChance * 0.55,
    leaflessVineChance: 0.04,
    bareVineCount: 0,
    leafChance: Math.min(1, cfg.leafChance * 1.08),
    leafCadenceMin: cfg.leafCadenceMin * 0.66,
    leafCadenceMax: cfg.leafCadenceMax * 0.78,
  };

  for (let i = 0; i < sproutCount; i += 1) {
    const spec = makeVineSpec(sproutCfg, rand, i);
    renderTaperedVine(svg, spec, sproutCfg);

    for (const site of spec.leafSites) {
      if (!maybe(rand, sproutCfg.leafChance * 0.94)) continue;

      const p = pointAt(spec, site.t);
      const angle = leafStemAngle(spec, site.t, site.side, site.rotate) + pick(rand, -0.04, 0.04);
      const radius = pick(rand, sproutCfg.leafMin, sproutCfg.leafMax) * site.scale * 0.9;
      const leafAnchor = leafOutwardAnchor(p, angle, site.side, radius * 0.66);

      appendPath(svg, leafPath(leafAnchor.x, leafAnchor.y, radius, angle, 1), {
        fill: spec.color,
        opacity: String(spec.opacity * pick(rand, 0.5, 0.92)),
      });
    }
  }

  renderTopCanopy(svg, cfg, rand);

  return {
    host,
    svg,
    config: cfg,

    show(): void {
      svg.style.set.visibility("visible");
    },

    hide(): void {
      svg.style.set.visibility("hidden");
    },

    remove(): void {
      svg.removeSelf();
    },
  };
}