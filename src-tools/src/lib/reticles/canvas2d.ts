import type { PaintStyle, ReticleCanvas } from "./types";

export class Canvas2DReticleCanvas implements ReticleCanvas {
  constructor(private readonly ctx: CanvasRenderingContext2D) {}

  line(x1: number, y1: number, x2: number, y2: number, paint: PaintStyle): void {
    this.applyPaint(paint);
    this.ctx.beginPath();
    this.ctx.moveTo(x1, y1);
    this.ctx.lineTo(x2, y2);
    this.ctx.stroke();
  }

  circle(x: number, y: number, radius: number, paint: PaintStyle): void {
    this.applyPaint(paint);
    this.ctx.beginPath();
    this.ctx.arc(x, y, radius, 0, Math.PI * 2);
    this.drawPath(paint);
  }

  rect(x1: number, y1: number, x2: number, y2: number, paint: PaintStyle): void {
    this.applyPaint(paint);
    const left = Math.min(x1, x2);
    const top = Math.min(y1, y2);
    const width = Math.abs(x2 - x1);
    const height = Math.abs(y2 - y1);

    if (paint.fill) {
      this.ctx.fillRect(left, top, width, height);
    } else {
      this.ctx.strokeRect(left, top, width, height);
    }
  }

  polygon(points: Array<{ x: number; y: number }>, paint: PaintStyle): void {
    if (points.length < 2) {
      return;
    }

    this.applyPaint(paint);
    this.ctx.beginPath();
    this.ctx.moveTo(points[0]!.x, points[0]!.y);

    for (const point of points.slice(1)) {
      this.ctx.lineTo(point.x, point.y);
    }

    this.ctx.closePath();
    this.drawPath(paint);
  }

  private applyPaint(paint: PaintStyle): void {
    this.ctx.strokeStyle = paint.color;
    this.ctx.fillStyle = paint.color;
    this.ctx.lineWidth = paint.strokeWidth ?? 1;
    this.ctx.lineCap = "round";
    this.ctx.lineJoin = "round";
  }

  private drawPath(paint: PaintStyle): void {
    if (paint.fill) {
      this.ctx.fill();
    }
    if (!paint.fill || paint.strokeWidth) {
      this.ctx.stroke();
    }
  }
}
