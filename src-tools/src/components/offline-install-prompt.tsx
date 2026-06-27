import { useEffect, useState } from "react";
import { Download, WifiOff, X } from "lucide-react";
import { Button } from "@/components/ui/button";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

const DISMISSED_KEY = "szkp-offline-install-prompt-dismissed";

export function OfflineInstallPrompt() {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isOfflineReady, setIsOfflineReady] = useState(false);
  const [isDismissed, setIsDismissed] = useState(
    () => localStorage.getItem(DISMISSED_KEY) === "true"
  );

  useEffect(() => {
    if (!("serviceWorker" in navigator) || !import.meta.env.PROD) {
      return;
    }

    navigator.serviceWorker.ready.then(() => setIsOfflineReady(true));

    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as BeforeInstallPromptEvent);
      setIsOfflineReady(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  if (isDismissed || !isOfflineReady) {
    return null;
  }

  const installApp = async () => {
    if (!installPrompt) {
      return;
    }

    await installPrompt.prompt();
    const choice = await installPrompt.userChoice;
    if (choice.outcome === "accepted") {
      setInstallPrompt(null);
      dismissPrompt();
    }
  };

  const dismissPrompt = () => {
    localStorage.setItem(DISMISSED_KEY, "true");
    setIsDismissed(true);
  };

  return (
    <div className="fixed inset-x-3 bottom-3 z-50 md:left-auto md:right-4 md:w-[28rem]">
      <div className="border bg-popover text-popover-foreground shadow-xl">
        <div className="flex items-start gap-3 p-4">
          <div className="flex size-9 shrink-0 items-center justify-center bg-secondary text-secondary-foreground">
            <WifiOff className="size-5" aria-hidden="true" />
          </div>
          <div className="min-w-0 flex-1 space-y-1">
            <p className="font-bold">Tryb Offline</p>
            <p className="text-sm text-muted-foreground">
              Możesz używać Narzędzi bez połączenia z internetem.
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              {installPrompt ? (
                <Button type="button" onClick={installApp} size="sm">
                  <Download className="size-4" aria-hidden="true" />
                  Zainstaluj
                </Button>
              ) : null}
              <Button type="button" variant="outline" size="sm" onClick={dismissPrompt}>
                OK
              </Button>
            </div>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={dismissPrompt}
            aria-label="Zamknij komunikat"
          >
            <X className="size-4" aria-hidden="true" />
          </Button>
        </div>
      </div>
    </div>
  );
}
