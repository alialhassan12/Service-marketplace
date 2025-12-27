import { useEffect, useState } from "react";
import { Search, Filter, Calendar, ChevronDown } from "lucide-react";
import adminStore from "../../store/adminStore";

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
  const [selectedProposals, setSelectedProposals] = useState([]);
  const [proposals, setProposals] = useState([]);
  const [meta, setMeta] = useState({});

  useEffect(() => {
    fetchProposals();
  }, []);

  async function fetchProposals(page = 1) {
    try {
      const data = await adminStore.fetchProposals({ page });
      setProposals(data.data || data);
      setMeta(data.meta || {});
    } catch (err) {
      console.error("Failed to fetch proposals", err);
      alert("Failed to fetch proposals");
    }
  }

  async function handleDeleteProposal(id) {
    if (!confirm("Delete this proposal?")) return;
    try {
      await adminStore.deleteProposal(id);
      alert("Proposal deleted");
      fetchProposals();
    } catch (err) {
      console.error(err);
      alert("Failed to delete proposal");
    }
  }

  // TODO: Replace with database query: SELECT * FROM proposals WHERE (provider_name LIKE ? OR job_title LIKE ? OR proposal_id LIKE ?)
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    // TODO: Debounce and call API: GET /api/proposals?search=${searchQuery}
    console.log("Searching proposals:", e.target.value);
  };

  // TODO: Replace with database query filtered by status: SELECT * FROM proposals WHERE status = ?
  const handleStatusFilter = (status) => {
    setStatusFilter(status);
    // TODO: Call API: GET /api/proposals?status=${status}
    console.log("Status filter:", status);
  };

  // TODO: Replace with database query filtered by date range: SELECT * FROM proposals WHERE date_submitted BETWEEN ? AND ?
  const handleDateRangeFilter = (range) => {
    setDateRangeFilter(range);
    // TODO: Call API: GET /api/proposals?date_range=${range}
    console.log("Date range filter:", range);
  };

  const handleSelectProposal = (proposalId) => {
    setSelectedProposals((prev) =>
      prev.includes(proposalId)
        ? prev.filter((id) => id !== proposalId)
        : [...prev, proposalId]
    );
  };

  const handleSelectAll = () => {
    if (selectedProposals.length === filteredProposals.length) {
      setSelectedProposals([]);
    } else {
      setSelectedProposals(filteredProposals.map((p) => p.id));
    }
  };

  const filteredProposals = proposals.filter((proposal) => {
    const matchesSearch =
      (proposal.provider?.name || '')
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      (proposal.job?.title || '')
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      proposal.id.toString().includes(searchQuery);

    const matchesStatus =
      statusFilter === "All" || proposal.status === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  return (
    <main className="flex-1 p-6 text-primary">
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
            onChange={handleSearch}
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
            onChange={(e) => handleStatusFilter(e.target.value)}
            className="appearance-none bg-card/80 border border-white/5 rounded-xl pl-10 pr-8 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option>Status: All</option>
            <option>Status: Accepted</option>
            <option>Status: Active</option>
            <option>Status: Flagged</option>
            <option>Status: Rejected</option>
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
            onChange={(e) => handleDateRangeFilter(e.target.value)}
            className="appearance-none bg-card/80 border border-white/5 rounded-xl pl-10 pr-8 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option>Date Range</option>
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>Last 90 days</option>
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
                <th className="py-3 font-medium">
                  <input
                    type="checkbox"
                    checked={
                      selectedProposals.length === filteredProposals.length &&
                      filteredProposals.length > 0
                    }
                    onChange={handleSelectAll}
                    className="rounded border-white/10 bg-card/80"
                  />
                </th>
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
              {filteredProposals.map((proposal) => (
                <tr key={proposal.id} className="hover:bg-white/5">
                  <td className="py-4">
                    <input
                      type="checkbox"
                      checked={selectedProposals.includes(proposal.id)}
                      onChange={() => handleSelectProposal(proposal.id)}
                      className="rounded border-white/10 bg-card/80"
                    />
                  </td>
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
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
