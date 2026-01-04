import { useEffect, useState } from "react";
import { Plus, Users2, User, Briefcase, UserCog, MapPin } from "lucide-react";
import adminStore from "../../store/adminStore";
import toast, { Toaster } from 'react-hot-toast';

/* ================= STATUS PILL ================= */
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

/* ================= SKELETON ROW ================= */
function SkeletonRow() {
  return (
    <tr className="animate-pulse">
      <td className="py-4">
        <div className="h-4 w-32 bg-white/10 rounded mb-2"></div>
        <div className="h-3 w-40 bg-white/5 rounded"></div>
      </td>

      <td className="py-4">
        <div className="h-4 w-20 bg-white/10 rounded"></div>
      </td>

      <td className="py-4">
        <div className="h-4 w-24 bg-white/10 rounded"></div>
      </td>

      <td className="py-4">
        <div className="h-6 w-20 bg-white/10 rounded-full"></div>
      </td>

      <td className="py-4">
        <div className="h-4 w-24 bg-white/10 rounded"></div>
      </td>
    </tr>
  );
}

/* ================= MAIN COMPONENT ================= */
export default function UserManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All Users");
  const [currentPage, setCurrentPage] = useState(1);
  const [users, setUsers] = useState([]);
  const [meta, setMeta] = useState({});
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

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
        per_page: 5,
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
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  }

  async function handleViewUser(id) {
    // Show empty modal first or loader? Better to fetch then show.
    // Or we show modal with loading state. 
    // Let's set selectedUser with a flag or just wait.
    try {
        const fullUser = await adminStore.fetchUser(id);
        setSelectedUser(fullUser);
    } catch (err) {
        console.error(err);
        toast.error("Failed to load user details");
    }
  }
  async function handleDeleteUser(id) {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      await adminStore.deleteUser(id);
      toast.success("User deleted");
      fetchUsers();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to delete user");
    }
  }

  

  /* ================= MODALS ================= */
  function AddUserModal({ onClose, onSuccess }) {
    const [formData, setFormData] = useState({
      name: "",
      email: "",
      password: "",
      role: "client",
      phone_number: "",
      location: "",
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);
      try {
        await adminStore.createUser(formData);
        toast.success("User created successfully");
        onSuccess();
        onClose();
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to create user");
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-[#1e1e2d] p-8 rounded-xl w-full max-w-2xl border border-white/10 shadow-2xl">
          <h2 className="text-2xl font-bold mb-6 text-white">Add New User</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Role Selection */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: 'client' })}
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  formData.role === 'client'
                    ? 'border-blue-500 bg-blue-500/10'
                    : 'border-white/10 bg-white/5 hover:bg-white/10'
                }`}
              >
                <h3 className={`font-semibold ${formData.role === 'client' ? 'text-blue-400' : 'text-white'}`}>Client</h3>
                <p className="text-xs text-gray-400 mt-1">Hiring</p>
              </button>

              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: 'provider' })}
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  formData.role === 'provider'
                    ? 'border-blue-500 bg-blue-500/10'
                    : 'border-white/10 bg-white/5 hover:bg-white/10'
                }`}
              >
                <h3 className={`font-semibold ${formData.role === 'provider' ? 'text-blue-400' : 'text-white'}`}>Provider</h3>
                <p className="text-xs text-gray-400 mt-1">Working</p>
              </button>

              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: 'admin' })}
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  formData.role === 'admin'
                    ? 'border-blue-500 bg-blue-500/10'
                    : 'border-white/10 bg-white/5 hover:bg-white/10'
                }`}
              >
                <h3 className={`font-semibold ${formData.role === 'admin' ? 'text-blue-400' : 'text-white'}`}>Admin</h3>
                <p className="text-xs text-gray-400 mt-1">Managing</p>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-6">
                <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
                <input
                    required
                    className="w-full bg-[#151521] border border-white/10 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none transition"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="John Doe"
                />
                </div>
                <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                <input
                    required
                    type="email"
                    className="w-full bg-[#151521] border border-white/10 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none transition"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="john@example.com"
                />
                </div>
                <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Phone Number</label>
                <input
                    required
                    className="w-full bg-[#151521] border border-white/10 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none transition"
                    value={formData.phone_number}
                    onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                    placeholder="+1 234 567 890"
                />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Location</label>
                    <input
                        disabled={formData.location === 'Remote' && formData.role !== 'admin'}
                        required={formData.role !== 'admin' && formData.location !== 'Remote'}
                        className="w-full bg-[#151521] border border-white/10 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none transition disabled:opacity-50 disabled:cursor-not-allowed"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        placeholder="New York, USA"
                    />
                    {formData.role !== 'admin' && (
                        <div className="mt-3 flex items-center justify-between bg-white/5 p-3 rounded-lg border border-white/5 hover:border-white/10 transition-colors cursor-pointer" onClick={() => {
                              if (formData.location === 'Remote') {
                                  setFormData({ ...formData, location: '' });
                              } else {
                                  setFormData({ ...formData, location: 'Remote' });
                              }
                        }}>
                            <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${formData.location === 'Remote' ? 'bg-blue-500/20 text-blue-400' : 'bg-white/5 text-gray-400'}`}>
                                   <MapPin size={16} />
                                </div>
                                <div>
                                    <p className={`text-sm font-medium ${formData.location === 'Remote' ? 'text-white' : 'text-gray-300'}`}>Remote Position</p>
                                    <p className="text-xs text-muted">User works remotely</p>
                                </div>
                            </div>
                            
                            <div className={`w-10 h-6 rounded-full p-1 transition-colors ${formData.location === 'Remote' ? 'bg-blue-600' : 'bg-white/10'}`}>
                                <div className={`w-4 h-4 bg-white rounded-full transition-transform ${formData.location === 'Remote' ? 'translate-x-4' : ''}`} />
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
              <input
                required
                type="password"
                className="w-full bg-[#151521] border border-white/10 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none transition"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Create a strong password"
              />
            </div>

            <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-white/10">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 rounded-lg hover:bg-white/5 text-gray-300 transition font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-lg font-medium transition disabled:opacity-50 shadow-lg shadow-blue-500/20"
              >
                {loading ? "Creating..." : "Create User"}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  function ViewUserModal({ user, onClose }) {
    if (!user) return null;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-[#1e1e2d] p-6 rounded-xl w-full max-w-lg border border-white/10">
          <div className="flex justify-between items-start mb-6">
            <div>
               <h2 className="text-xl font-semibold text-white">{user.name}</h2>
               <p className="text-sm text-gray-400 capitalize">{user.role}</p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-white">✕</button>
          </div>
          
          <div className="space-y-4">
             <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 p-3 rounded-lg">
                    <p className="text-xs text-gray-500 uppercase">Email</p>
                    <p className="text-white">{user.email}</p>
                </div>
                <div className="bg-white/5 p-3 rounded-lg">
                    <p className="text-xs text-gray-500 uppercase">Status</p>
                    <p className="text-emerald-400">Active</p>
                </div>
                <div className="bg-white/5 p-3 rounded-lg">
                    <p className="text-xs text-gray-500 uppercase">Joined</p>
                    <p className="text-white">{new Date(user.created_at).toLocaleDateString()}</p>
                </div>
             </div>

             {user.role === 'client' && (
                 <div className="border-t border-white/10 pt-4">
                    <h3 className="text-sm font-medium text-white mb-2">Client Activity</h3>
                    <div className="grid grid-cols-2 gap-4 text-center">
                        <div className="bg-blue-500/10 p-2 rounded-lg">
                           <p className="text-xl font-bold text-blue-400">{user.jobs_posted || 0}</p>
                           <p className="text-xs text-gray-400">Jobs Posted</p>
                        </div>
                        <div className="bg-purple-500/10 p-2 rounded-lg">
                           <p className="text-xl font-bold text-purple-400">${Number(user.total_spent || 0).toLocaleString()}</p>
                           <p className="text-xs text-gray-400">Spent</p>
                        </div>
                    </div>
                 </div>
             )}

             {user.role === 'provider' && (
                 <div className="border-t border-white/10 pt-4">
                    <h3 className="text-sm font-medium text-white mb-2">Provider Statistics</h3>
                    <div className="grid grid-cols-2 gap-4 text-center">
                        <div className="bg-green-500/10 p-2 rounded-lg">
                           <p className="text-xl font-bold text-green-400">{user.jobs_completed || 0}</p>
                           <p className="text-xs text-gray-400">Jobs Completed</p>
                        </div>
                        <div className="bg-amber-500/10 p-2 rounded-lg">
                           <p className="text-xl font-bold text-amber-400">${Number(user.total_earned || 0).toLocaleString()}</p>
                           <p className="text-xs text-gray-400">Earned</p>
                        </div>
                    </div>
                 </div>
             )}
          </div>
        </div>
      </div>
    );
  }

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
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-muted">
          Showing {meta?.from || 0} to {meta?.to || 0} of {meta?.total || 0}{" "}
          results
        </p>
        <button 
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 bg-blue-600 px-4 py-2 rounded-xl text-white hover:bg-blue-500 transition"
        >
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
              <th className="py-3" align="left">
                USER
              </th>
              <th className="py-3" align="left">
                ROLE
              </th>
              <th className="py-3" align="left">
                CREATED
              </th>
              <th className="py-3" align="left">
                STATUS
              </th>
              <th className="py-3" align="left">
                ACTIONS
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-white/5">
            {loading
              ? Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
              : users.map((user) => (
                  <tr key={user.id} className="hover:bg-white/5">
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-blue-500/20 flex items-center justify-center text-sm font-medium text-blue-400">
                          {(user.name || 'U')[0].toUpperCase()}
                        </div>
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-xs text-muted">{user.email}</div>
                        </div>
                      </div>
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
                          <button
                            onClick={() => handleViewUser(user.id)}
                            className="text-blue-400 hover:text-blue-300 text-sm"
                          >
                            View
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="text-red-400 hover:text-red-300 text-sm ml-4"
                          >
                            Delete
                          </button>
                        </>
                      ) : (
                        <span className="text-xs text-muted italic">
                          Protected
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>

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
      
      {showAddModal && (
        <AddUserModal 
            onClose={() => setShowAddModal(false)}
            onSuccess={() => fetchUsers(1)}
        />
      )}
      
      {selectedUser && (
        <ViewUserModal 
            user={selectedUser}
            onClose={() => setSelectedUser(null)}
        />
      )}
    </main>
  );
}
