import { useSyncExternalStore } from "react";

const subscribe = (callback: () => void) => {
  window.addEventListener("hashchange", callback);
  return () => window.removeEventListener("hashchange", callback);
};

const getSnapshot = () => {
  return window.location.hash;
};

const getServerSnapshot = () => {
  return "";
};

export function useHash() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
