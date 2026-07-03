import { drawGridReticle } from "./grid-reticle";
import type { ReticleCanvas, ReticleRenderInput } from "./types";

const MOA_PER_MRAD = 3.4377;

export function drawTmcqMoaVortex(canvas: ReticleCanvas, input: ReticleRenderInput): void {
  drawGridReticle(canvas, input, {
    radiusMrad: 15 / MOA_PER_MRAD,
    crosshairMrad: 7 / MOA_PER_MRAD,
    majorHashes: [2 / MOA_PER_MRAD, 4 / MOA_PER_MRAD, 6 / MOA_PER_MRAD],
    lowerLadder: [
      { yMrad: 3 / MOA_PER_MRAD, halfWidthMrad: 4 / MOA_PER_MRAD },
      { yMrad: 6 / MOA_PER_MRAD, halfWidthMrad: 6 / MOA_PER_MRAD },
      { yMrad: 9 / MOA_PER_MRAD, halfWidthMrad: 8 / MOA_PER_MRAD },
    ],
    postStartMrad: 7 / MOA_PER_MRAD,
    postHalfWidthMrad: 0.35 / MOA_PER_MRAD,
  });
}

export function drawTmcqMradVortex(canvas: ReticleCanvas, input: ReticleRenderInput): void {
  drawGridReticle(canvas, input, {
    radiusMrad: 7,
    crosshairMrad: 4,
    majorHashes: [1, 2, 3],
    lowerLadder: [
      { yMrad: 1, halfWidthMrad: 1.4 },
      { yMrad: 2, halfWidthMrad: 2.0 },
      { yMrad: 3, halfWidthMrad: 2.6 },
    ],
    postStartMrad: 4,
    postHalfWidthMrad: 0.16,
  });
}
