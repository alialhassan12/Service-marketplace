export default function StatCard({ title, value, delta, positive }) {
  return (
    <div className="card p-5">
      <p className="text-sm text-muted">{title}</p>
      <div className="mt-2 flex items-end justify-between">
        <h3 className="text-3xl font-semibold text-primary">{value}</h3>
        <span
          className={`text-sm rounded-md px-2 py-1 ${
            positive
              ? "text-emerald-400 bg-emerald-400/10"
              : "text-amber-400 bg-amber-400/10"
          }`}
        >
          {delta}
        </span>
      </div>
    </div>
  );
}
