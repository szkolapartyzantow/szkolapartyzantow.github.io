import * as React from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";

interface PageContainerProps {
  title: string;
  children?: React.ReactNode;
}

export function PageContainer({ title, children }: PageContainerProps) {
  return (
    <div className="container mx-auto p-4 max-w-6xl md:mt-5">
      <div className="flex items-center gap-2 mb-6">
        <SidebarTrigger className="md:hidden" />
        <h1 className="text-3xl font-bold">{title}</h1>
      </div>
      {children}
    </div>
  );
}
