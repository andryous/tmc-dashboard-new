import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { API_BASE_URL } from "@/lib/api";
import type { Order, OrderItem } from "@/types/order";
import type { Person } from "@/types/person";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ConsultantCombobox } from "@/components/ConsultantCombobox";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ServiceIcon } from "@/components/orders/ServiceIcon";
import { Pencil, Trash2, PlusCircle } from "lucide-react";
import EditOrderItemModal from "@/components/orders/EditOrderItemModal";

export default function EditOrder() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // --- State Management ---
  const [editableOrder, setEditableOrder] = useState<Order | null>(null);
  const [consultants, setConsultants] = useState<Person[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentItemToEdit, setCurrentItemToEdit] = useState<OrderItem | null>(
    null
  );
  const [modalMode, setModalMode] = useState<"add" | "edit">("edit");

  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<OrderItem | null>(null);

  // --- Data Fetching ---
  useEffect(() => {
    const fetchConsultants = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/persons/by-role/CONSULTANT`
        );
        if (!response.ok) throw new Error("Failed to fetch consultants");
        const data = await response.json();
        setConsultants(data);
      } catch (err) {
        console.error("Error fetching consultants", err);
        toast.error("Could not load consultant data.");
      }
    };
    fetchConsultants();
  }, []);

  useEffect(() => {
    const fetchOrder = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_BASE_URL}/api/orders/${id}`);
        if (!response.ok)
          throw new Error(
            `Failed to load order data. Status: ${response.status}`
          );
        const data: Order = await response.json();
        setEditableOrder(data);
      } catch (error) {
        setError((error as Error).message);
        toast.error((error as Error).message);
      } finally {
        setIsLoading(false);
      }
    };
    if (id) fetchOrder();
  }, [id]);

  // --- Handlers ---
  const handleSubmit = async () => {
    if (!editableOrder) {
      toast.error("No order data to submit.");
      return;
    }
    if (editableOrder.items.length === 0) {
      toast.error("An order must have at least one service item.");
      return;
    }
    setIsSubmitting(true);
    const itemsPayload = editableOrder.items.map((item) => ({
      serviceType: item.serviceType,
      status: item.status,
      startDate: item.startDate,
      endDate: item.endDate,
      fromAddress: item.fromAddress,
      toAddress: item.toAddress,
      note: item.note,
    }));
    const payload = {
      customerId: editableOrder.customer.id,
      consultantId: editableOrder.consultant.id,
      modifiedByConsultantId: editableOrder.consultant.id,
      status: editableOrder.status,
      items: itemsPayload,
    };
    try {
      const response = await fetch(`${API_BASE_URL}/api/orders/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: "Failed to update order." }));
        throw new Error(errorData.message || "An unknown error occurred.");
      }
      toast.success("Order updated successfully!");
      navigate("/orders");
    } catch (error) {
      toast.error((error as Error).message);
      console.error("Update failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConsultantChange = (consultantId: string) => {
    if (!editableOrder) return;
    const selectedConsultant = consultants.find(
      (c) => c.id.toString() === consultantId
    );
    if (selectedConsultant) {
      setEditableOrder({ ...editableOrder, consultant: selectedConsultant });
    }
  };

  const handleStatusChange = (status: string) => {
    if (!editableOrder) return;
    setEditableOrder({ ...editableOrder, status: status as Order["status"] });
  };

  const handleEditItemClick = (item: OrderItem) => {
    setModalMode("edit");
    setCurrentItemToEdit(item);
    setIsModalOpen(true);
  };

  const handleAddItemClick = () => {
    setModalMode("add");
    const newItem: OrderItem = {
      id: Date.now(),
      serviceType: "MOVING",
      status: "PENDING",
      startDate: new Date().toISOString().split("T")[0],
      endDate: new Date().toISOString().split("T")[0],
      fromAddress: "",
      toAddress: "",
      note: "",
    };
    setCurrentItemToEdit(newItem);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (item: OrderItem) => {
    setItemToDelete(item);
    setIsAlertOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!editableOrder || !itemToDelete) return;
    const updatedItems = editableOrder.items.filter(
      (item) => item.id !== itemToDelete.id
    );
    setEditableOrder({ ...editableOrder, items: updatedItems });
    toast.success("Service item removed.");
    setItemToDelete(null);
  };

  const handleSaveItem = (itemToSave: OrderItem) => {
    if (!editableOrder) return;
    const isExistingItem = editableOrder.items.some(
      (item) => item.id === itemToSave.id
    );
    let updatedItems: OrderItem[];
    if (isExistingItem) {
      updatedItems = editableOrder.items.map((item) =>
        item.id === itemToSave.id ? itemToSave : item
      );
      toast.success("Service item updated successfully!");
    } else {
      updatedItems = [...editableOrder.items, itemToSave];
      toast.success("New service item added!");
    }
    setEditableOrder({ ...editableOrder, items: updatedItems });
    setIsModalOpen(false);
  };

  if (isLoading) return <div className="p-6">Loading order data...</div>;
  if (error) return <div className="p-6 text-red-500">Error: {error}</div>;
  if (!editableOrder) return <div className="p-6">No order data found.</div>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Edit Order #{editableOrder.id}</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <Card className="border-blue-500">
            <CardHeader>
              <CardTitle>Order Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Customer</Label>
                <Input
                  value={`${editableOrder.customer.firstName} ${editableOrder.customer.lastName}`}
                  disabled
                  className="bg-gray-100 border-blue-500"
                />
              </div>
              <div className="space-y-2">
                <Label>Consultant</Label>
                <ConsultantCombobox
                  consultants={consultants}
                  selectedId={editableOrder.consultant.id.toString()}
                  setSelectedId={handleConsultantChange}
                />
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={editableOrder.status}
                  onValueChange={handleStatusChange}
                >
                  <SelectTrigger className="border-blue-500">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white z-50">
                    <SelectItem value="PENDING" className="focus:bg-blue-100">
                      Pending
                    </SelectItem>
                    <SelectItem
                      value="IN_PROGRESS"
                      className="focus:bg-blue-100"
                    >
                      In Progress
                    </SelectItem>
                    <SelectItem value="COMPLETED" className="focus:bg-blue-100">
                      Completed
                    </SelectItem>
                    <SelectItem value="CANCELLED" className="focus:bg-blue-100">
                      Cancelled
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isSubmitting ? "Updating..." : "Update Order"}
          </Button>
        </div>
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Service Items</h2>
            <Button
              onClick={handleAddItemClick}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Service
            </Button>
          </div>
          {editableOrder.items.map((item) => (
            <Card key={item.id} className="border-blue-300">
              <CardContent className="p-4 flex justify-between items-start">
                <div className="flex-1 grid grid-cols-1 md:grid-cols-5 gap-4 items-start">
                  <div className="md:col-span-2 flex items-center font-semibold">
                    <ServiceIcon serviceType={item.serviceType} />
                    <span className="text-lg capitalize">
                      {item.serviceType.toLowerCase()}
                    </span>
                  </div>
                  <div className="md:col-span-3 space-y-1 text-sm text-gray-600">
                    {item.id < 1_000_000 && (
                      <p>
                        <strong>Item ID:</strong> #{item.id}
                      </p>
                    )}
                    <p>
                      <strong>From:</strong> {item.fromAddress}
                    </p>
                    <p>
                      <strong>To:</strong> {item.toAddress || "—"}
                    </p>
                    <p>
                      <strong>Date:</strong> {item.startDate}
                    </p>
                    {item.note && (
                      <p className="pt-1 italic">
                        <strong>Note:</strong> {item.note}
                      </p>
                    )}
                  </div>
                </div>
                <div className="ml-4 flex flex-col space-y-2">
                  <Button
                    size="icon"
                    onClick={() => handleEditItemClick(item)}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleDeleteClick(item)}
                    className="text-white bg-red-700 hover:bg-red-600 hover:text-white"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <EditOrderItemModal
        isOpen={isModalOpen}
        item={currentItemToEdit}
        mode={modalMode}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveItem}
      />

      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will remove the "{itemToDelete?.serviceType}" service
              from this order. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="text-white bg-red-700 hover:bg-red-600"
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
