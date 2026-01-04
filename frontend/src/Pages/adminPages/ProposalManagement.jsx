import { useEffect, useState } from "react";
import { Search, Filter, Calendar, ChevronDown, Trash2 } from "lucide-react";
import adminStore from "../../store/adminStore";
import toast, { Toaster } from 'react-hot-toast';

function StatusPill({ status }) {
  const statusMap = {
    accepted: "bg-emerald-400/10 text-emerald-300",
    pending: "bg-amber-400/10 text-amber-300",
    rejected: "bg-rose-400/10 text-rose-300",
  };

  const displayStatus = status === 'accepted' ? 'Accepted' :
                       status === 'pending' ? 'Pending' :
                       status === 'rejected' ? 'Rejected' : status;

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
        statusMap[status] || statusMap.pending
      }`}
    >
      {displayStatus}
    </span>
  );
}

export default function ProposalManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [dateRangeFilter, setDateRangeFilter] = useState("All");
  const [proposals, setProposals] = useState([]);
  const [meta, setMeta] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
        fetchProposals();
    }, 500);
    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, statusFilter, dateRangeFilter, searchQuery]);

  async function fetchProposals(page = currentPage) {
    setLoading(true);
    try {
      const params = { 
          page,
          search: searchQuery,
          status: statusFilter !== "All" ? statusFilter.toLowerCase() : undefined,
          date_range: dateRangeFilter !== "All" ? dateRangeFilter : undefined,
      };

      const data = await adminStore.fetchProposals(params);
      setProposals(data.data || []);
      setMeta(data || {}); 
    } catch (err) {
      console.error("Failed to fetch proposals", err);
    } finally {
        setLoading(false);
    }
  }

  async function handleDeleteProposal(id) {
    if (!confirm("Are you sure you want to delete this proposal?")) return;
    try {
      await adminStore.deleteProposal(id);
      fetchProposals();
      toast.success("Proposal deleted successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete proposal");
    }
  }

  const totalPages = meta?.last_page || 1;

  return (
    <main className="flex-1 p-6 text-primary">
      <Toaster 
        position="top-center" 
        reverseOrder={false}
        toastOptions={{
          style: {
            background: '#1e1e2d',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.1)',
          },
        }}
      />
      <header className="mb-6">
        <h1 className="text-2xl font-semibold mb-1 text-primary">
          Proposal Management
        </h1>
        <p className="text-sm text-muted">
          Monitor and manage all proposals submitted by service providers.
        </p>
      </header>

      {/* Search and Filters */}
      <div className="mb-6 flex items-center gap-4">
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted"
            size={18}
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by provider, job title, or proposal ID"
            className="w-full pl-10 pr-4 py-2 bg-card/80 border border-white/5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="relative">
          <Filter
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted"
            size={16}
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="appearance-none bg-card/80 border border-white/5 rounded-xl pl-10 pr-8 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option>All</option>
            <option value="accepted">Accepted</option>
            <option value="pending">Pending</option>
            <option value="rejected">Rejected</option>
          </select>
          <ChevronDown
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-muted pointer-events-none"
            size={16}
          />
        </div>

        <div className="relative">
          <Calendar
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted"
            size={16}
          />
          <select
            value={dateRangeFilter}
            onChange={(e) => setDateRangeFilter(e.target.value)}
            className="appearance-none bg-card/80 border border-white/5 rounded-xl pl-10 pr-8 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option>All</option>
            <option value="7_days">Last 7 days</option>
            <option value="30_days">Last 30 days</option>
            <option value="90_days">Last 90 days</option>
          </select>
          <ChevronDown
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-muted pointer-events-none"
            size={16}
          />
        </div>
      </div>

      {/* Proposals Table */}
      <div className="card p-4">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-muted border-b border-white/5">
                <th className="py-3 font-medium">PROPOSAL ID</th>
                <th className="py-3 font-medium">JOB TITLE</th>
                <th className="py-3 font-medium">PROVIDER</th>
                <th className="py-3 font-medium">DATE SUBMITTED</th>
                <th className="py-3 font-medium">BID AMOUNT</th>
                <th className="py-3 font-medium">STATUS</th>
                <th className="py-3 font-medium">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                  Array.from({length: 5}).map((_, i) => (
                      <tr key={i} className="animate-pulse">
                          <td className="py-4"><div className="h-4 w-12 bg-white/10 rounded"></div></td>
                          <td className="py-4"><div className="h-4 w-32 bg-white/10 rounded"></div></td>
                          <td className="py-4"><div className="h-4 w-24 bg-white/10 rounded"></div></td>
                          <td className="py-4"><div className="h-4 w-20 bg-white/10 rounded"></div></td>
                          <td className="py-4"><div className="h-4 w-16 bg-white/10 rounded"></div></td>
                          <td className="py-4"><div className="h-6 w-16 bg-white/10 rounded-full"></div></td>
                          <td className="py-4"><div className="h-4 w-12 bg-white/10 rounded"></div></td>
                      </tr>
                  ))
              ) : proposals.length === 0 ? (
                  <tr>
                      <td colSpan="7" className="py-8 text-center text-muted">No proposals found.</td>
                  </tr>
              ) : (
                  proposals.map((proposal) => (
                    <tr key={proposal.id} className="hover:bg-white/5">
                      <td className="py-4">
                        <span className="text-xs bg-white/5 px-2 py-1 rounded-md">
                          #{proposal.id}
                        </span>
                      </td>
                      <td className="py-4 font-medium">{proposal.job?.title || 'Unknown Job'}</td>
                      <td className="py-4">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-blue-500/20 flex items-center justify-center text-xs font-medium">
                            {(proposal.provider?.name || 'U')[0].toUpperCase()}
                          </div>
                          <span>{proposal.provider?.name || 'Unknown Provider'}</span>
                        </div>
                      </td>
                      <td className="py-4 text-muted">{new Date(proposal.created_at).toLocaleDateString()}</td>
                      <td className="py-4 font-medium">
                        ${parseFloat(proposal.price || 0).toFixed(2)}
                      </td>
                      <td className="py-4">
                        <StatusPill status={proposal.status} />
                      </td>
                      <td className="py-4">
                        <button
                          onClick={() => handleDeleteProposal(proposal.id)}
                          className="text-rose-400 hover:text-rose-300 text-sm"
                          title="Delete"
                        >
                          <Trash2 size={16} />
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
                Showing {meta.from || 0} to {meta.to || 0} of {meta.total || 0}{" "}
                results
            </p>

            <div className="flex items-center gap-2">
                <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded-md bg-card/80 text-muted hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                &lt;
                </button>

                <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded-md bg-card/80 text-muted hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                &gt;
                </button>
            </div>
        </div>
      </div>
    </main>
  );
}
