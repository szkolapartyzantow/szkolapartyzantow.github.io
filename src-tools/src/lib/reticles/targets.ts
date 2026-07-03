import type { ReticleCanvas, ReticleRenderInput, ReticleVisualTarget } from "./types";

const targetFillPaint = { color: "rgba(37, 99, 235, 0.18)", fill: true };
const targetLinePaint = { color: "rgba(37, 99, 235, 0.7)", strokeWidth: 1.25 };
const correctionPaint = { color: "#dc2626", strokeWidth: 1.5 };

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
  const x = (fraction: number) => left + width * fraction;
  const y = (fraction: number) => top + height * fraction;

  canvas.polygon(
    [
      { x: x(0.334), y: y(0) },
      { x: x(0.666), y: y(0) },
      { x: x(0.666), y: y(0.202) },
      { x: x(0.83), y: y(0.202) },
      { x: x(1), y: y(0.35) },
      { x: x(1), y: y(0.83) },
      { x: x(0.83), y: y(1) },
      { x: x(0.17), y: y(1) },
      { x: x(0), y: y(0.83) },
      { x: x(0), y: y(0.35) },
      { x: x(0.17), y: y(0.202) },
      { x: x(0.334), y: y(0.202) },
    ],
    targetFillPaint
  );

  canvas.polygon(
    [
      { x: x(0.334), y: y(0) },
      { x: x(0.666), y: y(0) },
      { x: x(0.666), y: y(0.202) },
      { x: x(0.83), y: y(0.202) },
      { x: x(1), y: y(0.35) },
      { x: x(1), y: y(0.83) },
      { x: x(0.83), y: y(1) },
      { x: x(0.17), y: y(1) },
      { x: x(0), y: y(0.83) },
      { x: x(0), y: y(0.35) },
      { x: x(0.17), y: y(0.202) },
      { x: x(0.334), y: y(0.202) },
    ],
    targetLinePaint
  );

  canvas.circle(centerX, y(0.44), Math.min(width * 0.22, height * 0.13), targetLinePaint);
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
