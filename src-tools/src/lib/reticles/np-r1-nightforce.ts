import { getReticleMagnificationScale, getVisualTargetPxPerMrad } from "./magnification";
import { drawCorrectionMarker, drawVisualTarget } from "./targets";
import type { ReticleCanvas, ReticleRenderInput } from "./types";

const RETICLE_RADIUS_MRAD = 27;

const outerPaint = { color: "#ffffff", fill: true };
const linePaint = { color: "#111111", strokeWidth: 1 };

export function drawNpR1Nightforce(canvas: ReticleCanvas, input: ReticleRenderInput): void {
  const width = input.width || 320;
  const height = input.height || 320;
  const size = Math.min(width, height);
  const centerX = width / 2;
  const centerY = height / 2;
  const basePxPerMrad = size / (RETICLE_RADIUS_MRAD * 2);
  const pxPerMrad = basePxPerMrad * getReticleMagnificationScale(input.magnification);
  const targetPxPerMrad = getVisualTargetPxPerMrad(width, height, input.magnification);
  const radius = basePxPerMrad * RETICLE_RADIUS_MRAD;

  canvas.circle(centerX, centerY, radius, outerPaint);
  drawVisualTarget(canvas, centerX, centerY, targetPxPerMrad, input.visualTarget);
  drawCorrectionMarker(canvas, centerX, centerY, basePxPerMrad, input.target);

  canvas.line(centerX, centerY - 10 * pxPerMrad, centerX, centerY + 20 * pxPerMrad, linePaint);
  canvas.line(centerX - 20 * pxPerMrad, centerY, centerX + 20 * pxPerMrad, centerY, linePaint);

  for (let i = 1; i <= 10; i += 1) {
    const halfWidth = i % 10 === 0 ? 1.4 : i % 2 === 0 ? 0.7 : 0.35;
    drawHorizontalHash(canvas, centerX, centerY - i * pxPerMrad, halfWidth * pxPerMrad);
  }

  for (let i = 1; i <= 19; i += 1) {
    const halfWidth = i % 10 === 0 ? 1.4 : i % 2 === 0 ? 0.7 : 0.35;
    drawHorizontalHash(canvas, centerX, centerY + i * pxPerMrad, halfWidth * pxPerMrad);
  }

  for (let i = 1; i <= 9; i += 1) {
    const halfHeight = i % 5 === 0 ? 1.4 : 0.7;
    drawVerticalHash(canvas, centerX + i * 2 * pxPerMrad, centerY, halfHeight * pxPerMrad);
    drawVerticalHash(canvas, centerX - i * 2 * pxPerMrad, centerY, halfHeight * pxPerMrad);
  }

  const postHalfWidth = 0.7 * pxPerMrad;
  canvas.rect(
    centerX + 20 * pxPerMrad,
    centerY - postHalfWidth,
    centerX + 25 * pxPerMrad,
    centerY + postHalfWidth,
    linePaint
  );
  canvas.rect(
    centerX - 25 * pxPerMrad,
    centerY - postHalfWidth,
    centerX - 20 * pxPerMrad,
    centerY + postHalfWidth,
    linePaint
  );
  canvas.rect(
    centerX - postHalfWidth,
    centerY + 20 * pxPerMrad,
    centerX + postHalfWidth,
    centerY + 25 * pxPerMrad,
    linePaint
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
