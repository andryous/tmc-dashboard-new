// src/components/orders/OrderDetailsModal.tsx

import type { Order } from "@/types/order";

// Component that shows order details without its own Dialog wrapper
export default function OrderDetailsModal({ order }: { order: Order | null }) {
  if (!order) return null;

  // Helper to format enum-style values (e.g. IN_PROGRESS → In Progress)
  function formatText(text: string) {
    return text
      .toLowerCase()
      .split("_")
      .map((word) => word[0].toUpperCase() + word.slice(1))
      .join(" ");
  }

  return (
    <div className="space-y-2 text-sm">
      <p>
        <strong>Customer:</strong> {order.customer.firstName}{" "}
        {order.customer.lastName}
      </p>
      <p>
        <strong>Phone:</strong> {order.customer.phoneNumber}
      </p>
      <p>
        <strong>Email:</strong> {order.customer.email}
      </p>
      <p>
        <strong>Consultant:</strong>{" "}
        {order.consultant
          ? `${order.consultant.firstName} ${order.consultant.lastName}`
          : "—"}
      </p>
      <p>
        <strong>Service:</strong> {formatText(order.serviceType)}
      </p>
      <p>
        <strong>From:</strong> {order.fromAddress}
      </p>
      <p>
        <strong>To:</strong> {order.toAddress}
      </p>
      <p>
        <strong>Start Date:</strong> {order.startDate}
      </p>
      <p>
        <strong>End Date:</strong> {order.endDate}
      </p>
      <p>
        <strong>Status:</strong> {formatText(order.status)}
      </p>
      <p>
        <strong>Note:</strong> {order.note}
      </p>
    </div>
  );
}
