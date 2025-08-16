// File: src/components/stats/TopCustomersChart.tsx

import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  LabelList,
} from "recharts";

// CHANGED: The component now expects the pre-calculated list of top customers
interface TopCustomersChartProps {
  data: { name: string; count: number }[];
}

export default function TopCustomersChart({ data }: TopCustomersChartProps) {
  // REMOVED: All the logic for counting, grouping, and sorting orders is now gone!
  // The backend now provides this data pre-calculated.

  // Show a message if there's no data to display
  if (!data || data.length === 0) {
    return (
      <div className="text-center text-gray-500">
        No customer data to display.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={240}>
      {/* CHANGED: Using a vertical layout consistent with the consultants chart */}
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="#e5e7eb"
          horizontal={false}
        />
        <YAxis
          type="category"
          dataKey="name"
          width={120} // A bit wider for potentially longer customer names
          tickLine={false}
          axisLine={false}
          fontSize={12}
        />
        <XAxis type="number" hide />
        <Tooltip
          cursor={{ fill: "#f3f4f6" }}
          contentStyle={{ borderRadius: "0.5rem", border: "1px solid #e5e7eb" }}
        />
        <Bar dataKey="count" fill="#3b82f6" radius={[0, 4, 4, 0]}>
          <LabelList
            dataKey="count"
            position="right"
            style={{ fill: "#374151", fontSize: 12 }}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
