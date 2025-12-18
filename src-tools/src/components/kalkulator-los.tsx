import * as React from "react"
import { Calculator, Plane, Radio, AlertTriangle, ArrowRight, ChevronDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { PageContainer } from "./page-container"

const FREQUENCIES = [
  { value: "0.44", label: "440 MHz" },
  { value: "0.868", label: "868 MHz" },
  { value: "0.915", label: "915 MHz" },
  { value: "1.3", label: "1.3 GHz" },
  { value: "2.4", label: "2.4 GHz" },
  { value: "5.8", label: "5.8 GHz" },
]

function computeLOS(
  frequencyGhz: number,
  antennaHeightM: number,
  obstacleHeightM: number,
  obstacleDistanceM: number,
  targetDistanceM: number
) {
  if (isNaN(frequencyGhz) || isNaN(antennaHeightM) || isNaN(obstacleHeightM) || isNaN(obstacleDistanceM) || isNaN(targetDistanceM)) {
    return null
  }

  const earthRadiusM = 6371000

  // 1. Horizon Distance (from Antenna)
  const horizonDistanceM = Math.sqrt(2 * earthRadiusM * antennaHeightM)

  // 2. Obstacle Calculation
  const obstacleHeightAboveAntennaM = obstacleHeightM - antennaHeightM
  let antennaAngleObstacleRad = Math.atan(obstacleHeightAboveAntennaM / obstacleDistanceM)

  // Ignore obstacle if below horizon/line
  const isObstacleReallyObstacle = antennaAngleObstacleRad > 0
  if (!isObstacleReallyObstacle) {
    antennaAngleObstacleRad = 0
  }

  const antennaAngleObstacleDeg = antennaAngleObstacleRad * (180 / Math.PI)

  // 3. Fresnel Zone Calculation
  let fresnelCheckDistanceM = obstacleDistanceM

  if (!isObstacleReallyObstacle) {
    // No obstacle: use midpoint or horizon limit
    const midpointDistanceM = targetDistanceM / 2
    fresnelCheckDistanceM = Math.min(midpointDistanceM, horizonDistanceM)
  }

  // Radius calc
  const fresnelCheckDistanceKm = fresnelCheckDistanceM / 1000
  const fresnelRadiusFull = 17.32 * Math.sqrt(fresnelCheckDistanceKm / (4 * frequencyGhz))
  const fresnelRadiusClearance = fresnelRadiusFull * 0.6

  // 4. Fresnel Angle
  const fresnelAngleRad = Math.atan(fresnelRadiusClearance / fresnelCheckDistanceM)
  const fresnelAngleDeg = fresnelAngleRad * (180 / Math.PI)

  // 5. Total Angle
  const antennaAngleTotalRad = antennaAngleObstacleRad + fresnelAngleRad
  const antennaAngleTotalDeg = antennaAngleTotalRad * (180 / Math.PI)

  // 6. Flat Earth Altitude at Target
  const flatEarthAltitudeM = targetDistanceM * Math.tan(antennaAngleTotalRad)

  // 7. Earth Curvature Drop
  let earthCurvatureDropM = 0

  if (isObstacleReallyObstacle) {
    // Drop past horizon
    if (targetDistanceM > horizonDistanceM) {
      const distancePastHorizonM = targetDistanceM - horizonDistanceM
      earthCurvatureDropM = (distancePastHorizonM * distancePastHorizonM) / (2 * earthRadiusM)
    }
  } else {
    // Full Earth Drop
    earthCurvatureDropM = (targetDistanceM * targetDistanceM) / (2 * earthRadiusM)
  }

  // 8. Final Altitude
  const droneAltitudeM = flatEarthAltitudeM + earthCurvatureDropM

  return {
    horizonDistanceM,
    antennaAngleObstacleDeg,
    fresnelRadiusClearance,
    fresnelAngleDeg,
    antennaAngleTotalDeg,
    flatEarthAltitudeM,
    earthCurvatureDropM,
    droneAltitudeM,
    fresnelCheckDistanceM
  }
}

interface SimpleLineChartProps {
  data: { x: number; y: number }[]
  width?: number
  height?: number
}

function SimpleLineChart({ data, width = 750, height = 500 }: SimpleLineChartProps) {
  if (!data || data.length === 0) return null;

  const padding = { top: 20, right: 30, bottom: 50, left: 40 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const maxX = Math.max(...data.map(d => d.x));
  const maxY = Math.max(...data.map(d => d.y));
  const effectiveMaxY = maxY <= 0 ? 10 : maxY; // Handle flat 0 case

  const scaleX = (x: number) => (x / maxX) * chartWidth;
  const scaleY = (y: number) => chartHeight - (y / effectiveMaxY) * chartHeight;

  // Generate Path
  const points = data.map(d => `${scaleX(d.x)},${scaleY(d.y)}`).join(" ");

  // Grid lines (approx 5 vertical, 5 horizontal)
  const xTicks = [0, maxX * 0.25, maxX * 0.5, maxX * 0.75, maxX];
  const yTicks = [0, effectiveMaxY * 0.25, effectiveMaxY * 0.5, effectiveMaxY * 0.75, effectiveMaxY];

  return (
    <div className="w-full overflow-x-auto">
      <svg
        width="100%"
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className="font-sans text-sm"
        style={{ minWidth: width }}
      >
        <g transform={`translate(${padding.left}, ${padding.top})`}>
          {/* Y Axis Grid & Labels */}
          {yTicks.map((tick, i) => (
            <g key={`y-${i}`}>
              <line
                x1={0} y1={scaleY(tick)}
                x2={chartWidth} y2={scaleY(tick)}
                stroke="#e5e7eb" strokeDasharray="4 4"
              />
              <text
                x={-10} y={scaleY(tick)}
                textAnchor="end" dominantBaseline="middle"
                fill="#6b7280"
              >
                {tick.toFixed(0)}m
              </text>
            </g>
          ))}

          {/* X Axis Grid & Labels */}
          {xTicks.map((tick, i) => (
            <g key={`x-${i}`}>
              <line
                x1={scaleX(tick)} y1={0}
                x2={scaleX(tick)} y2={chartHeight}
                stroke="#e5e7eb" strokeDasharray="4 4"
              />
              <text
                x={scaleX(tick)} y={chartHeight + 20}
                textAnchor="middle"
                fill="#6b7280"
              >
                {tick.toFixed(0)}m
              </text>
            </g>
          ))}

          {/* Axes Lines */}
          <line x1={0} y1={0} x2={0} y2={chartHeight} stroke="#9ca3af" strokeWidth="2" />
          <line x1={0} y1={chartHeight} x2={chartWidth} y2={chartHeight} stroke="#9ca3af" strokeWidth="2" />

          {/* Data Line */}
          <polyline
            points={points}
            fill="none"
            stroke="currentColor"
            className="text-primary"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>

        {/* Labels */}
        <text x={width / 2} y={height - 5} textAnchor="middle" fill="#374151" fontWeight="bold">Dystans (m)</text>
        <text x={0} y={220} textAnchor="middle" transform={`rotate(-90, 15, ${height / 2})`} fill="#374151" fontWeight="bold">Wysokość (m)</text>
      </svg>
    </div>
  );
}

export function KalkulatorLOS() {
  const [frequency, setFrequency] = React.useState<string>("0.915")
  const [antennaHeight, setAntennaHeight] = React.useState<string>("1")
  const [obstacleHeight, setObstacleHeight] = React.useState<string>("8")
  const [obstacleDistance, setObstacleDistance] = React.useState<string>("50")
  const [targetDistance, setTargetDistance] = React.useState<string>("3000")

  const calculateResult = () => {
    return computeLOS(
      parseFloat(frequency),
      parseFloat(antennaHeight),
      parseFloat(obstacleHeight),
      parseFloat(obstacleDistance),
      parseFloat(targetDistance)
    )
  }

  const results = calculateResult()

  const graphData = React.useMemo(() => {
    if (!results) return [];

    const d_t = parseFloat(targetDistance);
    const h_a = parseFloat(antennaHeight);

    if (isNaN(d_t) || d_t <= 0) return [];

    return [
      { x: 0, y: h_a },
      { x: d_t, y: results.droneAltitudeM }
    ];
  }, [results, targetDistance, antennaHeight]);

  return (
    <PageContainer title="Kalkulator LOS (Line of Sight) Anteny">
      <div className="grid gap-6 md:grid-cols-2 mb-6">
        <Card>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Częstotliwość</Label>
              <Select value={frequency} onValueChange={setFrequency}>
                <SelectTrigger>
                  <SelectValue placeholder="Wybierz częstotliwość" />
                </SelectTrigger>
                <SelectContent>
                  {FREQUENCIES.map((f) => (
                    <SelectItem key={f.value} value={f.value}>
                      {f.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="antennaHeight">Wysokość anteny (m)</Label>
                <Input
                  id="antennaHeight"
                  type="number"
                  step="0.1"
                  value={antennaHeight}
                  onChange={(e) => setAntennaHeight(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="targetDistance">Docelowy dystans (m)</Label>
                <Input
                  id="targetDistance"
                  type="number"
                  value={targetDistance}
                  onChange={(e) => setTargetDistance(e.target.value)}
                />
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-2">
                Najbliższa Przeszkoda
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="obstacleHeight">Wysokość (m)</Label>
                  <Input
                    id="obstacleHeight"
                    type="number"
                    step="0.1"
                    value={obstacleHeight}
                    onChange={(e) => setObstacleHeight(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="obstacleDistance">Odległość od anteny (m)</Label>
                  <Input
                    id="obstacleDistance"
                    type="number"
                    value={obstacleDistance}
                    onChange={(e) => setObstacleDistance(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-muted/50">
          <CardContent>
            {results ? (
              <div className="space-y-6">
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Minimalna Wysokość Lotu Drona (AGL)</Label>
                  <div className="text-4xl font-bold text-primary">
                    {results.droneAltitudeM.toFixed(0)} m
                  </div>
                </div>

                <div className="space-y-1">
                  <Label className="text-muted-foreground">Wymagany Kąt Anteny</Label>
                  <div className="text-2xl font-semibold">
                    {results.antennaAngleTotalDeg.toFixed(2)}°
                  </div>
                </div>

                <Separator />

                <Collapsible>
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" className="flex w-full justify-between p-0 hover:bg-transparent group h-auto">
                      <span className="text-sm font-medium">Szczegóły</span>
                      <ChevronDown className="h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="grid grid-cols-2 gap-4 text-sm pt-4">
                      <div>
                        <span className="text-muted-foreground block">Horyzont radiowy:</span>
                        <span className="font-medium">{(results.horizonDistanceM / 1000).toFixed(2)} km</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block">Dystans Fresnela (dla obliczeń):</span>
                        <span className="font-medium">{(results.fresnelCheckDistanceM).toFixed(0)} m</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block">Promień Fresnela (60%):</span>
                        <span className="font-medium">{results.fresnelRadiusClearance.toFixed(2)} m</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block">Kąt do przeszkody:</span>
                        <span className="font-medium">{results.antennaAngleObstacleDeg.toFixed(2)}°</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block">Kąt Fresnela:</span>
                        <span className="font-medium">{results.fresnelAngleDeg.toFixed(2)}°</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block">Korekta Horyzontu:</span>
                        <span className="font-medium">{results.earthCurvatureDropM.toFixed(2)} m</span>
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
                <ArrowRight className="h-8 w-8 mb-2 opacity-50" />
                <p>Wprowadź poprawne dane</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {graphData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Minimalna wysokość lotu w zależności od dystansu</CardTitle>
          </CardHeader>
          <CardContent>
            <SimpleLineChart data={graphData} />
          </CardContent>
        </Card>
      )}
    </PageContainer>
  )
}
