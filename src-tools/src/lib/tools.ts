export const DRONE_TOOLS = [
  {
    title: "Kalkulator LOS anteny",
    description: 'Oblicz na jakiej wysokości musisz lecieć, aby Twoja antena "widziała" drona.',
    url: "#kalkulator-los",
  },
  {
    title: "Generator ustawień VTX",
    description:
      "Wygeneruj konfigurację VTX - tabelę oraz zmianę mocy/pasma/kanału za pomocą przełączników.",
    url: "#generator-ustawien-vtx",
  },
] as const;

export const SHOOTING_TOOLS = [
  {
    title: "Kalkulator Hit Factor",
    description: "Kalkulator do liczenia Hit Factor w IPSC/USPSA",
    url: "#kalkulator-hit-factor",
  },
] as const;

export const TOOLS = [...DRONE_TOOLS, ...SHOOTING_TOOLS] as const;

export const getToolByUrl = (url: string) => TOOLS.find((t) => t.url === url);
