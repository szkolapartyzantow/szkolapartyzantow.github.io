import * as React from "react";
import { ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { PageContainer } from "./page-container";
import { getToolByUrl } from "@/lib/tools";
import { ToolHelp } from "./tool-help";
import { DropdownSelect } from "./dropdown-select";

import {
  TrajectoryCalculator,
  ShotParameters,
  TrajectoryPoint,
} from "@/lib/ballistics/trajectory_calculator";
import {
  Ammunition,
  BallisticCoefficient,
  BallisticCoefficientType,
} from "@/lib/ballistics/ammunition";
import { UOM } from "@/lib/ballistics/uom";
import { DragTableId } from "@/lib/ballistics/drag_table";
import {
  Rifle,
  Sight,
  ZeroingParameters,
  Rifling,
  TwistDirection,
  Wind,
} from "@/lib/ballistics/rifle";
import { Atmosphere } from "@/lib/ballistics/atmosphere";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const DRAG_TABLE_OPTIONS = [
  { value: DragTableId.G1, label: "G1" },
  { value: DragTableId.G2, label: "G2" },
  { value: DragTableId.G5, label: "G5" },
  { value: DragTableId.G6, label: "G6" },
  { value: DragTableId.G7, label: "G7" },
  { value: DragTableId.G8, label: "G8" },
  { value: DragTableId.GI, label: "GI" },
  { value: DragTableId.RA4, label: "RA4" },
];

const WEIGHT_UNITS = [
  { value: "gr", label: "gr" },
  { value: "g", label: "g" },
];

const VELOCITY_UNITS = [
  { value: "m/s", label: "m/s" },
  { value: "ft/s", label: "ft/s" },
];

const DIAMETER_UNITS = [
  { value: "mm", label: "mm" },
  { value: "in", label: "in" },
];

const TWIST_DIRECTIONS = [
  { value: "Right", label: "Prawoskrętny" },
  { value: "Left", label: "Lewoskrętny" },
];

const SIGHT_HEIGHT_UNITS = [
  { value: "cm", label: "cm" },
  { value: "in", label: "in" },
];

const DISTANCE_UNITS = [
  { value: "m", label: "m" },
  { value: "yd", label: "yd" },
];

const ALTITUDE_UNITS = [
  { value: "m", label: "m" },
  { value: "ft", label: "ft" },
];

const TEMPERATURE_UNITS = [
  { value: "C", label: "°C" },
  { value: "F", label: "°F" },
];

const WIND_SPEED_UNITS = [
  { value: "m/s", label: "m/s" },
  { value: "km/h", label: "km/h" },
  { value: "mph", label: "mph" },
  { value: "ft/s", label: "ft/s" },
];

export function KalkulatorBalistyczny() {
  // Ammunition
  const [bulletWeight, setBulletWeight] = React.useState("55"); // grains or grams
  const [bulletWeightUnit, setBulletWeightUnit] = React.useState("gr");
  const [ballisticCoefficient, setBallisticCoefficient] = React.useState("0.242");
  const [dragTable, setDragTable] = React.useState<string>(DragTableId.G1);
  const [muzzleVelocity, setMuzzleVelocity] = React.useState("900"); // m/s
  const [muzzleVelocityUnit, setMuzzleVelocityUnit] = React.useState("m/s");
  const [bulletDiameter, setBulletDiameter] = React.useState("5.56"); // mm
  const [bulletDiameterUnit, setBulletDiameterUnit] = React.useState("mm");

  // Rifle
  const [sightHeight, setSightHeight] = React.useState("7.0"); // cm or in
  const [sightHeightUnit, setSightHeightUnit] = React.useState("cm");
  const [zeroDistance, setZeroDistance] = React.useState("50"); // m or yd
  const [zeroDistanceUnit, setZeroDistanceUnit] = React.useState("m");
  const [twistRate, setTwistRate] = React.useState("7"); // 1 in X inches
  const [twistDirection, setTwistDirection] = React.useState<string>("Right");
  const [cant, setCant] = React.useState("0"); // degrees
  const [shotAngle, setShotAngle] = React.useState("0"); // degrees

  // Atmosphere
  const defaultAltitude = UOM.Length.meters(0);
  const [altitude, setAltitude] = React.useState(defaultAltitude.inMeters);
  const [altitudeUnit, setAltitudeUnit] = React.useState("m");
  const defaultTemperature = UOM.Temperature.celsius(15);
  const [temperature, setTemperature] = React.useState(defaultTemperature.inCelsius);
  const [temperatureUnit, setTemperatureUnit] = React.useState("C");
  const defaultPressure = UOM.Pressure.hectoPascals(1013);
  const [pressure, setPressure] = React.useState(defaultPressure.inHectoPascals);
  const defaultHumidityPercent = 78;
  const [humidity, setHumidity] = React.useState(defaultHumidityPercent);

  // Wind
  const defaultWindSpeed = UOM.Velocity.mps(0);
  const [windSpeed, setWindSpeed] = React.useState(defaultWindSpeed.inMps);
  const [windSpeedUnit, setWindSpeedUnit] = React.useState("m/s");
  const defaultWindDirection = UOM.Angle.degrees(90);
  const [windDirection, setWindDirection] = React.useState(defaultWindDirection.inDegrees);

  // Shot
  const [maxDistance, setMaxDistance] = React.useState("500"); // m
  const [maxDistanceUnit, setMaxDistanceUnit] = React.useState("m");
  const [stepSize, setStepSize] = React.useState("10"); // m

  const [editAtmosphere, setEditAtmosphere] = React.useState(false);

  const [results, setResults] = React.useState<TrajectoryPoint[] | null>(null);

  const calculate = () => {
    try {
      // Parse inputs
      const weightGr = parseFloat(bulletWeight);
      const bcVal = parseFloat(ballisticCoefficient);
      const mv = parseFloat(muzzleVelocity);
      const diam = parseFloat(bulletDiameter);

      const sightHeightVal = parseFloat(sightHeight);
      const zeroDistVal = parseFloat(zeroDistance);
      const twistRateIn = parseFloat(twistRate);
      const cantDeg = parseFloat(cant);
      const shotAngleDeg = parseFloat(shotAngle);

      const maxDist = parseFloat(maxDistance);
      const step = parseFloat(stepSize);

      if (
        [
          weightGr,
          bcVal,
          mv,
          diam,
          sightHeightVal,
          zeroDistVal,
          twistRateIn,
          cantDeg,
          shotAngleDeg,
          maxDist,
          step,
        ].some(isNaN)
      ) {
        return;
      }

      // Build Objects
      const ammo = new Ammunition(
        bulletWeightUnit === "g" ? UOM.Mass.grams(weightGr) : UOM.Mass.grains(weightGr),
        new BallisticCoefficient(
          bcVal,
          BallisticCoefficientType.Coefficient,
          dragTable as DragTableId
        ),
        muzzleVelocityUnit === "ft/s" ? UOM.Velocity.fps(mv) : UOM.Velocity.mps(mv),
        bulletDiameterUnit === "in" ? UOM.Length.inches(diam) : UOM.Length.millimeters(diam)
      );

      let atmosphere: Atmosphere;
      let wind: Wind;

      if (editAtmosphere) {
        const altVal = altitude;
        const tempVal = temperature;
        const pressHpa = pressure;
        const humPct = humidity / 100.0;
        const windSpd = windSpeed;
        const windDirDeg = windDirection;

        if ([altVal, tempVal, pressHpa, humPct, windSpd, windDirDeg].some(isNaN)) {
          setResults(null);
          return;
        }

        atmosphere = Atmosphere.create(
          altitudeUnit === "ft" ? UOM.Length.feet(altVal) : UOM.Length.meters(altVal),
          UOM.Pressure.hectoPascals(pressHpa),
          false, // Pressure is station pressure
          temperatureUnit === "F"
            ? UOM.Temperature.fahrenheit(tempVal)
            : UOM.Temperature.celsius(tempVal),
          humPct
        );

        let windSpdMps: number;
        switch (windSpeedUnit) {
          case "km/h":
            windSpdMps = UOM.Velocity.kmh(windSpd).inMps;
            break;
          case "mph":
            windSpdMps = UOM.Velocity.mph(windSpd).inMps;
            break;
          case "ft/s":
            windSpdMps = UOM.Velocity.fps(windSpd).inMps;
            break;
          default: // m/s
            windSpdMps = windSpd;
            break;
        }
        wind = new Wind(UOM.Angle.degrees(windDirDeg), UOM.Velocity.mps(windSpdMps));
      } else {
        atmosphere = Atmosphere.create(
          defaultAltitude,
          defaultPressure,
          false,
          defaultTemperature,
          defaultHumidityPercent / 100
        );
        wind = new Wind(defaultWindDirection, defaultWindSpeed);
      }

      const rifling = new Rifling(
        UOM.Length.inches(twistRateIn),
        twistDirection === "Right" ? TwistDirection.Right : TwistDirection.Left
      );

      const rifle = new Rifle(
        new Sight(
          sightHeightUnit === "in"
            ? UOM.Length.inches(sightHeightVal)
            : UOM.Length.centimeters(sightHeightVal)
        ),
        new ZeroingParameters(
          zeroDistanceUnit === "yd"
            ? UOM.Length.yards(zeroDistVal)
            : UOM.Length.meters(zeroDistVal),
          atmosphere,
          ammo
        ),
        rifling
      );

      const calc = new TrajectoryCalculator();

      // Calculate Zero Angle
      const sightAngle = calc.calculateSightAngle(ammo, rifle, atmosphere);
      const shotParams = ShotParameters.new(
        sightAngle,
        maxDistanceUnit === "yd" ? UOM.Length.yards(step) : UOM.Length.meters(step),
        maxDistanceUnit === "yd" ? UOM.Length.yards(maxDist) : UOM.Length.meters(maxDist),
        UOM.Angle.degrees(cantDeg), // Cant
        UOM.Angle.degrees(shotAngleDeg), // Shot Angle
        UOM.Angle.ZERO // Barrel Azimuth
      );

      const trajectory = calc.calculateTrajectory(ammo, rifle, atmosphere, shotParams, [wind]);

      setResults(trajectory);
    } catch (e) {
      console.error(e);
      setResults(null);
    }
  };

  const toolInfo = getToolByUrl("#kalkulator-balistyczny");

  return (
    <PageContainer title={toolInfo?.title || "Kalkulator Balistyczny"}>
      <div className="grid gap-6 md:grid-cols-2 mb-6">
        <Card className="h-full">
          <CardContent className="pt-6 space-y-4">
            <h3 className="font-semibold">Amunicja</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Kaliber</Label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    step="0.01"
                    value={bulletDiameter}
                    onChange={(e) => setBulletDiameter(e.target.value)}
                    className="flex-1 no-spin-button"
                  />
                  <Select value={bulletDiameterUnit} onValueChange={setBulletDiameterUnit}>
                    <SelectTrigger className="w-[80px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {DIAMETER_UNITS.map((unit) => (
                        <SelectItem key={unit.value} value={unit.value}>
                          {unit.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Masa pocisku</Label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    value={bulletWeight}
                    onChange={(e) => setBulletWeight(e.target.value)}
                    className="flex-1 no-spin-button"
                  />
                  <Select value={bulletWeightUnit} onValueChange={setBulletWeightUnit}>
                    <SelectTrigger className="w-[70px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {WEIGHT_UNITS.map((unit) => (
                        <SelectItem key={unit.value} value={unit.value}>
                          {unit.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Prędkość wylotowa</Label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    value={muzzleVelocity}
                    onChange={(e) => setMuzzleVelocity(e.target.value)}
                    className="flex-1 no-spin-button"
                  />
                  <Select value={muzzleVelocityUnit} onValueChange={setMuzzleVelocityUnit}>
                    <SelectTrigger className="w-[80px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {VELOCITY_UNITS.map((unit) => (
                        <SelectItem key={unit.value} value={unit.value}>
                          {unit.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Współczynnik balistyczny</Label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    step="0.001"
                    value={ballisticCoefficient}
                    onChange={(e) => setBallisticCoefficient(e.target.value)}
                    className="flex-1 no-spin-button"
                  />
                  <Select value={dragTable} onValueChange={setDragTable}>
                    <SelectTrigger className="w-[80px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {DRAG_TABLE_OPTIONS.map((unit) => (
                        <SelectItem key={unit.value} value={unit.value}>
                          {unit.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <Separator className="my-6" />
            <h3 className="font-semibold">Broń</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Wysokość celownika</Label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    step="0.1"
                    value={sightHeight}
                    onChange={(e) => setSightHeight(e.target.value)}
                    className="flex-1 no-spin-button"
                  />
                  <Select value={sightHeightUnit} onValueChange={setSightHeightUnit}>
                    <SelectTrigger className="w-[80px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {SIGHT_HEIGHT_UNITS.map((unit) => (
                        <SelectItem key={unit.value} value={unit.value}>
                          {unit.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Zero</Label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    value={zeroDistance}
                    onChange={(e) => setZeroDistance(e.target.value)}
                    className="flex-1 no-spin-button"
                  />
                  <Select value={zeroDistanceUnit} onValueChange={setZeroDistanceUnit}>
                    <SelectTrigger className="w-[80px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {DISTANCE_UNITS.map((unit) => (
                        <SelectItem key={unit.value} value={unit.value}>
                          {unit.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Skok gwintu (1:x cal)</Label>
                <Input
                  type="number"
                  value={twistRate}
                  onChange={(e) => setTwistRate(e.target.value)}
                  className="no-spin-button"
                />
              </div>
              <div>
                <Label>Kierunek gwintu</Label>
                <DropdownSelect
                  label=""
                  items={TWIST_DIRECTIONS}
                  value={twistDirection}
                  onValueChange={setTwistDirection}
                  placeholder="Wybierz"
                  className="no-spin-button"
                  fullWidth
                />
              </div>
              <div className="space-y-2">
                <Label>Przechył (stopnie)</Label>
                <Input
                  type="number"
                  value={cant}
                  onChange={(e) => setCant(e.target.value)}
                  className="no-spin-button"
                />
              </div>
              <div className="space-y-2">
                <Label>Kąt strzału (stopnie)</Label>
                <Input
                  type="number"
                  value={shotAngle}
                  onChange={(e) => setShotAngle(e.target.value)}
                  className="no-spin-button"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="h-full">
          <CardContent className="pt-6 space-y-4">
            <h3 className="font-semibold">Warunki atmosferyczne</h3>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="edit-atmosphere"
                checked={editAtmosphere}
                onCheckedChange={(checked) => setEditAtmosphere(!!checked)}
              />
              <label
                htmlFor="edit-atmosphere"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Edytuj domyślne warunki atmosferyczne
              </label>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Wysokość n.p.m.</Label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    value={altitude}
                    onChange={(e) => setAltitude(e.target.value)}
                    className="flex-1 no-spin-button"
                    disabled={!editAtmosphere}
                  />
                  <Select
                    value={altitudeUnit}
                    onValueChange={setAltitudeUnit}
                    disabled={!editAtmosphere}
                  >
                    <SelectTrigger className="w-[80px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ALTITUDE_UNITS.map((unit) => (
                        <SelectItem key={unit.value} value={unit.value}>
                          {unit.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Temperatura</Label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    value={temperature}
                    onChange={(e) => setTemperature(e.target.value)}
                    className="flex-1 no-spin-button"
                    disabled={!editAtmosphere}
                  />
                  <Select
                    value={temperatureUnit}
                    onValueChange={setTemperatureUnit}
                    disabled={!editAtmosphere}
                  >
                    <SelectTrigger className="w-[80px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TEMPERATURE_UNITS.map((unit) => (
                        <SelectItem key={unit.value} value={unit.value}>
                          {unit.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Ciśnienie (hPa)</Label>
                <Input
                  type="number"
                  value={pressure}
                  onChange={(e) => setPressure(e.target.value)}
                  className="no-spin-button"
                  disabled={!editAtmosphere}
                />
              </div>
              <div className="space-y-2">
                <Label>Wilgotność (%)</Label>
                <Input
                  type="number"
                  value={humidity}
                  onChange={(e) => setHumidity(e.target.value)}
                  className="no-spin-button"
                  disabled={!editAtmosphere}
                />
              </div>
              <div className="space-y-2">
                <Label>Prędkość wiatru</Label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    step="0.1"
                    value={windSpeed}
                    onChange={(e) => setWindSpeed(e.target.value)}
                    className="flex-1 no-spin-button"
                    disabled={!editAtmosphere}
                  />
                  <Select
                    value={windSpeedUnit}
                    onValueChange={setWindSpeedUnit}
                    disabled={!editAtmosphere}
                  >
                    <SelectTrigger className="w-[100px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {WIND_SPEED_UNITS.map((unit) => (
                        <SelectItem key={unit.value} value={unit.value}>
                          {unit.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Kierunek wiatru (stopnie)</Label>
                <Input
                  type="number"
                  value={windDirection}
                  onChange={(e) => setWindDirection(e.target.value)}
                  placeholder="90 = z prawej"
                  className="no-spin-button"
                  disabled={!editAtmosphere}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6 space-y-4">
          <h3 className="font-semibold">Parametry obliczeń</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Maks. dystans</Label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  value={maxDistance}
                  onChange={(e) => setMaxDistance(e.target.value)}
                  className="flex-1 no-spin-button"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Krok</Label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  value={stepSize}
                  onChange={(e) => setStepSize(e.target.value)}
                  className="no-spin-button"
                />
                <Select value={maxDistanceUnit} onValueChange={setMaxDistanceUnit}>
                  <SelectTrigger className="w-[80px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DISTANCE_UNITS.map((unit) => (
                      <SelectItem key={unit.value} value={unit.value}>
                        {unit.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <Button onClick={calculate} className="w-full mt-4">
            Oblicz
          </Button>
        </CardContent>
      </Card>

      {results && (
        <Card className="mt-6">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-lg">Wyniki</h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm text-center">
                <thead className="text-muted-foreground border-b">
                  <tr>
                    <th className="py-2 px-2">Dystans ({maxDistanceUnit})</th>
                    <th className="py-2 px-2">Poprawka pionowa (cm)</th>
                    <th className="py-2 px-2">Poprawka pozioma (cm)</th>
                    <th className="py-2 px-2">Prędkość (m/s)</th>
                    <th className="py-2 px-2">Energia (J)</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((point) => (
                    <tr
                      key={point.distance.inMeters}
                      className="border-b last:border-0 hover:bg-muted/50"
                    >
                      <td className="py-2 px-2">
                        {(maxDistanceUnit === "m"
                          ? point.distance.inMeters
                          : point.distance.inYards
                        ).toFixed(0)}
                      </td>
                      <td className="py-2 px-2">{point.drop.inCentimeters.toFixed(1)}</td>
                      <td className="py-2 px-2">{point.windage.inCentimeters.toFixed(1)}</td>
                      <td className="py-2 px-2">{point.velocity.inMps.toFixed(0)}</td>
                      <td className="py-2 px-2">{point.energy.inJoules.toFixed(0)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </PageContainer>
  );
}
