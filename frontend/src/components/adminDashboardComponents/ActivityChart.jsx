import {
  LineChart,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

export default function ActivityChart({ data }) {
  return (
    <div className="card p-4 h-full flex flex-col">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm text-muted">Revenue Overview</p>
        <button className="text-xs text-muted hover:text-white bg-white/5 px-2 py-1 rounded-md">
          Last 7 Days
        </button>
      </div>
      <div className="flex-1 min-h-48">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ left: 10, right: 10 }}>
            <XAxis
              dataKey="name"
              tick={{ fill: "rgba(255,255,255,0.6)", fontSize: 11 }}
            />
            <YAxis 
                tick={{ fill: "rgba(255,255,255,0.6)", fontSize: 11 }} 
                tickFormatter={(value) => `$${value}`}
            />
            <Tooltip
              contentStyle={{
                background: "#0b1220",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 12,
                color: "white",
              }}
              labelStyle={{ color: "rgba(255,255,255,0.7)" }}
              formatter={(value) => [`$${value}`, "Revenue"]}
            />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#8b5cf6"
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
