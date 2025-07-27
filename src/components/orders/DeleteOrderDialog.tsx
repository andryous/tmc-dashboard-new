import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { Order } from "@/types/order";
import { API_BASE_URL } from "@/lib/api";

type Props = {
  order: Order | null; // Order to delete
  open: boolean; // Modal open state
  onOpenChange: (open: boolean) => void; // Function to toggle modal
  onDeleteSuccess: (id: string) => void; // Callback if deletion is successful
};

// Modal dialog to confirm deletion of an order
export default function DeleteOrderDialog({
  order,
  open,
  onOpenChange,
  onDeleteSuccess,
}: Props) {
  async function handleDelete() {
    if (!order) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/orders/${order.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Order deleted successfully");
        onDeleteSuccess(order.id);
        onOpenChange(false);
      } else {
        toast.error("Failed to delete order");
      }
    } catch (error) {
      console.error("Error deleting order:", error);
      toast.error("An error occurred while trying to delete the order");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white text-black rounded-xl shadow-xl">
        <DialogHeader>
          <DialogTitle>Confirm Deletion</DialogTitle>
        </DialogHeader>

        <p className="text-sm">
          Are you sure you want to delete order #{order?.id}? This action cannot
          be undone.
        </p>

        <DialogFooter className="flex justify-end gap-2">
          <Button
            onClick={() => onOpenChange(false)}
            className="bg-gray-100 border border-gray-300 hover:bg-gray-200 focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-gray-400"
          >
            Cancel
          </Button>

          <Button
            onClick={handleDelete}
            className="bg-red-700 text-white hover:bg-red-800"
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
