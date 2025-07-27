// src/components/customers/NewCustomerForm.tsx

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { API_BASE_URL } from "@/lib/api";

// Props definition
type Props = {
  newCustomer?: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
  };
  setNewCustomer?: (customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
  }) => void;
  onSuccess?: (createdOrUpdatedCustomer: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    address: string;
    personRole: string;
    archived: boolean;
  }) => void;
  customerId?: number;
  showSubmitButton?: boolean;
};

export default function NewCustomerForm({
  newCustomer,
  setNewCustomer,
  onSuccess,
  customerId,
  showSubmitButton = false,
}: Props) {
  const [localCustomer, setLocalCustomer] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
  });

  const currentCustomer = newCustomer ?? localCustomer;
  const updateCustomer = setNewCustomer ?? setLocalCustomer;

  const handleSubmit = async () => {
    // Validaciones
    if (!currentCustomer.firstName.trim()) {
      toast.error("First name is required.");
      return;
    }
    if (!currentCustomer.lastName.trim()) {
      toast.error("Last name is required.");
      return;
    }
    if (!currentCustomer.address.trim()) {
      toast.error("Address is required.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(currentCustomer.email)) {
      toast.error("Please enter a valid email address.");
      return;
    }
    const phoneRegex = /^\+?\d+$/;
    if (!phoneRegex.test(currentCustomer.phone)) {
      toast.error("Please enter a valid phone number.");
      return;
    }

    const isEditing = !!newCustomer && !!customerId;
    const url = `${API_BASE_URL}/api/persons${
      isEditing ? `/${customerId}` : ""
    }`;
    const method = isEditing ? "PUT" : "POST";
    if (isEditing && !customerId) {
      toast.error("Customer ID is required for updates.");
      return;
    }
    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstName: currentCustomer.firstName,
        lastName: currentCustomer.lastName,
        email: currentCustomer.email,
        phoneNumber: currentCustomer.phone,
        address: currentCustomer.address,
        personRole: "CUSTOMER",
      }),
    });

    if (!response.ok) {
      toast.error("Failed to save customer.");
      return;
    }

    const savedCustomer = await response.json();
    toast.success(
      `Customer ${isEditing ? "updated" : "created"} successfully!`
    );

    if (onSuccess) {
      onSuccess(savedCustomer);
    }

    // si es un formulario local, reseteamos
    if (!newCustomer) {
      setLocalCustomer({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        address: "",
      });
    }
  };

  return (
    <div className="space-y-2 max-w-md">
      <Input
        placeholder="First name"
        value={currentCustomer.firstName}
        onChange={(e) =>
          updateCustomer({ ...currentCustomer, firstName: e.target.value })
        }
        className="border-blue-500 focus-visible:ring-blue-500"
      />
      <Input
        placeholder="Last name"
        value={currentCustomer.lastName}
        onChange={(e) =>
          updateCustomer({ ...currentCustomer, lastName: e.target.value })
        }
        className="border-blue-500 focus-visible:ring-blue-500"
      />
      <Input
        placeholder="Email"
        value={currentCustomer.email}
        onChange={(e) =>
          updateCustomer({ ...currentCustomer, email: e.target.value })
        }
        className="border-blue-500 focus-visible:ring-blue-500"
      />
      <Input
        placeholder="Phone"
        value={currentCustomer.phone}
        onChange={(e) =>
          updateCustomer({ ...currentCustomer, phone: e.target.value })
        }
        className="border-blue-500 focus-visible:ring-blue-500"
      />
      <Input
        placeholder="Address"
        value={currentCustomer.address}
        onChange={(e) =>
          updateCustomer({ ...currentCustomer, address: e.target.value })
        }
        className="border-blue-500 focus-visible:ring-blue-500"
      />

      {showSubmitButton && (
        <Button
          onClick={handleSubmit}
          className="bg-blue-600 text-white hover:bg-blue-700 w-full mt-4"
        >
          {customerId ? "Update Customer" : "Create Customer"}
        </Button>
      )}
    </div>
  );
}
