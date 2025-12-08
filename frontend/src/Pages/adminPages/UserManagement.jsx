import { useState } from "react";
import { Plus, Search, Users2, User, Briefcase, Calendar } from "lucide-react";

// TODO: Replace with database query: SELECT * FROM users ORDER BY registration_date DESC
const fakeUsers = [
  {
    id: 1,
    name: "Alex Johnson",
    email: "alex.johnson@example.com",
    userType: "Provider",
    registrationDate: "2023-10-26",
    status: "Active",
  },
  {
    id: 2,
    name: "Brenda Smith",
    email: "brenda.smith@example.com",
    userType: "Client",
    registrationDate: "2023-10-25",
    status: "Active",
  },
  {
    id: 3,
    name: "Charles Brown",
    email: "charles.brown@example.com",
    userType: "Provider",
    registrationDate: "2023-10-24",
    status: "Pending Approval",
  },
  {
    id: 4,
    name: "Diana Miller",
    email: "diana.miller@example.com",
    userType: "Provider",
    registrationDate: "2023-10-22",
    status: "Suspended",
  },
  {
    id: 5,
    name: "Ethan Wilson",
    email: "ethan.wilson@example.com",
    userType: "Client",
    registrationDate: "2023-10-21",
    status: "Active",
  },
];

function StatusPill({ status }) {
  const statusMap = {
    Active: "bg-emerald-400/10 text-emerald-300",
    "Pending Approval": "bg-amber-400/10 text-amber-300",
    Suspended: "bg-rose-400/10 text-rose-300",
  };
  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
        statusMap[status] || statusMap.Active
      }`}
    >
      {status}
    </span>
  );
}

export default function UserManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All Users");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // TODO: Replace with database query: INSERT INTO users (name, email, user_type, status) VALUES (...)
  const handleAddNewUser = () => {
    console.log("Add New User clicked");
    // TODO: Open modal/form to add new user
    // TODO: On submit: POST /api/users with user data
    alert(
      "Add New User functionality - Replace with modal/form and API call to POST /api/users"
    );
  };

  // TODO: Replace with database query: SELECT * FROM users WHERE (name LIKE ? OR email LIKE ? OR id LIKE ?)
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    // TODO: Debounce and call API: GET /api/users?search=${searchQuery}
    console.log("Searching for:", e.target.value);
  };

  // TODO: Replace with database query filtered by user_type: SELECT * FROM users WHERE user_type = ?
  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    // TODO: Call API: GET /api/users?filter=${filter}
    console.log("Filter changed to:", filter);
  };

  const filteredUsers = fakeUsers.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.id.toString().includes(searchQuery);

    const matchesFilter =
      activeFilter === "All Users" ||
      (activeFilter === "Clients" && user.userType === "Client") ||
      (activeFilter === "Providers" && user.userType === "Provider") ||
      (activeFilter === "Pending Approval" &&
        user.status === "Pending Approval");

    return matchesSearch && matchesFilter;
  });

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <main className="flex-1 p-6 text-primary">
      <header className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold mb-1 text-primary">
            User Management
          </h1>
          <p className="text-sm text-muted">
            View, search, and manage all user accounts.
          </p>
        </div>
        <button
          onClick={handleAddNewUser}
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 transition px-4 py-2 rounded-xl shadow-[var(--shadow-soft)]"
        >
          <Plus size={16} />
          <span className="text-sm font-medium">Add New User</span>
        </button>
      </header>

      {/* Search and Filters */}
      <div className="mb-6 space-y-4">
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted"
            size={18}
          />
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearch}
            placeholder="Search by name, email, or user ID..."
            className="w-full pl-10 pr-4 py-2 bg-card/80 border border-white/5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleFilterChange("All Users")}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm transition ${
              activeFilter === "All Users"
                ? "bg-blue-600 text-white"
                : "bg-card/80 text-muted hover:text-white hover:bg-white/5"
            }`}
          >
            <Users2 size={16} />
            All Users
          </button>
          <button
            onClick={() => handleFilterChange("Clients")}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm transition ${
              activeFilter === "Clients"
                ? "bg-blue-600 text-white"
                : "bg-card/80 text-muted hover:text-white hover:bg-white/5"
            }`}
          >
            <User size={16} />
            Clients
          </button>
          <button
            onClick={() => handleFilterChange("Providers")}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm transition ${
              activeFilter === "Providers"
                ? "bg-blue-600 text-white"
                : "bg-card/80 text-muted hover:text-white hover:bg-white/5"
            }`}
          >
            <Briefcase size={16} />
            Providers
          </button>
          <button
            onClick={() => handleFilterChange("Pending Approval")}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm transition ${
              activeFilter === "Pending Approval"
                ? "bg-blue-600 text-white"
                : "bg-card/80 text-muted hover:text-white hover:bg-white/5"
            }`}
          >
            <Calendar size={16} />
            Pending Approval
          </button>
        </div>
      </div>

      {/* User Table */}
      <div className="card p-4">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-muted border-b border-white/5">
                <th className="py-3 font-medium text-muted">USER</th>
                <th className="py-3 font-medium text-muted">USER TYPE</th>
                <th className="py-3 font-medium text-muted">
                  REGISTRATION DATE
                </th>
                <th className="py-3 font-medium text-muted">STATUS</th>
                <th className="py-3 font-medium text-muted">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {paginatedUsers.map((user) => (
                <tr key={user.id} className="hover:bg-white/5">
                  <td className="py-4">
                    <div>
                      <div className="font-medium text-primary">
                        {user.name}
                      </div>
                      <div className="text-xs text-muted">{user.email}</div>
                    </div>
                  </td>
                  <td className="py-4 text-primary">{user.userType}</td>
                  <td className="py-4 text-muted">{user.registrationDate}</td>
                  <td className="py-4">
                    <StatusPill status={user.status} />
                  </td>
                  <td className="py-4">
                    <button
                      onClick={() => {
                        console.log("Edit user:", user.id);
                        // TODO: Open edit modal/form: GET /api/users/${user.id}
                        // TODO: On save: PUT /api/users/${user.id}
                      }}
                      className="text-blue-400 hover:text-blue-300 text-sm"
                    >
                      Edit
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
            Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
            {Math.min(currentPage * itemsPerPage, filteredUsers.length)} of{" "}
            {filteredUsers.length} results
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded-md bg-card/80 text-muted hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              &lt;
            </button>
            {Array.from({ length: Math.min(4, totalPages) }, (_, i) => {
              const page = i + 1;
              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1 rounded-md ${
                    currentPage === page
                      ? "bg-blue-600 text-white"
                      : "bg-card/80 text-muted hover:text-white"
                  }`}
                >
                  {page}
                </button>
              );
            })}
            {totalPages > 4 && <span className="px-2 text-muted">...</span>}
            {totalPages > 4 && (
              <button
                onClick={() => setCurrentPage(totalPages)}
                className={`px-3 py-1 rounded-md ${
                  currentPage === totalPages
                    ? "bg-blue-600 text-white"
                    : "bg-card/80 text-muted hover:text-white"
                }`}
              >
                {totalPages}
              </button>
            )}
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
