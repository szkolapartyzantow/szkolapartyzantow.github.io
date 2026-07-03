import { drawGridReticle } from "./grid-reticle";
import type { ReticleCanvas, ReticleRenderInput } from "./types";

export function drawBdaDocter25(canvas: ReticleCanvas, input: ReticleRenderInput): void {
  drawBdaDocter(canvas, input, 10, 5);
}

export function drawBdaDocter3(canvas: ReticleCanvas, input: ReticleRenderInput): void {
  drawBdaDocter(canvas, input, 8, 4.5);
}

function drawBdaDocter(canvas: ReticleCanvas, input: ReticleRenderInput, radiusMrad: number, postStartMrad: number): void {
  drawGridReticle(canvas, input, {
    radiusMrad,
    crosshairMrad: postStartMrad,
    majorHashes: [1.5, 3, 4.5],
    lowerLadder: [
      { yMrad: 1.5, halfWidthMrad: 1.5 },
      { yMrad: 3, halfWidthMrad: 2 },
      { yMrad: 4.5, halfWidthMrad: 2.5 },
    ],
    postStartMrad,
    postHalfWidthMrad: 0.22,
  });
}
