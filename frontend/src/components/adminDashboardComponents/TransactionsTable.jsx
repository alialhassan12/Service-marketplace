const transactions = [
    { id: "TXN-8A34-F1C3", client: "Liam Johnson", provider: "Olivia Chen", amount: 250.0, status: "Success", date: "2024-05-20" },
    { id: "TXN-489B-ED24", client: "Sophia Rodriguez", provider: "Noah Kim", amount: 1500.0, status: "Success", date: "2024-05-19" },
    { id: "TXN-C7F2-A586", client: "Ethan Williams", provider: "Ava Garcia", amount: 75.5, status: "Processing", date: "2024-05-19" },
    { id: "TXN-9D1E-8BC9", client: "Isabella Martinez", provider: "Mason Brown", amount: 520.0, status: "Success", date: "2024-05-18" },
    { id: "TXN-2A6B-C3D7", client: "James Taylor", provider: "Charlotte Lee", amount: 95.0, status: "Failed", date: "2024-05-17" },
  ];
  
  function StatusPill({ status }) {
    const map = {
      Success:    { color: "bg-emerald-400", tint: "bg-emerald-400/10", text: "text-emerald-300" },
      Processing: { color: "bg-blue-400",    tint: "bg-blue-400/10",    text: "text-blue-300" },
      Failed:     { color: "bg-rose-400",    tint: "bg-rose-400/10",    text: "text-rose-300" },
    };
    const s = map[status] || map.Success;
    return (
      <span className={`inline-flex items-center gap-2 ${s.text} ${s.tint} px-2 py-1 rounded-md`}>
        <span className={`h-2 w-2 rounded-full ${s.color}`} />
        {status}
      </span>
    );
  }
  
  export default function TransactionsTable() {
    return (
      <div className="card p-4">
        <p className="text-sm text-muted mb-3">Recent Transactions</p>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-muted">
                <th className="py-2 font-medium">TRANSACTION ID</th>
                <th className="py-2 font-medium">CLIENT</th>
                <th className="py-2 font-medium">PROVIDER</th>
                <th className="py-2 font-medium">AMOUNT</th>
                <th className="py-2 font-medium">STATUS</th>
                <th className="py-2 font-medium">DATE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {transactions.map((t) => (
                <tr key={t.id} className="hover:bg-white/5">
                  <td className="py-3"><span className="text-xs bg-white/5 px-2 py-1 rounded-md">{t.id}</span></td>
                  <td className="py-3 font-medium">{t.client}</td>
                  <td className="py-3">{t.provider}</td>
                  <td className="py-3">${t.amount.toFixed(2)}</td>
                  <td className="py-3"><StatusPill status={t.status} /></td>
                  <td className="py-3 text-muted">{t.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
  