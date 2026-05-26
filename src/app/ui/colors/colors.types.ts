

export interface OklchColor {
  l: number;
  c: number;
  h: number;
  a: number;
}

export interface RgbaColor {
  r: number;
  g: number;
  b: number;
  a: number;
}

export type ParsedColor =
  | {
      kind: "oklch";
      value: OklchColor;
    }
  | {
      kind: "rgba";
      value: RgbaColor;
    };