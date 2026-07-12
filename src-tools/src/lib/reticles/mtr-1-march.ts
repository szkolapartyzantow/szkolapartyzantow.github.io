import { getReticleMagnificationScale, getVisualTargetPxPerMrad } from "./magnification";
import { drawCorrectionMarker, drawVisualTarget } from "./targets";
import type { ReticleCanvas, ReticleRenderInput } from "./types";

const RETICLE_RADIUS_MRAD = 25;
const POST_START_MRAD = 8;

const outerPaint = { color: "#ffffff", fill: true };
const linePaint = { color: "#111111", strokeWidth: 1 };
const fillPaint = { color: "#111111", fill: true };

export function drawMtr1March(canvas: ReticleCanvas, input: ReticleRenderInput): void {
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
    centerY - POST_START_MRAD * pxPerMrad,
    centerX,
    centerY + POST_START_MRAD * pxPerMrad,
    linePaint
  );
  canvas.line(
    centerX - POST_START_MRAD * pxPerMrad,
    centerY,
    centerX + POST_START_MRAD * pxPerMrad,
    centerY,
    linePaint
  );

  for (const offset of [-6, -4, -2, 2, 4, 6]) {
    drawHorizontalHash(canvas, centerX, centerY + offset * pxPerMrad, 0.35 * pxPerMrad);
    drawVerticalHash(canvas, centerX + offset * pxPerMrad, centerY, 0.35 * pxPerMrad);
    drawVerticalHash(canvas, centerX - offset * pxPerMrad, centerY, 0.35 * pxPerMrad);
  }

  for (const offset of [-7, -5, -3, -1, 1, 3, 5, 7]) {
    drawHorizontalHash(canvas, centerX, centerY + offset * pxPerMrad, 0.18 * pxPerMrad);
    drawVerticalHash(canvas, centerX + offset * pxPerMrad, centerY, 0.18 * pxPerMrad);
    drawVerticalHash(canvas, centerX - offset * pxPerMrad, centerY, 0.18 * pxPerMrad);
  }

  for (const yOffset of [2, 4, 6, 8]) {
    const halfWidth = (yOffset + 2) * pxPerMrad;
    canvas.line(
      centerX - halfWidth,
      centerY + yOffset * pxPerMrad,
      centerX + halfWidth,
      centerY + yOffset * pxPerMrad,
      linePaint
    );
  }

  const postHalfWidth = 0.25 * pxPerMrad;
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
    centerY - scaledRadius,
    centerX + postHalfWidth,
    centerY - POST_START_MRAD * pxPerMrad,
    fillPaint
  );
  canvas.rect(
    centerX - postHalfWidth,
    centerY + (POST_START_MRAD + 2) * pxPerMrad,
    centerX + postHalfWidth,
    centerY + scaledRadius,
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
