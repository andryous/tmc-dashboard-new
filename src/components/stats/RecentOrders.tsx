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
import { format } from "date-fns";
import { getFullName } from "@/lib/fullName";

interface RecentOrdersProps {
  orders: Order[];
}

export default function RecentOrders({ orders }: RecentOrdersProps) {
  // Sort and get the last 5 orders by startDate
  const recent = [...orders]
    .sort(
      (a, b) =>
        new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
    )
    .slice(0, 5);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="font-semibold">ID</TableHead>
          <TableHead className="font-semibold">Customer</TableHead>
          <TableHead className="font-semibold">Consultant</TableHead>
          <TableHead className="font-semibold">Status</TableHead>
          <TableHead className="font-semibold">Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {recent.map((order) => (
          <TableRow key={order.id}>
            <TableCell>{order.id}</TableCell>
            <TableCell>
              {order.customer ? getFullName(order.customer) : "-"}
            </TableCell>
            <TableCell>
              {order.consultant ? getFullName(order.consultant) : "-"}
            </TableCell>
            <TableCell>
              {order.status
                .toLowerCase() // Pone todo en minúsculas
                .replace(/_/g, " ") // Cambia _ por espacio
                .replace(/^./, (c) => c.toUpperCase())}{" "}
            </TableCell>
            <TableCell>
              {format(new Date(order.startDate), "MMM d, yyyy")}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
