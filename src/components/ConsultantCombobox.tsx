// File: src/components/ConsultantCombobox.tsx

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";

// Type for a consultant object
type Consultant = {
  id: number;
  firstName: string;
  lastName: string;
};

// Props expected from parent
type Props = {
  consultants: Consultant[];
  selectedId: string;
  setSelectedId: (value: string) => void;
};

export function ConsultantCombobox({
  consultants,
  selectedId,
  setSelectedId,
}: Props) {
  const [open, setOpen] = useState(false);

  // Handle selection of a consultant
  const handleSelect = (value: string) => {
    setOpen(false);
    setSelectedId(value);
  };

  // Display label for current selection
  const getLabel = (id: string) => {
    const match = consultants.find((c) => String(c.id) === id);
    return match ? `${match.id} – ${match.firstName} ${match.lastName}` : "";
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between border-blue-500 focus-visible:ring-blue-500 focus-visible:outline-none"
        >
          {selectedId ? getLabel(selectedId) : "Select a consultant"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-full z-50 p-0 bg-white">
        <Command>
          <CommandList className="max-h-60 overflow-y-auto">
            <CommandEmpty>No consultant found.</CommandEmpty>
            <CommandGroup heading="Consultants">
              {consultants.map((c) => (
                <CommandItem
                  key={c.id}
                  value={`${c.id} ${c.firstName} ${c.lastName}`}
                  onSelect={() => handleSelect(String(c.id))}
                  className="cursor-pointer hover:bg-blue-100"
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedId === String(c.id) ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {c.id} – {c.firstName} {c.lastName}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
