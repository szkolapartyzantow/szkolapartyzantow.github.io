import { drawGridReticle } from "./grid-reticle";
import type { ReticleCanvas, ReticleRenderInput } from "./types";

export function drawSixDotsMildotCenterpoint(canvas: ReticleCanvas, input: ReticleRenderInput): void {
  drawGridReticle(canvas, input, {
    radiusMrad: 8,
    crosshairMrad: 5,
    majorHashes: [1, 2, 3],
    dots: [
      { xMrad: -3, yMrad: 0, radiusMrad: 0.1 },
      { xMrad: -2, yMrad: 0, radiusMrad: 0.1 },
      { xMrad: -1, yMrad: 0, radiusMrad: 0.1 },
      { xMrad: 1, yMrad: 0, radiusMrad: 0.1 },
      { xMrad: 2, yMrad: 0, radiusMrad: 0.1 },
      { xMrad: 3, yMrad: 0, radiusMrad: 0.1 },
      { xMrad: 0, yMrad: 1, radiusMrad: 0.1 },
      { xMrad: 0, yMrad: 2, radiusMrad: 0.1 },
      { xMrad: 0, yMrad: 3, radiusMrad: 0.1 },
    ],
    postStartMrad: 4,
    postHalfWidthMrad: 0.22,
  });
}
