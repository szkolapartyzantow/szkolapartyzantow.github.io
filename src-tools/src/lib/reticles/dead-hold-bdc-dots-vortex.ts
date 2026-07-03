import { drawGridReticle } from "./grid-reticle";
import type { ReticleCanvas, ReticleRenderInput } from "./types";

export function drawDeadHoldBdcDotsVortex(canvas: ReticleCanvas, input: ReticleRenderInput): void {
  drawGridReticle(canvas, input, {
    radiusMrad: 13,
    crosshairMrad: 4,
    majorHashes: [2, 4, 6],
    dots: [
      { xMrad: 0, yMrad: 2, radiusMrad: 0.08 },
      { xMrad: 0, yMrad: 4, radiusMrad: 0.08 },
      { xMrad: 0, yMrad: 6, radiusMrad: 0.08 },
      { xMrad: -2, yMrad: 4, radiusMrad: 0.08 },
      { xMrad: 2, yMrad: 4, radiusMrad: 0.08 },
      { xMrad: -3, yMrad: 6, radiusMrad: 0.08 },
      { xMrad: 3, yMrad: 6, radiusMrad: 0.08 },
    ],
    postStartMrad: 5,
    postHalfWidthMrad: 0.25,
  });
}
