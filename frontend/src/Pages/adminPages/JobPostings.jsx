import { useEffect, useState } from "react";
import { Plus, Search, Eye, Edit, Trash2, ChevronDown, X, AlertTriangle, Filter, Calendar, MapPin } from "lucide-react";
import adminStore from "../../store/adminStore";
import JobViewModal from "../../components/adminDashboardComponents/JobViewModal";
import toast, { Toaster } from 'react-hot-toast';

function StatusPill({ status }) {
  const statusMap = {
    open: "bg-emerald-400/10 text-emerald-300",
    in_progress: "bg-blue-400/10 text-blue-300",
    completed: "bg-green-400/10 text-green-300",
    closed: "bg-gray-400/10 text-gray-300",
  };

  const displayStatus =
    status === "open"
      ? "Open"
      : status === "in_progress"
      ? "In Progress"
      : status === "completed"
      ? "Completed"
      : status === "closed"
      ? "Closed"
      : status;

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
        statusMap[status] || statusMap.open
      }`}
    >
      {displayStatus}
    </span>
  );
}

function AddJobModal({ onClose, onSuccess }) {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        budget: "",
        location: "",
        is_remote: false,
        client_email: "" // Admin creates on behalf of client
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await adminStore.createJob(formData);
            toast.success("Job created successfully");
            onSuccess();
            onClose();
        } catch (err) {
            console.error("Create job error:", err);
            toast.error(`Error: ${err.response?.status} - ${JSON.stringify(err.response?.data)}` || err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-[#1e1e2d] p-6 rounded-xl w-full max-w-lg border border-white/10 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-white">Post New Job</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white"><X size={20}/></button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Client Email</label>
                        <input
                            required
                            type="email"
                            placeholder="Client email address"
                            className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-white"
                            value={formData.client_email}
                            onChange={(e) => setFormData({...formData, client_email: e.target.value})}
                        />
                        <p className="text-xs text-gray-500 mt-1">The job will be assigned to this client.</p>
                    </div>
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Job Title</label>
                        <input
                            required
                            className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-white"
                            value={formData.title}
                            onChange={(e) => setFormData({...formData, title: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Description</label>
                        <textarea
                            required
                            rows="4"
                            className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-white"
                            value={formData.description}
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Budget ($)</label>
                            <input
                                required
                                type="number"
                                className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-white"
                                value={formData.budget}
                                onChange={(e) => setFormData({...formData, budget: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Location</label>
                            <input
                                disabled={formData.is_remote}
                                className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-white disabled:opacity-50"
                                value={formData.location}
                                onChange={(e) => setFormData({...formData, location: e.target.value})}
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="is_remote"
                            checked={formData.is_remote}
                            onChange={(e) => setFormData({...formData, is_remote: e.target.checked})}
                            className="rounded border-white/10 bg-white/5"
                        />
                        <label htmlFor="is_remote" className="text-sm text-gray-300">This is a remote job</label>
                    </div>
                    <div className="flex justify-end gap-3 mt-6">
                        <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg hover:bg-white/5 text-gray-300 transition">Cancel</button>
                        <button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-medium transition disabled:opacity-50">
                            {loading ? "Creating..." : "Create Job"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function DeleteConfirmationModal({ onConfirm, onCancel }) {
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-[#1e1e2d] p-6 rounded-xl w-full max-w-sm border border-white/10 text-center">
                <div className="w-12 h-12 bg-rose-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertTriangle className="text-rose-400" size={24} />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Delete Job?</h3>
                <p className="text-gray-400 text-sm mb-6">Are you sure you want to delete this job? This action cannot be undone.</p>
                <div className="flex justify-center gap-3">
                    <button onClick={onCancel} className="px-4 py-2 rounded-lg hover:bg-white/5 text-gray-300 transition">Cancel</button>
                    <button onClick={onConfirm} className="bg-rose-600 hover:bg-rose-500 text-white px-4 py-2 rounded-lg font-medium transition">Delete</button>
                </div>
            </div>
        </div>
    );
}

export default function JobPostings() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("All");
  const [locationFilter, setLocationFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [jobs, setJobs] = useState([]);
  const [meta, setMeta] = useState({});
  const [loading, setLoading] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [jobToDelete, setJobToDelete] = useState(null);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
        fetchJobs();
    }, 500); // 500ms debounce
    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, statusFilter, dateFilter, locationFilter, searchQuery]);

  async function fetchJobs(page = currentPage) {
    setLoading(true);
    setJobs([]);
    try {
      const params = { 
          page,
          search: searchQuery,
          status: statusFilter !== "All" ? statusFilter.toLowerCase() : undefined,
          date_range: dateFilter !== "All" ? dateFilter : undefined,
          location: locationFilter !== "All" ? locationFilter : undefined
      };
      
      const data = await adminStore.fetchJobs(params);
      setJobs(data.data || []);
      setMeta({
        from: data.from,
        to: data.to,
        total: data.total,
        last_page: data.last_page,
      });
    } catch (err) {
      console.error("Failed to fetch jobs", err);
      toast.error("Failed to fetch jobs");
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteJob() {
    if (!jobToDelete) return;
    try {
      await adminStore.deleteJob(jobToDelete);
      setJobToDelete(null);
      fetchJobs();
      toast.success("Job deleted successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete job");
    }
  }

  async function handleViewJob(id) {
    try {
      const job = await adminStore.fetchJob(id);
      setSelectedJob(job);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load job details");
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
      <header className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold mb-1 text-primary">
            Job Postings Management
          </h1>
          <p className="text-sm text-muted">
            Manage and monitor all job postings on the platform.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 transition px-4 py-2 rounded-xl shadow-[var(--shadow-soft)]"
        >
          <Plus size={16} />
          <span className="text-sm font-medium">Create New Job</span>
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
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by job title, client name, or keywords"
            className="w-full pl-10 pr-4 py-2 bg-card/80 border border-white/5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-3">
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
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="closed">Closed</option>
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
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
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

          <div className="relative">
            <MapPin
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted"
              size={16}
            />
            <select
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="appearance-none bg-card/80 border border-white/5 rounded-xl pl-10 pr-8 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>All</option>
              <option value="remote">Remote</option>
              <option value="onsite">On-site</option>
            </select>
            <ChevronDown
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-muted pointer-events-none"
              size={16}
            />
          </div>
        </div>
      </div>

      {/* Job Postings Table */}
      <div className="card p-4">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-muted border-b border-white/5">
                <th className="py-3 font-medium">JOB TITLE</th>
                <th className="py-3 font-medium">CLIENT NAME</th>
                <th className="py-3 font-medium">DATE POSTED</th>
                <th className="py-3 font-medium">LOCATION/REMOTE</th>
                <th className="py-3 font-medium">STATUS</th>
                <th className="py-3 font-medium">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                  Array.from({length: 5}).map((_, i) => (
                      <tr key={i} className="animate-pulse">
                          <td className="py-4"><div className="h-4 w-32 bg-white/10 rounded"></div></td>
                          <td className="py-4"><div className="h-4 w-24 bg-white/10 rounded"></div></td>
                          <td className="py-4"><div className="h-4 w-20 bg-white/10 rounded"></div></td>
                          <td className="py-4"><div className="h-4 w-16 bg-white/10 rounded"></div></td>
                          <td className="py-4"><div className="h-6 w-16 bg-white/10 rounded-full"></div></td>
                          <td className="py-4"><div className="h-4 w-12 bg-white/10 rounded"></div></td>
                      </tr>
                  ))
              ) : jobs.length === 0 ? (
                  <tr>
                      <td colSpan="6" className="py-8 text-center text-muted">No jobs found matching your criteria.</td>
                  </tr>
              ) : (
                  jobs.map((job) => (
                    <tr key={job.id} className="hover:bg-white/5">
                      <td className="py-4 font-medium">{job.title}</td>
                      <td className="py-4">
                        <div className="flex items-center gap-2">
                           <div className="h-8 w-8 rounded-full bg-blue-500/20 flex items-center justify-center text-xs font-medium text-blue-400">
                             {(job.client?.name || 'U')[0].toUpperCase()}
                           </div>
                           <span>{job.client?.name || "Unknown"}</span>
                        </div>
                      </td>
                      <td className="py-4 text-muted">
                        {new Date(job.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-4">
                        {job.is_remote ? "Remote" : job.location || 'On-site'}
                      </td>
                      <td className="py-4">
                        <StatusPill status={job.status} />
                      </td>
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => handleViewJob(job.id)}
                            className="text-blue-400 hover:text-blue-300"
                            title="View"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => setJobToDelete(job.id)}
                            className="text-rose-400 hover:text-rose-300"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
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
      
      {showAddModal && <AddJobModal onClose={() => setShowAddModal(false)} onSuccess={() => fetchJobs(1)} />}
      {selectedJob && <JobViewModal job={selectedJob} onClose={() => setSelectedJob(null)} />}
      {jobToDelete && <DeleteConfirmationModal onConfirm={handleDeleteJob} onCancel={() => setJobToDelete(null)} />}
    </main>
  );
}
