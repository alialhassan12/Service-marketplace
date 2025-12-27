import { useEffect, useState } from "react";
import { Plus, Users2, User, Briefcase, UserCog } from "lucide-react";
import adminStore from "../../store/adminStore";

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
  const [users, setUsers] = useState([]);
  const [meta, setMeta] = useState({});
  const [loading, setLoading] = useState(false);

  const totalPages = meta.last_page || 1;

  const FILTER_MAP = {
    "All Users": null,
    Clients: "clients",
    Providers: "providers",
    Admins: "admins",
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, activeFilter]);

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    setCurrentPage(1);
  };

  async function fetchUsers(
    page = currentPage,
    search = searchQuery,
    filter = activeFilter
  ) {
    setLoading(true);
    setUsers([]); 
    try {
      const params = {
        page,
        per_page: 5, // ✅ ADD THIS
      };

      if (search) params.search = search;

      const apiFilter = FILTER_MAP[filter];
      if (apiFilter) params.filter = apiFilter;

      const data = await adminStore.fetchUsers(params);

      setUsers(data.data || []);

      setMeta({
        from: data.from,
        to: data.to,
        total: data.total,
        last_page: data.last_page,
        current_page: data.current_page,
      });
    } catch (err) {
      console.error("Failed to fetch users", err);
      alert("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteUser(id) {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      await adminStore.deleteUser(id);
      alert("User deleted");
      fetchUsers();
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to delete user");
    }
  }

  return (
    <main className="flex-1 p-6 text-primary">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-muted">
          Showing {meta?.from || 0} to {meta?.to || 0} of {meta?.total || 0}{" "}
          results
        </p>
        <button className="inline-flex items-center gap-2 bg-blue-600 px-4 py-2 rounded-xl">
          <Plus size={16} />
          Add New User
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-6">
        {[
          { label: "All Users", icon: Users2 },
          { label: "Clients", icon: User },
          { label: "Providers", icon: Briefcase },
          { label: "Admins", icon: UserCog },
        ].map(({ label, icon: Icon }) => (
          <button
            key={label}
            onClick={() => handleFilterChange(label)}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm ${
              activeFilter === label
                ? "bg-blue-600 text-white"
                : "bg-card/80 text-muted hover:text-white hover:bg-white/5"
            }`}
          >
            <Icon size={16} />
            {label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="card p-4">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b border-white/5 text-muted">
              <th className="py-3">USER</th>
              <th className="py-3">ROLE</th>
              <th className="py-3">CREATED</th>
              <th className="py-3">STATUS</th>
              <th className="py-3">ACTIONS</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-white/5">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-white/5">
                <td className="py-4">
                  <div className="font-medium">{user.name}</div>
                  <div className="text-xs text-muted">{user.email}</div>
                </td>

                <td className="py-4 capitalize">{user.role}</td>

                <td className="py-4 text-muted">
                  {new Date(user.created_at).toLocaleDateString()}
                </td>

                <td className="py-4">
                  <StatusPill status="Active" />
                </td>

                <td className="py-4">
                  {user.role !== "admin" ? (
                    <>
                      <button className="text-blue-400 hover:text-blue-300 text-sm">
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="text-red-400 hover:text-red-300 text-sm ml-4"
                      >
                        Delete
                      </button>
                    </>
                  ) : (
                    <span className="text-xs text-muted italic">Protected</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {loading && (
          <div className="text-center text-muted py-4">Loading...</div>
        )}

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
