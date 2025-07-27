// src/components/CustomerCombobox.tsx

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
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";

type Customer = {
  id: number;
  firstName: string;
  lastName: string;
};

type Props = {
  customers: Customer[];
  selectedId: string;
  setSelectedId: (value: string) => void;
  setIsNewCustomer: (flag: boolean) => void;
};

export function CustomerCombobox({
  customers,
  selectedId,
  setSelectedId,
  setIsNewCustomer,
}: Props) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  // Handle selection of customer or new
  const handleSelect = (value: string) => {
    setOpen(false);
    if (value === "__new") {
      setSelectedId("");
      setIsNewCustomer(true);
    } else {
      setSelectedId(value);
      setIsNewCustomer(false);
    }
  };

  // Display label for current selection
  const getLabel = (id: string) => {
    const match = customers.find((c) => String(c.id) === id);
    return match ? `${match.id} – ${match.firstName} ${match.lastName}` : "";
  };

  // Filter customers based on search input
  const filtered = customers.filter((c) => {
    const term = search.toLowerCase();
    return (
      c.firstName.toLowerCase().includes(term) ||
      c.lastName.toLowerCase().includes(term) ||
      String(c.id).includes(term)
    );
  });

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between border-blue-500 focus-visible:ring-blue-500 focus-visible:outline-none"
        >
          {selectedId
            ? getLabel(selectedId)
            : "Select existing customer or add new"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-full z-50 p-0 bg-white">
        <Command>
          {/* Input field to search customers */}
          <CommandInput
            placeholder="Search customer..."
            value={search}
            onValueChange={setSearch}
          />
          <CommandList className="max-h-60 overflow-y-auto">
            <CommandEmpty>No customer found.</CommandEmpty>
            <CommandGroup heading="Customers">
              {filtered.map((c) => (
                <CommandItem
                  key={c.id}
                  value={String(c.id)}
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

          {/* ➕ Option outside scroll, always visible */}
          <div className="border-t px-2 py-2">
            <Button
              variant="ghost"
              onClick={() => handleSelect("__new")}
              className="w-full justify-start text-purple-600 hover:bg-muted font-medium"
            >
              ➕ New customer
            </Button>
          </div>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
