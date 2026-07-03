import { drawGridReticle } from "./grid-reticle";
import type { ReticleCanvas, ReticleRenderInput } from "./types";

export function drawDoa600Bushnell(canvas: ReticleCanvas, input: ReticleRenderInput): void {
  drawGridReticle(canvas, input, {
    radiusMrad: 15,
    crosshairMrad: 5,
    majorHashes: [2, 4, 6],
    dots: [
      { xMrad: 0, yMrad: 2, radiusMrad: 0.1 },
      { xMrad: 0, yMrad: 4, radiusMrad: 0.1 },
      { xMrad: 0, yMrad: 6, radiusMrad: 0.1 },
      { xMrad: -1.8, yMrad: 4, radiusMrad: 0.08 },
      { xMrad: 1.8, yMrad: 4, radiusMrad: 0.08 },
      { xMrad: -2.5, yMrad: 6, radiusMrad: 0.08 },
      { xMrad: 2.5, yMrad: 6, radiusMrad: 0.08 },
    ],
    postStartMrad: 6,
    postHalfWidthMrad: 0.3,
  });
}
