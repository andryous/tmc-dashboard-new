import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ConsultantCombobox } from "@/components/ConsultantCombobox";
import { toast } from "sonner";

import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

// Page to edit an existing order
export default function EditOrder() {
  const { id } = useParams(); // Get order ID from URL
  const navigate = useNavigate();

  // Local state for form fields
  const [fromAddress, setFromAddress] = useState("");
  const [toAddress, setToAddress] = useState("");
  const [serviceType, setServiceType] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [note, setNote] = useState("");
  const [customerId, setCustomerId] = useState("");
  const [customerFirstName, setCustomerFirstName] = useState("");
  const [customerLastName, setCustomerLastName] = useState("");
  const [consultantId, setConsultantId] = useState("");
  const [status, setStatus] = useState("");
  const [parentOrderId, setParentOrderId] = useState<number | null>(null);

  // Local state to store consultants fetched from backend
  const [consultants, setConsultants] = useState<
    { id: number; firstName: string; lastName: string }[]
  >([]);

  // Fetch the list of consultants when component mounts
  useEffect(() => {
    fetch("http://localhost:8088/api/persons/by-role/CONSULTANT")
      .then((res) => res.json()) // Parse JSON response
      .then(setConsultants) // Save consultants to local state
      .catch(
        (
          err // Handle error if request fails
        ) => console.error("Error fetching consultants", err)
      );
  }, []);

  // Load order data from backend
  useEffect(() => {
    async function fetchOrder() {
      try {
        const response = await fetch(`http://localhost:8088/api/orders/${id}`);
        const data = await response.json();

        // Populate form fields with existing values
        setFromAddress(data.fromAddress);
        setToAddress(data.toAddress);
        setServiceType(data.serviceType);
        setStartDate(data.startDate);
        setEndDate(data.endDate);
        setNote(data.note);
        setStatus(data.status); // Load existing status into local state
        setParentOrderId(data.parentOrderId);
        setCustomerId(data.customer.id.toString());
        setConsultantId(data.consultant.id.toString());
        setCustomerFirstName(data.customer.firstName);
        setCustomerLastName(data.customer.lastName);
      } catch (error) {
        console.error("Failed to load order", error);
      }
    }

    fetchOrder();
  }, [id]);

  // Handle form submission (PUT)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // ⬇️ Debug: log the full payload before sending the PUT request
      if (import.meta.env.DEV) {
        console.log("📤 Updating order payload:", {
          fromAddress,
          toAddress,
          serviceType,
          startDate,
          endDate,
          note,
          status,
          customerId: Number(customerId),
          consultantId: Number(consultantId),
          modifiedByConsultantId: Number(consultantId),
          parentOrderId: parentOrderId,
        });
      }

      const response = await fetch(`http://localhost:8088/api/orders/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fromAddress,
          toAddress,
          serviceType,
          startDate,
          endDate,
          note,
          status,
          customerId: Number(customerId),
          consultantId: Number(consultantId), // This is the assigned consultant
          mmodifiedByConsultantId: Number(consultantId),

          parentOrderId: parentOrderId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update order");
      }

      toast.success("Order updated successfully!");

      setTimeout(() => {
        navigate("/orders");
      }, 500);

      navigate("/orders");
    } catch (error) {
      console.error("Error updating order:");
      alert("Failed to update order");
    }
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="p-6 space-y-6">
      {/* Page title */}
      <h1 className="text-2xl font-bold">Edit Order #{id}</h1>

      {/* Order edit form */}
      <form onSubmit={handleSubmit} className="space-y-6 max-w-xl">
        {/* Same structure as create form */}
        {/* From Address */}
        <div className="space-y-2">
          <Label htmlFor="fromAddress">From Address</Label>
          <Input
            className="border-blue-500 focus-visible:ring-blue-500"
            id="fromAddress"
            value={fromAddress}
            onChange={(e) => setFromAddress(e.target.value)}
            placeholder="Enter starting address"
          />
        </div>
        {/* To Address */}
        <div className="space-y-2">
          <Label htmlFor="toAddress">To Address</Label>

          <Input
            className="border-blue-500 focus-visible:ring-blue-500"
            id="toAddress"
            value={toAddress}
            onChange={(e) => setToAddress(e.target.value)}
            placeholder="Enter destination address (use comma for multiple)"
          />
        </div>
        {/* Service Type (readonly when editing) */}
        <div className="space-y-2">
          <Label htmlFor="serviceType">Service Type</Label>
          <Select value={serviceType} onValueChange={() => {}} disabled>
            <SelectTrigger
              id="serviceType"
              className="bg-gray-100 cursor-not-allowed  border-blue-500 focus-visible:ring-blue-500"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="MOVING">Moving</SelectItem>
              <SelectItem value="CLEANING">Cleaning</SelectItem>
              <SelectItem value="PACKING">Packing</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Start date */}
        <div className="space-y-2">
          <Label htmlFor="startDate">Start Date</Label>
          <Input
            className="border-blue-500 focus-visible:ring-blue-500"
            id="startDate"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            min={today} // Prevent selecting dates in the past
            required
          />
        </div>
        {/* End date */}
        <div className="space-y-2">
          <Label htmlFor="endDate">End Date</Label>
          <Input
            className="border-blue-500 focus-visible:ring-blue-500"
            id="endDate"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            min={startDate || today} // End date can't be before start date
            required
          />
        </div>
        {/* Customer info (readonly) */}
        <div className="space-y-2">
          <Label htmlFor="customerName">Customer</Label>
          <Input
            className="border-blue-500 focus-visible:ring-blue-500"
            id="customerName"
            value={`${customerId} – ${customerFirstName} ${customerLastName}`}
            disabled
          />
        </div>

        {/* Consultant ID.  Field to select the consultant using a dropdown */}
        <div className="space-y-2">
          <Label htmlFor="consultantId">Consultant</Label>
          <ConsultantCombobox
            consultants={consultants} // List of available consultants
            selectedId={consultantId} // Current selected consultant ID
            setSelectedId={setConsultantId} // Function to update selected consultant
          />
        </div>

        {/* Status field */}
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger id="status">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
              <SelectItem value="COMPLETED">Completed</SelectItem>
              <SelectItem value="CANCELLED">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Parent Order ID – Only show if order is a child */}
        {parentOrderId !== null && (
          <div className="space-y-2">
            <Label htmlFor="parentOrderId">Parent Order ID</Label>
            <Input
              id="parentOrderId"
              value={`#${parentOrderId}`}
              disabled
              className="bg-gray-100 cursor-not-allowed border-blue-500 focus-visible:ring-blue-500"
            />
          </div>
        )}

        {/* Note */}
        <div className="space-y-2">
          <Label htmlFor="note">Note</Label>
          <textarea
            id="note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className=" border-blue-500 focus-visible:ring-blue-500 w-full min-h-[120px] rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          />
        </div>
        {/* Submit button */}
        <Button type="submit" className="w-full">
          Update Order
        </Button>
      </form>
    </div>
  );
}
