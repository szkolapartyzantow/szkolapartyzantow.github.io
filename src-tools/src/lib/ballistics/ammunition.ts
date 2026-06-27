import { Length, Mass, Velocity } from "./uom";
import { DragTableId } from "./drag_table";

export const BallisticCoefficientType = {
  Coefficient: 0,
  FormFactor: 1,
} as const;
export type BallisticCoefficientType =
  (typeof BallisticCoefficientType)[keyof typeof BallisticCoefficientType];

export class BallisticCoefficient {
  readonly value: number;
  readonly type: BallisticCoefficientType;
  readonly dragTableId: DragTableId;

  constructor(value: number, type: BallisticCoefficientType, dragTableId: DragTableId) {
    this.value = value;
    this.type = type;
    this.dragTableId = dragTableId;
  }
}

export class Ammunition {
  readonly weight: Mass;
  readonly ballisticCoefficient: BallisticCoefficient;
  readonly muzzleVelocity: Velocity;
  readonly diameter?: Length;
  readonly length?: Length;

  constructor(
    weight: Mass,
    ballisticCoefficient: BallisticCoefficient,
    muzzleVelocity: Velocity,
    diameter?: Length,
    length?: Length
  ) {
    this.weight = weight;
    this.ballisticCoefficient = ballisticCoefficient;
    this.muzzleVelocity = muzzleVelocity;
    this.diameter = diameter;
    this.length = length;
  }

  private calculateBallisticCoefficientFromFormFactor(ballisticCoefficientValue: number): number {
    const bulletWeight = this.weight.inPounds;
    if (bulletWeight <= 0) {
      throw new Error("Bullet weight must be greater than 0");
    }

    if (!this.diameter) {
      throw new Error("Diameter is required to calculate ballistic coefficient from form factor");
    }
    const bulletDiameter = this.diameter.inInches;

    if (bulletDiameter <= 0) {
      throw new Error("Diameter must be greater than 0");
    }

    return bulletWeight / Math.pow(bulletDiameter, 2) / ballisticCoefficientValue;
  }

  getBallisticCoefficient(): number {
    if (this.ballisticCoefficient.type === BallisticCoefficientType.Coefficient) {
      return this.ballisticCoefficient.value;
    } else {
      return this.calculateBallisticCoefficientFromFormFactor(this.ballisticCoefficient.value);
    }
  }

  getDragTableId(): DragTableId {
    return this.ballisticCoefficient.dragTableId;
  }
}
