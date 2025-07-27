// File: src/components/ParentOrderCombobox.tsx

import { useEffect, useState } from "react";
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
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";

// Type for the parent order
type Order = {
  id: number;
  customer: {
    id: number;
    firstName: string;
    lastName: string;
  };
  consultant: {
    id: number;
    firstName: string;
    lastName: string;
  };
};

// Props expected by this combobox
type ParentOrderComboboxProps = {
  selectedId: number | null;
  setSelectedId: (id: number | null) => void;
  serviceType: string;
  setCustomerIdFromParent?: (id: string) => void; // Must accept string
  setConsultantIdFromParent: (id: string) => void;
};

// ComboBox to select a parent order (only for CLEANING or PACKING)
export function ParentOrderCombobox({
  selectedId,
  setSelectedId,
  serviceType,
  setCustomerIdFromParent,
  setConsultantIdFromParent,
}: ParentOrderComboboxProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [open, setOpen] = useState(false);

  // Fetch MOVING orders from the backend only when needed
  useEffect(() => {
    if (serviceType === "CLEANING" || serviceType === "PACKING") {
      fetch("http://localhost:8088/api/orders/by-service-type/MOVING")
        .then((res) => res.json())
        .then((data) => setOrders(data));
    }
  }, [serviceType]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between border border-blue-500 focus:ring-2 focus:ring-blue-500"
        >
          {selectedId
            ? `#${selectedId} – ${
                orders.find((o) => o.id === selectedId)?.customer.firstName ??
                "?"
              } ${
                orders.find((o) => o.id === selectedId)?.customer.lastName ?? ""
              }`
            : "Select parent order"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[350px] p-0 bg-white">
        <Command>
          <CommandInput placeholder="Search by name or ID..." />
          <CommandEmpty>No orders found.</CommandEmpty>
          <CommandList className="max-h-60 overflow-y-auto">
            <CommandGroup className="bg-white max-h-60 overflow-auto">
              {orders.map((order) => (
                <CommandItem
                  key={order.id}
                  value={`${order.id} ${order.customer.firstName} ${order.customer.lastName}`}
                  onSelect={() => {
                    setSelectedId(order.id); // Update selected parent ID
                    setCustomerIdFromParent?.(String(order.customer.id)); // Convert customer.id to string
                    setConsultantIdFromParent(order.consultant.id.toString()); // Inherits consultant

                    setOpen(false); // Close combobox
                  }}
                  className="cursor-pointer hover:bg-blue-100"
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedId === order.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  #{order.id} – {order.customer.firstName}{" "}
                  {order.customer.lastName}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
