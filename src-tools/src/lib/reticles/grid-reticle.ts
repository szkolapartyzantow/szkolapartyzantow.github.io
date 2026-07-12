import { getReticleMagnificationScale, getVisualTargetPxPerMrad } from "./magnification";
import { drawCorrectionMarker, drawVisualTarget } from "./targets";
import type { ReticleCanvas, ReticleRenderInput } from "./types";

export interface GridReticleOptions {
  radiusMrad: number;
  crosshairMrad: number;
  majorHashes?: readonly number[];
  minorHashes?: readonly number[];
  verticalHashes?: readonly number[];
  lowerLadder?: readonly { yMrad: number; halfWidthMrad: number }[];
  dots?: readonly { xMrad: number; yMrad: number; radiusMrad: number }[];
  postStartMrad?: number;
  postHalfWidthMrad?: number;
}

const outerPaint = { color: "#ffffff", fill: true };
const linePaint = { color: "#111111", strokeWidth: 1 };
const fillPaint = { color: "#111111", fill: true };

export function drawGridReticle(
  canvas: ReticleCanvas,
  input: ReticleRenderInput,
  options: GridReticleOptions
): void {
  const width = input.width || 320;
  const height = input.height || 320;
  const size = Math.min(width, height);
  const centerX = width / 2;
  const centerY = height / 2;
  const basePxPerMrad = size / (options.radiusMrad * 2);
  const pxPerMrad = basePxPerMrad * getReticleMagnificationScale(input.magnification);
  const targetPxPerMrad = getVisualTargetPxPerMrad(width, height, input.magnification);
  const radius = basePxPerMrad * options.radiusMrad;
  const scaledRadius = pxPerMrad * options.radiusMrad;

  canvas.circle(centerX, centerY, radius, outerPaint);
  drawVisualTarget(canvas, centerX, centerY, targetPxPerMrad, input.visualTarget);
  drawCorrectionMarker(canvas, centerX, centerY, basePxPerMrad, input.target);

  const cross = options.crosshairMrad * pxPerMrad;
  canvas.line(centerX, centerY - cross, centerX, centerY + cross, linePaint);
  canvas.line(centerX - cross, centerY, centerX + cross, centerY, linePaint);

  for (const offset of options.majorHashes ?? []) {
    drawHashPair(canvas, centerX, centerY, offset * pxPerMrad, 0.45 * pxPerMrad);
  }

  for (const offset of options.minorHashes ?? []) {
    drawHashPair(canvas, centerX, centerY, offset * pxPerMrad, 0.22 * pxPerMrad);
  }

  for (const offset of options.verticalHashes ?? []) {
    drawHorizontalHash(canvas, centerX, centerY + offset * pxPerMrad, 0.35 * pxPerMrad);
  }

  for (const ladder of options.lowerLadder ?? []) {
    const y = centerY + ladder.yMrad * pxPerMrad;
    const halfWidth = ladder.halfWidthMrad * pxPerMrad;
    canvas.line(centerX - halfWidth, y, centerX + halfWidth, y, linePaint);
  }

  for (const dot of options.dots ?? []) {
    canvas.circle(
      centerX + dot.xMrad * pxPerMrad,
      centerY + dot.yMrad * pxPerMrad,
      dot.radiusMrad * pxPerMrad,
      fillPaint
    );
  }

  const postStart = options.postStartMrad;
  if (postStart === undefined) {
    return;
  }

  const postHalfWidth = (options.postHalfWidthMrad ?? 0.2) * pxPerMrad;
  canvas.rect(
    centerX + postStart * pxPerMrad,
    centerY - postHalfWidth,
    centerX + scaledRadius,
    centerY + postHalfWidth,
    fillPaint
  );
  canvas.rect(
    centerX - scaledRadius,
    centerY - postHalfWidth,
    centerX - postStart * pxPerMrad,
    centerY + postHalfWidth,
    fillPaint
  );
  canvas.rect(
    centerX - postHalfWidth,
    centerY - scaledRadius,
    centerX + postHalfWidth,
    centerY - postStart * pxPerMrad,
    fillPaint
  );
  canvas.rect(
    centerX - postHalfWidth,
    centerY + postStart * pxPerMrad,
    centerX + postHalfWidth,
    centerY + scaledRadius,
    fillPaint
  );
}

function drawHashPair(
  canvas: ReticleCanvas,
  centerX: number,
  centerY: number,
  offsetPx: number,
  halfLength: number
): void {
  drawVerticalHash(canvas, centerX + offsetPx, centerY, halfLength);
  drawVerticalHash(canvas, centerX - offsetPx, centerY, halfLength);
  drawHorizontalHash(canvas, centerX, centerY + offsetPx, halfLength);
  drawHorizontalHash(canvas, centerX, centerY - offsetPx, halfLength);
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
