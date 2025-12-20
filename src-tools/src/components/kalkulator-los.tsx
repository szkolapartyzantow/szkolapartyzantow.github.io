import * as React from "react";
import { ArrowRight, ChevronDown, Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { DropdownSelect } from "./dropdown-select";
import { PageContainer } from "./page-container";

enum FREQUENCIES {
  F_440_MHZ = "0.44",
  F_868_MHZ = "0.868",
  F_915_MHZ = "0.915",
  F_1_3_GHZ = "1.3",
  F_2_4_GHZ = "2.4",
  F_5_8_GHZ = "5.8",
}

export const FREQUENCIES_DROPDOWN_MAP = [
  { value: FREQUENCIES.F_440_MHZ, label: "440 MHz" },
  { value: FREQUENCIES.F_868_MHZ, label: "868 MHz" },
  { value: FREQUENCIES.F_915_MHZ, label: "915 MHz" },
  { value: FREQUENCIES.F_1_3_GHZ, label: "1.3 GHz" },
  { value: FREQUENCIES.F_2_4_GHZ, label: "2.4 GHz" },
  { value: FREQUENCIES.F_5_8_GHZ, label: "5.8 GHz" },
];

function computeLOS(
  frequencyGhz: number,
  antennaHeightM: number,
  obstacleHeightM: number,
  obstacleDistanceM: number,
  targetDistanceM: number
) {
  if (
    isNaN(frequencyGhz) ||
    isNaN(antennaHeightM) ||
    isNaN(obstacleHeightM) ||
    isNaN(obstacleDistanceM) ||
    isNaN(targetDistanceM)
  ) {
    return null;
  }

  const earthRadiusM = 6371000;

  // 1. Horizon Distance (from Antenna)
  const horizonDistanceM = Math.sqrt(2 * earthRadiusM * antennaHeightM);

  // 2. Obstacle Calculation
  const obstacleHeightAboveAntennaM = obstacleHeightM - antennaHeightM;
  let antennaAngleObstacleRad = Math.atan(obstacleHeightAboveAntennaM / obstacleDistanceM);

  // Ignore obstacle if below horizon/line
  const isObstacleReallyObstacle = antennaAngleObstacleRad > 0;
  if (!isObstacleReallyObstacle) {
    antennaAngleObstacleRad = 0;
  }

  const antennaAngleObstacleDeg = antennaAngleObstacleRad * (180 / Math.PI);

  // 3. Fresnel Zone Calculation
  let fresnelCheckDistanceM = obstacleDistanceM;

  if (!isObstacleReallyObstacle) {
    // No obstacle: use midpoint or horizon limit
    const midpointDistanceM = targetDistanceM / 2;
    fresnelCheckDistanceM = Math.min(midpointDistanceM, horizonDistanceM);
  }

  // Radius calc
  const fresnelCheckDistanceKm = fresnelCheckDistanceM / 1000;
  const fresnelRadiusFull = 17.32 * Math.sqrt(fresnelCheckDistanceKm / (4 * frequencyGhz));
  const fresnelRadiusClearance = fresnelRadiusFull * 0.6;

  // 4. Fresnel Angle
  const fresnelAngleRad = Math.atan(fresnelRadiusClearance / fresnelCheckDistanceM);
  const fresnelAngleDeg = fresnelAngleRad * (180 / Math.PI);

  // 5. Total Angle
  const antennaAngleTotalRad = antennaAngleObstacleRad + fresnelAngleRad;
  const antennaAngleTotalDeg = antennaAngleTotalRad * (180 / Math.PI);

  // 6. Flat Earth Altitude at Target
  const flatEarthAltitudeM = targetDistanceM * Math.tan(antennaAngleTotalRad);

  // 7. Earth Curvature Drop
  let earthCurvatureDropM = 0;

  if (isObstacleReallyObstacle) {
    // Drop past horizon
    if (targetDistanceM > horizonDistanceM) {
      const distancePastHorizonM = targetDistanceM - horizonDistanceM;
      earthCurvatureDropM = (distancePastHorizonM * distancePastHorizonM) / (2 * earthRadiusM);
    }
  } else {
    // Full Earth Drop
    earthCurvatureDropM = (targetDistanceM * targetDistanceM) / (2 * earthRadiusM);
  }

  // 8. Final Altitude
  const droneAltitudeM = flatEarthAltitudeM + earthCurvatureDropM;

  return {
    horizonDistanceM,
    antennaAngleObstacleDeg,
    fresnelRadiusClearance,
    fresnelAngleDeg,
    antennaAngleTotalDeg,
    flatEarthAltitudeM,
    earthCurvatureDropM,
    droneAltitudeM,
    fresnelCheckDistanceM,
  };
}

export function KalkulatorLOS() {
  const [frequency, setFrequency] = React.useState<string>(FREQUENCIES.F_915_MHZ);
  const [antennaHeight, setAntennaHeight] = React.useState<string>("1");
  const [targetDistance, setTargetDistance] = React.useState<string>("3000");

  const [obstacles, setObstacles] = React.useState<
    { id: number; height: string; distance: string }[]
  >([{ id: 1, height: "8", distance: "50" }]);

  const addObstacle = () => {
    setObstacles((prev) => [
      ...prev,
      { id: Math.max(0, ...prev.map((o) => o.id)) + 1, height: "0", distance: "0" },
    ]);
  };

  const removeObstacle = (id: number) => {
    if (obstacles.length <= 1) return;
    setObstacles((prev) => prev.filter((o) => o.id !== id));
  };

  const updateObstacle = (id: number, field: "height" | "distance", value: string) => {
    setObstacles((prev) => prev.map((o) => (o.id === id ? { ...o, [field]: value } : o)));
  };

  const calculateResult = () => {
    const f = parseFloat(frequency);
    const h_a = parseFloat(antennaHeight);
    const d_t = parseFloat(targetDistance);

    if (isNaN(f) || isNaN(h_a) || isNaN(d_t)) return null;

    let worstResult: ReturnType<typeof computeLOS> | null = null;

    for (const obs of obstacles) {
      const h_o = parseFloat(obs.height);
      const d_o = parseFloat(obs.distance);

      const res = computeLOS(f, h_a, h_o, d_o, d_t);

      if (res) {
        if (!worstResult || res.droneAltitudeM > worstResult.droneAltitudeM) {
          worstResult = res;
        }
      }
    }

    return worstResult;
  };

  const results = calculateResult();

  return (
    <PageContainer title="Kalkulator LOS (Line of Sight) Anteny">
      <div className="grid gap-6 md:grid-cols-2 mb-6">
        <Card>
          <CardContent className="space-y-4">
            <DropdownSelect
              label="Częstotliwość"
              items={FREQUENCIES_DROPDOWN_MAP}
              value={frequency}
              onValueChange={setFrequency}
              placeholder="Wybierz częstotliwość"
              fullWidth={false}
            />

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
                {obstacles.length > 1 ? "Przeszkody" : "Najbliższa Przeszkoda"}
              </div>

              <div className="space-y-4">
                {obstacles.map((obstacle, index) => (
                  <div key={obstacle.id} className="grid grid-cols-2 gap-4 relative group">
                    <div className="space-y-2">
                      <Label htmlFor={`obs-h-${obstacle.id}`}>Wysokość (m)</Label>
                      <Input
                        id={`obs-h-${obstacle.id}`}
                        type="number"
                        step="0.1"
                        value={obstacle.height}
                        onChange={(e) => updateObstacle(obstacle.id, "height", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`obs-d-${obstacle.id}`}>Odległość od anteny (m)</Label>
                      <div className="flex gap-2">
                        <Input
                          id={`obs-d-${obstacle.id}`}
                          type="number"
                          value={obstacle.distance}
                          onChange={(e) => updateObstacle(obstacle.id, "distance", e.target.value)}
                        />
                        {obstacles.length > 1 && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="shrink-0 text-muted-foreground hover:text-destructive"
                            onClick={() => removeObstacle(obstacle.id)}
                            title="Usuń przeszkodę"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Button
                variant="outline"
                size="sm"
                className="w-full mt-2 border-dashed"
                onClick={addObstacle}
              >
                <Plus className="mr-2 h-4 w-4" /> Dodaj przeszkodę
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-muted/50">
          <CardContent>
            {results ? (
              <div className="space-y-6">
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Minimalna wysokość lotu</Label>
                  <div className="text-4xl font-bold text-primary">
                    {results.droneAltitudeM.toFixed(0)} m
                  </div>
                </div>

                <div className="space-y-1">
                  <Label className="text-muted-foreground">Wymagany kat odchylenia anteny</Label>
                  <div className="text-2xl font-semibold">
                    {results.antennaAngleTotalDeg.toFixed(2)}°
                  </div>
                </div>

                <Separator />

                <Collapsible>
                  <CollapsibleTrigger asChild>
                    <Button
                      variant="ghost"
                      className="flex w-full justify-between p-0 hover:bg-transparent group h-auto"
                    >
                      <span className="text-sm font-medium">Szczegóły</span>
                      <ChevronDown className="h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="grid grid-cols-2 gap-4 text-sm pt-4">
                      <div>
                        <span className="text-muted-foreground block">Horyzont radiowy:</span>
                        <span className="font-medium">
                          {(results.horizonDistanceM / 1000).toFixed(2)} km
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block">
                          Dystans Fresnela (dla obliczeń):
                        </span>
                        <span className="font-medium">
                          {results.fresnelCheckDistanceM.toFixed(0)} m
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block">Promień Fresnela (60%):</span>
                        <span className="font-medium">
                          {results.fresnelRadiusClearance.toFixed(2)} m
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block">Kąt do przeszkody:</span>
                        <span className="font-medium">
                          {results.antennaAngleObstacleDeg.toFixed(2)}°
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block">Kąt Fresnela:</span>
                        <span className="font-medium">{results.fresnelAngleDeg.toFixed(2)}°</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block">Korekta Horyzontu:</span>
                        <span className="font-medium">
                          {results.earthCurvatureDropM.toFixed(2)} m
                        </span>
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
    </PageContainer>
  );
}
