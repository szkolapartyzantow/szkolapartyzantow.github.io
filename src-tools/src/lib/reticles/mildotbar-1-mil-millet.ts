import { drawGridReticle } from "./grid-reticle";
import type { ReticleCanvas, ReticleRenderInput } from "./types";

export function drawMildotbar1MilMillet(canvas: ReticleCanvas, input: ReticleRenderInput): void {
  drawGridReticle(canvas, input, {
    radiusMrad: 15,
    crosshairMrad: 6,
    majorHashes: [1, 2, 3, 4, 5, 6],
    dots: [
      { xMrad: 1, yMrad: 0, radiusMrad: 0.09 },
      { xMrad: 2, yMrad: 0, radiusMrad: 0.09 },
      { xMrad: 3, yMrad: 0, radiusMrad: 0.09 },
      { xMrad: 4, yMrad: 0, radiusMrad: 0.09 },
      { xMrad: -1, yMrad: 0, radiusMrad: 0.09 },
      { xMrad: -2, yMrad: 0, radiusMrad: 0.09 },
      { xMrad: -3, yMrad: 0, radiusMrad: 0.09 },
      { xMrad: -4, yMrad: 0, radiusMrad: 0.09 },
      { xMrad: 0, yMrad: 1, radiusMrad: 0.09 },
      { xMrad: 0, yMrad: 2, radiusMrad: 0.09 },
      { xMrad: 0, yMrad: 3, radiusMrad: 0.09 },
      { xMrad: 0, yMrad: 4, radiusMrad: 0.09 },
    ],
    postStartMrad: 6,
    postHalfWidthMrad: 0.2,
  });
}
