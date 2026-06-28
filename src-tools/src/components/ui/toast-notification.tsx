import * as React from "react";

import { cn } from "@/lib/utils";

interface ToastNotificationProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  duration?: number;
  className?: string;
}

export function ToastNotification({
  open,
  onOpenChange,
  children,
  duration = 3000,
  className,
}: ToastNotificationProps) {
  React.useEffect(() => {
    if (!open) return;

    const timeoutId = window.setTimeout(() => {
      onOpenChange(false);
    }, duration);

    return () => window.clearTimeout(timeoutId);
  }, [duration, onOpenChange, open]);

  if (!open) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "fixed right-4 bottom-4 z-50 max-w-[calc(100vw-2rem)] rounded-md border bg-background px-4 py-3 text-sm font-medium shadow-lg",
        className
      )}
    >
      {children}
    </div>
  );
}
