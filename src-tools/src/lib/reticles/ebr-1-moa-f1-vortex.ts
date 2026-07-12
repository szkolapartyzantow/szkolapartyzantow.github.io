import { getReticleMagnificationScale, getVisualTargetPxPerMrad } from "./magnification";
import { drawCorrectionMarker, drawVisualTarget } from "./targets";
import type { ReticleCanvas, ReticleRenderInput } from "./types";

const RETICLE_RADIUS_MOA = 35;
const MOA_PER_MRAD = 3.4377;
const POST_START_MOA = 16;

const outerPaint = { color: "#ffffff", fill: true };
const linePaint = { color: "#111111", strokeWidth: 1 };
const fillPaint = { color: "#111111", fill: true };

export function drawEbr1MoaF1Vortex(canvas: ReticleCanvas, input: ReticleRenderInput): void {
  const width = input.width || 320;
  const height = input.height || 320;
  const size = Math.min(width, height);
  const centerX = width / 2;
  const centerY = height / 2;
  const reticleRadiusMrad = RETICLE_RADIUS_MOA / MOA_PER_MRAD;
  const basePxPerMrad = size / (reticleRadiusMrad * 2);
  const pxPerMrad = basePxPerMrad * getReticleMagnificationScale(input.magnification);
  const pxPerMoa = pxPerMrad / MOA_PER_MRAD;
  const targetPxPerMrad = getVisualTargetPxPerMrad(width, height, input.magnification);
  const radius = basePxPerMrad * reticleRadiusMrad;
  const scaledRadius = pxPerMoa * RETICLE_RADIUS_MOA;

  canvas.circle(centerX, centerY, radius, outerPaint);
  drawVisualTarget(canvas, centerX, centerY, targetPxPerMrad, input.visualTarget);
  drawCorrectionMarker(canvas, centerX, centerY, basePxPerMrad, input.target);

  canvas.line(centerX, centerY - 15 * pxPerMoa, centerX, centerY + 15 * pxPerMoa, linePaint);
  canvas.line(centerX - 15 * pxPerMoa, centerY, centerX + 15 * pxPerMoa, centerY, linePaint);

  for (const offset of [-15, -10, -5, 5, 10, 15]) {
    drawVerticalHash(canvas, centerX + offset * pxPerMoa, centerY, 0.5 * pxPerMoa);
    drawHorizontalHash(canvas, centerX, centerY + offset * pxPerMoa, 0.5 * pxPerMoa);
  }

  for (const offset of [-12.5, -7.5, -2.5, 2.5, 7.5, 12.5]) {
    drawVerticalHash(canvas, centerX + offset * pxPerMoa, centerY, 0.3 * pxPerMoa);
    drawHorizontalHash(canvas, centerX, centerY + offset * pxPerMoa, 0.3 * pxPerMoa);
  }

  const postHalfWidth = 0.5 * pxPerMoa;
  canvas.rect(
    centerX + POST_START_MOA * pxPerMoa,
    centerY - postHalfWidth,
    centerX + scaledRadius,
    centerY + postHalfWidth,
    fillPaint
  );
  canvas.rect(
    centerX - scaledRadius,
    centerY - postHalfWidth,
    centerX - POST_START_MOA * pxPerMoa,
    centerY + postHalfWidth,
    fillPaint
  );
  canvas.rect(
    centerX - postHalfWidth,
    centerY + POST_START_MOA * pxPerMoa,
    centerX + postHalfWidth,
    centerY + scaledRadius,
    fillPaint
  );
  canvas.rect(
    centerX - postHalfWidth,
    centerY - scaledRadius,
    centerX + postHalfWidth,
    centerY - POST_START_MOA * pxPerMoa,
    fillPaint
  );
}

function drawVerticalHash(
  canvas: ReticleCanvas,
  x: number,
  centerY: number,
  halfHeight: number
): void {
  canvas.line(x, centerY - halfHeight, x, centerY + halfHeight, linePaint);
}

function drawHorizontalHash(
  canvas: ReticleCanvas,
  centerX: number,
  y: number,
  halfWidth: number
): void {
  canvas.line(centerX - halfWidth, y, centerX + halfWidth, y, linePaint);
}
