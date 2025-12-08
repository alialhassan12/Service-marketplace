import { useState } from "react";
import { Search, Download, ChevronDown, MoreVertical } from "lucide-react";
import StatCard from "../../components/adminDashboardComponents/StatCard";

// TODO: Replace with database query: SELECT SUM(amount) as total_volume FROM transactions
const fakeSummaryData = {
  totalVolume: { value: "$850,230.00", delta: "+5.2%", positive: true },
  platformFees: { value: "$42,511.50", delta: "+8.1%", positive: true },
  totalPayouts: { value: "$790,112.90", delta: "+4.8%", positive: true },
  pendingTransactions: { value: "$17,605.60", delta: "-1.5%", positive: false },
};

// TODO: Replace with database query: SELECT * FROM transactions ORDER BY date DESC
const fakeTransactions = [
  {
    id: "TXN-7B3C1A",
    date: "Oct 26, 2023",
    client: "Olivia Martin",
    provider: "Liam Johnson",
    amount: 1250.0,
    fee: 62.5,
    status: "Completed",
  },
  {
    id: "TXN-9D8E5F",
    date: "Oct 25, 2023",
    client: "Noah Williams",
    provider: "Emma Brown",
    amount: 800.0,
    fee: 40.0,
    status: "Completed",
  },
  {
    id: "TXN-4A2B6C",
    date: "Oct 24, 2023",
    client: "Ava Garcia",
    provider: "James Miller",
    amount: 2500.0,
    fee: 125.0,
    status: "Pending",
  },
  {
    id: "TXN-6E7F1D",
    date: "Oct 23, 2023",
    client: "Sophia Rodriguez",
    provider: "Lucas Wilson",
    amount: 450.0,
    fee: 22.5,
    status: "Failed",
  },
  {
    id: "TXN-8C9B3A",
    date: "Oct 22, 2023",
    client: "Isabella Martinez",
    provider: "Henry Davis",
    amount: 1800.0,
    fee: 90.0,
    status: "Completed",
  },
];

function StatusPill({ status }) {
  const statusMap = {
    Completed: "bg-emerald-400/10 text-emerald-300",
    Pending: "bg-amber-400/10 text-amber-300",
    Failed: "bg-rose-400/10 text-rose-300",
  };
  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
        statusMap[status] || statusMap.Pending
      }`}
    >
      {status}
    </span>
  );
}

export default function PaymentHistory() {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [dateRangeFilter, setDateRangeFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // TODO: Replace with database query: SELECT * FROM transactions WHERE (transaction_id LIKE ? OR client_name LIKE ? OR provider_name LIKE ? OR job_title LIKE ?)
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    // TODO: Debounce and call API: GET /api/transactions?search=${searchQuery}
    console.log("Searching transactions:", e.target.value);
  };

  // TODO: Replace with database queries filtered by type, status, date range
  const handleTypeFilter = (type) => {
    setTypeFilter(type);
    // TODO: Call API: GET /api/transactions?type=${type}
    console.log("Type filter:", type);
  };

  const handleStatusFilter = (status) => {
    setStatusFilter(status);
    // TODO: Call API: GET /api/transactions?status=${status}
    console.log("Status filter:", status);
  };

  const handleDateRangeFilter = (range) => {
    setDateRangeFilter(range);
    // TODO: Call API: GET /api/transactions?date_range=${range}
    console.log("Date range filter:", range);
  };

  // TODO: Replace with CSV export functionality: Generate CSV from database query results
  const handleExportCSV = () => {
    console.log("Exporting CSV");
    // TODO: Call API: GET /api/transactions/export?format=csv&filters=...
    // TODO: Download CSV file
    alert(
      "Export CSV functionality - Replace with API call to GET /api/transactions/export?format=csv"
    );
  };

  const filteredTransactions = fakeTransactions.filter((transaction) => {
    const matchesSearch =
      transaction.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.provider.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || transaction.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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
          value={fakeSummaryData.totalVolume.value}
          delta={fakeSummaryData.totalVolume.delta}
          positive={fakeSummaryData.totalVolume.positive}
        />
        <StatCard
          title="Platform Fees (30 days)"
          value={fakeSummaryData.platformFees.value}
          delta={fakeSummaryData.platformFees.delta}
          positive={fakeSummaryData.platformFees.positive}
        />
        <StatCard
          title="Total Payouts"
          value={fakeSummaryData.totalPayouts.value}
          delta={fakeSummaryData.totalPayouts.delta}
          positive={fakeSummaryData.totalPayouts.positive}
        />
        <StatCard
          title="Pending Transactions"
          value={fakeSummaryData.pendingTransactions.value}
          delta={fakeSummaryData.pendingTransactions.delta}
          positive={fakeSummaryData.pendingTransactions.positive}
        />
      </section>

      {/* Search, Filters, and Export */}
      <div className="mb-6 space-y-4">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted"
              size={18}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Search by ID, name, job..."
              className="w-full pl-10 pr-4 py-2 bg-card/80 border border-white/5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="relative">
            <select
              value={typeFilter}
              onChange={(e) => handleTypeFilter(e.target.value)}
              className="appearance-none bg-card/80 border border-white/5 rounded-xl px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>Type: All</option>
              <option>Type: Payment</option>
              <option>Type: Refund</option>
              <option>Type: Fee</option>
            </select>
            <ChevronDown
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-muted pointer-events-none"
              size={16}
            />
          </div>

          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => handleStatusFilter(e.target.value)}
              className="appearance-none bg-card/80 border border-white/5 rounded-xl px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>Status: All</option>
              <option>Status: Completed</option>
              <option>Status: Pending</option>
              <option>Status: Failed</option>
            </select>
            <ChevronDown
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-muted pointer-events-none"
              size={16}
            />
          </div>

          <div className="relative">
            <select
              value={dateRangeFilter}
              onChange={(e) => handleDateRangeFilter(e.target.value)}
              className="appearance-none bg-card/80 border border-white/5 rounded-xl px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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

          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 transition px-4 py-2 rounded-xl shadow-[var(--shadow-soft)]"
          >
            <Download size={16} />
            <span className="text-sm font-medium">Export Data (CSV)</span>
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
                <th className="py-3 font-medium">FEE</th>
                <th className="py-3 font-medium">STATUS</th>
                <th className="py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {paginatedTransactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-white/5">
                  <td className="py-4">
                    <span className="text-xs bg-white/5 px-2 py-1 rounded-md font-mono">
                      {transaction.id}
                    </span>
                  </td>
                  <td className="py-4 text-muted">{transaction.date}</td>
                  <td className="py-4 font-medium">{transaction.client}</td>
                  <td className="py-4">{transaction.provider}</td>
                  <td className="py-4 font-medium">
                    ${transaction.amount.toFixed(2)}
                  </td>
                  <td className="py-4 text-muted">
                    ${transaction.fee.toFixed(2)}
                  </td>
                  <td className="py-4">
                    <StatusPill status={transaction.status} />
                  </td>
                  <td className="py-4">
                    <button
                      onClick={() => {
                        console.log("Transaction actions:", transaction.id);
                        // TODO: Open actions menu (view details, refund, etc.)
                      }}
                      className="text-muted hover:text-white"
                    >
                      <MoreVertical size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm text-muted">
            Showing {(currentPage - 1) * itemsPerPage + 1}-
            {Math.min(currentPage * itemsPerPage, filteredTransactions.length)}{" "}
            of {filteredTransactions.length}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-4 py-1 rounded-md bg-card/80 text-muted hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(1)}
              className={`px-3 py-1 rounded-md ${
                currentPage === 1
                  ? "bg-blue-600 text-white"
                  : "bg-card/80 text-muted hover:text-white"
              }`}
            >
              1
            </button>
            {totalPages > 1 && (
              <button
                onClick={() => setCurrentPage(2)}
                className={`px-3 py-1 rounded-md ${
                  currentPage === 2
                    ? "bg-blue-600 text-white"
                    : "bg-card/80 text-muted hover:text-white"
                }`}
              >
                2
              </button>
            )}
            {totalPages > 2 && (
              <button
                onClick={() => setCurrentPage(3)}
                className={`px-3 py-1 rounded-md ${
                  currentPage === 3
                    ? "bg-blue-600 text-white"
                    : "bg-card/80 text-muted hover:text-white"
                }`}
              >
                3
              </button>
            )}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
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
