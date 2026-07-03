import { drawGridReticle } from "./grid-reticle";
import type { ReticleCanvas, ReticleRenderInput } from "./types";

export function drawCmrLeatherwood(canvas: ReticleCanvas, input: ReticleRenderInput): void {
  drawGridReticle(canvas, input, {
    radiusMrad: 13,
    crosshairMrad: 5,
    majorHashes: [2, 4],
    dots: [
      { xMrad: 0, yMrad: 2, radiusMrad: 0.1 },
      { xMrad: 0, yMrad: 4, radiusMrad: 0.1 },
      { xMrad: -1.5, yMrad: 4, radiusMrad: 0.08 },
      { xMrad: 1.5, yMrad: 4, radiusMrad: 0.08 },
    ],
    postStartMrad: 5,
    postHalfWidthMrad: 0.25,
  });
}
