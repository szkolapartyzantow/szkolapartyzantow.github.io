import * as React from "react"
import { Card, CardContent } from "./ui/card"
import patroniteLogo from "../assets/patronite-logo-SVG-02.svg"
import { PageContainer } from "./page-container"

export function Home() {
  return (
    <PageContainer title="Szkoła Partyzantów - Narzędzia">
      <Card>
        <CardContent>
          <p>Zbiór różnych opracowanych przez nas narzędzi.</p>
          <br />
          <p>Jeśli wyniosłeś z tej strony więcej niż 5 PLN wartości, rozważ wsparcie nas na Patronite:</p>
          <div className="flex items-center justify-center gap-2 mt-4">
            <a href="https://patronite.pl/szkola_partyzantow"><img src={patroniteLogo} alt="Patronite" className="h-20 w-auto" /></a>
          </div>
        </CardContent>
      </Card>
    </PageContainer>
  )
}
