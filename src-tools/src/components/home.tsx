import * as React from "react"
import { Card, CardContent } from "./ui/card"
import patroniteLogo from "../assets/patronite-logo-SVG-02.svg"

export function Home() {
  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="flex items-center gap-2 mb-6">
        <h1 className="text-3xl font-bold">Szkoła Partyzantów - Narzędzia</h1>
      </div>
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
    </div>
  )
}
