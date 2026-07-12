import type { ReticleCanvas, ReticleRenderInput, ReticleVisualTarget } from "./types";

const targetFillPaint = { color: "rgba(37, 99, 235, 0.18)", fill: true };
const targetLinePaint = { color: "rgba(37, 99, 235, 0.7)", strokeWidth: 1.25 };
const correctionPaint = { color: "#dc2626", strokeWidth: 1.5 };

const IDPA_TARGET_WIDTH_IN = 18;
const IDPA_TARGET_HEIGHT_IN = 30;

export function drawVisualTarget(
  canvas: ReticleCanvas,
  centerX: number,
  centerY: number,
  pxPerMrad: number,
  target: ReticleVisualTarget | undefined
): void {
  if (!target || target.widthMrad <= 0 || target.heightMrad <= 0) {
    return;
  }

  const width = Math.max(2, target.widthMrad * pxPerMrad);
  const height = Math.max(2, target.heightMrad * pxPerMrad);

  switch (target.kind) {
    case "bullseye":
      drawBullseye(canvas, centerX, centerY, width, height);
      return;
    case "IDPA":
      drawIDPA(canvas, centerX, centerY, width, height);
      return;
    case "plate":
      drawPlate(canvas, centerX, centerY, width, height);
      return;
    case "circle":
      drawCircleTarget(canvas, centerX, centerY, width, height);
      return;
  }
}

export function drawCorrectionMarker(
  canvas: ReticleCanvas,
  centerX: number,
  centerY: number,
  pxPerMrad: number,
  target: ReticleRenderInput["target"]
): void {
  if (!target) {
    return;
  }

  const x = centerX + target.horizontalMrad * pxPerMrad;
  const y = centerY + target.verticalMrad * pxPerMrad;
  const size = Math.max(6, pxPerMrad * 0.3);

  canvas.line(x - size, y, x + size, y, correctionPaint);
  canvas.line(x, y - size, x, y + size, correctionPaint);
  canvas.circle(x, y, size * 0.7, correctionPaint);
}

function drawBullseye(
  canvas: ReticleCanvas,
  centerX: number,
  centerY: number,
  width: number,
  height: number
): void {
  const radius = Math.min(width, height) / 2;

  canvas.circle(centerX, centerY, radius, targetFillPaint);
  canvas.circle(centerX, centerY, radius, targetLinePaint);
  canvas.circle(centerX, centerY, radius * 0.66, targetLinePaint);
  canvas.circle(centerX, centerY, radius * 0.33, targetLinePaint);
  canvas.line(centerX - radius, centerY, centerX + radius, centerY, targetLinePaint);
  canvas.line(centerX, centerY - radius, centerX, centerY + radius, targetLinePaint);
}

function drawIDPA(
  canvas: ReticleCanvas,
  centerX: number,
  centerY: number,
  width: number,
  height: number
): void {
  const left = centerX - width / 2;
  const top = centerY - height / 2;
  const x = (inches: number) => left + width * (inches / IDPA_TARGET_WIDTH_IN);
  const y = (inches: number) => top + height * (inches / IDPA_TARGET_HEIGHT_IN);
  const radius = (inches: number) =>
    Math.min(width * (inches / IDPA_TARGET_WIDTH_IN), height * (inches / IDPA_TARGET_HEIGHT_IN));
  const outline = [
    { x: x(6), y: y(0) },
    { x: x(12), y: y(0) },
    { x: x(12), y: y(6) },
    { x: x(15), y: y(6) },
    { x: x(18), y: y(9) },
    { x: x(18), y: y(25) },
    { x: x(15), y: y(30) },
    { x: x(3), y: y(30) },
    { x: x(0), y: y(25) },
    { x: x(0), y: y(9) },
    { x: x(3), y: y(6) },
    { x: x(6), y: y(6) },
  ];

  canvas.polygon(outline, targetFillPaint);
  canvas.polygon(outline, targetLinePaint);

  canvas.circle(centerX, y(3), radius(2), targetLinePaint);
  canvas.circle(centerX, y(14), radius(4), targetLinePaint);
}

function drawPlate(
  canvas: ReticleCanvas,
  centerX: number,
  centerY: number,
  width: number,
  height: number
): void {
  canvas.rect(
    centerX - width / 2,
    centerY - height / 2,
    centerX + width / 2,
    centerY + height / 2,
    targetFillPaint
  );
  canvas.rect(
    centerX - width / 2,
    centerY - height / 2,
    centerX + width / 2,
    centerY + height / 2,
    targetLinePaint
  );
  canvas.line(centerX - width / 2, centerY, centerX + width / 2, centerY, targetLinePaint);
  canvas.line(centerX, centerY - height / 2, centerX, centerY + height / 2, targetLinePaint);
}

function drawCircleTarget(
  canvas: ReticleCanvas,
  centerX: number,
  centerY: number,
  width: number,
  height: number
): void {
  const radius = Math.min(width, height) / 2;

  canvas.circle(centerX, centerY, radius, targetFillPaint);
  canvas.circle(centerX, centerY, radius, targetLinePaint);
  canvas.line(centerX - radius, centerY, centerX + radius, centerY, targetLinePaint);
  canvas.line(centerX, centerY - radius, centerX, centerY + radius, targetLinePaint);
}
