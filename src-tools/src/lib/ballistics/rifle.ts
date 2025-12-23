import { Angle, Length, Velocity } from "./uom";
import { Ammunition } from "./ammunition";
import { Atmosphere } from "./atmosphere";

export enum TwistDirection {
  Right = -1,
  Left = 1,
}

export class Sight {
  constructor(
    public readonly height: Length,
    public readonly verticalClick?: Angle,
    public readonly horizontalClick?: Angle
  ) {}
}

export class ZeroingParameters {
  constructor(
    public readonly distance: Length,
    public readonly atmosphere?: Atmosphere,
    public readonly ammunition?: Ammunition,
    public readonly verticalOffset?: Length
  ) {}
}

export class Rifling {
  constructor(
    public readonly step: Length,
    public readonly twistDirection: TwistDirection
  ) {}
}

export class Wind {
  constructor(
    public readonly direction: Angle,
    public readonly velocity: Velocity,
    public readonly maxRange?: Length
  ) {}
}

export class Rifle {
  constructor(
    public readonly sight: Sight,
    public readonly zeroingParameters: ZeroingParameters,
    public readonly rifling?: Rifling
  ) {}
}
