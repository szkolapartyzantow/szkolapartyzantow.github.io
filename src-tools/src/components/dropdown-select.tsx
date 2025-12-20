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
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface SelectItemData {
  value: any;
  label: string;
}

export interface SelectItemGroup {
  label: string;
  items: SelectItemData[];
}

function isGroup(item: SelectItemData | SelectItemGroup): item is SelectItemGroup {
  return "items" in item && "label" in item;
}

interface DropdownSelectProps {
  label: string;
  items: (SelectItemData | SelectItemGroup)[];
  value: any;
  onValueChange: (value: any) => void;
  placeholder?: string;
  className?: string;
  searchable?: boolean;
  fullWidth?: boolean;
}

export function DropdownSelect({
  label,
  items,
  value,
  onValueChange,
  placeholder = "Select option",
  className,
  searchable = false,
  fullWidth = true,
}: DropdownSelectProps) {
  const [open, setOpen] = React.useState(false);

  const selectedItem = React.useMemo(() => {
    for (const itemOrGroup of items) {
      if (isGroup(itemOrGroup)) {
        const found = itemOrGroup.items.find((item) => item.value === value);
        if (found) return found;
      } else {
        const item = itemOrGroup as SelectItemData;
        if (item.value === value) return item;
      }
    }
  }, [items, value]);

  if (searchable) {
    return (
      <div className={`space-y-2 ${className || ""}`}>
        <Label>{label}</Label>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className={cn("justify-between font-normal", fullWidth ? "w-full" : "w-fit")}
            >
              {selectedItem ? selectedItem.label : placeholder}
              <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
            <Command>
              <CommandInput placeholder={`Search ${label.toLowerCase()}...`} />
              <CommandList>
                <CommandEmpty>No item found.</CommandEmpty>
                {items.map((itemOrGroup) => {
                  if (isGroup(itemOrGroup)) {
                    return (
                      <CommandGroup key={itemOrGroup.label} heading={itemOrGroup.label}>
                        {itemOrGroup.items.map((item) => (
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
                    );
                  }
                  const item = itemOrGroup as SelectItemData;
                  return (
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
                  );
                })}
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
        <SelectTrigger className={fullWidth ? "w-full" : "w-fit"}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {items.map((itemOrGroup) => {
            if (isGroup(itemOrGroup)) {
              return (
                <SelectGroup key={itemOrGroup.label}>
                  {/* @ts-ignore */}
                  <SelectLabel>{itemOrGroup.label}</SelectLabel>
                  {itemOrGroup.items.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              );
            }
            const item = itemOrGroup as SelectItemData;
            return (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </div>
  );
}
