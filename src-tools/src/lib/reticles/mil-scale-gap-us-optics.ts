import { drawGridReticle } from "./grid-reticle";
import type { ReticleCanvas, ReticleRenderInput } from "./types";

export function drawMilScaleGapUsOptics(canvas: ReticleCanvas, input: ReticleRenderInput): void {
  drawGridReticle(canvas, input, {
    radiusMrad: 11,
    crosshairMrad: 6,
    majorHashes: [1, 2, 3, 4, 5],
    minorHashes: [0.2, 0.4, 0.6, 0.8, 1.5, 2.5, 3.5, 4.5],
    postStartMrad: 6,
    postHalfWidthMrad: 0.14,
  });
}
