import { CalendarDays } from "lucide-react";
import { PageContainer } from "./page-container";
import { Card, CardContent } from "./ui/card";

const changes = [
  {
    date: "2026-06-28",
    items: [
      "Dodano Katalog VTX.",
      "Dodano możliwość udostępniania ustawień VTX przez link.",
      "Dodano import i eksport ustawień w kalkulatorze balistycznym.",
    ],
  },
  {
    date: "2026-06-27",
    items: [
      "Dodano tryb offline aplikacji.",
      "Rozbudowano kalkulator balistyczny i poprawiono błędy w obliczeniach.",
    ],
  },
  {
    date: "2026-02-26",
    items: [
      "Poprawiono układ generatora VTX na telefonach.",
    ],
  },
  {
    date: "2025-12-24",
    items: [
      "Dodano kalkulator balistyczny.",
      "Dodano zmianę pasma i kanału VTX oraz instrukcje użycia przełączników.",
    ],
  },
  {
    date: "2025-12-22",
    items: [
      "Dodano kalkulator Hit Factor.",
    ],
  },
  {
    date: "2025-12-20",
    items: [
      "Dodano generator ustawień VTX.",
    ],
  },
  {
    date: "2025-12-18",
    items: [
      "Dodano kalkulator LOS anteny.",
    ],
  }
];

export function ListaZmian() {
  return (
    <PageContainer title="Lista zmian">
      <div className="space-y-5">
        <div className="space-y-4">
          {changes.map((entry) => (
            <Card key={entry.date} className="rounded-none">
              <CardContent className="grid gap-4 md:grid-cols-[10rem_1fr]">
                <div className="flex items-center gap-2 text-sm font-bold text-muted-foreground">
                  <CalendarDays className="size-4" />
                  <time dateTime={entry.date}>{entry.date}</time>
                </div>
                <ul className="list-disc space-y-2 pl-5 text-sm leading-6">
                  {entry.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </PageContainer>
  );
}
