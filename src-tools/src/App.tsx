import { useMemo, type ComponentType } from "react";
import { AppSidebar } from "./components/app-sidebar";
import { Home } from "./components/home";
import { GeneratorUstawienVTX } from "./components/generator-ustawien-vtx";
import { KatalogVTX } from "./components/katalog-vtx";
import { KalkulatorLOS } from "./components/kalkulator-los";
import { KalkulatorHitFactor } from "./components/kalkulator-hit-factor";
import { KalkulatorBalistyczny } from "./components/kalkulator-balistyczny";
import { SidebarInset, SidebarProvider } from "./components/ui/sidebar";
import { useHash } from "@/hooks/use-hash";
import { useGoogleAnalytics } from "@/hooks/use-google-analytics";
import "./index.css";
import { Kontakt } from "./components/kontakt";
import { OfflineInstallPrompt } from "./components/offline-install-prompt";
import { ListaZmian } from "./components/lista-zmian";

const components: Record<string, ComponentType> = {
  "kalkulator-los": KalkulatorLOS,
  "generator-ustawien-vtx": GeneratorUstawienVTX,
  "katalog-vtx": KatalogVTX,
  "kalkulator-hit-factor": KalkulatorHitFactor,
  "kalkulator-balistyczny": KalkulatorBalistyczny,
  kontakt: Kontakt,
  "lista-zmian": ListaZmian,
};

export function App() {
  const hash = useHash();
  useGoogleAnalytics(hash);
  const currentYear = new Date().getFullYear();
  const Component = useMemo(() => {
    const componentName = hash.slice(1).split("?")[0];
    return components[componentName] ?? Home;
  }, [hash]);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="flex-1">
          <Component />
        </div>
        <footer className="border-t border-border px-4 py-4 text-center text-sm text-muted-foreground">
          SZKP Struś | Szkoła Partyzantów
        </footer>
      </SidebarInset>
      <OfflineInstallPrompt />
    </SidebarProvider>
  );
}

export default App;
