import { Length, MassDensity, Pressure, Temperature, Velocity } from "./uom";

export class Atmosphere {
  static readonly STANDARD_DENSITY_POUND_PER_CUBIC_FOOT = 0.076474;
  static readonly STANDARD_TEMPERATURE_DEGREE_CELSIUS = 15.0;
  static readonly STANDARD_PRESSURE_INCH_OF_MERCURY = 29.95;
  static readonly STANDARD_RELATIVE_HUMIDITY = 0.78;
  static readonly TEMPERATURE_LAPSE = -0.0065; // K/m

  constructor(
    public readonly altitude: Length,
    public readonly pressure: Pressure,
    public readonly temperature: Temperature,
    public readonly humidity: number,
    public readonly soundVelocity: Velocity,
    public readonly density: MassDensity,
    public readonly standardDensity: MassDensity
  ) {}

  /**
   * Creates an Atmosphere instance.
   *
   * @param altitude - The altitude of the atmosphere.
   * @param pressure - The pressure (either at altitude or at sea level).
   * @param isPressureAtSeaLevel - If true, the `pressure` argument is treated as Sea Level Pressure (QNH) and adjusted to altitude.
   *                               If false, `pressure` is treated as Station Pressure (at altitude).
   * @param temperature - The local temperature at the given altitude.
   * @param humidity - The relative humidity (0.0 to 1.0).
   */
  static create(
    altitude: Length,
    pressure: Pressure,
    isPressureAtSeaLevel: boolean,
    temperature: Temperature,
    humidity: number
  ): Atmosphere {
    let pressureAtAltitude = pressure;

    if (isPressureAtSeaLevel) {
      // If the provided pressure is at Sea Level, we need to calculate the Station Pressure at Altitude.
      // To do this accurately, we need the Temperature at Sea Level.
      // We infer the Sea Level Temperature from the provided Local Temperature using the standard lapse rate.
      // T_local = T_base + Lapse * (Alt - BaseAlt)
      // => T_base = T_local - Lapse * Alt
      const baseTempKelvin =
        temperature.inKelvin - Atmosphere.TEMPERATURE_LAPSE * altitude.inMeters;
      const baseTemp = Temperature.kelvin(baseTempKelvin);

      pressureAtAltitude = Atmosphere.calculatePressure(pressure, baseTemp, Length.ZERO, altitude);
    }

    return new Atmosphere(
      altitude,
      pressureAtAltitude,
      temperature,
      humidity,
      Atmosphere.calculateSoundVelocity(temperature),
      Atmosphere.calculateDensity(temperature, pressureAtAltitude, humidity),
      MassDensity.lbPerCubicFoot(Atmosphere.STANDARD_DENSITY_POUND_PER_CUBIC_FOOT)
    );
  }

  static standard(): Atmosphere {
    return Atmosphere.create(
      Length.ZERO,
      Pressure.inHg(Atmosphere.STANDARD_PRESSURE_INCH_OF_MERCURY),
      false,
      Temperature.celsius(Atmosphere.STANDARD_TEMPERATURE_DEGREE_CELSIUS),
      Atmosphere.STANDARD_RELATIVE_HUMIDITY
    );
  }

  static icaoStandard(altitude: Length): Atmosphere {
    return Atmosphere.icaoStandardWithHumidity(altitude, 0.0);
  }

  static icaoStandardWithHumidity(altitude: Length, humidity: number): Atmosphere {
    const standardPressure = Pressure.inHg(Atmosphere.STANDARD_PRESSURE_INCH_OF_MERCURY);
    const standardTemp = Temperature.celsius(Atmosphere.STANDARD_TEMPERATURE_DEGREE_CELSIUS);

    // Calculate Local Temperature at Altitude
    const localTemp = Atmosphere.calculateTemperature(standardTemp, Length.ZERO, altitude);

    // Calculate Local Pressure at Altitude (using Standard Sea Level Temp)
    const localPressure = Atmosphere.calculatePressure(
      standardPressure,
      standardTemp,
      Length.ZERO,
      altitude
    );

    return new Atmosphere(
      altitude,
      localPressure,
      localTemp,
      humidity,
      Atmosphere.calculateSoundVelocity(localTemp),
      Atmosphere.calculateDensity(localTemp, localPressure, humidity),
      MassDensity.lbPerCubicFoot(Atmosphere.STANDARD_DENSITY_POUND_PER_CUBIC_FOOT)
    );
  }

  getDensityFactorAndMachAtAltitude(altitude: Length): {
    densityFactor: number;
    mach: Velocity;
  } {
    // This method calculates conditions at a DIFFERENT altitude based on the current atmosphere's model.
    // It assumes the current atmosphere defines the "Base" conditions (Station conditions).
    // So we treat `this.temperature` and `this.pressure` as base values at `this.altitude`.

    const t = Atmosphere.calculateTemperature(this.temperature, this.altitude, altitude);
    const p = Atmosphere.calculatePressure(
      this.pressure,
      this.temperature,
      this.altitude,
      altitude
    );
    const d = Atmosphere.calculateDensity(t, p, this.humidity);
    const densityFactor =
      d.inKgPerCubicMeter /
      MassDensity.lbPerCubicFoot(Atmosphere.STANDARD_DENSITY_POUND_PER_CUBIC_FOOT)
        .inKgPerCubicMeter;
    const mach = Atmosphere.calculateSoundVelocity(t);
    return { densityFactor, mach };
  }

  private static calculateTemperature(
    baseTemperature: Temperature,
    baseAltitude: Length,
    altitude: Length
  ): Temperature {
    return Temperature.kelvin(
      baseTemperature.inKelvin +
        Atmosphere.TEMPERATURE_LAPSE * (altitude.inMeters - baseAltitude.inMeters)
    );
  }

  private static calculatePressure(
    basePressure: Pressure,
    baseTemperature: Temperature,
    baseAltitude: Length,
    altitude: Length
  ): Pressure {
    const G = 9.80665;
    const GAS_CONSTANT = 8.31432;
    const AIR_MOLAR_MASS = 0.0289644;
    const EXPONENT = (-G * AIR_MOLAR_MASS) / (GAS_CONSTANT * Atmosphere.TEMPERATURE_LAPSE);

    const basePressureBar = basePressure.inBar;
    const baseTemperatureKelvin = baseTemperature.inKelvin;
    const baseAltitudeMeters = baseAltitude.inMeters;
    const altitudeMeters = altitude.inMeters;

    const pressureAtAltitude =
      basePressureBar *
      Math.pow(
        1.0 +
          (Atmosphere.TEMPERATURE_LAPSE / baseTemperatureKelvin) *
            (altitudeMeters - baseAltitudeMeters),
        EXPONENT
      );
    return Pressure.bar(pressureAtAltitude);
  }

  private static calculateSaturatedVaporPressure(temperature: Temperature): number {
    const ES0 = 6.1078;
    const SVP_C0 = 0.99999683;
    const SVP_C1 = -0.90826951e-2;
    const SVP_C2 = 0.78736169e-4;
    const SVP_C3 = -0.61117958e-6;
    const SVP_C4 = 0.43884187e-8;
    const SVP_C5 = -0.29883885e-10;
    const SVP_C6 = 0.21874425e-12;

    const tempCelsius = temperature.inCelsius;
    const pt =
      SVP_C0 +
      tempCelsius *
        (SVP_C1 +
          tempCelsius *
            (SVP_C2 +
              tempCelsius *
                (SVP_C3 + tempCelsius * (SVP_C4 + tempCelsius * (SVP_C5 + tempCelsius * SVP_C6)))));

    return ES0 / Math.pow(pt, 8.0);
  }

  private static calculateDensity(
    temperature: Temperature,
    pressure: Pressure,
    humidity: number
  ): MassDensity {
    const DRY_AIR_K = 287.058;
    const VAPOR_K = 461.495;

    const vaporSaturation = Atmosphere.calculateSaturatedVaporPressure(temperature) * 100.0;
    const actualVapourPressure = vaporSaturation * humidity;
    const dryPressure = pressure.inPascals - actualVapourPressure;
    const tempKelvin = temperature.inKelvin;

    return MassDensity.kgPerCubicMeter(
      dryPressure / (DRY_AIR_K * tempKelvin) + actualVapourPressure / (VAPOR_K * tempKelvin)
    );
  }

  private static calculateSoundVelocity(temperature: Temperature): Velocity {
    const tempKelvin = temperature.inKelvin;
    return Velocity.mps(331.0 * Math.sqrt(tempKelvin / 273.0));
  }
}
