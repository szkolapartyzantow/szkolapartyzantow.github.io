import { getReticleMagnificationScale, getVisualTargetPxPerMrad } from "./magnification";
import { drawCorrectionMarker, drawVisualTarget } from "./targets";
import type { ReticleCanvas, ReticleRenderInput } from "./types";

const RETICLE_RADIUS_MOA = 10;
const CENTRAL_RING_RADIUS_MOA = (0.9549 * 3) / 2;
const LOWER_RING_RADIUS_MOA = 0.9549;
const SMALL_RING_RADIUS_MOA = 0.9549 / 2;
const POST_START_MOA = 0.9549 * 4;

const outerPaint = { color: "#ffffff", fill: true };
const linePaint = { color: "#111111", strokeWidth: 1 };
const fillPaint = { color: "#111111", fill: true };

export function drawBdcPredatorNikon(canvas: ReticleCanvas, input: ReticleRenderInput): void {
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

  const centralRingRadius = CENTRAL_RING_RADIUS_MOA * pxPerMoa;
  canvas.circle(centerX, centerY, centralRingRadius, linePaint);
  canvas.line(centerX - scaledRadius, centerY, centerX - centralRingRadius, centerY, linePaint);
  canvas.line(centerX + centralRingRadius, centerY, centerX + scaledRadius, centerY, linePaint);
  canvas.line(centerX, centerY - scaledRadius, centerX, centerY - centralRingRadius, linePaint);

  const lowerRingRadius = LOWER_RING_RADIUS_MOA * pxPerMoa;
  const lowerRingCenterY = centerY + 2.8647 * pxPerMoa;
  canvas.line(
    centerX,
    centerY + centralRingRadius,
    centerX,
    lowerRingCenterY - lowerRingRadius,
    linePaint
  );
  canvas.circle(centerX, lowerRingCenterY, lowerRingRadius, linePaint);

  const smallRingRadius = SMALL_RING_RADIUS_MOA * pxPerMoa;
  const smallRingCenterY = centerY + 5.2519503 * pxPerMoa;
  canvas.line(
    centerX,
    lowerRingCenterY + lowerRingRadius,
    centerX,
    smallRingCenterY - smallRingRadius,
    linePaint
  );
  canvas.circle(centerX, smallRingCenterY, smallRingRadius, linePaint);
  canvas.line(
    centerX,
    smallRingCenterY + smallRingRadius,
    centerX,
    centerY + 7.6392 * pxPerMoa,
    linePaint
  );

  const postHalfWidth = 0.9549 * 0.3 * pxPerMoa;
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
    centerY + 7.6392 * pxPerMoa,
    centerX + postHalfWidth,
    centerY + scaledRadius,
    fillPaint
  );
}
