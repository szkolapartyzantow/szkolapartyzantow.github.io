import { getReticleMagnificationScale, getVisualTargetPxPerMrad } from "./magnification";
import { drawCorrectionMarker, drawVisualTarget } from "./targets";
import type { ReticleCanvas, ReticleRenderInput } from "./types";

const RETICLE_RADIUS_MRAD = 14;
const POST_START_MRAD = 5;

const outerPaint = { color: "#ffffff", fill: true };
const linePaint = { color: "#111111", strokeWidth: 1 };
const fillPaint = { color: "#111111", fill: true };

export function drawP4lSchmidtBender(canvas: ReticleCanvas, input: ReticleRenderInput): void {
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

  canvas.line(centerX, centerY - scaledRadius, centerX, centerY + scaledRadius, linePaint);
  canvas.line(centerX - scaledRadius, centerY, centerX + scaledRadius, centerY, linePaint);

  for (let i = 2; i <= 8; i += 1) {
    const offset = i * 0.5 * pxPerMrad;
    const halfLength = (i % 2 === 0 ? 0.4 : 0.2) * pxPerMrad;
    canvas.line(
      centerX - halfLength,
      centerY - offset,
      centerX + halfLength,
      centerY - offset,
      linePaint
    );
  }

  for (let i = 2; i <= 26; i += 1) {
    const offset = i * 0.5 * pxPerMrad;
    const halfLength = (i % 10 === 0 ? 0.8 : i % 2 === 0 ? 0.4 : 0.2) * pxPerMrad;
    canvas.line(
      centerX - halfLength,
      centerY + offset,
      centerX + halfLength,
      centerY + offset,
      linePaint
    );
  }

  for (let i = 2; i <= 8; i += 1) {
    const offset = i * 0.5 * pxPerMrad;
    const halfLength = (i % 2 === 0 ? 0.4 : 0.2) * pxPerMrad;
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

  const postHalfWidth = 0.2 * pxPerMrad;
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
}
