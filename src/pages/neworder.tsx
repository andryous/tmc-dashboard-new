// src/pages/NewOrder.tsx

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CustomerCombobox } from "@/components/CustomerCombobox";
import { ConsultantCombobox } from "@/components/ConsultantCombobox";
import { ParentOrderCombobox } from "@/components/ParentOrderCombobox";
import NewCustomerForm from "@/components/customers/NewCustomerForm";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { API_BASE_URL } from "@/lib/api";

export default function NewOrder() {
  const [fromAddress, setFromAddress] = useState("");
  const [toAddress, setToAddress] = useState("");
  const [serviceType, setServiceType] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [note, setNote] = useState("");
  const [customerId, setCustomerId] = useState("");
  const [consultantId, setConsultantId] = useState("");
  const [customers, setCustomers] = useState<
    { id: number; firstName: string; lastName: string }[]
  >([]);
  const [consultants, setConsultants] = useState<
    { id: number; firstName: string; lastName: string }[]
  >([]);
  const [parentOrderId, setParentOrderId] = useState<number | null>(null);

  const [isNewCustomer, setIsNewCustomer] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/persons/by-role/CONSULTANT`)
      .then((res) => res.json())
      .then(setConsultants)
      .catch((err) => console.error("Error fetching consultants", err));
  }, []);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/persons?role=CUSTOMER`)
      .then((res) => res.json())
      .then((data) =>
        setCustomers(data.filter((p: any) => p.personRole === "CUSTOMER"))
      )
      .catch((err) => console.error("Error fetching customers", err));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      let finalCustomerId = customerId;

      if (isNewCustomer) {
        if (!newCustomer.firstName.trim()) {
          toast.error("First name is required.");
          setIsSubmitting(false);
          return;
        }
        if (!newCustomer.lastName.trim()) {
          toast.error("Last name is required.");
          setIsSubmitting(false);
          return;
        }
        if (!newCustomer.address.trim()) {
          toast.error("Address is required.");
          setIsSubmitting(false);
          return;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(newCustomer.email)) {
          toast.error("Please enter a valid email address.");
          setIsSubmitting(false);
          return;
        }
        const phoneRegex = /^\+?\d+$/;
        if (!phoneRegex.test(newCustomer.phone)) {
          toast.error("Please enter a valid phone number.");
          setIsSubmitting(false);
          return;
        }

        const customerResponse = await fetch(`${API_BASE_URL}/api/persons`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            firstName: newCustomer.firstName,
            lastName: newCustomer.lastName,
            email: newCustomer.email,
            phoneNumber: newCustomer.phone,
            address: newCustomer.address,
            personRole: "CUSTOMER",
          }),
        });

        if (!customerResponse.ok) throw new Error("Failed to create customer");

        const createdCustomer = await customerResponse.json();
        finalCustomerId = String(createdCustomer.id);
      }

      const response = await fetch(`${API_BASE_URL}/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fromAddress,
          toAddress,
          serviceType: serviceType.toUpperCase(),
          startDate,
          endDate,
          note,
          status: "PENDING",
          customerId: Number(finalCustomerId),
          consultantId: consultantId ? Number(consultantId) : null,
          modifiedByConsultantId: null,
          parentOrderId: parentOrderId ?? null,
        }),
      });

      if (!response.ok) throw new Error("Failed to create order");

      toast.success("Order created successfully!");
      setTimeout(() => navigate("/orders"), 500);
    } catch (error) {
      console.error("Error creating order:", error);
      toast.error("Failed to create order");
    } finally {
      setIsSubmitting(false);
    }
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">New Order</h1>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-xl">
        {/* From address */}
        <div className="space-y-2">
          <Label htmlFor="fromAddress">From Address</Label>
          <Input
            id="fromAddress"
            value={fromAddress}
            onChange={(e) => setFromAddress(e.target.value)}
            placeholder="Enter starting address"
            className="border-blue-500 focus-visible:ring-blue-500"
          />
        </div>

        {/* To address */}
        <div className="space-y-2">
          <Label htmlFor="toAddress">To Address</Label>
          <Input
            id="toAddress"
            value={toAddress}
            onChange={(e) => setToAddress(e.target.value)}
            placeholder="Enter destination address (use comma for multiple)"
            className="border-blue-500 focus-visible:ring-blue-500"
          />
        </div>

        {/* Service type */}
        <div className="space-y-2">
          <Label htmlFor="serviceType">Service Type</Label>
          <Select onValueChange={setServiceType}>
            <SelectTrigger
              id="serviceType"
              className="border-blue-500 focus-visible:ring-blue-500"
            >
              <SelectValue placeholder="Select a service type" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="MOVING">Moving</SelectItem>
              <SelectItem value="CLEANING">Cleaning</SelectItem>
              <SelectItem value="PACKING">Packing</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Parent order only if PACKING or CLEANING */}
        {(serviceType === "CLEANING" || serviceType === "PACKING") && (
          <div className="space-y-2">
            <Label htmlFor="parentOrderId">Parent Order</Label>
            <ParentOrderCombobox
              selectedId={parentOrderId}
              setSelectedId={setParentOrderId}
              serviceType={serviceType}
              setCustomerIdFromParent={setCustomerId}
              setConsultantIdFromParent={setConsultantId}
            />
          </div>
        )}

        {/* Dates */}
        <div className="space-y-2">
          <Label htmlFor="startDate">Start Date</Label>
          <Input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            min={today}
            className="border-blue-500 focus-visible:ring-blue-500"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="endDate">End Date</Label>
          <Input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            min={startDate || today}
            className="border-blue-500 focus-visible:ring-blue-500"
            required
          />
        </div>

        {/* Customer combobox only for MOVING */}
        {serviceType === "MOVING" && (
          <div className="space-y-2">
            <Label htmlFor="customerId">Customer</Label>
            <CustomerCombobox
              customers={customers}
              selectedId={customerId}
              setSelectedId={setCustomerId}
              setIsNewCustomer={setIsNewCustomer}
            />
          </div>
        )}

        {/* Show new customer form only if requested */}
        {isNewCustomer && (
          <NewCustomerForm
            newCustomer={newCustomer}
            setNewCustomer={setNewCustomer}
          />
        )}

        {/* Consultant combobox only for MOVING */}
        {serviceType === "MOVING" && (
          <div className="space-y-2">
            <Label htmlFor="consultantId">Consultant</Label>
            <ConsultantCombobox
              consultants={consultants}
              selectedId={consultantId}
              setSelectedId={setConsultantId}
            />
          </div>
        )}

        {/* Note field */}
        <div className="space-y-2">
          <Label htmlFor="note">Note</Label>
          <textarea
            id="note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Optional comments"
            className="border-blue-500 focus-visible:ring-blue-500 w-full min-h-[120px] rounded-md border px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1"
          />
        </div>

        {/* Submit button */}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-600 text-white hover:bg-blue-700"
        >
          {isSubmitting ? "Creating..." : "Create Order"}
        </Button>
      </form>
    </div>
  );
}
