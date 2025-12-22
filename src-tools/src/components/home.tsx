import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import patroniteLogo from "../assets/patronite-logo-SVG-02.svg";
import { PageContainer } from "./page-container";

import { DRONE_TOOLS, SHOOTING_TOOLS } from "../lib/tools";

export function Home() {
  return (
    <PageContainer title="Szkoła Partyzantów - Narzędzia">
      <div className="space-y-6">
        <Card>
          <CardContent>
            <p>Zbiór różnych opracowanych przez nas narzędzi wspomagających pracę z dronami.</p>
            <br />
            <p>
              Jeśli wyniosłeś z tej strony więcej niż 5 PLN wartości, rozważ wsparcie nas na
              Patronite:
            </p>
            <div className="flex items-center justify-center gap-2 mt-4">
              <a href="https://patronite.pl/szkola_partyzantow">
                <img src={patroniteLogo} alt="Patronite" className="h-20 w-auto" />
              </a>
            </div>
            <p>
              Znajdziesz tam dodatkowo między innymi{" "}
              <a
                href="https://patronite.pl/szkola_partyzantow/posts/24484,kody"
                className="text-primary"
              >
                kody zniżkowe od naszych partnerów
              </a>{" "}
              oraz materiały szkoleniowe, takie jak np. wykład{" "}
              <a
                href="https://patronite.pl/post/65283/jak-zaczac-przygode-z-fpv-nagranie-warsztatow"
                className="text-primary"
              >
                "Jak zacząć przygodę z FPV?"
              </a>
              .
            </p>
          </CardContent>
        </Card>

        <h1 className="text-2xl font-bold">Drony</h1>
        <p>Narzędzia wspomagające pracę zespołów dronowych.</p>
        <div className="grid gap-4 md:grid-cols-2">
          {DRONE_TOOLS.map((tool) => (
            <a key={tool.url} href={tool.url} className="block group">
              <Card className="h-full transition-colors hover:bg-muted/50">
                <CardHeader>
                  <CardTitle className="group-hover:text-primary transition-colors">
                    {tool.title}
                  </CardTitle>
                  <CardDescription>{tool.description}</CardDescription>
                </CardHeader>
              </Card>
            </a>
          ))}
        </div>
        <h1 className="text-2xl font-bold">Strzelectwo</h1>
        <p>Narzędzia przydatne w strzelectwie.</p>
        <div className="grid gap-4 md:grid-cols-2">
          {SHOOTING_TOOLS.map((tool) => (
            <a key={tool.url} href={tool.url} className="block group">
              <Card className="h-full transition-colors hover:bg-muted/50">
                <CardHeader>
                  <CardTitle className="group-hover:text-primary transition-colors">
                    {tool.title}
                  </CardTitle>
                  <CardDescription>{tool.description}</CardDescription>
                </CardHeader>
              </Card>
            </a>
          ))}
        </div>
      </div>
    </PageContainer>
  );
}
