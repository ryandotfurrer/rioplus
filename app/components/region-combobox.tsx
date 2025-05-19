"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";

const regions = [
  {
    value: "US",
    label: "US",
  },
  {
    value: "EU",
    label: "EU",
  },
  {
    value: "KR",
    label: "KR",
  },
  {
    value: "TW",
    label: "TW",
  },
];

export function RegionCombobox({
  region,
  onChange,
}: {
  region: string;
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(region);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value
            ? regions.find((region) => region.value === value)?.label
            : "Select a region"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Select a region" />
          <CommandList>
            <CommandEmpty>No region found.</CommandEmpty>
            <CommandGroup>
              {regions.map((region) => (
                <CommandItem
                  key={region.value}
                  value={region.value}
                  onSelect={(currentValue) => {
                    const newValue = currentValue === value ? "" : currentValue;
                    setValue(newValue);
                    onChange(newValue); // Notify parent
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === region.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {region.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
