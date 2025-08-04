// File: src/components/stats/TopCustomersChart.tsx

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import type { Order } from "@/types/order";
import { getFullName } from "@/lib/fullName";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TopCustomersChartProps {
  orders: Order[];
}

export default function TopCustomersChart({ orders }: TopCustomersChartProps) {
  // Count orders per customer
  const counts: Record<string, number> = {};

  orders.forEach((order) => {
    const name = order.customer ? getFullName(order.customer) : "Unknown";
    counts[name] = (counts[name] || 0) + 1;
  });

  // Convert to array and get top 5 customers
  const data = Object.entries(counts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={data} layout="vertical" margin={{ left: 20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />{" "}
        {/* gris claro */}
        <XAxis type="number" allowDecimals={false} />
        <YAxis type="category" dataKey="name" width={120} />
        <Tooltip />
        <Bar dataKey="count" fill="#0ea5e9" radius={[0, 4, 4, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
