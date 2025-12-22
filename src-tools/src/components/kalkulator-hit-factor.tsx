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

const POWER_FACTOR_OPTIONS = [
  { value: "minor", label: "Minor" },
  { value: "major", label: "Major" },
];

const CounterControl = ({
  value,
  onChange,
}: {
  value: number;
  onChange: (val: number) => void;
}) => (
  <div className="flex items-center space-x-2">
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

  const [powerFactor, setPowerFactor] = React.useState<string>("minor");
  const [time, setTime] = React.useState<string>("0.00");
  const [hitsA, setHitsA] = React.useState(0);
  const [hitsC, setHitsC] = React.useState(0);
  const [hitsD, setHitsD] = React.useState(0);
  const [misses, setMisses] = React.useState(0);
  const [noShoots, setNoShoots] = React.useState(0);
  const [procedurals, setProcedurals] = React.useState(0);

  // Placeholder logic - result is always 0.0000 for now as requested "without logic"
  const hitFactor = 0.0;

  return (
    <PageContainer title={toolInfo?.title || "Kalkulator Hit Factor"}>
      <ToolHelp>
        <p>Hit Factor to stosunek zdobytych punktów do czasu przebiegu.</p>
      </ToolHelp>
      <div className="grid gap-6 md:grid-cols-2 mb-6">
        <Card>
          <CardContent className="space-y-6 pt-6">
            <div className="grid grid-cols-2 gap-4">
              <DropdownSelect
                label="Power Factor"
                items={POWER_FACTOR_OPTIONS}
                value={powerFactor}
                onValueChange={setPowerFactor}
                fullWidth={true}
              />
              <div className="space-y-2">
                <Label htmlFor="time">Time (s)</Label>
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

            <div className="flex justify-between px-2">
              <div className="flex flex-col items-center gap-2">
                <Label className="text-lg font-semibold">A</Label>
                <CounterControl value={hitsA} onChange={setHitsA} />
              </div>
              <div className="flex flex-col items-center gap-2">
                <Label className="text-lg font-semibold">C</Label>
                <CounterControl value={hitsC} onChange={setHitsC} />
              </div>
              <div className="flex flex-col items-center gap-2">
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
          <CardContent className="flex flex-col items-center justify-center h-full min-h-[300px] space-y-4">
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
