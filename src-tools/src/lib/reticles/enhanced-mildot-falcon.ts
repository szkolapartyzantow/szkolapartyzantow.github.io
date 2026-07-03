import { drawGridReticle } from "./grid-reticle";
import type { ReticleCanvas, ReticleRenderInput } from "./types";

export function drawEnhancedMildotFalcon(canvas: ReticleCanvas, input: ReticleRenderInput): void {
  drawGridReticle(canvas, input, {
    radiusMrad: 10,
    crosshairMrad: 5,
    majorHashes: [1, 2, 3, 4, 5],
    minorHashes: [0.5, 1.5, 2.5, 3.5, 4.5],
    dots: [
      { xMrad: 1, yMrad: 0, radiusMrad: 0.08 },
      { xMrad: 2, yMrad: 0, radiusMrad: 0.08 },
      { xMrad: 3, yMrad: 0, radiusMrad: 0.08 },
      { xMrad: 4, yMrad: 0, radiusMrad: 0.08 },
      { xMrad: -1, yMrad: 0, radiusMrad: 0.08 },
      { xMrad: -2, yMrad: 0, radiusMrad: 0.08 },
      { xMrad: -3, yMrad: 0, radiusMrad: 0.08 },
      { xMrad: -4, yMrad: 0, radiusMrad: 0.08 },
      { xMrad: 0, yMrad: 1, radiusMrad: 0.08 },
      { xMrad: 0, yMrad: 2, radiusMrad: 0.08 },
      { xMrad: 0, yMrad: 3, radiusMrad: 0.08 },
      { xMrad: 0, yMrad: 4, radiusMrad: 0.08 },
    ],
    postStartMrad: 5,
    postHalfWidthMrad: 0.18,
  });
}
