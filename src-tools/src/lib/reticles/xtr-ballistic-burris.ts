import { drawGridReticle } from "./grid-reticle";
import type { ReticleCanvas, ReticleRenderInput } from "./types";

export function drawXtrBallistic556Burris(canvas: ReticleCanvas, input: ReticleRenderInput): void {
  drawXtrBallistic(canvas, input, 45, 18);
}

export function drawXtrBallistic762Burris(canvas: ReticleCanvas, input: ReticleRenderInput): void {
  drawXtrBallistic(canvas, input, 40, 16);
}

function drawXtrBallistic(
  canvas: ReticleCanvas,
  input: ReticleRenderInput,
  radiusMrad: number,
  postStartMrad: number
): void {
  drawGridReticle(canvas, input, {
    radiusMrad,
    crosshairMrad: postStartMrad,
    majorHashes: [4, 8, 12],
    lowerLadder: [
      { yMrad: 4, halfWidthMrad: 4 },
      { yMrad: 8, halfWidthMrad: 6 },
      { yMrad: 12, halfWidthMrad: 8 },
      { yMrad: 16, halfWidthMrad: 10 },
    ],
    dots: [
      { xMrad: 0, yMrad: 4, radiusMrad: 0.25 },
      { xMrad: 0, yMrad: 8, radiusMrad: 0.25 },
      { xMrad: 0, yMrad: 12, radiusMrad: 0.25 },
    ],
    postStartMrad,
    postHalfWidthMrad: 0.55,
  });
}
