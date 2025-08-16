// File: src/components/stats/OrdersBarChart.tsx

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";

// CHANGED: The component now expects the pre-calculated monthly data
interface OrdersBarChartProps {
  data: Record<string, number>;
}

export default function OrdersBarChart({ data }: OrdersBarChartProps) {
  // REMOVED: All complex date-fns logic and filtering is now gone.

  // CHANGED: We just transform the data from the backend into the array format Recharts needs.
  const chartData = Object.entries(data).map(([month, count]) => ({
    name: month,
    Orders: count, // Use "Orders" as the key for a nice tooltip/legend label
  }));

  // Show a message if there's no data to display
  if (chartData.length === 0) {
    return (
      <div className="text-center text-gray-500">
        No monthly data to display.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        {/* CHANGED: dataKey is now 'name' to match our new data structure */}
        <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis
          fontSize={12}
          tickLine={false}
          axisLine={false}
          allowDecimals={false}
        />
        <Tooltip
          cursor={{ fill: "#f3f4f6" }} // light gray background on hover
          contentStyle={{ borderRadius: "0.5rem", border: "1px solid #e5e7eb" }}
        />
        <Legend verticalAlign="top" height={36} />
        {/* CHANGED: dataKey is now 'Orders' to match our new data structure */}
        <Bar dataKey="Orders" fill="#3b82f6" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
