// File: src/components/stats/RecentOrders.tsx

import type { Order } from "@/types/order";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge"; // Added Badge for consistency

interface RecentOrdersProps {
  orders: Order[]; // This component receives the 5 most recent orders
}

export default function RecentOrders({ orders }: RecentOrdersProps) {
  // No need to sort here anymore, the parent component (statistics.tsx) already does it.

  // Helper to format the status text
  const formatStatus = (status: string) =>
    status
      .toLowerCase()
      .replace(/_/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());

  // Helper to get consistent badge colors
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "IN_PROGRESS":
        return "bg-blue-100 text-blue-800";
      case "COMPLETED":
        return "bg-green-100 text-green-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="font-semibold">ID</TableHead>
          <TableHead className="font-semibold">Customer</TableHead>
          <TableHead className="font-semibold">Consultant</TableHead>
          <TableHead className="font-semibold">Status</TableHead>
          <TableHead className="font-semibold">Created On</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((order) => (
          <TableRow key={order.id}>
            <TableCell>#{order.id}</TableCell>
            <TableCell>
              {order.customer
                ? `${order.customer.firstName} ${order.customer.lastName}`
                : "—"}
            </TableCell>
            <TableCell>
              {order.consultant
                ? `${order.consultant.firstName} ${order.consultant.lastName}`
                : "—"}
            </TableCell>
            <TableCell>
              {/* Using the consistent badge style */}
              <Badge className={getStatusBadgeVariant(order.status)}>
                {formatStatus(order.status)}
              </Badge>
            </TableCell>
            <TableCell>
              {/* CHANGED: Using creationDate which exists on the Order object */}
              {order.creationDate
                ? new Date(order.creationDate).toLocaleDateString()
                : "—"}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
