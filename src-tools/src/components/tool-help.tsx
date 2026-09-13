import * as React from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { ChevronDown } from "lucide-react";

interface ToolHelpProps {
  children?: React.ReactNode;
}

export function ToolHelp({ children }: ToolHelpProps) {
  return (
    <div className="mb-5">
      <Card>
        <CardContent>
          <Collapsible>
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className="flex w-full justify-between p-0 hover:bg-transparent group h-auto"
              >
                <h1 className="text-1xl font-bold">Instrukcja</h1>
                <ChevronDown className="h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-3 ml-3">{children}</CollapsibleContent>
          </Collapsible>
        </CardContent>
      </Card>
    </div>
  );
}
