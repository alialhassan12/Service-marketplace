export default function StatCard({ title, value, delta, positive }) {
  return (
    <div className="card p-5">
      <p className="text-sm text-muted">{title}</p>
      <div className="mt-2 flex items-end justify-between">
        <h3 className="text-3xl font-semibold text-primary">{value}</h3>
        {delta && (  // Check if delta exists first
    <span className="...">
      {delta}
    </span>
  )}
      </div>
    </div>
  );
}
