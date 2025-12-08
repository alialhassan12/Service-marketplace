import {
  LineChart,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

const lineData = [
  { name: "Day 1", users: 220 },
  { name: "Day 5", users: 540 },
  { name: "Day 10", users: 380 },
  { name: "Day 15", users: 720 },
  { name: "Day 20", users: 310 },
  { name: "Day 25", users: 640 },
  { name: "Day 30", users: 690 },
];

export default function ActivityChart() {
  return (
    <div className="card p-4 h-full flex flex-col">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm text-muted">Activity Overview</p>
        <button className="text-xs text-muted hover:text-white bg-white/5 px-2 py-1 rounded-md">
          Last 30 Days
        </button>
      </div>
      <div className="flex-1 min-h-48">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={lineData} margin={{ left: 10, right: 10 }}>
            <XAxis
              dataKey="name"
              tick={{ fill: "rgba(255,255,255,0.6)", fontSize: 11 }}
            />
            <YAxis tick={{ fill: "rgba(255,255,255,0.6)", fontSize: 11 }} />
            <Tooltip
              contentStyle={{
                background: "#0b1220",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 12,
                color: "white",
              }}
              labelStyle={{ color: "rgba(255,255,255,0.7)" }}
            />
            <Line
              type="monotone"
              dataKey="users"
              stroke="#3b82f6"
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
