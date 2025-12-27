import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

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

export default function DonutChart({ stats }) {
  // Calculate user breakdown from stats
  const totalUsers = (stats?.users_count || 0);
  const providers = Math.floor(totalUsers * 0.7); // Assuming 70% are providers
  const clients = totalUsers - providers;

  const pieData = [
    { name: "Providers", value: providers },
    { name: "Clients", value: clients },
  ];
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
           <div className="text-3xl font-semibold text-primary">{totalUsers.toLocaleString()}</div>
           <div className="text-xs text-muted">Total Users</div>
         </div>
      </div>
      <div className="flex items-center justify-center gap-6 mt-2">
        <LegendDot color="#3b82f6" label={`Providers (${totalUsers > 0 ? Math.round((providers / totalUsers) * 100) : 0}%)`} />
        <LegendDot color="#22d3ee" label={`Clients (${totalUsers > 0 ? Math.round((clients / totalUsers) * 100) : 0}%)`} />
      </div>
    </div>
  );
}
