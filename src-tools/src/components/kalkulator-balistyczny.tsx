import * as React from "react";
import { ChevronDown, Download, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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

const CORRECTION_UNITS = [
  { value: "cm", label: "cm" },
  { value: "moa", label: "MOA" },
  { value: "mrad", label: "MIL (MRAD)" },
];

const RESULT_VELOCITY_UNITS = [
  { value: "m/s", label: "m/s" },
  { value: "ft/s", label: "ft/s" },
];

const RESULT_ENERGY_UNITS = [
  { value: "J", label: "J" },
  { value: "ft*lbs", label: "ft*lbs" },
];

const CORRECTION_DISPLAY_OPTIONS = [
  { value: "directional", label: "U/D/L/R" },
  { value: "signed", label: "+/-" },
  { value: "polishDirectional", label: "G/D/L/P" },
];

type CorrectionUnit = (typeof CORRECTION_UNITS)[number]["value"];
type CorrectionDisplay = (typeof CORRECTION_DISPLAY_OPTIONS)[number]["value"];
type ResultVelocityUnit = (typeof RESULT_VELOCITY_UNITS)[number]["value"];
type ResultEnergyUnit = (typeof RESULT_ENERGY_UNITS)[number]["value"];
type OptionalResultColumnId = "vertical" | "horizontal" | "velocity" | "energy";
type ResultColumnId = "distance" | OptionalResultColumnId;
type BallisticCalculatorData = {
  version: 1;
  ammunition: {
    bulletWeight: string;
    bulletWeightUnit: string;
    ballisticCoefficient: string;
    dragTable: string;
    muzzleVelocity: string;
    muzzleVelocityUnit: string;
    bulletDiameter: string;
    bulletDiameterUnit: string;
  };
  rifle: {
    sightHeight: string;
    sightHeightUnit: string;
    zeroDistance: string;
    zeroDistanceUnit: string;
    twistRate: string;
    twistDirection: string;
    cant: string;
    shotAngle: string;
  };
  atmosphere: {
    editAtmosphere: boolean;
    altitude: number;
    altitudeUnit: string;
    temperature: number;
    temperatureUnit: string;
    pressure: number;
    humidity: number;
    windSpeed: number;
    windSpeedUnit: string;
    windDirection: number;
  };
  shot: {
    maxDistance: string;
    maxDistanceUnit: string;
    stepSize: string;
    correctionUnit: CorrectionUnit;
    correctionDisplay: CorrectionDisplay;
    resultVelocityUnit: ResultVelocityUnit;
    resultEnergyUnit: ResultEnergyUnit;
    visibleResultColumns: Record<OptionalResultColumnId, boolean>;
  };
};

const DEFAULT_VISIBLE_RESULT_COLUMNS: Record<OptionalResultColumnId, boolean> = {
  vertical: true,
  horizontal: true,
  velocity: true,
  energy: true,
};

export function KalkulatorBalistyczny() {
  const importFileInputRef = React.useRef<HTMLInputElement>(null);

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
  const [correctionUnit, setCorrectionUnit] = React.useState<CorrectionUnit>("cm");
  const [correctionDisplay, setCorrectionDisplay] = React.useState<CorrectionDisplay>("signed");
  const [resultVelocityUnit, setResultVelocityUnit] = React.useState<ResultVelocityUnit>("m/s");
  const [resultEnergyUnit, setResultEnergyUnit] = React.useState<ResultEnergyUnit>("J");
  const [visibleResultColumns, setVisibleResultColumns] = React.useState(
    DEFAULT_VISIBLE_RESULT_COLUMNS
  );

  const [isImportErrorOpen, setIsImportErrorOpen] = React.useState(false);
  const [editAtmosphere, setEditAtmosphere] = React.useState(false);

  const [results, setResults] = React.useState<TrajectoryPoint[] | null>(null);

  const correctionUnitLabel =
    CORRECTION_UNITS.find((unit) => unit.value === correctionUnit)?.label ?? "cm";

  const resultVelocityUnitLabel =
    RESULT_VELOCITY_UNITS.find((unit) => unit.value === resultVelocityUnit)?.label ?? "m/s";

  const resultEnergyUnitLabel =
    RESULT_ENERGY_UNITS.find((unit) => unit.value === resultEnergyUnit)?.label ?? "J";

  const formatSignedCorrection = (value: number, fractionDigits: number) => {
    const formatted = value.toFixed(fractionDigits);
    return value > 0 ? `+${formatted}` : formatted;
  };

  const formatDirectionalCorrection = (
    value: number,
    fractionDigits: number,
    positiveDirection: string,
    negativeDirection: string
  ) => {
    const direction = value > 0 ? positiveDirection : value < 0 ? negativeDirection : "";
    return `${Math.abs(value).toFixed(fractionDigits)}${direction}`;
  };

  const formatCorrection = (
    value: number,
    fractionDigits: number,
    positiveDirection: string,
    negativeDirection: string,
    polishPositiveDirection: string,
    polishNegativeDirection: string
  ) => {
    if (correctionDisplay === "directional") {
      return formatDirectionalCorrection(
        value,
        fractionDigits,
        positiveDirection,
        negativeDirection
      );
    }

    if (correctionDisplay === "polishDirectional") {
      return formatDirectionalCorrection(
        value,
        fractionDigits,
        polishPositiveDirection,
        polishNegativeDirection
      );
    }

    return formatSignedCorrection(value, fractionDigits);
  };

  const getVerticalCorrectionValue = (point: TrajectoryPoint) => {
    switch (correctionUnit) {
      case "moa":
        return { value: -point.dropAdjustment.inMoa, fractionDigits: 2 };
      case "mrad":
        return { value: -point.dropAdjustment.inMrad, fractionDigits: 2 };
      default:
        return { value: -point.drop.inCentimeters, fractionDigits: 1 };
    }
  };

  const getHorizontalCorrectionValue = (point: TrajectoryPoint) => {
    switch (correctionUnit) {
      case "moa":
        return { value: -point.windageAdjustment.inMoa, fractionDigits: 2 };
      case "mrad":
        return { value: -point.windageAdjustment.inMrad, fractionDigits: 2 };
      default:
        return { value: -point.windage.inCentimeters, fractionDigits: 1 };
    }
  };

  const formatVerticalCorrection = (point: TrajectoryPoint) => {
    const correction = getVerticalCorrectionValue(point);
    return formatCorrection(correction.value, correction.fractionDigits, "U", "D", "G", "D");
  };

  const formatHorizontalCorrection = (point: TrajectoryPoint) => {
    const correction = getHorizontalCorrectionValue(point);
    return formatCorrection(correction.value, correction.fractionDigits, "R", "L", "P", "L");
  };

  const formatResultVelocity = (point: TrajectoryPoint) => {
    switch (resultVelocityUnit) {
      case "ft/s":
        return point.velocity.inFps.toFixed(0);
      default:
        return point.velocity.inMps.toFixed(0);
    }
  };

  const formatResultEnergy = (point: TrajectoryPoint) => {
    switch (resultEnergyUnit) {
      case "ft*lbs":
        return point.energy.inFootPounds.toFixed(0);
      default:
        return point.energy.inJoules.toFixed(0);
    }
  };

  const setResultColumnVisible = (columnId: OptionalResultColumnId, visible: boolean) => {
    setVisibleResultColumns((columns) => ({
      ...columns,
      [columnId]: visible,
    }));
  };

  const getCalculatorData = (): BallisticCalculatorData => ({
    version: 1,
    ammunition: {
      bulletWeight,
      bulletWeightUnit,
      ballisticCoefficient,
      dragTable,
      muzzleVelocity,
      muzzleVelocityUnit,
      bulletDiameter,
      bulletDiameterUnit,
    },
    rifle: {
      sightHeight,
      sightHeightUnit,
      zeroDistance,
      zeroDistanceUnit,
      twistRate,
      twistDirection,
      cant,
      shotAngle,
    },
    atmosphere: {
      editAtmosphere,
      altitude,
      altitudeUnit,
      temperature,
      temperatureUnit,
      pressure,
      humidity,
      windSpeed,
      windSpeedUnit,
      windDirection,
    },
    shot: {
      maxDistance,
      maxDistanceUnit,
      stepSize,
      correctionUnit,
      correctionDisplay,
      resultVelocityUnit,
      resultEnergyUnit,
      visibleResultColumns,
    },
  });

  const isBallisticCalculatorData = (value: unknown): value is BallisticCalculatorData => {
    if (!value || typeof value !== "object") {
      return false;
    }

    const data = value as Partial<BallisticCalculatorData>;
    const isString = (field: unknown) => typeof field === "string";
    const isNumber = (field: unknown) => typeof field === "number" && Number.isFinite(field);
    const isBoolean = (field: unknown) => typeof field === "boolean";
    const hasOption = <T extends string>(options: readonly { value: T }[], field: unknown) =>
      isString(field) && options.some((option) => option.value === field);

    return (
      data.version === 1 &&
      Boolean(data.ammunition) &&
      Boolean(data.rifle) &&
      Boolean(data.atmosphere) &&
      Boolean(data.shot) &&
      isString(data.ammunition?.bulletWeight) &&
      hasOption(WEIGHT_UNITS, data.ammunition?.bulletWeightUnit) &&
      isString(data.ammunition?.ballisticCoefficient) &&
      hasOption(DRAG_TABLE_OPTIONS, data.ammunition?.dragTable) &&
      isString(data.ammunition?.muzzleVelocity) &&
      hasOption(VELOCITY_UNITS, data.ammunition?.muzzleVelocityUnit) &&
      isString(data.ammunition?.bulletDiameter) &&
      hasOption(DIAMETER_UNITS, data.ammunition?.bulletDiameterUnit) &&
      isString(data.rifle?.sightHeight) &&
      hasOption(SIGHT_HEIGHT_UNITS, data.rifle?.sightHeightUnit) &&
      isString(data.rifle?.zeroDistance) &&
      hasOption(DISTANCE_UNITS, data.rifle?.zeroDistanceUnit) &&
      isString(data.rifle?.twistRate) &&
      hasOption(TWIST_DIRECTIONS, data.rifle?.twistDirection) &&
      isString(data.rifle?.cant) &&
      isString(data.rifle?.shotAngle) &&
      isBoolean(data.atmosphere?.editAtmosphere) &&
      isNumber(data.atmosphere?.altitude) &&
      hasOption(ALTITUDE_UNITS, data.atmosphere?.altitudeUnit) &&
      isNumber(data.atmosphere?.temperature) &&
      hasOption(TEMPERATURE_UNITS, data.atmosphere?.temperatureUnit) &&
      isNumber(data.atmosphere?.pressure) &&
      isNumber(data.atmosphere?.humidity) &&
      isNumber(data.atmosphere?.windSpeed) &&
      hasOption(WIND_SPEED_UNITS, data.atmosphere?.windSpeedUnit) &&
      isNumber(data.atmosphere?.windDirection) &&
      isString(data.shot?.maxDistance) &&
      hasOption(DISTANCE_UNITS, data.shot?.maxDistanceUnit) &&
      isString(data.shot?.stepSize) &&
      hasOption(CORRECTION_UNITS, data.shot?.correctionUnit) &&
      hasOption(CORRECTION_DISPLAY_OPTIONS, data.shot?.correctionDisplay) &&
      hasOption(RESULT_VELOCITY_UNITS, data.shot?.resultVelocityUnit) &&
      hasOption(RESULT_ENERGY_UNITS, data.shot?.resultEnergyUnit) &&
      isBoolean(data.shot?.visibleResultColumns?.vertical) &&
      isBoolean(data.shot?.visibleResultColumns?.horizontal) &&
      isBoolean(data.shot?.visibleResultColumns?.velocity) &&
      isBoolean(data.shot?.visibleResultColumns?.energy)
    );
  };

  const applyCalculatorData = (data: BallisticCalculatorData) => {
    setBulletWeight(data.ammunition.bulletWeight);
    setBulletWeightUnit(data.ammunition.bulletWeightUnit);
    setBallisticCoefficient(data.ammunition.ballisticCoefficient);
    setDragTable(data.ammunition.dragTable);
    setMuzzleVelocity(data.ammunition.muzzleVelocity);
    setMuzzleVelocityUnit(data.ammunition.muzzleVelocityUnit);
    setBulletDiameter(data.ammunition.bulletDiameter);
    setBulletDiameterUnit(data.ammunition.bulletDiameterUnit);

    setSightHeight(data.rifle.sightHeight);
    setSightHeightUnit(data.rifle.sightHeightUnit);
    setZeroDistance(data.rifle.zeroDistance);
    setZeroDistanceUnit(data.rifle.zeroDistanceUnit);
    setTwistRate(data.rifle.twistRate);
    setTwistDirection(data.rifle.twistDirection);
    setCant(data.rifle.cant);
    setShotAngle(data.rifle.shotAngle);

    setEditAtmosphere(data.atmosphere.editAtmosphere);
    setAltitude(data.atmosphere.altitude);
    setAltitudeUnit(data.atmosphere.altitudeUnit);
    setTemperature(data.atmosphere.temperature);
    setTemperatureUnit(data.atmosphere.temperatureUnit);
    setPressure(data.atmosphere.pressure);
    setHumidity(data.atmosphere.humidity);
    setWindSpeed(data.atmosphere.windSpeed);
    setWindSpeedUnit(data.atmosphere.windSpeedUnit);
    setWindDirection(data.atmosphere.windDirection);

    setMaxDistance(data.shot.maxDistance);
    setMaxDistanceUnit(data.shot.maxDistanceUnit);
    setStepSize(data.shot.stepSize);
    setCorrectionUnit(data.shot.correctionUnit);
    setCorrectionDisplay(data.shot.correctionDisplay);
    setResultVelocityUnit(data.shot.resultVelocityUnit);
    setResultEnergyUnit(data.shot.resultEnergyUnit);
    setVisibleResultColumns(data.shot.visibleResultColumns);
    setResults(null);
  };

  const resultColumns: {
    id: ResultColumnId;
    label: string;
    render: (point: TrajectoryPoint) => React.ReactNode;
  }[] = [
      {
        id: "distance",
        label: `Dystans (${maxDistanceUnit})`,
        render: (point) =>
          (maxDistanceUnit === "m" ? point.distance.inMeters : point.distance.inYards).toFixed(0),
      },
      {
        id: "vertical",
        label: `Poprawka pionowa (${correctionUnitLabel})`,
        render: formatVerticalCorrection,
      },
      {
        id: "horizontal",
        label: `Poprawka pozioma (${correctionUnitLabel})`,
        render: formatHorizontalCorrection,
      },
      {
        id: "velocity",
        label: `Prędkość pocisku (${resultVelocityUnitLabel})`,
        render: formatResultVelocity,
      },
      {
        id: "energy",
        label: `Energia pocisku (${resultEnergyUnitLabel})`,
        render: formatResultEnergy,
      },
    ];

  const optionalResultColumns = resultColumns.filter(
    (column): column is typeof column & { id: OptionalResultColumnId } => column.id !== "distance"
  );
  const visibleColumns = resultColumns.filter(
    (column) => column.id === "distance" || visibleResultColumns[column.id]
  );

  const escapeCsvValue = (value: React.ReactNode) => {
    const text = String(value ?? "");
    return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
  };

  const exportResultsToCsv = () => {
    if (!results?.length) {
      return;
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const rows = [
      visibleColumns.map((column) => column.label),
      ...results.map((point) => visibleColumns.map((column) => column.render(point))),
    ];
    const csv = rows.map((row) => row.map(escapeCsvValue).join(",")).join("\n");
    const blob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `tabela-bal-${timestamp}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const exportCalculatorData = () => {
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const json = JSON.stringify(getCalculatorData(), null, 2);
    const blob = new Blob([json], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `dane-bal-${timestamp}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const importCalculatorData = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) {
      return;
    }

    try {
      const parsed = JSON.parse(await file.text());

      if (!isBallisticCalculatorData(parsed)) {
        setIsImportErrorOpen(true);
        return;
      }

      applyCalculatorData(parsed);
    } catch (error) {
      console.error(error);
      setIsImportErrorOpen(true);
    }
  };

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
      <div className="mb-6 flex gap-2">
        <input
          ref={importFileInputRef}
          type="file"
          accept="application/json,.json"
          className="hidden"
          onChange={importCalculatorData}
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => importFileInputRef.current?.click()}
        >
          <Download />
          Importuj dane
        </Button>
        <Button type="button" variant="outline" onClick={exportCalculatorData}>
          <Upload />
          Eksportuj dane
        </Button>
      </div>
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
                <Label>Wysokość linii celowania</Label>
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
                <Label>Kanting [przechył] (stopnie)</Label>
                <Input
                  type="number"
                  value={cant}
                  onChange={(e) => setCant(e.target.value)}
                  className="no-spin-button"
                />
              </div>
              <div className="space-y-2">
                <Label>Kąt strzału [w górę/w dół] (stopnie)</Label>
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
                    onChange={(e) => setAltitude(e.target.valueAsNumber)}
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
                    onChange={(e) => setTemperature(e.target.valueAsNumber)}
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
                  onChange={(e) => setPressure(e.target.valueAsNumber)}
                  className="no-spin-button"
                  disabled={!editAtmosphere}
                />
              </div>
              <div className="space-y-2">
                <Label>Wilgotność (%)</Label>
                <Input
                  type="number"
                  value={humidity}
                  onChange={(e) => setHumidity(e.target.valueAsNumber)}
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
                    onChange={(e) => setWindSpeed(e.target.valueAsNumber)}
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
                  onChange={(e) => setWindDirection(e.target.valueAsNumber)}
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
          <Separator className="my-6" />
          <h3 className="font-semibold">Jednostki</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Poprawka pionowa/pozioma</Label>
                <Select
                  value={correctionUnit}
                  onValueChange={(value) => setCorrectionUnit(value as CorrectionUnit)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CORRECTION_UNITS.map((unit) => (
                      <SelectItem key={unit.value} value={unit.value}>
                        {unit.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Zapis poprawki</Label>
                <Select
                  value={correctionDisplay}
                  onValueChange={(value) => setCorrectionDisplay(value as CorrectionDisplay)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CORRECTION_DISPLAY_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Prędkość pocisku</Label>
                <Select
                  value={resultVelocityUnit}
                  onValueChange={(value) => setResultVelocityUnit(value as ResultVelocityUnit)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {RESULT_VELOCITY_UNITS.map((unit) => (
                      <SelectItem key={unit.value} value={unit.value}>
                        {unit.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Energia pocisku</Label>
                <Select
                  value={resultEnergyUnit}
                  onValueChange={(value) => setResultEnergyUnit(value as ResultEnergyUnit)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {RESULT_ENERGY_UNITS.map((unit) => (
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
          <CardContent className="pt-6 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-lg">Wyniki</h3>
              <Button type="button" variant="outline" size="sm" onClick={exportResultsToCsv}>
                <Upload />
                Eksportuj do CSV
              </Button>
            </div>

            <div className="flex flex-wrap gap-x-4 gap-y-3">
              {optionalResultColumns.map((column) => (
                <div key={column.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`result-column-${column.id}`}
                    checked={visibleResultColumns[column.id]}
                    onCheckedChange={(checked) => setResultColumnVisible(column.id, !!checked)}
                  />
                  <label
                    htmlFor={`result-column-${column.id}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {column.label}
                  </label>
                </div>
              ))}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm text-center">
                <thead className="text-muted-foreground border-b">
                  <tr>
                    {visibleColumns.map((column) => (
                      <th key={column.id} className="py-2 px-2">
                        {column.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {results.map((point) => (
                    <tr
                      key={point.distance.inMeters}
                      className="border-b last:border-0 hover:bg-muted/50"
                    >
                      {visibleColumns.map((column) => (
                        <td key={column.id} className="py-2 px-2">
                          {column.render(point)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      <Dialog open={isImportErrorOpen} onOpenChange={setIsImportErrorOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Błąd</DialogTitle>
            <DialogDescription>
              Błąd parsowania danych. Wybierz poprawny plik JSON wyeksportowany z kalkulatora
              balistycznego.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button>OK</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
}
