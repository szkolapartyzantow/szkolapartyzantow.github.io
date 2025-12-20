export const TOOLS = [
  {
    title: "Kalkulator LOS Anteny",
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

export const getToolByUrl = (url: string) => TOOLS.find((t) => t.url === url);
