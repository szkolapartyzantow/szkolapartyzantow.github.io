import { drawGridReticle } from "./grid-reticle";
import type { ReticleCanvas, ReticleRenderInput } from "./types";

const MOA_PER_MRAD = 3.4377;

export function drawMoaErPremier(canvas: ReticleCanvas, input: ReticleRenderInput): void {
  drawGridReticle(canvas, input, {
    radiusMrad: 25 / MOA_PER_MRAD,
    crosshairMrad: 12 / MOA_PER_MRAD,
    majorHashes: [2 / MOA_PER_MRAD, 4 / MOA_PER_MRAD, 6 / MOA_PER_MRAD, 8 / MOA_PER_MRAD, 10 / MOA_PER_MRAD],
    minorHashes: [1 / MOA_PER_MRAD, 3 / MOA_PER_MRAD, 5 / MOA_PER_MRAD, 7 / MOA_PER_MRAD, 9 / MOA_PER_MRAD],
    lowerLadder: [
      { yMrad: 5 / MOA_PER_MRAD, halfWidthMrad: 4 / MOA_PER_MRAD },
      { yMrad: 10 / MOA_PER_MRAD, halfWidthMrad: 6 / MOA_PER_MRAD },
      { yMrad: 15 / MOA_PER_MRAD, halfWidthMrad: 8 / MOA_PER_MRAD },
    ],
    postStartMrad: 12 / MOA_PER_MRAD,
    postHalfWidthMrad: 0.35 / MOA_PER_MRAD,
  });
}
