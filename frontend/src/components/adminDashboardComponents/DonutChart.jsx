import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const pieData = [
  { name: "Providers", value: 70 },
  { name: "Clients", value: 30 },
];
const PIE_COLORS = ["#3b82f6", "#22d3ee"];

function LegendDot({ color, label }) {
  return (
    <div className="flex items-center gap-2 text-sm text-muted">
      <span
        className="inline-block h-2.5 w-2.5 rounded-full"
        style={{ background: color }}
      />
      {label}
    </div>
  );
}

export default function DonutChart() {
  return (
    <div className="card p-4 h-full relative flex flex-col items-center">
      <p className="text-sm text-muted mb-2 w-full text-left">User Breakdown</p>
      <div className="flex-1 w-full flex items-center justify-center relative min-h-48">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={pieData}
              innerRadius={60}
              outerRadius={80}
              paddingAngle={3}
              dataKey="value"
              cx="50%"
              cy="50%"
            >
              {pieData.map((_, i) => (
                <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none">
          <div className="text-3xl font-semibold text-primary">1,245</div>
          <div className="text-xs text-muted">Total Users</div>
        </div>
      </div>
      <div className="flex items-center justify-center gap-6 mt-2">
        <LegendDot color="#3b82f6" label="Providers (70%)" />
        <LegendDot color="#22d3ee" label="Clients (30%)" />
      </div>
    </div>
  );
}
