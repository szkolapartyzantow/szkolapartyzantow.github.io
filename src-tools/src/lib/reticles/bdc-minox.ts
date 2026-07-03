import { drawGridReticle } from "./grid-reticle";
import type { ReticleCanvas, ReticleRenderInput } from "./types";

export function drawBdc05001Minox20(canvas: ReticleCanvas, input: ReticleRenderInput): void {
  drawBdcMinox(canvas, input, 20, 7);
}

export function drawBdc05001Minox10(canvas: ReticleCanvas, input: ReticleRenderInput): void {
  drawBdcMinox(canvas, input, 10, 4);
}

function drawBdcMinox(canvas: ReticleCanvas, input: ReticleRenderInput, radiusMrad: number, postStartMrad: number): void {
  drawGridReticle(canvas, input, {
    radiusMrad,
    crosshairMrad: postStartMrad,
    majorHashes: [2, 4, 6],
    lowerLadder: [
      { yMrad: 2, halfWidthMrad: 1.6 },
      { yMrad: 4, halfWidthMrad: 2.4 },
      { yMrad: 6, halfWidthMrad: 3.2 },
    ],
    postStartMrad,
    postHalfWidthMrad: 0.22,
  });
}
