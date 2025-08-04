// File: src/components/stats/OrdersBarChart.tsx

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
import { format, subWeeks, eachWeekOfInterval } from "date-fns";

interface OrdersBarChartProps {
  orders: Order[];
}

export default function OrdersBarChart({ orders }: OrdersBarChartProps) {
  // Get current date and range for past 4 weeks
  const now = new Date();
  const weeks = eachWeekOfInterval({
    start: subWeeks(now, 3),
    end: now,
  });

  // Build data grouped by week
  const data = weeks.map((weekStart) => {
    const weekLabel = format(weekStart, "MMM d");
    const count = orders.filter((order) => {
      const date = new Date(order.startDate);
      return date >= weekStart && date < subWeeks(weekStart, -1);
    }).length;
    return { week: weekLabel, count };
  });

  return (
    <>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="week" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </>
  );
}
