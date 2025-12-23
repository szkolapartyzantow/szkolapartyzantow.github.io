import { Length, Mass, Velocity } from "./uom";
import { DragTableId } from "./drag_table";

export enum BallisticCoefficientType {
  Coefficient,
  FormFactor,
}

export class BallisticCoefficient {
  constructor(
    public readonly value: number,
    public readonly type: BallisticCoefficientType,
    public readonly dragTableId: DragTableId
  ) {}
}

export class Ammunition {
  constructor(
    public readonly weight: Mass,
    public readonly ballisticCoefficient: BallisticCoefficient,
    public readonly muzzleVelocity: Velocity,
    public readonly diameter?: Length,
    public readonly length?: Length
  ) {}

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
