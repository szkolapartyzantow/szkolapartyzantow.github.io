export type ReticleId = number;

export interface PaintStyle {
  color: string;
  strokeWidth?: number;
  fill?: boolean;
}

export interface ReticleCanvas {
  line(x1: number, y1: number, x2: number, y2: number, paint: PaintStyle): void;
  circle(x: number, y: number, radius: number, paint: PaintStyle): void;
  rect(x1: number, y1: number, x2: number, y2: number, paint: PaintStyle): void;
  polygon(points: Array<{ x: number; y: number }>, paint: PaintStyle): void;
}

export interface ReticleTarget {
  horizontalMrad: number;
  verticalMrad: number;
}

export type ReticleVisualTargetKind = "bullseye" | "IDPA" | "plate" | "circle";

export interface ReticleVisualTarget {
  kind: ReticleVisualTargetKind;
  widthMrad: number;
  heightMrad: number;
}

export interface ReticleMagnification {
  firstFocalPlane: boolean;
  trueMagnification: number;
  currentMagnification: number;
}

export interface ReticleRenderInput {
  width: number;
  height: number;
  reticleId?: ReticleId;
  target?: ReticleTarget;
  visualTarget?: ReticleVisualTarget;
  magnification?: ReticleMagnification;
}
