import * as React from "react";
import { PageContainer } from "./page-container";
import { Card, CardContent } from "./ui/card";
import { DropdownSelect } from "./dropdown-select";
import type { SelectItemData, SelectItemGroup } from "./dropdown-select";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { getToolByUrl } from "@/lib/tools";
import { ToolHelp } from "./tool-help";

enum AUX {
  AUX1,
  AUX2,
  AUX3,
  AUX4,
  AUX5,
  AUX6,
  AUX7,
  AUX8,
}

enum SWITCH_TYPE {
  POS2,
  POS3,
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
  SMART_AUDIO = "2048",
  TRAMP = "8192",
}

enum CHANNEL {
  CHANNEL_1 = 1,
  CHANNEL_2,
  CHANNEL_3,
  CHANNEL_4,
  CHANNEL_5,
  CHANNEL_6,
  CHANNEL_7,
  CHANNEL_8,
}

interface PowerLevel {
  index: number;
  label: string;
  value: string;
}

interface VtxData {
  id: string;
  name: string;
  manufacturer: string;
  protocol: PROTOCOL;
  port: UART;
  power_1: number;
  power_2: number;
  power_3: number;
  warning: number;
  table: string;
  switch_type: SWITCH_TYPE;
  vtx_power_aux: AUX;
  default_band: number;
  default_channel: CHANNEL;
  power_levels: PowerLevel[];
}

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

const VTX_CHANNEL_DROPDOWN_MAP = [
  { value: CHANNEL.CHANNEL_1, label: CHANNEL.CHANNEL_1 },
  { value: CHANNEL.CHANNEL_2, label: CHANNEL.CHANNEL_2 },
  { value: CHANNEL.CHANNEL_3, label: CHANNEL.CHANNEL_3 },
  { value: CHANNEL.CHANNEL_4, label: CHANNEL.CHANNEL_4 },
  { value: CHANNEL.CHANNEL_5, label: CHANNEL.CHANNEL_5 },
  { value: CHANNEL.CHANNEL_6, label: CHANNEL.CHANNEL_6 },
  { value: CHANNEL.CHANNEL_7, label: CHANNEL.CHANNEL_7 },
  { value: CHANNEL.CHANNEL_8, label: CHANNEL.CHANNEL_8 },
];

const CUSTOM_VTX_ID = "custom";

function getPowerLevelsFromTable(table: string): PowerLevel[] {
  const levels: PowerLevel[] = [];
  const lines = table.split("\n");
  let labels: string[] = [];
  let values: string[] = [];

  for (const line of lines) {
    const parts = line.trim().split(/\s+/);
    if (parts.length < 3) continue;

    if (parts[0] === "vtxtable" && parts[1] === "powerlabels") {
      labels = parts.slice(2);
    } else if (parts[0] === "vtxtable" && parts[1] === "powervalues") {
      values = parts.slice(2);
    }
  }

  // Combine labels and values
  for (let i = 0; i < labels.length; i++) {
    levels.push({
      index: i + 1,
      label: labels[i] || "",
      value: values[i] || "",
    });
  }

  return levels;
}

function getBandsFromTable(table: string): { value: number; label: string }[] {
  const bands: { value: number; label: string }[] = [];
  const lines = table.split("\n");
  for (const line of lines) {
    const parts = line.trim().split(/\s+/);
    if (parts[0] === "vtxtable" && parts[1] === "band" && parts.length >= 5) {
      const num = parseInt(parts[2]!, 10);
      const label = parts[4]!; // using the letter/short label
      if (!isNaN(num)) {
        bands.push({ value: num, label: label });
      }
    }
  }
  return bands;
}

function parseCSV(text: string): VtxData[] {
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentField = "";
  let inQuote = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (inQuote) {
      if (char === '"' && nextChar === '"') {
        currentField += '"';
        i++;
      } else if (char === '"') {
        inQuote = false;
      } else {
        currentField += char;
      }
    } else {
      if (char === '"') {
        inQuote = true;
      } else if (char === ",") {
        currentRow.push(currentField);
        currentField = "";
      } else if (char === "\n" || char === "\r") {
        if (char === "\r" && nextChar === "\n") i++;
        if (currentRow.length > 0 || currentField.length > 0) {
          currentRow.push(currentField);
          rows.push(currentRow);
        }
        currentRow = [];
        currentField = "";
      } else {
        currentField += char;
      }
    }
  }
  if (currentRow.length > 0 || currentField.length > 0) {
    currentRow.push(currentField);
    rows.push(currentRow);
  }

  // Remove header
  const dataRows = rows.slice(1);

  return dataRows
    .map((row) => {
      if (row.length < 10) return null;

      let port = UART.UART1;
      const portMatch = row[4]?.match(/UART\s*(\d+)/i);
      if (portMatch) {
        const portNum = parseInt(portMatch[1]!, 10);
        if (portNum >= 1 && portNum <= 6) {
          port = (portNum - 1) as UART;
        }
      }

      const protocolStr = row[3];
      const protocolEnum = protocolStr?.toLowerCase().includes("smartaudio")
        ? PROTOCOL.SMART_AUDIO
        : PROTOCOL.TRAMP;

      const tableData = row[9] || "";
      const bands = getBandsFromTable(tableData);
      const powerLevels = getPowerLevelsFromTable(tableData);

      // Default to R (5) if available, otherwise first available band, or 1 as fallback
      const defaultBand = bands.find((b) => b.value === 5)
        ? 5
        : bands.length > 0
          ? bands[0]!.value
          : 1;

      return {
        id: row[0],
        name: row[1],
        manufacturer: row[2],
        protocol: protocolEnum,
        port: port,
        power_1: parseInt(row[5]!, 10),
        power_2: parseInt(row[6]!, 10),
        power_3: parseInt(row[7]!, 10),
        warning: parseInt(row[8]!, 10),
        table: tableData,
        switch_type: SWITCH_TYPE.POS3,
        vtx_power_aux: AUX.AUX2,
        default_band: defaultBand,
        default_channel: CHANNEL.CHANNEL_1,
        power_levels: powerLevels,
      };
    })
    .filter((x): x is VtxData => x !== null);
}

function generateConfig(vtxData: VtxData): string {
  let switch_settings = "";
  if (vtxData.switch_type === SWITCH_TYPE.POS3) {
    switch_settings = `vtx 0 ${vtxData.vtx_power_aux} 0 0 ${vtxData.power_1} 900 1100
vtx 1 ${vtxData.vtx_power_aux} 0 0 ${vtxData.power_2} 1400 1600
vtx 2 ${vtxData.vtx_power_aux} 0 0 ${vtxData.power_3} 1900 2100`;
  } else {
    switch_settings = `vtx 0 ${vtxData.vtx_power_aux} 0 0 ${vtxData.power_1} 900 1400
vtx 1 ${vtxData.vtx_power_aux} 0 0 ${vtxData.power_3} 1600 2100`;
  }

  return `serial ${vtxData.port} ${vtxData.protocol} 115200 57600 0 115200

# Tabela VTX
${vtxData.table}

# Domyślne pasmo/kanał
set vtx_band = ${vtxData.default_band}
set vtx_channel = ${vtxData.default_channel}

# Ustawienia przełącznika
${switch_settings}

save
`;
}

export function GeneratorUstawienVTX() {
  const [vtxDataMap, setVtxDataMap] = React.useState<Record<string, VtxData>>({});
  const [vtxOptions, setVtxOptions] = React.useState<(SelectItemData | SelectItemGroup)[]>([]);
  const [currentVtx, setCurrentVtx] = React.useState<VtxData | null>(null);
  const [configText, setConfigText] = React.useState<string>("");
  const [isErrorOpen, setIsErrorOpen] = React.useState(false);

  const vtxBandOptions = React.useMemo(() => {
    if (!currentVtx) return [];
    return getBandsFromTable(currentVtx.table);
  }, [currentVtx]);

  const vtxPowerOptions = React.useMemo(() => {
    if (!currentVtx) return [];
    return currentVtx.power_levels.map((level) => ({
      value: level.index,
      label: level.label,
    }));
  }, [currentVtx]);

  React.useEffect(() => {
    fetch(
      "https://docs.google.com/spreadsheets/d/1pSce3OR-ZkvILul03hWvtaR-mHh861qv2u8pIxIHbWQ/export?format=csv"
    )
      .then((res) => res.text())
      .then((text) => {
        const data = parseCSV(text);
        const map: Record<string, VtxData> = {};
        for (const item of data) {
          map[item.id] = item;
        }

        const grouped: { [key: string]: VtxData[] } = {};
        for (const item of data) {
          const m = item.manufacturer || "Inne";
          if (!grouped[m]) {
            grouped[m] = [];
          }
          grouped[m]!.push(item);
        }

        const options: (SelectItemData | SelectItemGroup)[] = [
          { value: CUSTOM_VTX_ID, label: "Własna tabela VTX" },
        ];

        for (const manufacturer in grouped) {
          options.push({
            label: manufacturer,
            items: grouped[manufacturer]!.map((item) => ({
              value: item.id,
              label: item.name,
            })),
          });
        }

        setVtxDataMap(map);
        setVtxOptions(options);

        if (data.length > 0) {
          const first = data[0]!;
          setCurrentVtx(first);
          setConfigText(generateConfig(first));
        } else {
          // Fallback to custom
          handleVtxChange(CUSTOM_VTX_ID);
        }
      })
      .catch((err) => console.error("Error fetching VTX data:", err));
  }, []);

  // Update config whenever currentVtx changes
  React.useEffect(() => {
    if (currentVtx) {
      if (currentVtx.id === CUSTOM_VTX_ID) {
        const bands = getBandsFromTable(currentVtx.table);
        const levels = getPowerLevelsFromTable(currentVtx.table);
        if (bands.length === 0 || levels.length === 0) {
          setConfigText("");
          return;
        }
      }
      setConfigText(generateConfig(currentVtx));
    }
  }, [currentVtx]);

  const handleVtxChange = (val: string) => {
    if (val === CUSTOM_VTX_ID) {
      setCurrentVtx({
        id: CUSTOM_VTX_ID,
        name: "Własna tabela VTX",
        manufacturer: "Custom",
        protocol: PROTOCOL.SMART_AUDIO,
        port: UART.UART1,
        power_1: 0,
        power_2: 0,
        power_3: 0,
        warning: 0,
        table: "",
        switch_type: SWITCH_TYPE.POS3,
        vtx_power_aux: AUX.AUX1,
        default_band: 1,
        default_channel: CHANNEL.CHANNEL_1,
        power_levels: [],
      });
      return;
    }

    const selected = vtxDataMap[val];
    if (selected) {
      const bands = getBandsFromTable(selected.table);
      if (bands.length === 0) {
        setIsErrorOpen(true);
        return;
      }
      // When switching VTX, we reset to the defaults from that VTX
      setCurrentVtx(selected);
    }
  };

  const updateCurrentVtx = (updates: Partial<VtxData>) => {
    if (currentVtx) {
      setCurrentVtx({ ...currentVtx, ...updates });
    }
  };

  const handleCustomTableChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newTable = e.target.value;
    const powerLevels = getPowerLevelsFromTable(newTable);
    const bands = getBandsFromTable(newTable);

    if (!currentVtx) return;

    const updates: Partial<VtxData> = {
      table: newTable,
      power_levels: powerLevels,
    };

    if (powerLevels.length > 0) {
      updates.power_1 = powerLevels[0]?.index ?? 0;
      updates.power_2 = powerLevels[1]?.index ?? powerLevels[0]?.index ?? 0;
      updates.power_3 =
        powerLevels[2]?.index ?? powerLevels[1]?.index ?? powerLevels[0]?.index ?? 0;
    }

    if (bands.length > 0) {
      const defaultBand = bands.find((b) => b.value === 5) ? 5 : bands[0]!.value;
      updates.default_band = defaultBand;
    }

    updateCurrentVtx(updates);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(configText);
  };

  const toolInfo = getToolByUrl("#generator-ustawien-vtx");

  if (!currentVtx) {
    return (
      <PageContainer title={toolInfo?.title || "Generator ustawień VTX"}>
        <div className="flex justify-center p-8">Ładowanie danych...</div>
      </PageContainer>
    );
  }

  return (
    <PageContainer title={toolInfo?.title || "Generator ustawień VTX"}>
      <ToolHelp>
        <p>
          Narzędzie pozwala nam wygenerować komendy do Betaflight, które dla danej tabeli VTX
          skonfigurują zmianę mocy VTX za pomocą wybranego przełącznika.
        </p>
        <br />
        <p>
          Jeśli Twojego VTX nie ma na liście, możesz wybrać opcję "Własna tabela VTX" i wkleić
          ręcznie tabelę dla Twojego nadajnika. Jeśli się z nami skontaktujesz (najlepiej przez
          Instagram), dodamy ten VTX do naszej bazy.
        </p>
        <br />
        <p>
          Po wygenerowaniu komend naciśnij przycisk "Kopiuj", aby skopiować je do schowka, i wklej
          je do CLI w Betaflight, aby je zastosować.
        </p>
        <br />
        <ul className="list-disc">
          <li>
            <b>UART</b> - UART do którego VTX jest podłączony.
          </li>
          <li>
            <b>Protokół</b> - protokół którego VTX używa do komunikacji.
          </li>
          <li>
            <b>Domyślne pasmo/kanał</b> - kanał i pasmo które zostanie ustawione jako domyślne -
            będzie aktywne po włączeniu drona.
          </li>
          <li>
            <b>AUX do kontroli mocy VTX</b> - numer AUX przełącznika, którego chcesz użyć do zmiany
            mocy VTX. Do sprawdzenia w zakładce Receiver (Odbiornik) w Betaflight.
          </li>
          <li>
            <b>Typ przełącznika</b> - wybierz czy Twój przełącznik jest 3 czy 2 pozycyjny.
          </li>
          <li>
            <b>Moc 1/2/3</b> - ustawienia mocy. Moc 1 z zasady powinna być najniższa i odpowiada
            górnemu położeniu przełącznika.
          </li>
        </ul>
      </ToolHelp>

      <div className="grid gap-6 md:grid-cols-2 mb-6">
        <Card>
          <CardContent className="space-y-4">
            <DropdownSelect
              label="VTX"
              items={vtxOptions}
              value={currentVtx.id}
              onValueChange={handleVtxChange}
              placeholder="Wybierz VTX"
              searchable
            />

            {currentVtx.id === CUSTOM_VTX_ID && (
              <div className="space-y-2">
                <Label>Wklej tabelę VTX poniżej:</Label>
                {currentVtx.table.length > 0 &&
                  (getBandsFromTable(currentVtx.table).length === 0 ||
                    getPowerLevelsFromTable(currentVtx.table).length === 0) && (
                    <Label className="text-red-500 block">Błąd parsowania tabeli VTX!</Label>
                  )}
                <Textarea
                  value={currentVtx.table}
                  onChange={handleCustomTableChange}
                  className="font-mono text-xs whitespace-pre overflow-x-auto min-h-[150px]"
                  placeholder={`vtxtable bands 6
vtxtable channels 8
vtxtable band 1 BOSCAM_A A FACTORY 5865 5845 5825 5805 5786 5765 5745 5725
vtxtable band 2 BOSCAM_B B FACTORY 5733 5752 5771 5790 5809 5828 5847 5866
...
vtxtable powerlevels 5
vtxtable powerlabels 25 100 200 400 600
vtxtable powervalues 14 20 23 26 28`}
                  rows={11}
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <DropdownSelect
                label="UART"
                items={VTX_UART_DROPDOWN_MAP}
                value={currentVtx.port}
                onValueChange={(val) => updateCurrentVtx({ port: val as UART })}
                placeholder="Wybierz UART VTX"
              />
              <DropdownSelect
                label="Protokół"
                items={VTX_PROTOCOL_DROPDOWN_MAP}
                value={currentVtx.protocol}
                onValueChange={(val) => updateCurrentVtx({ protocol: val as PROTOCOL })}
                placeholder="Wybierz Protokół VTX"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <DropdownSelect
                label="Domyślne pasmo"
                items={vtxBandOptions}
                value={currentVtx.default_band}
                onValueChange={(val) => updateCurrentVtx({ default_band: Number(val) })}
                placeholder="Wybierz domyślne pasmo"
              />
              <DropdownSelect
                label="Domyślny kanał"
                items={VTX_CHANNEL_DROPDOWN_MAP}
                value={currentVtx.default_channel}
                onValueChange={(val) => updateCurrentVtx({ default_channel: val as CHANNEL })}
                placeholder="Wybierz domyślny kanal"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <DropdownSelect
                label="AUX do kontroli mocy VTX"
                items={AUX_DROPDOWN_MAP}
                value={currentVtx.vtx_power_aux}
                onValueChange={(val) => updateCurrentVtx({ vtx_power_aux: val as AUX })}
                placeholder="Wybierz AUX"
              />
              <DropdownSelect
                label="Typ przełącznika"
                items={SWITCH_DROPDOWN_MAP}
                value={currentVtx.switch_type}
                onValueChange={(val) => updateCurrentVtx({ switch_type: val as SWITCH_TYPE })}
                placeholder="Wybierz typ przelacznika"
              />
            </div>

            {currentVtx.switch_type === SWITCH_TYPE.POS2 ? (
              <div className="grid grid-cols-2 gap-4">
                <DropdownSelect
                  label="Moc 1"
                  items={vtxPowerOptions}
                  value={currentVtx.power_1}
                  onValueChange={(val) => updateCurrentVtx({ power_1: Number(val) })}
                  placeholder="Wybierz moc"
                />
                <DropdownSelect
                  label="Moc 2"
                  items={vtxPowerOptions}
                  value={currentVtx.power_3}
                  onValueChange={(val) => updateCurrentVtx({ power_3: Number(val) })}
                  placeholder="Wybierz moc"
                />
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-4">
                <DropdownSelect
                  label="Moc 1"
                  items={vtxPowerOptions}
                  value={currentVtx.power_1}
                  onValueChange={(val) => updateCurrentVtx({ power_1: Number(val) })}
                  placeholder="Wybierz moc"
                />
                <DropdownSelect
                  label="Moc 2"
                  items={vtxPowerOptions}
                  value={currentVtx.power_2}
                  onValueChange={(val) => updateCurrentVtx({ power_2: Number(val) })}
                  placeholder="Wybierz moc"
                />
                <DropdownSelect
                  label="Moc 3"
                  items={vtxPowerOptions}
                  value={currentVtx.power_3}
                  onValueChange={(val) => updateCurrentVtx({ power_3: Number(val) })}
                  placeholder="Wybierz moc"
                />
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-muted/50">
          <CardContent className="space-y-4">
            <Textarea
              value={configText}
              onChange={(e) => setConfigText(e.target.value)}
              className="font-mono text-xs whitespace-pre overflow-x-auto"
              rows={configText.split("\n").length + 1}
              readOnly
            />

            <Button onClick={copyToClipboard} className="w-full">
              Kopiuj
            </Button>
          </CardContent>
        </Card>
      </div>

      <Dialog
        open={isErrorOpen}
        onOpenChange={(open) => {
          setIsErrorOpen(open);
          if (!open) {
            handleVtxChange(CUSTOM_VTX_ID);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Błąd</DialogTitle>
            <DialogDescription>
              Błąd parsowania tabeli VTX. Wybierz inny VTX. Prosimy zgłoś nam błąd, najlepiej przez
              wiadomość na Instagramie!
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
