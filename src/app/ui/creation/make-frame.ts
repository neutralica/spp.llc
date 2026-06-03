import { hson, type LiveTree } from "hson-live";
import { OKLCH_ACID_WASHED } from "../../core/consts/oklch";
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
} as const;

const FRAME_OUTER_FILL = "oklch(27% 0.055 83 / 0.88)";
const WOOD_GRAIN_DARK = "oklch(42% 0.045 78 / 0.12)";
const WOOD_GRAIN_SOFT = "oklch(68% 0.055 88 / 0.07)";
const WOOD_KNOT_DARK = "oklch(36% 0.05 72 / 0.10)";
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

function makeFramePath(ctx: CanvasRenderingContext2D, w: number, h: number, cfg: FrameDrawConfig): void {
  const x0 = cfg.inset;
  const y0 = cfg.inset;
  const x1 = w - cfg.inset;
  const y1 = h - cfg.inset;
  const c = Math.min(cfg.corner, Math.max(18, Math.min(w, h) * 0.08));
  const lift = Math.min(cfg.lift, c * 0.65);

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

  ctx.save();
  ctx.lineJoin = "round";
  ctx.lineCap = "round";

  // CHANGED: relief is faked with a wide dull under-stroke, a main gold line,
  // and two small offset highlights/shadows.
  makeFramePath(ctx, w, h, cfg);
  ctx.strokeStyle = set_alpha(gold, 0.22);
  ctx.lineWidth = 10;
  ctx.stroke();

  makeFramePath(ctx, w, h, cfg);
  ctx.strokeStyle = set_alpha(gold, 0.82);
  ctx.lineWidth = 3;
  ctx.stroke();

  ctx.save();
  ctx.translate(-1.2, -1.2);
  makeFramePath(ctx, w, h, cfg);
  ctx.strokeStyle = set_alpha(gold, 0.48);
  ctx.lineWidth = 1.25;
  ctx.stroke();
  ctx.restore();

  ctx.save();
  ctx.translate(1.4, 1.4);
  makeFramePath(ctx, w, h, cfg);
  ctx.strokeStyle = set_alpha(gold, 0.26);
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.restore();

  ctx.restore();
}

function syncCanvasSize(canvas: HTMLCanvasElement): Readonly<{ w: number; h: number }> {
  const rect = canvas.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  const w = Math.max(1, Math.round(rect.width));
  const h = Math.max(1, Math.round(rect.height));
  const pxW = Math.max(1, Math.round(w * dpr));
  const pxH = Math.max(1, Math.round(h * dpr));

  if (canvas.width !== pxW) canvas.width = pxW;
  if (canvas.height !== pxH) canvas.height = pxH;

  const ctx = canvas.getContext("2d");
  if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  return { w, h };
}

export function makeFrame(host?: LiveTree) {
  const tree = hson.liveTree.create.canvas()
    .id.set("page-frame-canvas")
    .css.setMany(frameCss);

  if (host) host.append(tree);

  const draw = (): void => {
    const el = tree.dom.el();
    if (!(el instanceof HTMLCanvasElement)) return;

    const ctx = el.getContext("2d");
    if (!ctx) return;

    const { w, h } = syncCanvasSize(el);
    ctx.clearRect(0, 0, w, h);
    strokeFrame(ctx, w, h, DEFAULT_FRAME);
  };

  const onResize = (): void => draw();

  window.addEventListener("resize", onResize);
  requestAnimationFrame(draw);

  const destroy = (): void => {
    window.removeEventListener("resize", onResize);
    tree.removeSelf();
  };

  return { tree, draw, destroy } as const;
}