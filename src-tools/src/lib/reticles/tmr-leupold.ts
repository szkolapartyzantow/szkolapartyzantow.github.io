import { getReticleMagnificationScale, getVisualTargetPxPerMrad } from "./magnification";
import { drawCorrectionMarker, drawVisualTarget } from "./targets";
import type { ReticleCanvas, ReticleRenderInput } from "./types";

const RETICLE_RADIUS_MRAD = 7;
const INNER_CROSS_MRAD = 5;
const MINOR_HASH_HALF_LENGTH_MRAD = 0.075;
const MAJOR_HASH_HALF_LENGTH_MRAD = 0.2;
const POST_START_MRAD = 5;
const POST_HALF_WIDTH_MRAD = 0.2;

const outerPaint = { color: "#ffffff", fill: true };
const linePaint = { color: "#111111", strokeWidth: 1 };
const fillPaint = { color: "#111111", fill: true };

export function drawTmrLeupold(canvas: ReticleCanvas, input: ReticleRenderInput): void {
  const width = input.width || 320;
  const height = input.height || 320;
  const size = Math.min(width, height);
  const centerX = width / 2;
  const centerY = height / 2;
  const basePxPerMrad = size / (RETICLE_RADIUS_MRAD * 2);
  const pxPerMrad = basePxPerMrad * getReticleMagnificationScale(input.magnification);
  const targetPxPerMrad = getVisualTargetPxPerMrad(width, height, input.magnification);
  const radius = basePxPerMrad * RETICLE_RADIUS_MRAD;
  const scaledRadius = pxPerMrad * RETICLE_RADIUS_MRAD;

  canvas.circle(centerX, centerY, radius, outerPaint);
  drawVisualTarget(canvas, centerX, centerY, targetPxPerMrad, input.visualTarget);
  drawCorrectionMarker(canvas, centerX, centerY, basePxPerMrad, input.target);

  canvas.line(
    centerX,
    centerY - INNER_CROSS_MRAD * pxPerMrad,
    centerX,
    centerY + INNER_CROSS_MRAD * pxPerMrad,
    linePaint
  );
  canvas.line(
    centerX - INNER_CROSS_MRAD * pxPerMrad,
    centerY,
    centerX + INNER_CROSS_MRAD * pxPerMrad,
    centerY,
    linePaint
  );

  for (const offset of [
    -4.8, -4.6, -4.4, -4.2, -3.5, -2.5, -1.5, -0.5, 0.5, 1.5, 2.5, 3.5, 4.2, 4.4, 4.6, 4.8,
  ]) {
    drawHorizontalHash(
      canvas,
      centerX,
      centerY + offset * pxPerMrad,
      MINOR_HASH_HALF_LENGTH_MRAD * pxPerMrad
    );
    drawVerticalHash(
      canvas,
      centerX + offset * pxPerMrad,
      centerY,
      MINOR_HASH_HALF_LENGTH_MRAD * pxPerMrad
    );
  }

  for (const offset of [-4, -3, -2, -1, 1, 2, 3, 4]) {
    drawHorizontalHash(
      canvas,
      centerX,
      centerY + offset * pxPerMrad,
      MAJOR_HASH_HALF_LENGTH_MRAD * pxPerMrad
    );
    drawVerticalHash(
      canvas,
      centerX + offset * pxPerMrad,
      centerY,
      MAJOR_HASH_HALF_LENGTH_MRAD * pxPerMrad
    );
  }

  const postHalfWidth = POST_HALF_WIDTH_MRAD * pxPerMrad;
  canvas.rect(
    centerX + POST_START_MRAD * pxPerMrad,
    centerY - postHalfWidth,
    centerX + scaledRadius,
    centerY + postHalfWidth,
    fillPaint
  );
  canvas.rect(
    centerX - scaledRadius,
    centerY - postHalfWidth,
    centerX - POST_START_MRAD * pxPerMrad,
    centerY + postHalfWidth,
    fillPaint
  );
  canvas.rect(
    centerX - postHalfWidth,
    centerY + POST_START_MRAD * pxPerMrad,
    centerX + postHalfWidth,
    centerY + scaledRadius,
    fillPaint
  );
  canvas.rect(
    centerX - postHalfWidth,
    centerY - scaledRadius,
    centerX + postHalfWidth,
    centerY - POST_START_MRAD * pxPerMrad,
    fillPaint
  );
}

function drawHorizontalHash(
  canvas: ReticleCanvas,
  centerX: number,
  y: number,
  halfWidth: number
): void {
  canvas.line(centerX - halfWidth, y, centerX + halfWidth, y, linePaint);
}

function drawVerticalHash(
  canvas: ReticleCanvas,
  x: number,
  centerY: number,
  halfHeight: number
): void {
  canvas.line(x, centerY - halfHeight, x, centerY + halfHeight, linePaint);
}
