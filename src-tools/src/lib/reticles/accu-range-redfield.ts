import { getReticleMagnificationScale, getVisualTargetPxPerMrad } from "./magnification";
import { drawCorrectionMarker, drawVisualTarget } from "./targets";
import type { ReticleCanvas, ReticleRenderInput } from "./types";

const RETICLE_RADIUS_MOA = 15;
const RING_RADIUS_MOA = 2.19;
const LOWER_DOT_CENTER_MOA = 4.8;
const LOWER_POST_START_MOA = 7.82;
const SIDE_POST_START_MOA = 7.68;

const outerPaint = { color: "#ffffff", fill: true };
const linePaint = { color: "#111111", strokeWidth: 1 };
const fillPaint = { color: "#111111", fill: true };

export function drawAccuRangeRedfield(canvas: ReticleCanvas, input: ReticleRenderInput): void {
  const width = input.width || 320;
  const height = input.height || 320;
  const size = Math.min(width, height);
  const centerX = width / 2;
  const centerY = height / 2;
  const basePxPerMoa = size / (RETICLE_RADIUS_MOA * 2);
  const pxPerMoa = basePxPerMoa * getReticleMagnificationScale(input.magnification);
  const targetPxPerMrad = getVisualTargetPxPerMrad(width, height, input.magnification);
  const radius = basePxPerMoa * RETICLE_RADIUS_MOA;
  const scaledRadius = pxPerMoa * RETICLE_RADIUS_MOA;

  canvas.circle(centerX, centerY, radius, outerPaint);
  drawVisualTarget(canvas, centerX, centerY, targetPxPerMrad, input.visualTarget);
  drawCorrectionMarker(canvas, centerX, centerY, basePxPerMoa, input.target);

  canvas.line(centerX, centerY - scaledRadius, centerX, centerY + scaledRadius, linePaint);
  canvas.line(centerX - scaledRadius, centerY, centerX + scaledRadius, centerY, linePaint);

  canvas.circle(centerX, centerY, RING_RADIUS_MOA * pxPerMoa, linePaint);
  canvas.circle(centerX, centerY + LOWER_DOT_CENTER_MOA * pxPerMoa, 0.355 * pxPerMoa, fillPaint);

  const postHalfWidth = 0.36 * pxPerMoa;
  canvas.rect(
    centerX + SIDE_POST_START_MOA * pxPerMoa,
    centerY - postHalfWidth,
    centerX + scaledRadius,
    centerY + postHalfWidth,
    fillPaint
  );
  canvas.rect(
    centerX - scaledRadius,
    centerY - postHalfWidth,
    centerX - SIDE_POST_START_MOA * pxPerMoa,
    centerY + postHalfWidth,
    fillPaint
  );
  canvas.rect(
    centerX - postHalfWidth,
    centerY + LOWER_POST_START_MOA * pxPerMoa,
    centerX + postHalfWidth,
    centerY + scaledRadius,
    fillPaint
  );
  canvas.rect(
    centerX - postHalfWidth,
    centerY - scaledRadius,
    centerX + postHalfWidth,
    centerY - SIDE_POST_START_MOA * pxPerMoa,
    fillPaint
  );
}
