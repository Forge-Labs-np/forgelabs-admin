
"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Check, X, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";

export type OptionType = {
  label: string;
  value: string;
};

interface MultiSelectProps {
  options: OptionType[];
  defaultValue: string[];
  onValueChange: (value: string[]) => void;
  placeholder?: string;
  className?: string;
}

function MultiSelect({
  options,
  defaultValue,
  onValueChange,
  placeholder = "Select options...",
  className,
  ...props
}: MultiSelectProps) {
  const [selectedValues, setSelectedValues] =
    React.useState<string[]>(defaultValue);
  const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);

  React.useEffect(() => {
    setSelectedValues(defaultValue);
  }, [defaultValue]);

  const handleToggleOption = (value: string) => {
    const newSelectedValues = selectedValues.includes(value)
      ? selectedValues.filter((v) => v !== value)
      : [...selectedValues, value];
    setSelectedValues(newSelectedValues);
    onValueChange(newSelectedValues);
  };
  
  const handleClear = () => {
    const newSelectedValues: string[] = [];
    setSelectedValues(newSelectedValues);
    onValueChange(newSelectedValues);
  }

  return (
    <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen} {...props}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={isPopoverOpen}
          className={cn("w-full justify-between h-auto", className)}
          onClick={() => setIsPopoverOpen(!isPopoverOpen)}
        >
          <div className="flex gap-1 flex-wrap">
            {selectedValues.length > 0 ? (
              options
                .filter((option) => selectedValues.includes(option.value))
                .map((option) => (
                  <Badge
                    variant="secondary"
                    key={option.value}
                    className="mr-1 mb-1"
                    onClick={(e) => {
                        e.stopPropagation();
                        handleToggleOption(option.value);
                    }}
                  >
                    {option.label}
                    <X className="ml-1 h-3 w-3" />
                  </Badge>
                ))
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
          </div>
          <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
        <Command>
          <CommandInput placeholder="Search..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  onSelect={() => handleToggleOption(option.value)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedValues.includes(option.value)
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
             {selectedValues.length > 0 && (
                <>
                <CommandGroup>
                    <CommandItem
                    onSelect={handleClear}
                    className="justify-center text-center"
                    >
                    Clear
                    </CommandItem>
                </CommandGroup>
                </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export { MultiSelect };
