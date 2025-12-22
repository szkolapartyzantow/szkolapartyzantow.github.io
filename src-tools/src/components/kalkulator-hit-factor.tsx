import * as React from "react";
import { Minus, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { DropdownSelect } from "./dropdown-select";
import { PageContainer } from "./page-container";
import { getToolByUrl } from "@/lib/tools";
import { ToolHelp } from "./tool-help";

enum POWER_FACTOR {
  MINOR = "Minor",
  MAJOR = "Major",
}

const POWER_FACTOR_OPTIONS = [
  { value: POWER_FACTOR.MINOR, label: POWER_FACTOR.MINOR },
  { value: POWER_FACTOR.MAJOR, label: POWER_FACTOR.MAJOR },
];

const CounterControl = ({
  value,
  onChange,
}: {
  value: number;
  onChange: (val: number) => void;
}) => (
  <div className="flex items-center md:space-x-0 space-x-2">
    <Button
      variant="outline"
      size="icon"
      onClick={() => onChange(Math.max(0, value - 1))}
      className="h-9 w-9 shrink-0"
    >
      <Minus className="h-4 w-4" />
    </Button>
    <Input
      type="number"
      min="0"
      value={value}
      onChange={(e) => onChange(Math.max(0, parseInt(e.target.value) || 0))}
      className="text-center w-20 h-9 no-spin-button"
    />
    <Button
      variant="outline"
      size="icon"
      onClick={() => onChange(value + 1)}
      className="h-9 w-9 shrink-0"
    >
      <Plus className="h-4 w-4" />
    </Button>
  </div>
);

export function KalkulatorHitFactor() {
  const toolInfo = getToolByUrl("#kalkulator-hit-factor");

  const [powerFactor, setPowerFactor] = React.useState<string>(POWER_FACTOR.MINOR);
  const [time, setTime] = React.useState<string>("0.00");
  const [hitsA, setHitsA] = React.useState(0);
  const [hitsC, setHitsC] = React.useState(0);
  const [hitsD, setHitsD] = React.useState(0);
  const [misses, setMisses] = React.useState(0);
  const [noShoots, setNoShoots] = React.useState(0);
  const [procedurals, setProcedurals] = React.useState(0);

  const calculateHitFactor = () => {
    const timeValue = parseFloat(time) || 0;

    // Points calculation based on Power Factor
    // A zone is always 5
    // C zone: Minor = 3, Major = 4
    // D zone: Minor = 1, Major = 2
    const pointsA = 5;
    const pointsC = powerFactor === POWER_FACTOR.MAJOR ? 4 : 3;
    const pointsD = powerFactor === POWER_FACTOR.MAJOR ? 2 : 1;

    // Penalties (Miss, No Shoot, Procedural) are 10 points each
    const penaltyValue = 10;

    const totalPoints = hitsA * pointsA + hitsC * pointsC + hitsD * pointsD;

    const totalPenalties =
      misses * penaltyValue + noShoots * penaltyValue + procedurals * penaltyValue;

    // Stage score cannot be negative
    const stageScore = Math.max(0, totalPoints - totalPenalties);

    if (timeValue <= 0) return 0;

    return stageScore / timeValue;
  };

  const hitFactor = calculateHitFactor();

  return (
    <PageContainer title={toolInfo?.title || "Kalkulator Hit Factor"}>
      <div className="grid gap-6 md:grid-cols-2 mb-6">
        <Card>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <DropdownSelect
                label="Power Factor"
                items={POWER_FACTOR_OPTIONS}
                value={powerFactor}
                onValueChange={setPowerFactor}
                fullWidth={true}
              />
              <div className="space-y-2">
                <Label htmlFor="time">Czas (s)</Label>
                <Input
                  id="time"
                  type="number"
                  step="0.01"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  placeholder="0.00"
                  className="no-spin-button"
                />
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="flex flex-row items-center justify-between sm:flex-col sm:justify-center gap-2">
                <Label className="text-lg font-semibold">A</Label>
                <CounterControl value={hitsA} onChange={setHitsA} />
              </div>
              <div className="flex flex-row items-center justify-between sm:flex-col sm:justify-center gap-2">
                <Label className="text-lg font-semibold">C</Label>
                <CounterControl value={hitsC} onChange={setHitsC} />
              </div>
              <div className="flex flex-row items-center justify-between sm:flex-col sm:justify-center gap-2">
                <Label className="text-lg font-semibold">D</Label>
                <CounterControl value={hitsD} onChange={setHitsD} />
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-base">Miss</Label>
                <CounterControl value={misses} onChange={setMisses} />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-base">No Shoot</Label>
                <CounterControl value={noShoots} onChange={setNoShoots} />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-base">Procedural</Label>
                <CounterControl value={procedurals} onChange={setProcedurals} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-muted/50">
          <CardContent className="flex flex-col items-center justify-center h-full md:min-h-[300px] space-y-4">
            <div className="space-y-2 text-center">
              <Label className="text-muted-foreground text-xl">Hit Factor</Label>
              <div className="text-7xl font-bold text-primary">{hitFactor.toFixed(4)}</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
