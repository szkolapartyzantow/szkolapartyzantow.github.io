import * as React from "react";
import { PageContainer } from "./page-container";
import { Card, CardContent } from "./ui/card";
import { DropdownSelect } from "./dropdown-select";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";

enum AUX {
  AUX1 = "0",
  AUX2 = "1",
  AUX3 = "2",
  AUX4 = "3",
  AUX5 = "4",
  AUX6 = "5",
  AUX7 = "6",
  AUX8 = "7",
}

enum SWITCH_TYPE {
  POS2,
  POS3,
  POS6,
}

enum UART {
  UART1,
  UART2,
  UART3,
  UART4,
  UART5,
  UART6,
}

enum PROTOCOL {
  SMART_AUDIO,
  TRAMP,
}

enum BAND {
  A,
  B,
  E,
  F,
  R,
  BAND6,
  BAND7,
  BAND8,
}

enum CHANNEL {
  CHANNEL_1,
  CHANNEL_2,
  CHANNEL_3,
  CHANNEL_4,
  CHANNEL_5,
  CHANNEL_6,
  CHANNEL_7,
  CHANNEL_8,
}

const VTX_CONFIG_TEMPLATE = `serial 0 2048 115200 57600 0 115200

# Tabela VTX
vtxtable bands 6
vtxtable channels 8
vtxtable band 1 BAND_A   A CUSTOM  5865 5845 5825 5805 5785 5765 5745 5725
vtxtable band 2 BAND_B   B CUSTOM  5733 5752 5771 5790 5809 5828 5847 5866
vtxtable band 3 BAND_E   E CUSTOM  5705 5685 5665 5645 5885 5905 5925 5945
vtxtable band 4 AIRWAVE  F CUSTOM  5740 5760 5780 5800 5820 5840 5860 5880
vtxtable band 5 RACEBAND R CUSTOM  5658 5695 5732 5769 5806 5843 5880 5917
vtxtable band 6 LOWRACE  L CUSTOM  5362 5399 5436 5473 5510 5547 5584 5621
vtxtable powerlevels 4
vtxtable powervalues 14 27 30 34
vtxtable powerlabels 25 500 1 2.5

# Ustawienia przycisku
vtx 0 2 0 0 1 900 1100
vtx 1 2 0 0 3 1400 1600
vtx 2 2 0 0 4 1900 2100

# Domyślne pasmo/kanał
set vtx_band = 1
set vtx_channel = 1

save
`;

const VTX_TEMPLATES = [
  { value: 0, label: "TBS Unify Pro32 HV" },
  { value: 1, label: "TBS Unify Pro32 HV copy" },
];

const AUX_DROPDOWN_MAP = [
  { value: AUX.AUX1, label: "AUX1" },
  { value: AUX.AUX2, label: "AUX2" },
  { value: AUX.AUX3, label: "AUX3" },
  { value: AUX.AUX4, label: "AUX4" },
  { value: AUX.AUX5, label: "AUX5" },
  { value: AUX.AUX6, label: "AUX6" },
  { value: AUX.AUX7, label: "AUX7" },
  { value: AUX.AUX8, label: "AUX8" },
];

const SWITCH_DROPDOWN_MAP = [
  { value: SWITCH_TYPE.POS2, label: "2POS" },
  { value: SWITCH_TYPE.POS3, label: "3POS" },
  { value: SWITCH_TYPE.POS6, label: "6POS" },
];

const VTX_PROTOCOL_DROPDOWN_MAP = [
  { value: PROTOCOL.SMART_AUDIO, label: "SmartAudio" },
  { value: PROTOCOL.TRAMP, label: "Tramp" },
];

const VTX_UART_DROPDOWN_MAP = [
  { value: UART.UART1, label: "UART 1" },
  { value: UART.UART2, label: "UART 2" },
  { value: UART.UART3, label: "UART 3" },
  { value: UART.UART4, label: "UART 4" },
  { value: UART.UART5, label: "UART 5" },
  { value: UART.UART6, label: "UART 6" },
];

const VTX_BAND_DROPDOWN_MAP = [
  { value: BAND.A, label: "A" },
  { value: BAND.B, label: "B" },
  { value: BAND.E, label: "E" },
  { value: BAND.F, label: "F" },
  { value: BAND.R, label: "R" },
  { value: BAND.BAND6, label: "Pasmo 6 z tabeli VTX" },
  { value: BAND.BAND7, label: "Pasmo 7 z tabeli VTX" },
  { value: BAND.BAND8, label: "Pasmo 8 z tabeli VTX" },
];

const VTX_CHANNEL_DROPDOWN_MAP = [
  { value: CHANNEL.CHANNEL_1, label: "Channel 1" },
  { value: CHANNEL.CHANNEL_2, label: "Channel 2" },
  { value: CHANNEL.CHANNEL_3, label: "Channel 3" },
  { value: CHANNEL.CHANNEL_4, label: "Channel 4" },
  { value: CHANNEL.CHANNEL_5, label: "Channel 5" },
  { value: CHANNEL.CHANNEL_6, label: "Channel 6" },
  { value: CHANNEL.CHANNEL_7, label: "Channel 7" },
  { value: CHANNEL.CHANNEL_8, label: "Channel 8" },
];

export function GeneratorUstawienVTX() {
  const [vtx, setVtx] = React.useState<Number>(0);
  const [vtxUart, setVtxUart] = React.useState<Number>(UART.UART1);
  const [vtxProtocol, setVtxProtocol] = React.useState<Number>(PROTOCOL.SMART_AUDIO);
  const [vtxPowerAuxChannel, setVtxPowerAuxChannel] = React.useState<string>(AUX.AUX2);
  const [vtxPowerSwitchType, setVtxPowerSwitchType] = React.useState<Number>(SWITCH_TYPE.POS3);
  const [vtxDefaultBand, setVtxDefaultBand] = React.useState<Number>(BAND.R);
  const [vtxDefaultChannel, setVtxDefaultChannel] = React.useState<Number>(CHANNEL.CHANNEL_1);

  const [includeVtxTable, setIncludeVtxTable] = React.useState<boolean>(true);
  const [configText, setConfigText] = React.useState<string>(VTX_CONFIG_TEMPLATE);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(configText);
  };

  return (
    <PageContainer title="Generator ustawień VTX">
      <div className="grid gap-6 md:grid-cols-2 mb-6">
        <Card>
          <CardContent className="space-y-4">
            <DropdownSelect
              label="VTX"
              items={VTX_TEMPLATES}
              value={vtx}
              onValueChange={setVtx}
              placeholder="Wybierz VTX"
              searchable
            />
            <div className="grid grid-cols-2 gap-4">
              <DropdownSelect
                label="UART VTX"
                items={VTX_UART_DROPDOWN_MAP}
                value={vtxUart}
                onValueChange={setVtxUart}
                placeholder="Wybierz UART VTX"
              />
              <DropdownSelect
                label="Protokół VTX"
                items={VTX_PROTOCOL_DROPDOWN_MAP}
                value={vtxProtocol}
                onValueChange={setVtxProtocol}
                placeholder="Wybierz Protokół VTX"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <DropdownSelect
                label="AUX do kontroli mocy VTX"
                items={AUX_DROPDOWN_MAP}
                value={vtxPowerAuxChannel}
                onValueChange={setVtxPowerAuxChannel}
                placeholder="Wybierz AUX"
              />
              <DropdownSelect
                label="Typ przełącznika"
                items={SWITCH_DROPDOWN_MAP}
                value={vtxPowerSwitchType}
                onValueChange={setVtxPowerSwitchType}
                placeholder="Wybierz typ przelacznika"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <DropdownSelect
                label="Domyślne pasmo"
                items={VTX_BAND_DROPDOWN_MAP}
                value={vtxDefaultBand}
                onValueChange={setVtxDefaultBand}
                placeholder="Wybierz domyślne pasmo"
              />
              <DropdownSelect
                label="Domyślny kanał"
                items={VTX_CHANNEL_DROPDOWN_MAP}
                value={vtxDefaultChannel}
                onValueChange={setVtxDefaultChannel}
                placeholder="Wybierz domyślny kanal"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-muted/50">
          <CardContent className="space-y-4 pt-6">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="include-vtx-table"
                checked={includeVtxTable}
                onChange={(e) => setIncludeVtxTable(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <Label htmlFor="include-vtx-table">Uwzględnij tabelę VTX</Label>
            </div>

            <Textarea
              value={configText}
              onChange={(e) => setConfigText(e.target.value)}
              className="font-mono text-xs whitespace-pre overflow-x-auto"
              rows={configText.split("\n").length + 1}
            />

            <Button onClick={copyToClipboard} className="w-full">
              Kopiuj
            </Button>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
