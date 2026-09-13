import { Angle, Length, Velocity } from "./uom";
import { Ammunition } from "./ammunition";
import { Atmosphere } from "./atmosphere";

export const TwistDirection = {
  Right: -1,
  Left: 1,
} as const;
export type TwistDirection = (typeof TwistDirection)[keyof typeof TwistDirection];

export class Sight {
  readonly height: Length;
  readonly verticalClick?: Angle;
  readonly horizontalClick?: Angle;

  constructor(height: Length, verticalClick?: Angle, horizontalClick?: Angle) {
    this.height = height;
    this.verticalClick = verticalClick;
    this.horizontalClick = horizontalClick;
  }
}

export class ZeroingParameters {
  readonly distance: Length;
  readonly atmosphere?: Atmosphere;
  readonly ammunition?: Ammunition;
  readonly verticalOffset?: Length;

  constructor(
    distance: Length,
    atmosphere?: Atmosphere,
    ammunition?: Ammunition,
    verticalOffset?: Length
  ) {
    this.distance = distance;
    this.atmosphere = atmosphere;
    this.ammunition = ammunition;
    this.verticalOffset = verticalOffset;
  }
}

export class Rifling {
  readonly step: Length;
  readonly twistDirection: TwistDirection;

  constructor(step: Length, twistDirection: TwistDirection) {
    this.step = step;
    this.twistDirection = twistDirection;
  }
}

export class Wind {
  readonly direction: Angle;
  readonly velocity: Velocity;
  readonly maxRange?: Length;

  constructor(direction: Angle, velocity: Velocity, maxRange?: Length) {
    this.direction = direction;
    this.velocity = velocity;
    this.maxRange = maxRange;
  }
}

export class Rifle {
  readonly sight: Sight;
  readonly zeroingParameters: ZeroingParameters;
  readonly rifling?: Rifling;

  constructor(sight: Sight, zeroingParameters: ZeroingParameters, rifling?: Rifling) {
    this.sight = sight;
    this.zeroingParameters = zeroingParameters;
    this.rifling = rifling;
  }
}
