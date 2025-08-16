// File: src/components/stats/ConsultantsChart.tsx

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

// CHANGED: The component now expects the pre-calculated list of top performers
interface ConsultantsChartProps {
  data: { name: string; count: number }[];
}

export default function ConsultantsChart({ data }: ConsultantsChartProps) {
  // REMOVED: All the logic for counting and grouping orders is now gone!

  // Show a message if there's no data to display
  if (!data || data.length === 0) {
    return (
      <div className="text-center text-gray-500">
        No consultant data to display.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={240}>
      {/* CHANGED: Switched to a vertical layout which is better for top-N lists */}
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
        {/* Y-Axis now shows the consultant names */}
        <YAxis
          type="category"
          dataKey="name"
          width={100}
          tickLine={false}
          axisLine={false}
          fontSize={12}
        />
        {/* X-Axis is the count, but we hide it for a cleaner look */}
        <XAxis type="number" hide />
        <Tooltip
          cursor={{ fill: "#f3f4f6" }}
          contentStyle={{ borderRadius: "0.5rem", border: "1px solid #e5e7eb" }}
        />
        <Bar dataKey="count" fill="#3b82f6" radius={[0, 4, 4, 0]}>
          {/* This adds the count number directly on the bar */}
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
