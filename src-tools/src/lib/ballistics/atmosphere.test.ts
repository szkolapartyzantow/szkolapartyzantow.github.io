import { Atmosphere } from "./atmosphere";
import { Length, Pressure, Temperature, UOM } from "./uom";

describe("Atmosphere", () => {
  const createTestAtmosphere = (
    altitude: number,
    temperature: number,
    pressure: number,
    isPressureAtSeaLevel: boolean,
    humidity: number
  ) => {
    return Atmosphere.create(
      Length.meters(altitude),
      Pressure.inHg(pressure),
      isPressureAtSeaLevel,
      Temperature.celsius(temperature),
      humidity
    );
  };

  test("sound velocity is properly calculated", () => {
    const cases = [
      { temp: Atmosphere.STANDARD_TEMPERATURE_DEGREE_CELSIUS, expected: 340.1 },
      { temp: 0.0, expected: 331.1 },
    ];

    cases.forEach(({ temp, expected }) => {
      const atmosphere = createTestAtmosphere(
        0,
        temp,
        Atmosphere.STANDARD_PRESSURE_INCH_OF_MERCURY,
        false,
        Atmosphere.STANDARD_RELATIVE_HUMIDITY
      );
      expect(atmosphere.soundVelocity.inMps).toBeCloseTo(expected, 1);
    });
  });

  test("density is properly calculated", () => {
    const cases = [
      {
        temp: Atmosphere.STANDARD_TEMPERATURE_DEGREE_CELSIUS,
        pressure: Atmosphere.STANDARD_PRESSURE_INCH_OF_MERCURY,
        humidity: Atmosphere.STANDARD_RELATIVE_HUMIDITY,
        expected: 1.2201,
      },
      {
        temp: Atmosphere.STANDARD_TEMPERATURE_DEGREE_CELSIUS,
        pressure: Atmosphere.STANDARD_PRESSURE_INCH_OF_MERCURY,
        humidity: 0.0,
        expected: 1.2262,
      },
      {
        temp: 24.0,
        pressure: 31.07,
        humidity: Atmosphere.STANDARD_RELATIVE_HUMIDITY,
        expected: 1.2232,
      },
      {
        temp: -12.0,
        pressure: 28.0,
        humidity: 0.3,
        expected: 1.2645,
      },
    ];

    cases.forEach(({ temp, pressure, humidity, expected }) => {
      const atmosphere = createTestAtmosphere(0, temp, pressure, false, humidity);
      expect(atmosphere.density.inKgPerCubicMeter).toBeCloseTo(expected, 4);
    });
  });

  test("pressure is properly calculated from Sea Level", () => {
    // To match Standard Pressure at 1000m (approx 89960 Pa),
    // we must be in Standard Atmosphere.
    // In Standard Atmosphere, if Base Temp is 15C, then Local Temp at 1000m is 8.5C.
    // My implementation of `create` takes Local Temp.
    // So if we pass 8.5C, it should infer Base 15C, and calculate Standard Pressure.

    const standardTempAt1000m =
      Atmosphere.STANDARD_TEMPERATURE_DEGREE_CELSIUS + Atmosphere.TEMPERATURE_LAPSE * 1000; // 15 - 6.5 = 8.5

    const cases = [
      {
        altitude: 1000.0,
        temp: standardTempAt1000m,
        expected: 89960.92,
      },
    ];

    cases.forEach(({ altitude, temp, expected }) => {
      const atmosphere = createTestAtmosphere(
        altitude,
        temp,
        Atmosphere.STANDARD_PRESSURE_INCH_OF_MERCURY,
        true, // Pressure is Sea Level
        Atmosphere.STANDARD_RELATIVE_HUMIDITY
      );
      expect(atmosphere.pressure.inPascals).toBeCloseTo(expected, 1);
    });
  });

  test("ICAO Standard Atmosphere is correct", () => {
    const altitudeMeters = 1000.0;
    const atmosphere = Atmosphere.icaoStandard(Length.meters(altitudeMeters));

    // Expected Pressure at 1000m in ICAO Standard Atmosphere: ~89960 Pa (Formula)
    expect(atmosphere.pressure.inPascals).toBeCloseTo(89960.92, 1);

    // Expected Temperature: 15 - 0.0065 * 1000 = 8.5 C
    expect(atmosphere.temperature.inCelsius).toBeCloseTo(8.5, 5);

    // Expected Density:
    // P = 89960, T = 8.5C (281.65K)
    expect(atmosphere.density.inKgPerCubicMeter).toBeCloseTo(1.1127, 3);
  });
});
