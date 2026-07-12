import * as React from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

interface PageContainerProps {
  title: string;
  children?: React.ReactNode;
  className?: string;
}

export function PageContainer({ title, children, className }: PageContainerProps) {
  return (
    <div className={cn("container mx-auto p-4 max-w-6xl md:mt-10", className)}>
      <div className="flex items-center gap-2 mb-6">
        <SidebarTrigger className="md:hidden" />
        <h1 className="text-3xl font-bold">{title}</h1>
      </div>
      {children}
    </div>
  );
}
