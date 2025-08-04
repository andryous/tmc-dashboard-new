import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { Order } from "@/types/order";

interface OrdersPieChartProps {
  orders: Order[];
}

const STATUS_COLORS: Record<string, string> = {
  PENDING: "#fbbf24", // amber-400
  IN_PROGRESS: "#3b82f6", // blue-500
  COMPLETED: "#10b981", // green-500
  CANCELLED: "#ef4444", // red-500
};

export default function OrdersPieChart({ orders }: OrdersPieChartProps) {
  const data = Object.entries(
    orders.reduce<Record<string, number>>((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {})
  ).map(([status, count]) => ({
    name: status,
    value: count,
  }));

  return (
    <ResponsiveContainer width="100%" height={240}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={100}
          label
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.name]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend
          verticalAlign="bottom"
          height={36}
          formatter={(value) => {
            // puedes hacerlo lowercase, capitalizar o incluso traducir
            if (value === "IN_PROGRESS") return "In progress";
            if (value === "PENDING") return "Pending";
            if (value === "COMPLETED") return "Completed";
            if (value === "CANCELLED") return "Cancelled";
            return value;
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
