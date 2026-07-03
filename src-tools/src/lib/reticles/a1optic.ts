import { getReticleMagnificationScale, getVisualTargetPxPerMrad } from "./magnification";
import { drawCorrectionMarker, drawVisualTarget } from "./targets";
import type { ReticleCanvas, ReticleRenderInput } from "./types";

const RETICLE_RADIUS_MOA = 35;
const CROSS_RADIUS_MOA = 30;
const POST_START_MOA = 25;

const outerPaint = { color: "#ffffff", fill: true };
const linePaint = { color: "#111111", strokeWidth: 1 };
const fillPaint = { color: "#111111", fill: true };

export function drawA1Optic(canvas: ReticleCanvas, input: ReticleRenderInput): void {
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

  canvas.line(
    centerX,
    centerY - CROSS_RADIUS_MOA * pxPerMoa,
    centerX,
    centerY + CROSS_RADIUS_MOA * pxPerMoa,
    linePaint
  );
  canvas.line(
    centerX - CROSS_RADIUS_MOA * pxPerMoa,
    centerY,
    centerX + CROSS_RADIUS_MOA * pxPerMoa,
    centerY,
    linePaint
  );

  for (let i = 1; i < 5; i += 1) {
    const offset = i * 5 * pxPerMoa;
    const halfLength = ((i + 1) / 2) * pxPerMoa;
    canvas.line(
      centerX - halfLength,
      centerY - offset,
      centerX + halfLength,
      centerY - offset,
      linePaint
    );
    canvas.line(
      centerX - halfLength,
      centerY + offset,
      centerX + halfLength,
      centerY + offset,
      linePaint
    );
    canvas.line(
      centerX - offset,
      centerY - halfLength,
      centerX - offset,
      centerY + halfLength,
      linePaint
    );
    canvas.line(
      centerX + offset,
      centerY - halfLength,
      centerX + offset,
      centerY + halfLength,
      linePaint
    );
  }

  const postHalfWidth = pxPerMoa;
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
