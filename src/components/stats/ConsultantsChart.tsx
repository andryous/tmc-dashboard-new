// File: src/components/stats/ConsultantsChart.tsx

import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { Order } from "@/types/order";
import { getFullName } from "@/lib/fullName";

interface ConsultantsChartProps {
  orders: Order[];
}

export default function ConsultantsChart({ orders }: ConsultantsChartProps) {
  // Count orders per consultant
  const counts: Record<string, number> = {};

  orders.forEach((order) => {
    const name = order.consultant ? getFullName(order.consultant) : "Unknown";
    counts[name] = (counts[name] || 0) + 1;
  });

  const data = Object.entries(counts).map(([name, count]) => ({ name, count }));

  return (
    <>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data.slice(0, 5)} layout="vertical">
          <XAxis type="number" allowDecimals={false} hide />
          <YAxis type="category" dataKey="name" width={100} />
          <Tooltip />
          <Bar dataKey="count" fill="#2563eb" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </>
  );
}
