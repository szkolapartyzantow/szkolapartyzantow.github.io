import { useMemo, type ComponentType } from "react";
import { AppSidebar } from "./components/app-sidebar";
import { Home } from "./components/home";
import { GeneratorUstawienVTX } from "./components/generator-ustawien-vtx";
import { KalkulatorLOS } from "./components/kalkulator-los";
import { KalkulatorHitFactor } from "./components/kalkulator-hit-factor";
import { KalkulatorBalistyczny } from "./components/kalkulator-balistyczny";
import { SidebarInset, SidebarProvider } from "./components/ui/sidebar";
import { useHash } from "@/hooks/use-hash";
import { useGoogleAnalytics } from "@/hooks/use-google-analytics";
import "./index.css";
import { Kontakt } from "./components/kontakt";

const components: Record<string, ComponentType> = {
  "kalkulator-los": KalkulatorLOS,
  "generator-ustawien-vtx": GeneratorUstawienVTX,
  "kalkulator-hit-factor": KalkulatorHitFactor,
  "kalkulator-balistyczny": KalkulatorBalistyczny,
  kontakt: Kontakt,
};

export function App() {
  const hash = useHash();
  useGoogleAnalytics(hash);
  const Component = useMemo(() => {
    const componentName = hash.slice(1);
    return components[componentName] ?? Home;
  }, [hash]);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Component />
      </SidebarInset>
    </SidebarProvider>
  );
}

export default App;
