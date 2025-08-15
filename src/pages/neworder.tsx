// File: src/pages/neworder.tsx

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CustomerCombobox } from "@/components/CustomerCombobox";
import { ConsultantCombobox } from "@/components/ConsultantCombobox";
import NewCustomerForm from "@/components/customers/NewCustomerForm";
import { createOrder } from "@/services/orderService";
import type { Person } from "@/types/person";
import { Trash2, PackagePlus, Truck, Box, Sparkles } from "lucide-react";
import { API_BASE_URL } from "@/lib/api";

type StagedItem = {
  serviceType: "MOVING" | "PACKING" | "CLEANING" | "";
  fromAddress: string;
  toAddress: string;
  startDate: string;
  endDate: string;
  note: string;
};

export default function NewOrder() {
  const navigate = useNavigate();

  // --- State Management ---
  const [customerId, setCustomerId] = useState("");
  const [consultantId, setConsultantId] = useState("");
  const [isNewCustomer, setIsNewCustomer] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [stagedItems, setStagedItems] = useState<StagedItem[]>([]);
  const [currentItem, setCurrentItem] = useState<StagedItem>({
    serviceType: "",
    fromAddress: "",
    toAddress: "",
    startDate: "",
    endDate: "",
    note: "",
  });
  const [newCustomer, setNewCustomer] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    address: "",
  });
  const [customers, setCustomers] = useState<Person[]>([]);
  const [consultants, setConsultants] = useState<Person[]>([]);

  // --- Data Fetching ---
  useEffect(() => {
    const fetchPeople = async () => {
      try {
        const [customerResponse, consultantResponse] = await Promise.all([
          fetch(`${API_BASE_URL}/api/persons/by-role/CUSTOMER`),
          fetch(`${API_BASE_URL}/api/persons/by-role/CONSULTANT`),
        ]);

        if (!customerResponse.ok || !consultantResponse.ok) {
          throw new Error("Failed to fetch person data from the backend.");
        }

        const customerData = await customerResponse.json();
        const consultantData = await consultantResponse.json();

        setCustomers(customerData);
        setConsultants(consultantData);
      } catch (error) {
        toast.error("Failed to load Customers or Consultants.");
        console.error("Data fetching error:", error);
      }
    };

    fetchPeople();
  }, []);

  // --- Event Handlers ---
  const handleAddItem = () => {
    if (
      !currentItem.serviceType ||
      !currentItem.startDate ||
      !currentItem.endDate ||
      !currentItem.fromAddress
    ) {
      toast.error(
        "Service Type, Start Date, End Date and From Address are required to add an item."
      );
      return;
    }
    setStagedItems([...stagedItems, currentItem]);

    toast.success("Service added to summary!");

    setCurrentItem({
      serviceType: "",
      fromAddress: "",
      toAddress: "",
      startDate: "",
      endDate: "",
      note: "",
    });
  };

  const handleRemoveItem = (index: number) => {
    setStagedItems(stagedItems.filter((_, i) => i !== index));
  };

  // File: src/pages/neworder.tsx (function replacement)

  // File: src/pages/neworder.tsx (function replacement)

  const handleSubmitOrder = async () => {
    // --- DETAILED VALIDATION BLOCK ---
    if (isNewCustomer) {
      if (!newCustomer.firstName.trim()) {
        toast.error("First name is required.");
        return;
      }
      if (!newCustomer.lastName.trim()) {
        toast.error("Last name is required.");
        return;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!newCustomer.email.trim() || !emailRegex.test(newCustomer.email)) {
        toast.error("A valid email address is required.");
        return;
      }
      const phoneRegex = /^\+?\d+$/;
      if (
        !newCustomer.phoneNumber.trim() ||
        !phoneRegex.test(newCustomer.phoneNumber)
      ) {
        toast.error(
          "A valid phone number is required (only digits and optional '+')."
        );
        return;
      }
      if (!newCustomer.address.trim()) {
        toast.error("Address is required.");
        return;
      }
    }
    // --- END DETAILED VALIDATION BLOCK ---
    else if (!customerId) {
      toast.error("A customer must be selected.");
      return;
    }

    if (stagedItems.length === 0) {
      toast.error("You must add at least one service to the order.");
      return;
    }
    if (!consultantId) {
      toast.error("A consultant must be assigned.");
      return;
    }

    setIsSubmitting(true);

    try {
      let finalCustomerId: number | null = customerId
        ? Number(customerId)
        : null;

      if (isNewCustomer) {
        const custResponse = await fetch(`${API_BASE_URL}/api/persons`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...newCustomer, personRole: "CUSTOMER" }),
        });

        if (!custResponse.ok) {
          const errorData = await custResponse.json().catch(() => null);
          const backendMessage =
            errorData?.message ||
            `Request failed with status: ${custResponse.status}`;
          throw new Error(`Failed to create new customer: ${backendMessage}`);
        }

        const createdCustomer = await custResponse.json();
        finalCustomerId = createdCustomer.id;
      }

      if (finalCustomerId === null) {
        toast.error("Unexpected error: Customer ID could not be determined.");
        setIsSubmitting(false);
        return;
      }

      const orderPayload = {
        customerId: finalCustomerId,
        consultantId: Number(consultantId),
        status: "PENDING",
        items: stagedItems.map((item) => ({ ...item, status: "PENDING" })),
      };

      await createOrder(orderPayload);

      toast.success("Order created successfully!");
      navigate("/orders");
    } catch (error) {
      toast.error((error as Error).message);
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper component to render the correct icon based on the service type.
  const ServiceIcon = ({
    serviceType,
  }: {
    serviceType: StagedItem["serviceType"];
  }) => {
    const iconProps = { className: "w-5 h-5 mr-2 text-blue-600" };
    switch (serviceType) {
      case "MOVING":
        return <Truck {...iconProps} />;
      case "PACKING":
        return <Box {...iconProps} />;
      case "CLEANING":
        return <Sparkles {...iconProps} />;
      default:
        return null;
    }
  };

  const today = new Date().toISOString().split("T")[0];

  // --- JSX Render ---
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">New Order</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6 p-6 border border-blue-500 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold border-b border-gray-300 pb-2">
            1. Select Customer & Consultant
          </h2>
          <div className="space-y-4">
            <CustomerCombobox
              customers={customers}
              selectedId={customerId}
              setSelectedId={setCustomerId}
              setIsNewCustomer={setIsNewCustomer}
            />
            {isNewCustomer && (
              <NewCustomerForm
                newCustomer={newCustomer}
                setNewCustomer={setNewCustomer}
              />
            )}
            <ConsultantCombobox
              consultants={consultants}
              selectedId={consultantId}
              setSelectedId={setConsultantId}
            />
          </div>

          <h2 className="text-lg font-semibold border-b border-gray-300 pb-2">
            2. Configure a Service
          </h2>
          <div className="space-y-2">
            <Label>Service Type</Label>
            <Select
              value={currentItem.serviceType}
              onValueChange={(val) =>
                setCurrentItem({
                  ...currentItem,
                  serviceType: val as StagedItem["serviceType"],
                })
              }
            >
              <SelectTrigger className="border-blue-500 focus:ring-blue-500">
                <SelectValue placeholder="Select a service" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="MOVING" className="focus:bg-blue-200">
                  Moving
                </SelectItem>
                <SelectItem value="PACKING" className="focus:bg-blue-200">
                  Packing
                </SelectItem>
                <SelectItem value="CLEANING" className="focus:bg-blue-200">
                  Cleaning
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>From Address</Label>
            <Input
              value={currentItem.fromAddress}
              onChange={(e) =>
                setCurrentItem({ ...currentItem, fromAddress: e.target.value })
              }
              placeholder="Starting address"
              className="w-full justify-between border-blue-500 focus-visible:ring-blue-500 focus-visible:outline-none"
            />
          </div>
          <div className="space-y-2">
            <Label>To Address</Label>
            <Input
              value={currentItem.toAddress}
              onChange={(e) =>
                setCurrentItem({ ...currentItem, toAddress: e.target.value })
              }
              placeholder="Destination (if any)"
              className="w-full justify-between border-blue-500 focus-visible:ring-blue-500 focus-visible:outline-none"
            />
          </div>

          <div className="flex gap-4">
            <div className="space-y-2 w-full">
              <Label>Start Date</Label>
              <Input
                type="date"
                value={currentItem.startDate}
                onChange={(e) => {
                  const newStartDate = e.target.value;
                  // Check if the new start date is after the current end date.
                  // "YYYY-MM-DD" string comparison works for this check.
                  if (
                    currentItem.endDate &&
                    newStartDate > currentItem.endDate
                  ) {
                    // If it is, update both the start and end date to match.
                    setCurrentItem({
                      ...currentItem,
                      startDate: newStartDate,
                      endDate: newStartDate,
                    });
                  } else {
                    // Otherwise, just update the start date as usual.
                    setCurrentItem({
                      ...currentItem,
                      startDate: newStartDate,
                    });
                  }
                }}
                min={today}
                className="w-full justify-between border-blue-500 focus-visible:ring-blue-500 focus-visible:outline-none"
              />
            </div>
            <div className="space-y-2 w-full">
              <Label>End Date</Label>
              <Input
                type="date"
                value={currentItem.endDate}
                onChange={(e) =>
                  setCurrentItem({ ...currentItem, endDate: e.target.value })
                }
                min={currentItem.startDate || today}
                className="w-full justify-between border-blue-500 focus-visible:ring-blue-500 focus-visible:outline-none"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Note for this service</Label>
            <Textarea
              value={currentItem.note}
              onChange={(e) =>
                setCurrentItem({ ...currentItem, note: e.target.value })
              }
              placeholder="Optional comments for this specific service..."
              className="w-full justify-between border-blue-500 focus-visible:ring-blue-500 focus-visible:outline-none"
            />
          </div>

          <Button
            onClick={handleAddItem}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white"
          >
            <PackagePlus className="w-4 h-4 mr-2" />
            Add Service to Order
          </Button>
        </div>

        {/* --- ORDER SUMMARY SECTION --- */}
        <div className="flex flex-col p-6 border border-blue-500 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold border-b border-blue-500 pb-2">
            3. Order Summary
          </h2>

          {stagedItems.length === 0 ? (
            <div className="flex-grow flex items-center justify-center">
              <p className="text-gray-500 text-center py-8">
                Services you add will appear here.
              </p>
            </div>
          ) : (
            <div className="flex-grow space-y-3 my-4 overflow-y-auto pr-2">
              {stagedItems.map((item, index) => (
                <div
                  key={index}
                  className="p-3 border border-blue-300 rounded-md bg-gray-50 relative"
                >
                  <div className="flex items-center font-bold text-md capitalize">
                    <ServiceIcon serviceType={item.serviceType} />
                    {item.serviceType.toLowerCase()}
                  </div>
                  <p className="text-sm text-gray-600">
                    <strong>From:</strong> {item.fromAddress}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>To:</strong> {item.toAddress || "N/A"}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Dates:</strong> {item.startDate} to {item.endDate}
                  </p>
                  {item.note && (
                    <p className="text-sm text-gray-600 mt-1 italic">
                      "{item.note}"
                    </p>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-1 right-1 h-7 w-7"
                    onClick={() => handleRemoveItem(index)}
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          {stagedItems.length > 0 && (
            <Button
              onClick={handleSubmitOrder}
              disabled={isSubmitting}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white mt-auto"
            >
              {isSubmitting ? "Submitting..." : "Submit Final Order"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
