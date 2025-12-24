/**
 * Units of Measurement
 *
 * Immutable value objects for physical quantities.
 * All values are stored internally in SI base units.
 */

export class Length {
  private constructor(public readonly rawValue: number) { } // meters

  static readonly ZERO = new Length(0);

  static meters(value: number): Length {
    return new Length(value);
  }
  static centimeters(value: number): Length {
    return new Length(value * 0.01);
  }
  static millimeters(value: number): Length {
    return new Length(value * 0.001);
  }
  static inches(value: number): Length {
    return new Length(value * 0.0254);
  }
  static feet(value: number): Length {
    return new Length(value * 0.3048);
  }
  static yards(value: number): Length {
    return new Length(value * 0.9144);
  }

  get inMeters(): number {
    return this.rawValue;
  }
  get inCentimeters(): number {
    return this.rawValue / 0.01;
  }
  get inMillimeters(): number {
    return this.rawValue / 0.001;
  }
  get inInches(): number {
    return this.rawValue / 0.0254;
  }
  get inFeet(): number {
    return this.rawValue / 0.3048;
  }
  get inYards(): number {
    return this.rawValue / 0.9144;
  }

  add(other: Length): Length {
    return new Length(this.rawValue + other.rawValue);
  }
  subtract(other: Length): Length {
    return new Length(this.rawValue - other.rawValue);
  }
  multiply(scalar: number): Length {
    return new Length(this.rawValue * scalar);
  }
  divide(scalar: number): Length {
    return new Length(this.rawValue / scalar);
  }
}

export class Velocity {
  private constructor(public readonly rawValue: number) { } // m/s

  static readonly ZERO = new Velocity(0);

  static mps(value: number): Velocity {
    return new Velocity(value);
  }
  static kmh(value: number): Velocity {
    return new Velocity(value * 0.27778);
  }
  static fps(value: number): Velocity {
    return new Velocity(value * 0.3048);
  }
  static mph(value: number): Velocity {
    return new Velocity(value * 0.44704);
  }

  get inMps(): number {
    return this.rawValue;
  }
  get inKmh(): number {
    return this.rawValue / 0.27778;
  }
  get inFps(): number {
    return this.rawValue / 0.3048;
  }
  get inMph(): number {
    return this.rawValue / 0.44704;
  }

  add(other: Velocity): Velocity {
    return new Velocity(this.rawValue + other.rawValue);
  }
  subtract(other: Velocity): Velocity {
    return new Velocity(this.rawValue - other.rawValue);
  }
  multiply(scalar: number): Velocity {
    return new Velocity(this.rawValue * scalar);
  }
  divide(scalar: number): Velocity {
    return new Velocity(this.rawValue / scalar);
  }
}

export class Mass {
  private constructor(public readonly rawValue: number) { } // kg

  static readonly ZERO = new Mass(0);

  static kilograms(value: number): Mass {
    return new Mass(value);
  }
  static grams(value: number): Mass {
    return new Mass(value * 1000);
  }
  static pounds(value: number): Mass {
    return new Mass(value * 0.45359237);
  }
  static grains(value: number): Mass {
    return new Mass((value * 0.45359237) / 7000);
  }

  get inKilograms(): number {
    return this.rawValue;
  }
  get inGrams(): number {
    return this.rawValue * 1000;
  }
  get inPounds(): number {
    return this.rawValue / 0.45359237;
  }
  get inGrains(): number {
    return (this.rawValue * 7000) / 0.45359237;
  }

  add(other: Mass): Mass {
    return new Mass(this.rawValue + other.rawValue);
  }
  subtract(other: Mass): Mass {
    return new Mass(this.rawValue - other.rawValue);
  }
  multiply(scalar: number): Mass {
    return new Mass(this.rawValue * scalar);
  }
  divide(scalar: number): Mass {
    return new Mass(this.rawValue / scalar);
  }
}

export class MassDensity {
  private constructor(public readonly rawValue: number) { } // kg/m^3

  static readonly ZERO = new MassDensity(0);

  static kgPerCubicMeter(value: number): MassDensity {
    return new MassDensity(value);
  }
  static lbPerCubicFoot(value: number): MassDensity {
    return new MassDensity(value * 16.018463);
  }

  get inKgPerCubicMeter(): number {
    return this.rawValue;
  }
  get inLbPerCubicFoot(): number {
    return this.rawValue / 16.018463;
  }

  add(other: MassDensity): MassDensity {
    return new MassDensity(this.rawValue + other.rawValue);
  }
  subtract(other: MassDensity): MassDensity {
    return new MassDensity(this.rawValue - other.rawValue);
  }
  multiply(scalar: number): MassDensity {
    return new MassDensity(this.rawValue * scalar);
  }
  divide(scalar: number): MassDensity {
    return new MassDensity(this.rawValue / scalar);
  }
}

export class Energy {
  private constructor(public readonly rawValue: number) { } // Joules

  static readonly ZERO = new Energy(0);

  static joules(value: number): Energy {
    return new Energy(value);
  }
  static footPounds(value: number): Energy {
    return new Energy(value * 1.355818);
  }

  get inJoules(): number {
    return this.rawValue;
  }
  get inFootPounds(): number {
    return this.rawValue / 1.355818;
  }

  add(other: Energy): Energy {
    return new Energy(this.rawValue + other.rawValue);
  }
  subtract(other: Energy): Energy {
    return new Energy(this.rawValue - other.rawValue);
  }
  multiply(scalar: number): Energy {
    return new Energy(this.rawValue * scalar);
  }
  divide(scalar: number): Energy {
    return new Energy(this.rawValue / scalar);
  }
}

export class Pressure {
  private constructor(public readonly rawValue: number) { } // Pascals

  static readonly ZERO = new Pressure(0);

  static pascals(value: number): Pressure {
    return new Pressure(value);
  }
  static hectoPascals(value: number): Pressure {
    return new Pressure(value / 100);
  }
  static inHg(value: number): Pressure {
    return new Pressure(value * 3386.389);
  }
  static bar(value: number): Pressure {
    return new Pressure(value * 100000);
  }

  get inPascals(): number {
    return this.rawValue;
  }
  get inHectoPascals(): number {
    return this.rawValue / 100;
  }
  get inInHg(): number {
    return this.rawValue / 3386.389;
  }
  get inBar(): number {
    return this.rawValue / 100000;
  }

  add(other: Pressure): Pressure {
    return new Pressure(this.rawValue + other.rawValue);
  }
  subtract(other: Pressure): Pressure {
    return new Pressure(this.rawValue - other.rawValue);
  }
  multiply(scalar: number): Pressure {
    return new Pressure(this.rawValue * scalar);
  }
  divide(scalar: number): Pressure {
    return new Pressure(this.rawValue / scalar);
  }
}

export class Temperature {
  private constructor(public readonly rawValue: number) { } // Kelvin

  static readonly ZERO = new Temperature(0);

  static kelvin(value: number): Temperature {
    return new Temperature(value);
  }
  static celsius(value: number): Temperature {
    return new Temperature(value + 273.15);
  }
  static fahrenheit(value: number): Temperature {
    return new Temperature(((value - 32) * 5) / 9 + 273.15);
  }

  get inKelvin(): number {
    return this.rawValue;
  }
  get inCelsius(): number {
    return this.rawValue - 273.15;
  }
  get inFahrenheit(): number {
    return ((this.rawValue - 273.15) * 9) / 5 + 32;
  }
}

export class Angle {
  private constructor(public readonly rawValue: number) { } // Radians

  static readonly ZERO = new Angle(0);

  static radians(value: number): Angle {
    return new Angle(value);
  }
  static degrees(value: number): Angle {
    return new Angle((value * Math.PI) / 180);
  }
  static moa(value: number): Angle {
    return new Angle((value * Math.PI) / (180 * 60));
  }
  static mrad(value: number): Angle {
    return new Angle(value * 0.001);
  }

  get inRadians(): number {
    return this.rawValue;
  }
  get inDegrees(): number {
    return (this.rawValue * 180) / Math.PI;
  }
  get inMoa(): number {
    return (this.rawValue * 180 * 60) / Math.PI;
  }
  get inMrad(): number {
    return this.rawValue * 1000;
  }

  add(other: Angle): Angle {
    return new Angle(this.rawValue + other.rawValue);
  }
  subtract(other: Angle): Angle {
    return new Angle(this.rawValue - other.rawValue);
  }
  multiply(scalar: number): Angle {
    return new Angle(this.rawValue * scalar);
  }
  divide(scalar: number): Angle {
    return new Angle(this.rawValue / scalar);
  }

  // Trigonometric helpers
  cos(): number {
    return Math.cos(this.rawValue);
  }
  sin(): number {
    return Math.sin(this.rawValue);
  }
  tan(): number {
    return Math.tan(this.rawValue);
  }
}

export class Time {
  private constructor(public readonly rawValue: number) { } // Seconds

  static readonly ZERO = new Time(0);

  static seconds(value: number): Time {
    return new Time(value);
  }

  get inSeconds(): number {
    return this.rawValue;
  }

  add(other: Time): Time {
    return new Time(this.rawValue + other.rawValue);
  }
  subtract(other: Time): Time {
    return new Time(this.rawValue - other.rawValue);
  }
  multiply(scalar: number): Time {
    return new Time(this.rawValue * scalar);
  }
  divide(scalar: number): Time {
    return new Time(this.rawValue / scalar);
  }
}

export const UOM = {
  Length,
  Velocity,
  Mass,
  Pressure,
  Temperature,
  Angle,
  Time,
  MassDensity,
  Energy,
};
