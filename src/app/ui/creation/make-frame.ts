import { hson, type LiveTree } from "hson-live";
import { OKLCH_ACID_WASHED, OKLCH_FOREST, OKLCH_NEUTRALS } from "../../core/consts/oklch";
import { set_alpha } from "../colors/color-helpers";

type FrameDrawConfig = Readonly<{
  inset: number;
  corner: number;
  lift: number;
}>;

const DEFAULT_FRAME: FrameDrawConfig = {
  inset: 8,
  corner: 52,
  lift: 24,
};

const frameCss = {
  position: "fixed",
  inset: "0",
  width: "100vw",
  height: "100vh",
  pointerEvents: "none",
  zIndex: "40",
  boxShadow: `
  inset 0 0 1.5rem ${set_alpha(OKLCH_FOREST.deepMossBlack, 0.30)}`,
} as const;

const FRAME_OUTER_FILL = "oklch(27% 0.055 83 / 0.88)";
const WOOD_GRAIN_DARK = "oklch(42% 0.045 78 / 0.12)";
const WOOD_GRAIN_SOFT = "oklch(68% 0.055 88 / 0.07)";
const WOOD_KNOT_DARK = "oklch(36% 0.05 72 / 0.10)";

const FRAME_TEXTURE_SEED = Math.random() * 1000;
const FRAME_BASE_DPR = window.devicePixelRatio || 1;

function frameZoomFactor(): number {
  // CHANGED: browser zoom changes devicePixelRatio in Chromium and usually in
  // Safari. Use the load-time DPR as the visual baseline, then compensate draw
  // dimensions when the user zooms after load.
  const now = window.devicePixelRatio || FRAME_BASE_DPR;
  return Math.max(0.5, Math.min(3, now / FRAME_BASE_DPR));
}

function framePx(n: number): number {
  return n / frameZoomFactor();
}

function frameRand(i: number, salt: number): number {
  const x = Math.sin((i + 1) * 127.1 + salt * 311.7 + FRAME_TEXTURE_SEED) * 43758.5453123;
  return x - Math.floor(x);
}

function frameRandInt(salt: number, min: number, max: number): number {
  return min + Math.floor(frameRand(0, salt) * (max - min + 1));
}

function frameCornerSize(w: number, h: number, cfg: FrameDrawConfig): number {
  // CHANGED: keep the ornamental corner visually stable when browser zoom
  // changes. The canvas still fills the viewport, but the frame motif is drawn
  // in compensated CSS-pixel units.
  const inset = frameInsetSize(cfg);
  const available = Math.max(1, Math.min(w, h) - inset * 2);
  return Math.min(framePx(cfg.corner), available * 0.22);
}

function frameInsetSize(cfg: FrameDrawConfig): number {
  return framePx(cfg.inset);
}

// ---- Frame path helpers ----
type FramePathPoint = Readonly<{
  x: number;
  y: number;
  tx: number;
  ty: number;
  nx: number;
  ny: number;
}>;

function unitVector(x: number, y: number): Readonly<{ x: number; y: number }> {
  const len = Math.hypot(x, y) || 1;
  return { x: x / len, y: y / len };
}

function quadPoint(
  p0: Readonly<{ x: number; y: number }>,
  p1: Readonly<{ x: number; y: number }>,
  p2: Readonly<{ x: number; y: number }>,
  t: number,
): FramePathPoint {
  const mt = 1 - t;
  const x = mt * mt * p0.x + 2 * mt * t * p1.x + t * t * p2.x;
  const y = mt * mt * p0.y + 2 * mt * t * p1.y + t * t * p2.y;
  const dx = 2 * mt * (p1.x - p0.x) + 2 * t * (p2.x - p1.x);
  const dy = 2 * mt * (p1.y - p0.y) + 2 * t * (p2.y - p1.y);
  const tan = unitVector(dx, dy);
  const norm = unitVector(-tan.y, tan.x);
  return { x, y, tx: tan.x, ty: tan.y, nx: norm.x, ny: norm.y };
}

function sampleFramePath(w: number, h: number, cfg: FrameDrawConfig, t: number): FramePathPoint {
  const inset = frameInsetSize(cfg);
  const x0 = inset;
  const y0 = inset;
  const x1 = w - inset;
  const y1 = h - inset;
  const c = frameCornerSize(w, h, cfg);

  const topLen = Math.max(1, x1 - x0 - c * 2);
  const sideLen = Math.max(1, y1 - y0 - c * 2);
  const curveLen = c * 1.58;
  const total = topLen * 2 + sideLen * 2 + curveLen * 4;
  let d = ((t % 1) + 1) % 1 * total;

  const take = (len: number): number | undefined => {
    if (d <= len) return d / len;
    d -= len;
    return undefined;
  };

  let u = take(topLen);
  if (u !== undefined) {
    return { x: x0 + c + topLen * u, y: y0, tx: 1, ty: 0, nx: 0, ny: -1 };
  }

  u = take(curveLen);
  if (u !== undefined) {
    return quadPoint({ x: x1 - c, y: y0 }, { x: x1 - c, y: y0 + c }, { x: x1, y: y0 + c }, u);
  }

  u = take(sideLen);
  if (u !== undefined) {
    return { x: x1, y: y0 + c + sideLen * u, tx: 0, ty: 1, nx: 1, ny: 0 };
  }

  u = take(curveLen);
  if (u !== undefined) {
    return quadPoint({ x: x1, y: y1 - c }, { x: x1 - c, y: y1 - c }, { x: x1 - c, y: y1 }, u);
  }

  u = take(topLen);
  if (u !== undefined) {
    return { x: x1 - c - topLen * u, y: y1, tx: -1, ty: 0, nx: 0, ny: 1 };
  }

  u = take(curveLen);
  if (u !== undefined) {
    return quadPoint({ x: x0 + c, y: y1 }, { x: x0 + c, y: y1 - c }, { x: x0, y: y1 - c }, u);
  }

  u = take(sideLen);
  if (u !== undefined) {
    return { x: x0, y: y1 - c - sideLen * u, tx: 0, ty: -1, nx: -1, ny: 0 };
  }

  u = d / curveLen;
  return quadPoint({ x: x0, y: y0 + c }, { x: x0 + c, y: y0 + c }, { x: x0 + c, y: y0 }, u);
}
function drawWoodGrain(ctx: CanvasRenderingContext2D, w: number, h: number): void {
  ctx.save();

  // CHANGED: very low-contrast procedural grain. These are intentionally not
  // realistic; they only break the flat brass field enough to feel material.
  for (let i = 0; i < 18; i += 1) {
    const x = ((i * 97) % Math.max(1, w)) + Math.sin(i * 1.7) * 18;
    const y = ((i * 211) % Math.max(1, h)) + Math.cos(i * 1.13) * 26;
    const rx = 22 + ((i * 17) % 42);
    const ry = 120 + ((i * 31) % 220);

    const g = ctx.createRadialGradient(x, y, 2, x, y, Math.max(rx, ry));
    g.addColorStop(0, i % 3 === 0 ? WOOD_KNOT_DARK : WOOD_GRAIN_DARK);
    g.addColorStop(0.18, "transparent");
    g.addColorStop(0.38, i % 2 === 0 ? WOOD_GRAIN_SOFT : "transparent");
    g.addColorStop(0.7, "transparent");

    ctx.save();
    ctx.translate(x, y);
    ctx.scale(rx / Math.max(rx, ry), ry / Math.max(rx, ry));
    ctx.translate(-x, -y);
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x, y, Math.max(rx, ry), 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // CHANGED: soft vertical board-grain bands, deliberately barely visible.
  for (let x = -80; x < w + 80; x += 38) {
    const wobble = Math.sin(x * 0.035) * 7;
    const g = ctx.createLinearGradient(x + wobble - 11, 0, x + wobble + 11, 0);
    g.addColorStop(0, "transparent");
    g.addColorStop(0.48, WOOD_GRAIN_DARK);
    g.addColorStop(1, "transparent");

    ctx.fillStyle = g;
    ctx.fillRect(x + wobble - 12, 0, 24, h);
  }

  ctx.restore();
}

function drawInnerApertureShadow(ctx: CanvasRenderingContext2D, w: number, h: number, cfg: FrameDrawConfig): void {
  ctx.save();
  ctx.lineJoin = "round";
  ctx.lineCap = "round";

  // CHANGED: on the pale paper wash the aperture needs a real separating edge,
  // but it should follow the frame path rather than become right/bottom bars.
  makeFramePath(ctx, w, h, cfg);
  ctx.clip();

  ctx.save();
  ctx.shadowColor = "oklch(4% 0.025 78 / 0.26)";
  ctx.shadowBlur = 6;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
  makeFramePath(ctx, w, h, cfg);
  ctx.strokeStyle = "oklch(9% 0.026 78 / 0.41)";
  ctx.lineWidth = 2.15;
  ctx.stroke();
  ctx.restore();

  makeFramePath(ctx, w, h, cfg);
  ctx.strokeStyle = "oklch(2% 0.024 78 / 0.046)";
  ctx.lineWidth = 10.2;
  ctx.stroke();

  ctx.restore();
}

function drawDirectionalApertureShadow(ctx: CanvasRenderingContext2D, w: number, h: number, cfg: FrameDrawConfig, theta = -Math.PI * 0.25): void {
  const strength = Math.max(0.18, Math.cos(theta + Math.PI * 0.25));

  ctx.save();
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  // CHANGED: no more straight right/bottom bars. Keep only a very quiet
  // path-following directional darkening so the paper wash still has depth.
  makeFramePath(ctx, w, h, cfg);
  ctx.clip();

  ctx.save();
  ctx.translate(1.15, 1.15);
  makeFramePath(ctx, w, h, cfg);
  ctx.strokeStyle = `oklch(5% 0.026 78 / ${0.055 + strength * 0.035})`;
  ctx.lineWidth = 3.2;
  ctx.stroke();
  ctx.restore();

  ctx.restore();
}

function drawDirectionalEdgeShade(ctx: CanvasRenderingContext2D, w: number, h: number, cfg: FrameDrawConfig, theta = -Math.PI * 0.25): void {
  const inset = frameInsetSize(cfg);
  const x0 = inset;
  const y0 = inset;
  const x1 = w - inset;
  const y1 = h - inset;
  const c = frameCornerSize(w, h, cfg);
  const strength = Math.max(0.22, Math.cos(theta + Math.PI * 0.25));

  ctx.save();
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.strokeStyle = `oklch(7% 0.03 74 / ${0.10 + strength * 0.07})`;
  ctx.lineWidth = 1.05;

  // CHANGED: subtle opposite-edge shading, paired with the top-left light source.
  // Keep this grouped for future directional movement.
  ctx.beginPath();
  ctx.moveTo(x1 + 0.7, y0 + c + 58);
  ctx.lineTo(x1 + 0.7, y1 - c - 80);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(x0 + c + 82, y1 + 0.8);
  ctx.lineTo(x1 - c - 70, y1 + 0.8);
  ctx.stroke();

  ctx.restore();
}

function drawGoldPits(ctx: CanvasRenderingContext2D, w: number, h: number, cfg: FrameDrawConfig): void {
  ctx.save();

  // CHANGED: pocks now sample the actual frame path instead of fixed top/side
  // coordinates. This keeps every dent on the gilt path, including the inverse
  // corners, and prevents marks from floating in the wood.
  const pitCount = frameRandInt(31, 18, 28);

  for (let i = 0; i < pitCount; i += 1) {
    const t = (i / pitCount + frameRand(i, 32) * 0.05) % 1;
    const p = sampleFramePath(w, h, cfg, t);
    const offset = framePx((frameRand(i, 33) - 0.5) * 2.9);
    const x = p.x + p.nx * offset;
    const y = p.y + p.ny * offset;
    const r = framePx(0.46 + frameRand(i, 34) * 0.58);
    const rot = (frameRand(i, 35) - 0.5) * 0.55;

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(Math.atan2(p.ty, p.tx) + rot);

    // CHANGED: the dark center roughens the gilt but remains small enough to
    // read as surface damage, not ornament.
    ctx.fillStyle = "oklch(13% 0.032 72 / 0.24)";
    ctx.beginPath();
    ctx.ellipse(0, 0, r, r * 0.72, 0, 0, Math.PI * 2);
    ctx.fill();

    // CHANGED: small displaced-metal burr; paired with the dent and aligned to
    // the local frame tangent instead of screen coordinates.
    ctx.strokeStyle = "oklch(99% 0.055 98 / 0.34)";
    ctx.lineWidth = 0.34;
    ctx.beginPath();
    ctx.arc(r * 0.30, r * 0.28, r * 0.72, Math.PI * 1.85, Math.PI * 2.22);
    ctx.stroke();

    ctx.restore();
  }

  ctx.restore();
}

function drawGoldFlecks(ctx: CanvasRenderingContext2D, w: number, h: number, cfg: FrameDrawConfig): void {
  ctx.save();

  // CHANGED: randomized count and fully path-sampled placement. The flecks now
  // respect the inverse-corner path rather than the canvas box.
  const fleckCount = frameRandInt(41, 82, 128);

  for (let i = 0; i < fleckCount; i += 1) {
    const t = (i / fleckCount + frameRand(i, 42) * 0.028) % 1;
    const p = sampleFramePath(w, h, cfg, t);
    const bright = frameRand(i, 43) > 0.86;
    const r = framePx((bright ? 0.38 : 0.24) * (0.65 + frameRand(i, 44) * 0.78));
    const offset = framePx((frameRand(i, 45) - 0.5) * 3.1);
    const x = p.x + p.nx * offset;
    const y = p.y + p.ny * offset;

    ctx.fillStyle = bright
      ? "oklch(97% 0.045 98 / 0.20)"
      : "oklch(16% 0.035 76 / 0.16)";

    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

function drawGoldGrain(ctx: CanvasRenderingContext2D, w: number, h: number, cfg: FrameDrawConfig): void {
  ctx.save();
  ctx.lineCap = "round";

  // CHANGED: randomized count and fully path-sampled scratches/patina. The
  // corners receive the same surface treatment as the straight runs.
  const grainCount = frameRandInt(51, 96, 142);

  for (let i = 0; i < grainCount; i += 1) {
    const t = (i / grainCount + frameRand(i, 52) * 0.022) % 1;
    const p = sampleFramePath(w, h, cfg, t);
    const bright = frameRand(i, 53) > 0.90;
    const len = framePx(bright ? 2.8 + frameRand(i, 54) * 4.2 : 1.4 + frameRand(i, 55) * 3.0);
    const offset = framePx((frameRand(i, 56) - 0.5) * 3.2);
    const x = p.x + p.nx * offset;
    const y = p.y + p.ny * offset;
    const lean = (frameRand(i, 57) - 0.5) * 0.42;
    const tx = p.tx + p.nx * lean;
    const ty = p.ty + p.ny * lean;
    const u = unitVector(tx, ty);

    ctx.strokeStyle = bright
      ? "oklch(98% 0.045 98 / 0.14)"
      : "oklch(10% 0.03 74 / 0.105)";
    ctx.lineWidth = framePx(bright ? 0.36 : 0.30);

    ctx.beginPath();
    ctx.moveTo(x - u.x * len * 0.5, y - u.y * len * 0.5);
    ctx.lineTo(x + u.x * len * 0.5, y + u.y * len * 0.5);
    ctx.stroke();
  }

  ctx.restore();
}

function drawDirectionalGlints(ctx: CanvasRenderingContext2D, w: number, h: number, cfg: FrameDrawConfig, theta = -Math.PI * 0.25): void {
  const inset = frameInsetSize(cfg);
  const x0 = inset;
  const y0 = inset;
  const x1 = w - inset;
  const y1 = h - inset;
  const c = frameCornerSize(w, h, cfg);
  const strength = Math.max(0, Math.cos(theta + Math.PI * 0.25));
  const alpha = 0.30 + strength * 0.22;

  ctx.save();
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  // CHANGED: keep glints away from the inverse-corner curves. The path-sampled
  // version was physically nicer in theory, but tangent-line segments can poke
  // out as whiskers at certain sizes.
  const topStart = x0 + c + 44;
  const topEnd = x1 - c - 68;
  const topLen = Math.max(0, topEnd - topStart);
  const glintCount = frameRandInt(61, 3, 6);

  for (let i = 0; i < glintCount; i += 1) {
    const t = frameRand(i, 62);
    const x = topStart + topLen * t;
    const y = y0 - 0.48 + (frameRand(i, 63) - 0.5) * 0.6;
    const len = Math.min(48, 14 + frameRand(i, 64) * 34);
    const fade = 1 - i / Math.max(1, glintCount);

    ctx.strokeStyle = `oklch(99% 0.052 98 / ${alpha * (0.20 + fade * 0.45)})`;
    ctx.lineWidth = 0.36 + frameRand(i, 65) * 0.16;

    ctx.beginPath();
    ctx.moveTo(x - len * 0.42, y);
    ctx.lineTo(x + len * 0.58, y);
    ctx.stroke();
  }

  // A tiny upper-left vertical catch, kept on the straight rail only.
  ctx.strokeStyle = `oklch(98% 0.048 98 / ${alpha * 0.22})`;
  ctx.lineWidth = 0.34;
  ctx.beginPath();
  ctx.moveTo(x0 - 0.42, y0 + c + 72);
  ctx.lineTo(x0 - 0.42, y0 + c + 94);
  ctx.stroke();

  // Tiny lower-right counter-catch, also on a straight run and away from the corner.
  ctx.strokeStyle = `oklch(98% 0.048 98 / ${alpha * 0.12})`;
  ctx.lineWidth = 0.32;
  ctx.beginPath();
  ctx.moveTo(x1 - c - 106, y1 + 0.42);
  ctx.lineTo(x1 - c - 82, y1 + 0.42);
  ctx.stroke();

  ctx.restore();
}

function makeFramePath(ctx: CanvasRenderingContext2D, w: number, h: number, cfg: FrameDrawConfig): void {
  const inset = frameInsetSize(cfg);
  const x0 = inset;
  const y0 = inset;
  const x1 = w - inset;
  const y1 = h - inset;
  const c = frameCornerSize(w, h, cfg);

  // CHANGED: canvas equivalent of the old SVG frame motif. The sides stay
  // rectangular, while each corner is cut inward by a soft quadratic scoop.
  ctx.beginPath();
  ctx.moveTo(x0 + c, y0);
  ctx.lineTo(x1 - c, y0);
  ctx.quadraticCurveTo(x1 - c, y0 + c, x1, y0 + c);
  ctx.lineTo(x1, y1 - c);
  ctx.quadraticCurveTo(x1 - c, y1 - c, x1 - c, y1);
  ctx.lineTo(x0 + c, y1);
  ctx.quadraticCurveTo(x0 + c, y1 - c, x0, y1 - c);
  ctx.lineTo(x0, y0 + c);
  ctx.quadraticCurveTo(x0 + c, y0 + c, x0 + c, y0);
  ctx.closePath();
}

function fillFrameExterior(ctx: CanvasRenderingContext2D, w: number, h: number, cfg: FrameDrawConfig): void {
  ctx.save();

  // CHANGED: paint the whole fixed canvas with a muted brass/wood backing,
  // then punch the framed interior back to transparent so the prairie shows through.
  ctx.fillStyle = FRAME_OUTER_FILL;
  ctx.fillRect(0, 0, w, h);
  drawWoodGrain(ctx, w, h);

  ctx.globalCompositeOperation = "destination-out";
  makeFramePath(ctx, w, h, cfg);
  ctx.fill();

  ctx.restore();
}

function strokeFrame(ctx: CanvasRenderingContext2D, w: number, h: number, cfg: FrameDrawConfig): void {
  const gold = OKLCH_ACID_WASHED.straw;

  fillFrameExterior(ctx, w, h, cfg);
  drawInnerApertureShadow(ctx, w, h, cfg);
  drawDirectionalApertureShadow(ctx, w, h, cfg);

  ctx.save();
  ctx.lineJoin = "round";
  ctx.lineCap = "round";

  // CHANGED: relief is faked with a wide dull under-stroke, a main gold line,
  // and two small offset highlights/shadows.
  makeFramePath(ctx, w, h, cfg);
  ctx.strokeStyle = set_alpha(gold, 0.12);
  ctx.lineWidth = framePx(4.85);
  ctx.stroke();

  makeFramePath(ctx, w, h, cfg);
  ctx.strokeStyle = set_alpha(gold, 0.68);
  ctx.lineWidth = framePx(2.65);
  ctx.stroke();

  ctx.save();
  ctx.translate(framePx(1.2), framePx(1.2));
  makeFramePath(ctx, w, h, cfg);
  ctx.strokeStyle = set_alpha(gold, 0.24);
  ctx.lineWidth = framePx(1.2);
  ctx.stroke();
  ctx.restore();

  drawDirectionalEdgeShade(ctx, w, h, cfg);
  drawGoldGrain(ctx, w, h, cfg);
  drawGoldPits(ctx, w, h, cfg);
  drawGoldFlecks(ctx, w, h, cfg);
  drawDirectionalGlints(ctx, w, h, cfg);

  ctx.restore();
}
function syncCanvasSize(canvas: LiveTree): Readonly<{ w: number; h: number }> {
  const rect = canvas.dom.must.rect();
  const dpr = window.devicePixelRatio || 1;

  const w = Math.max(1, Math.round(rect.width));
  const h = Math.max(1, Math.round(rect.height));
  const pxW = Math.max(1, Math.round(w * dpr));
  const pxH = Math.max(1, Math.round(h * dpr));

  // CHANGED: DOMRect is only a measurement. The canvas backing store must be
  // resized through the canvas width/height attributes.
  canvas.attr.setMany({
    width: String(pxW),
    height: String(pxH),
  });

  const ctx = canvas.canvas.ctx2d();
  if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  return { w, h };
}

export function make_frame(host?: LiveTree) {
  const tree = hson.liveTree.create.canvas()
    .id.set("page-frame-canvas")
    .css.setMany(frameCss);

  if (host) host.append(tree);

  const draw = (): void => {

    const ctx = tree.canvas.ctx2d();

    const { w, h } = syncCanvasSize(tree);
    if (!ctx) { return; }
    ctx.clearRect(0, 0, w, h);
    strokeFrame(ctx, w, h, DEFAULT_FRAME);
  };

  const onResize = (): void => draw();
  tree.listen.window.on("resize", onResize);


  requestAnimationFrame(draw);

  const destroy = (): void => {
    // CHANGED: the listener was registered on `window`, so remove it from the
    // same target during teardown.
    tree.listen.window.on("resize", onResize).off();
    tree.removeSelf();
  };

  return { tree, draw, destroy } as const;
}