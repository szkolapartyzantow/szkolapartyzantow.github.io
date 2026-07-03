import { drawGridReticle } from "./grid-reticle";
import type { ReticleCanvas, ReticleRenderInput } from "./types";

export function drawNineDotsMildotCenterpoint(canvas: ReticleCanvas, input: ReticleRenderInput): void {
  drawGridReticle(canvas, input, {
    radiusMrad: 11,
    crosshairMrad: 6,
    majorHashes: [1, 2, 3, 4],
    dots: [
      { xMrad: -4, yMrad: 0, radiusMrad: 0.1 },
      { xMrad: -3, yMrad: 0, radiusMrad: 0.1 },
      { xMrad: -2, yMrad: 0, radiusMrad: 0.1 },
      { xMrad: -1, yMrad: 0, radiusMrad: 0.1 },
      { xMrad: 1, yMrad: 0, radiusMrad: 0.1 },
      { xMrad: 2, yMrad: 0, radiusMrad: 0.1 },
      { xMrad: 3, yMrad: 0, radiusMrad: 0.1 },
      { xMrad: 4, yMrad: 0, radiusMrad: 0.1 },
      { xMrad: 0, yMrad: 1, radiusMrad: 0.1 },
      { xMrad: 0, yMrad: 2, radiusMrad: 0.1 },
      { xMrad: 0, yMrad: 3, radiusMrad: 0.1 },
      { xMrad: 0, yMrad: 4, radiusMrad: 0.1 },
    ],
    postStartMrad: 5,
    postHalfWidthMrad: 0.22,
  });
}
