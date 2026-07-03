import { drawGridReticle } from "./grid-reticle";
import type { ReticleCanvas, ReticleRenderInput } from "./types";

const MOA_PER_MRAD = 3.4377;

export function drawVelocity1000HvNightforce(canvas: ReticleCanvas, input: ReticleRenderInput): void {
  drawVelocity(canvas, input, 33, 14);
}

export function drawVelocity600LvNightforce(canvas: ReticleCanvas, input: ReticleRenderInput): void {
  drawVelocity(canvas, input, 20, 9);
}

export function drawMvVelocity600Nightforce(canvas: ReticleCanvas, input: ReticleRenderInput): void {
  drawVelocity(canvas, input, 20, 8);
}

export function drawVelocity1000UhvNightforce(canvas: ReticleCanvas, input: ReticleRenderInput): void {
  drawVelocity(canvas, input, 33, 13);
}

export function drawBdc05112Minox(canvas: ReticleCanvas, input: ReticleRenderInput): void {
  drawBallistic(canvas, input, 19, 7);
}

export function drawTmdBsa(canvas: ReticleCanvas, input: ReticleRenderInput): void {
  drawMilGrid(canvas, input, 10, 5);
}

export function drawContenderBsa(canvas: ReticleCanvas, input: ReticleRenderInput): void {
  drawBallistic(canvas, input, 12, 5);
}

export function drawContenderMildotBsa(canvas: ReticleCanvas, input: ReticleRenderInput): void {
  drawMilGrid(canvas, input, 15, 6);
}

export function drawMp8DotModifiedIor(canvas: ReticleCanvas, input: ReticleRenderInput): void {
  drawMilGrid(canvas, input, 16, 6);
}

export function drawMp8XtremeIor(canvas: ReticleCanvas, input: ReticleRenderInput): void {
  drawMilGrid(canvas, input, 16, 7);
}

export function drawRangeFinderOsprey(canvas: ReticleCanvas, input: ReticleRenderInput): void {
  drawRangefinder(canvas, input, 90, 18);
}

export function drawArtHolland(canvas: ReticleCanvas, input: ReticleRenderInput): void {
  drawRangefinder(canvas, input, 26, 10);
}

export function drawWbdcAlpen(canvas: ReticleCanvas, input: ReticleRenderInput): void {
  drawBallistic(canvas, input, 11, 5);
}

export function drawTbxWeaver(canvas: ReticleCanvas, input: ReticleRenderInput): void {
  drawBallistic(canvas, input, 35, 10);
}

export function drawEbr1Moa2510Vortex(canvas: ReticleCanvas, input: ReticleRenderInput): void {
  drawMoaGrid(canvas, input, 25, 12);
}

export function drawEpbMilsWotac(canvas: ReticleCanvas, input: ReticleRenderInput): void {
  drawMilGrid(canvas, input, 25, 9);
}

export function drawEpbMoaWotac(canvas: ReticleCanvas, input: ReticleRenderInput): void {
  drawMoaGrid(canvas, input, 25, 10);
}

export function drawAmdMtcOptics(canvas: ReticleCanvas, input: ReticleRenderInput): void {
  drawMilGrid(canvas, input, 12, 5);
}

export function drawPrecisionPlexPentax(canvas: ReticleCanvas, input: ReticleRenderInput): void {
  drawBallistic(canvas, input, 20, 7);
}

export function drawBallisticPlex3510Burris(canvas: ReticleCanvas, input: ReticleRenderInput): void {
  drawBallistic(canvas, input, 20, 7);
}

export function drawFml1March3(canvas: ReticleCanvas, input: ReticleRenderInput): void {
  drawMilGrid(canvas, input, 16, 7);
}

export function drawFml1March5(canvas: ReticleCanvas, input: ReticleRenderInput): void {
  drawMilGrid(canvas, input, 11, 5);
}

export function drawMsrSchmidtBender(canvas: ReticleCanvas, input: ReticleRenderInput): void {
  drawMilGrid(canvas, input, 16, 7);
}

export function drawMoarNightforce(canvas: ReticleCanvas, input: ReticleRenderInput): void {
  drawMoaGrid(canvas, input, 33, 14);
}

export function drawBrabant20Falcon(canvas: ReticleCanvas, input: ReticleRenderInput): void {
  drawMilGrid(canvas, input, 11, 5);
}

export function drawEbr1Mrad2510Vortex(canvas: ReticleCanvas, input: ReticleRenderInput): void {
  drawMilGrid(canvas, input, 10, 5);
}

export function drawRapidReticle221Pfi(canvas: ReticleCanvas, input: ReticleRenderInput): void {
  drawBallistic(canvas, input, 26, 10);
}

export function draw4a300Swarovski(canvas: ReticleCanvas, input: ReticleRenderInput): void {
  drawBallistic(canvas, input, 5, 3);
}

export function drawChevronTrijicon(canvas: ReticleCanvas, input: ReticleRenderInput): void {
  drawGridReticle(canvas, input, {
    radiusMrad: 45,
    crosshairMrad: 12,
    majorHashes: [4, 8, 12],
    dots: [
      { xMrad: 0, yMrad: -1, radiusMrad: 0.35 },
      { xMrad: -0.6, yMrad: 0, radiusMrad: 0.2 },
      { xMrad: 0.6, yMrad: 0, radiusMrad: 0.2 },
    ],
    postStartMrad: 14,
    postHalfWidthMrad: 0.55,
  });
}

export function drawPosp8x42Russia(canvas: ReticleCanvas, input: ReticleRenderInput): void {
  drawRangefinder(canvas, input, 22, 8);
}

export function drawG2DmrBushnell(canvas: ReticleCanvas, input: ReticleRenderInput): void {
  drawMilGrid(canvas, input, 13, 6);
}

function drawVelocity(canvas: ReticleCanvas, input: ReticleRenderInput, radiusMrad: number, postStartMrad: number): void {
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
    postStartMrad,
    postHalfWidthMrad: 0.5,
  });
}

function drawBallistic(canvas: ReticleCanvas, input: ReticleRenderInput, radiusMrad: number, postStartMrad: number): void {
  drawGridReticle(canvas, input, {
    radiusMrad,
    crosshairMrad: postStartMrad,
    majorHashes: [2, 4, 6],
    lowerLadder: [
      { yMrad: 2, halfWidthMrad: 1.5 },
      { yMrad: 4, halfWidthMrad: 2.4 },
      { yMrad: 6, halfWidthMrad: 3.2 },
    ],
    postStartMrad,
    postHalfWidthMrad: 0.25,
  });
}

function drawRangefinder(canvas: ReticleCanvas, input: ReticleRenderInput, radiusMrad: number, postStartMrad: number): void {
  drawGridReticle(canvas, input, {
    radiusMrad,
    crosshairMrad: postStartMrad,
    majorHashes: [1, 2, 3, 4],
    lowerLadder: [
      { yMrad: 1, halfWidthMrad: 1 },
      { yMrad: 2, halfWidthMrad: 2 },
      { yMrad: 3, halfWidthMrad: 3 },
      { yMrad: 4, halfWidthMrad: 4 },
    ],
    postStartMrad,
    postHalfWidthMrad: 0.2,
  });
}

function drawMilGrid(canvas: ReticleCanvas, input: ReticleRenderInput, radiusMrad: number, postStartMrad: number): void {
  drawGridReticle(canvas, input, {
    radiusMrad,
    crosshairMrad: postStartMrad,
    majorHashes: [1, 2, 3, 4, 5],
    minorHashes: [0.5, 1.5, 2.5, 3.5, 4.5],
    lowerLadder: [
      { yMrad: 2, halfWidthMrad: 2 },
      { yMrad: 4, halfWidthMrad: 3 },
      { yMrad: 6, halfWidthMrad: 4 },
    ],
    postStartMrad,
    postHalfWidthMrad: 0.16,
  });
}

function drawMoaGrid(canvas: ReticleCanvas, input: ReticleRenderInput, radiusMoa: number, postStartMoa: number): void {
  drawGridReticle(canvas, input, {
    radiusMrad: radiusMoa / MOA_PER_MRAD,
    crosshairMrad: postStartMoa / MOA_PER_MRAD,
    majorHashes: [2, 4, 6, 8, 10].map((moa) => moa / MOA_PER_MRAD),
    minorHashes: [1, 3, 5, 7, 9].map((moa) => moa / MOA_PER_MRAD),
    lowerLadder: [
      { yMrad: 5 / MOA_PER_MRAD, halfWidthMrad: 4 / MOA_PER_MRAD },
      { yMrad: 10 / MOA_PER_MRAD, halfWidthMrad: 6 / MOA_PER_MRAD },
      { yMrad: 15 / MOA_PER_MRAD, halfWidthMrad: 8 / MOA_PER_MRAD },
    ],
    postStartMrad: postStartMoa / MOA_PER_MRAD,
    postHalfWidthMrad: 0.35 / MOA_PER_MRAD,
  });
}
