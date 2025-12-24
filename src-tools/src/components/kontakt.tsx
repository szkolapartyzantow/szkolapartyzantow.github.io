import { PageContainer } from "./page-container";
import { Card, CardContent } from "./ui/card";

export function Kontakt() {
  return (
    <PageContainer title="Kontakt">
      <div className="space-y-6">
        <Card>
          <CardContent>
            <p>
              Najłatwiej/najszybciej skontaktować się z nami przez{" "}
              <a href="https://szkolapartyzantow.pl/ig" className="text-primary">
                Instagram
              </a>
              .
            </p>
            <br />
            <p>Nasze pozostałe social media:</p>
            <ul className="list-disc ml-5">
              <a href="https://szkolapartyzantow.pl/youtube" className="text-primary">
                <li>YouTube</li>
              </a>
              <a href="https://szkolapartyzantow.pl/facebook" className="text-primary">
                <li>Facebook</li>
              </a>
              <a href="https://szkolapartyzantow.pl/discord" className="text-primary">
                <li>Discord dla Patronów</li>
              </a>
            </ul>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
