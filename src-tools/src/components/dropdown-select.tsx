import * as React from "react";
import { Check, ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface SelectItemData {
  value: any;
  label: string;
}

interface DropdownSelectProps {
  label: string;
  items: SelectItemData[];
  value: any;
  onValueChange: (value: any) => void;
  placeholder?: string;
  className?: string;
  searchable?: boolean;
}

export function DropdownSelect({
  label,
  items,
  value,
  onValueChange,
  placeholder = "Select option",
  className,
  searchable = false,
}: DropdownSelectProps) {
  const [open, setOpen] = React.useState(false);

  if (searchable) {
    const selectedItem = items.find((item) => item.value === value);

    return (
      <div className={`space-y-2 ${className || ""}`}>
        <Label>{label}</Label>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-full justify-between font-normal"
            >
              {selectedItem ? selectedItem.label : placeholder}
              <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-125 p-0">
            <Command>
              <CommandInput placeholder={`Search ${label.toLowerCase()}...`} />
              <CommandList>
                <CommandEmpty>No item found.</CommandEmpty>
                <CommandGroup>
                  {items.map((item) => (
                    <CommandItem
                      key={item.value}
                      value={item.label}
                      onSelect={() => {
                        onValueChange(item.value);
                        setOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          value === item.value ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {item.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
    );
  }

  return (
    <div className={`space-y-2 ${className || ""}`}>
      <Label>{label}</Label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {items.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
