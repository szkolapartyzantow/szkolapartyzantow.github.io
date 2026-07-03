import { drawGridReticle } from "./grid-reticle";
import type { ReticleCanvas, ReticleRenderInput } from "./types";

export function drawSs14DonutSwfa(canvas: ReticleCanvas, input: ReticleRenderInput): void {
  drawGridReticle(canvas, input, {
    radiusMrad: 13,
    crosshairMrad: 5,
    majorHashes: [1, 2, 3, 4],
    dots: [
      { xMrad: 0, yMrad: -1, radiusMrad: 0.08 },
      { xMrad: 1, yMrad: 0, radiusMrad: 0.08 },
      { xMrad: 0, yMrad: 1, radiusMrad: 0.08 },
      { xMrad: -1, yMrad: 0, radiusMrad: 0.08 },
    ],
    postStartMrad: 5,
    postHalfWidthMrad: 0.3,
  });
}
