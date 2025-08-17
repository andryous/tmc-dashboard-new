import { useEffect, useState } from "react";
import type { OrderItem } from "@/types/order";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle, // This component is now used
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

type Props = {
  item: OrderItem | null;
  isOpen: boolean;
  mode: "add" | "edit";
  onClose: () => void;
  onSave: (updatedItem: OrderItem) => void;
};

export default function EditOrderItemModal({
  item,
  isOpen,
  mode,
  onClose,
  onSave,
}: Props) {
  const [editedItem, setEditedItem] = useState<OrderItem | null>(item);

  useEffect(() => {
    setEditedItem(item);
  }, [item]);

  if (!item || !editedItem) return null;

  const handleChange = (field: keyof OrderItem, value: string) => {
    if (!editedItem) return;
    let updatedItem = { ...editedItem, [field]: value };
    if (
      field === "startDate" &&
      updatedItem.endDate &&
      value > updatedItem.endDate
    ) {
      updatedItem = { ...updatedItem, endDate: value };
    }
    setEditedItem(updatedItem);
  };

  const handleSave = () => {
    if (!editedItem) return;

    if (!editedItem.fromAddress.trim()) {
      toast.error("'From Address' is required.");
      return;
    }
    if (!editedItem.startDate) {
      toast.error("'Start Date' is required.");
      return;
    }
    if (!editedItem.endDate) {
      toast.error("'End Date' is required.");
      return;
    }

    onSave(editedItem);
  };

  // REMOVED: The 'isNewItem' variable is no longer needed as we now use the 'mode' prop.

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-white">
        <DialogHeader>
          {/* CORRECTED: The DialogTitle component is now correctly used */}
          <DialogTitle>
            {mode === "add"
              ? "Add New Service Item"
              : `Edit Service Item #${item.id}`}
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="serviceType" className="text-right">
              Service Type
            </Label>
            <Select
              value={editedItem.serviceType}
              onValueChange={(value) => handleChange("serviceType", value)}
            >
              <SelectTrigger className="col-span-3 border-blue-500">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white z-50">
                <SelectItem value="MOVING" className="focus:bg-blue-100">
                  Moving
                </SelectItem>
                <SelectItem value="PACKING" className="focus:bg-blue-100">
                  Packing
                </SelectItem>
                <SelectItem value="CLEANING" className="focus:bg-blue-100">
                  Cleaning
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="fromAddress" className="text-right">
              From Address
            </Label>
            <Input
              id="fromAddress"
              value={editedItem.fromAddress}
              onChange={(e) => handleChange("fromAddress", e.target.value)}
              className="col-span-3 border-blue-500"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="toAddress" className="text-right">
              To Address
            </Label>
            <Input
              id="toAddress"
              value={editedItem.toAddress}
              onChange={(e) => handleChange("toAddress", e.target.value)}
              className="col-span-3 border-blue-500"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="startDate" className="text-right">
              Start Date
            </Label>
            <Input
              id="startDate"
              type="date"
              value={editedItem.startDate}
              onChange={(e) => handleChange("startDate", e.target.value)}
              className="col-span-3 border-blue-500"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="endDate" className="text-right">
              End Date
            </Label>
            <Input
              id="endDate"
              type="date"
              value={editedItem.endDate}
              min={editedItem.startDate}
              onChange={(e) => handleChange("endDate", e.target.value)}
              className="col-span-3 border-blue-500"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="note" className="text-right">
              Note
            </Label>
            <Textarea
              id="note"
              value={editedItem.note || ""}
              onChange={(e) => handleChange("note", e.target.value)}
              className="col-span-3 border-blue-500"
            />
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button
              type="button"
              variant="outline"
              className="border-blue-600 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
            >
              Cancel
            </Button>
          </DialogClose>
          <Button
            type="button"
            onClick={handleSave}
            className="bg-blue-600 text-white"
          >
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
