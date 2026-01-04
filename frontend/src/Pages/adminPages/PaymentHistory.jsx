import { useState, useEffect } from "react";
import { Search, Download, ChevronDown, MoreVertical, Filter, Calendar } from "lucide-react";
import StatCard from "../../components/adminDashboardComponents/StatCard";
import adminStore from "../../store/adminStore";

function StatusPill({ status }) {
  const statusMap = {
    paid: "bg-emerald-400/10 text-emerald-300",
    pending: "bg-amber-400/10 text-amber-300",
    failed: "bg-rose-400/10 text-rose-300",
  };
  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium capitalize ${
        statusMap[status?.toLowerCase()] || statusMap.pending
      }`}
    >
      {status}
    </span>
  );
}

function SkeletonRow() {
  return (
    <tr className="animate-pulse">
        <td className="py-4"><div className="h-5 w-24 bg-white/10 rounded"></div></td>
        <td className="py-4"><div className="h-4 w-24 bg-white/10 rounded"></div></td>
        <td className="py-4"><div className="h-4 w-32 bg-white/10 rounded mb-1"></div></td>
        <td className="py-4"><div className="h-4 w-32 bg-white/10 rounded"></div></td>
        <td className="py-4"><div className="h-4 w-16 bg-white/10 rounded"></div></td>
        <td className="py-4"><div className="h-4 w-12 bg-white/10 rounded"></div></td>
        <td className="py-4"><div className="h-6 w-20 bg-white/10 rounded-full"></div></td>
        <td className="py-4"><div className="h-4 w-4 bg-white/10 rounded"></div></td>
    </tr>
  );
}

export default function PaymentHistory() {
  const [searchQuery, setSearchQuery] = useState("");
  // Removed Type Filter as schema doesn't seem to support it explicitly or it's not in requirements beyond basic listing
  // If "Type" is needed we can infer or add later. Focusing on Client/Status/Date.
  const [statusFilter, setStatusFilter] = useState("All");
  const [dateRangeFilter, setDateRangeFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  
  const [transactions, setTransactions] = useState([]);
  const [stats, setStats] = useState({
    total_volume: { value: 0 },
    platform_fees: { value: 0 },
    total_payouts: { value: 0 },
    pending_transactions: { value: 0 },
  });
  const [meta, setMeta] = useState({});
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);

  // Debounce search
  const [debouncedSearch, setDebouncedSearch] = useState("");
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    fetchTransactions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, debouncedSearch, statusFilter, dateRangeFilter]);

  async function fetchStats() {
    setStatsLoading(true);
    try {
        const data = await adminStore.fetchTransactionStats();
        setStats(data);
    } catch(err) {
        console.error("Failed to fetch stats", err);
    } finally {
        setStatsLoading(false);
    }
  }

  async function fetchTransactions() {
    setLoading(true);
    try {
        const params = {
            page: currentPage,
            per_page: 5,
        };
        if (debouncedSearch) params.search = debouncedSearch;
        if (statusFilter !== 'All') params.status = statusFilter.toLowerCase();
        if (dateRangeFilter !== 'All') params.date_range = dateRangeFilter;

        const data = await adminStore.fetchTransactions(params);
        setTransactions(data.data || []);
        setMeta({
            current_page: data.current_page,
            last_page: data.last_page,
            total: data.total,
            from: data.from,
            to: data.to
        });
    } catch (err) {
        console.error("Failed to fetch transactions", err);
    } finally {
        setLoading(false);
    }
  }

  const handleExportCSV = () => {
    const params = {};
    if (debouncedSearch) params.search = debouncedSearch;
    if (statusFilter !== 'All') params.status = statusFilter.toLowerCase();
    
    // Trigger download
    const url = adminStore.getExportTransactionsUrl(params);
    window.location.href = url;
  };

  return (
    <main className="flex-1 p-6 text-primary">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold mb-1 text-primary">
          Payment & Transaction History
        </h1>
        <p className="text-sm text-muted">
          View and manage all financial transactions on the platform.
        </p>
      </header>

      {/* Summary Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Total Transaction Volume"
          value={statsLoading ? "..." : `$${Number(stats.total_volume?.value || 0).toLocaleString()}`}
          
          positive={true}
        />
        <StatCard
          title="Platform Fees"
          value={statsLoading ? "..." : `$${Number(stats.platform_fees?.value || 0).toLocaleString()}`}
          
          positive={true}
        />
        <StatCard
          title="Net Payouts (Providers)"
          value={statsLoading ? "..." : `$${Number(stats.total_payouts?.value || 0).toLocaleString()}`}
          
          positive={true}
        />
        <StatCard
          title="Pending Transactions"
          value={statsLoading ? "..." : `$${Number(stats.pending_transactions?.value || 0).toLocaleString()}`}
          
          positive={false}
        />
      </section>

      {/* Search, Filters, and Export */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="relative flex-1 w-full">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted"
              size={18}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by ID, name..."
              className="w-full pl-10 pr-4 py-2 bg-card/80 border border-white/5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="relative w-full md:w-auto">
            <Filter
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted"
              size={16}
            />
            <select
              value={statusFilter}
              onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
              }}
              className="w-full md:w-auto appearance-none bg-card/80 border border-white/5 rounded-xl pl-10 pr-8 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>All</option>
              <option>Paid</option>
              <option>Pending</option>
              {/* <option>Failed</option> -- Schema/Controller might return failed, keeping option open */}
            </select>
            <ChevronDown
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-muted pointer-events-none"
              size={16}
            />
          </div>

          <div className="relative w-full md:w-auto">
            <Calendar
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted"
              size={16}
            />
            <select
              value={dateRangeFilter}
              onChange={(e) => {
                  setDateRangeFilter(e.target.value);
                  setCurrentPage(1);
              }}
              className="w-full md:w-auto appearance-none bg-card/80 border border-white/5 rounded-xl pl-10 pr-8 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>All</option>
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 90 days</option>
            </select>
            <ChevronDown
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-muted pointer-events-none"
              size={16}
            />
          </div>

          <button
            onClick={handleExportCSV}
            className="w-full md:w-auto inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 transition px-4 py-2 rounded-xl shadow-[var(--shadow-soft)]"
          >
            <Download size={16} />
            <span className="text-sm font-medium">Export CSV</span>
          </button>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="card p-4">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-muted border-b border-white/5">
                <th className="py-3 font-medium">TRANSACTION ID</th>
                <th className="py-3 font-medium">DATE</th>
                <th className="py-3 font-medium">CLIENT</th>
                <th className="py-3 font-medium">PROVIDER</th>
                <th className="py-3 font-medium">AMOUNT</th>
                <th className="py-3 font-medium">FEE (5%)</th>
                <th className="py-3 font-medium">STATUS</th>
                <th className="py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                  Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
              ) : transactions.length === 0 ? (
                  <tr>
                      <td colSpan="8" className="py-8 text-center text-muted">No transactions found matching your filters.</td>
                  </tr>
              ) : (
                  transactions.map((transaction) => (
                    <tr key={transaction.id} className="hover:bg-white/5">
                      <td className="py-4">
                        <span className="text-xs bg-white/5 px-2 py-1 rounded-md font-mono">
                          {transaction.transaction_id || `ID-${transaction.id}`}
                        </span>
                      </td>
                      <td className="py-4 text-muted">{new Date(transaction.created_at).toLocaleDateString()}</td>
                      <td className="py-4 font-medium">
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full bg-blue-500/20 flex items-center justify-center text-xs font-medium text-blue-400">
                                {(transaction.client?.name || 'U')[0].toUpperCase()}
                            </div>
                            <div>
                                {transaction.client?.name || 'Unknown'}
                                <div className="text-xs text-muted font-normal">{transaction.client?.email}</div>
                            </div>
                          </div>
                      </td>
                      <td className="py-4">
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full bg-purple-500/20 flex items-center justify-center text-xs font-medium text-purple-400">
                                {(transaction.provider?.name || 'U')[0].toUpperCase()}
                            </div>
                            <span>{transaction.provider?.name || 'Unknown'}</span>
                          </div>
                      </td>
                      <td className="py-4 font-medium">
                        ${Number(transaction.amount).toFixed(2)}
                      </td>
                      <td className="py-4 text-muted">
                        ${(Number(transaction.amount) * 0.05).toFixed(2)}
                      </td>
                      <td className="py-4">
                        <StatusPill status={transaction.status} />
                      </td>
                      <td className="py-4">
                        <button
                          className="text-muted hover:text-white"
                        >
                          <MoreVertical size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm text-muted">
            Showing {meta.from || 0} to {meta.to || 0} of {meta.total || 0} results
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1 || loading}
              className="px-4 py-1 rounded-md bg-card/80 text-muted hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="text-sm text-muted">
                Page {meta.current_page || 1} of {meta.last_page || 1}
            </span>
            <button
              onClick={() => setCurrentPage((p) => (meta.last_page && p < meta.last_page ? p + 1 : p))}
              disabled={!meta.last_page || currentPage >= meta.last_page || loading}
              className="px-4 py-1 rounded-md bg-card/80 text-muted hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
