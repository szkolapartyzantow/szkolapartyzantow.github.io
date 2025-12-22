import { useEffect } from "react";

declare global {
  interface Window {
    gtag: (
      command: "config" | "event" | "js",
      targetId: string,
      config?: Record<string, any>
    ) => void;
    dataLayer: any[];
  }
}

export const useGoogleAnalytics = (hash: string) => {
  useEffect(() => {
    if (typeof window.gtag !== "undefined") {
      const path = hash ? `/${hash.slice(1)}` : "/";
      window.gtag("config", "G-L0B0MVFVHX", {
        page_path: path,
      });
    }
  }, [hash]);
};
