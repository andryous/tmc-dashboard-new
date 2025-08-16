import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface OrdersPieChartProps {
  data: Record<string, number>;
}

const STATUS_COLORS: Record<string, string> = {
  PENDING: "#fbbf24", // amber-400
  IN_PROGRESS: "#3b82f6", // blue-500
  COMPLETED: "#10b981", // emerald-500
  CANCELLED: "#ef4444", // red-500
};

export default function OrdersPieChart({ data }: OrdersPieChartProps) {
  const chartData = Object.entries(data).map(([status, count]) => ({
    name: status,
    value: count,
  }));

  if (chartData.length === 0) {
    return (
      <div className="text-center text-gray-500">No order data to display.</div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={240}>
      <PieChart>
        <Pie
          data={chartData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={80}
          labelLine={false}
          label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
            // ADDED: Safety check to ensure values are defined
            if (percent === undefined || midAngle === undefined) return null;

            const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
            const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
            const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));
            return percent > 0.05 ? (
              <text
                x={x}
                y={y}
                fill="white"
                textAnchor="middle"
                dominantBaseline="central"
              >
                {`${(percent * 100).toFixed(0)}%`}
              </text>
            ) : null;
          }}
        >
          {chartData.map((entry) => (
            <Cell
              key={`cell-${entry.name}`}
              fill={STATUS_COLORS[entry.name] || "#cccccc"}
            />
          ))}
        </Pie>
        <Tooltip />
        <Legend
          verticalAlign="bottom"
          height={36}
          formatter={(value) => {
            if (value === "IN_PROGRESS") return "In Progress";
            return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
