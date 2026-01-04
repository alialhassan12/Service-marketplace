import { useEffect, useState } from "react";
import adminStore from "../../store/adminStore";

function StatusPill({ status }) {
  const map = {
    paid: {
      color: "bg-emerald-400",
      tint: "bg-emerald-400/10",
      text: "text-emerald-300",
    },
    pending: {
      color: "bg-blue-400",
      tint: "bg-blue-400/10",
      text: "text-blue-300",
    },
    failed: {
      color: "bg-rose-400",
      tint: "bg-rose-400/10",
      text: "text-rose-300",
    },
  };
  // Default to pending style if status not found
  const s = map[status?.toLowerCase()] || map.pending;
  return (
    <span
      className={`inline-flex items-center gap-2 ${s.text} ${s.tint} px-2 py-1 rounded-md capitalize`}
    >
      <span className={`h-2 w-2 rounded-full ${s.color}`} />
      {status}
    </span>
  );
}

function SkeletonRow() {
  return (
    <tr className="animate-pulse border-b border-white/5">
      <td className="py-3">
        <div className="h-5 w-24 bg-white/10 rounded"></div>
      </td>
      <td className="py-3">
        <div className="h-4 w-32 bg-white/10 rounded mb-1"></div>
      </td>
      <td className="py-3">
        <div className="h-4 w-32 bg-white/10 rounded"></div>
      </td>
      <td className="py-3">
        <div className="h-4 w-16 bg-white/10 rounded"></div>
      </td>
      <td className="py-3">
        <div className="h-6 w-20 bg-white/10 rounded-full"></div>
      </td>
      <td className="py-3">
        <div className="h-4 w-24 bg-white/5 rounded"></div>
      </td>
    </tr>
  );
}

export default function TransactionsTable() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({});

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  async function fetchData() {
    setLoading(true);
    try {
      const data = await adminStore.fetchTransactions({ page, per_page: 5 });
      setTransactions(data.data || []);
      setMeta({
        current_page: data.current_page,
        last_page: data.last_page,
        total: data.total,
        from: data.from,
        to: data.to,
      });
    } catch (err) {
      console.error("Failed to fetch transactions", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card p-4">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm text-muted">Recent Transactions</p>
        <div className="flex gap-2">
           <button
             onClick={() => setPage(p => Math.max(1, p - 1))}
             disabled={page === 1 || loading}
             className="text-xs px-2 py-1 bg-white/5 hover:bg-white/10 rounded disabled:opacity-50"
           >
             Prev
           </button>
           <button
             onClick={() => setPage(p => (meta.last_page && p < meta.last_page ? p + 1 : p))}
             disabled={!meta.last_page || page >= meta.last_page || loading}
             className="text-xs px-2 py-1 bg-white/5 hover:bg-white/10 rounded disabled:opacity-50"
           >
            Next
           </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-muted border-b border-white/5">
              <th className="py-2 font-medium">TRANSACTION ID</th>
              <th className="py-2 font-medium">CLIENT</th>
              <th className="py-2 font-medium">PROVIDER</th>
              <th className="py-2 font-medium">AMOUNT</th>
              <th className="py-2 font-medium">STATUS</th>
              <th className="py-2 font-medium">DATE</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
            ) : transactions.length === 0 ? (
               <tr>
                 <td colSpan="6" className="py-8 text-center text-muted">
                   No transactions found.
                 </td>
               </tr>
            ) : (
              transactions.map((t) => (
                <tr key={t.id} className="hover:bg-white/5">
                  <td className="py-3">
                    <span className="text-xs bg-white/5 px-2 py-1 rounded-md font-mono">
                      {t.transaction_id || `ID-${t.id}`}
                    </span>
                  </td>
                  <td className="py-3 font-medium">
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-blue-500/20 flex items-center justify-center text-xs font-medium text-blue-400">
                             {(t.client?.name || 'U')[0].toUpperCase()}
                        </div>
                        <div>
                            <div>{t.client?.name || "Unknown Client"}</div>
                            <div className="text-xs text-muted font-normal">
                            {t.client?.email}
                            </div>
                        </div>
                    </div>
                  </td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-purple-500/20 flex items-center justify-center text-xs font-medium text-purple-400">
                             {(t.provider?.name || 'U')[0].toUpperCase()}
                        </div>
                        <span>{t.provider?.name || "Unknown Provider"}</span>
                    </div>
                  </td>
                  <td className="py-3 font-medium">${Number(t.amount).toFixed(2)}</td>
                  <td className="py-3">
                    <StatusPill status={t.status} />
                  </td>
                  <td className="py-3 text-muted">
                    {new Date(t.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
       
      {!loading && transactions.length > 0 && (
          <div className="text-xs text-muted mt-2 text-right">
            Page {meta.current_page} of {meta.last_page}
          </div>
      )}
    </div>
  );
}
  