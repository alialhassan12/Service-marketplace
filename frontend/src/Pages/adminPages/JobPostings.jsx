import { useEffect, useState } from "react";
import { Plus, Search, Eye, Edit, Trash2, ChevronDown } from "lucide-react";
import adminStore from "../../store/adminStore";
import JobViewModal from "../../components/adminDashboardComponents/JobViewModal";

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

export default function JobPostings() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [jobTypeFilter, setJobTypeFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("All");
  const [locationFilter, setLocationFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [jobs, setJobs] = useState([]);
  const [meta, setMeta] = useState({});
  const [loading, setLoading] = useState(false);
  const [itemsPerPage] = useState(10);
  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => {
    fetchJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, statusFilter]);

  // TODO: Replace with database query: INSERT INTO job_postings (title, client_id, description, ...) VALUES (...)
  const handleCreateNewJob = () => {
    console.log("Create New Job clicked");
    // TODO: Open modal/form to create new job posting
    // TODO: On submit: POST /api/jobs with job data
    alert(
      "Create New Job functionality - Replace with modal/form and API call to POST /api/jobs"
    );
  };

  // TODO: Replace with database query: SELECT * FROM job_postings WHERE (title LIKE ? OR client_name LIKE ? OR keywords LIKE ?)
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    // TODO: Debounce and call API: GET /api/jobs?search=${searchQuery}
    console.log("Searching for:", e.target.value);
  };

  async function fetchJobs(page = currentPage) {
    setLoading(true);
    setJobs([]);
    try {
      const params = { page };
      if (statusFilter && statusFilter !== "All")
        params.status = statusFilter.toLowerCase();
      const data = await adminStore.fetchJobs(params);
      setJobs(data.data);
      setMeta({
        from: data.from,
        to: data.to,
        total: data.total,
        last_page: data.last_page,
      });
    } catch (err) {
      console.error("Failed to fetch jobs", err);
      alert("Failed to fetch jobs");
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteJob(id) {
    if (!confirm("Are you sure you want to delete this job?")) return;
    try {
      await adminStore.deleteJob(id);
      alert("Job deleted");
      fetchJobs();
    } catch (err) {
      console.error(err);
      alert("Failed to delete job");
    }
  }

  async function handleApproveJob(id) {
    try {
      await adminStore.updateJobStatus(id, "approved");
      alert("Job approved");
      fetchJobs();
    } catch (err) {
      console.error(err);
      alert("Failed to update job status");
    }
  }
  async function handleViewJob(id) {
    try {
      const job = await adminStore.fetchJob(id);
      setSelectedJob(job);
    } catch (err) {
      console.error(err);
      alert("Failed to load job details");
    }
  }

  // TODO: Replace with database queries filtered by status, type, date, location
  const handleStatusFilter = (status) => {
    setStatusFilter(status);
    // TODO: Call API: GET /api/jobs?status=${status}
    console.log("Status filter:", status);
  };

  const handleJobTypeFilter = (type) => {
    setJobTypeFilter(type);
    // TODO: Call API: GET /api/jobs?job_type=${type}
    console.log("Job type filter:", type);
  };

  const handleDateFilter = (date) => {
    setDateFilter(date);
    // TODO: Call API: GET /api/jobs?date_range=${date}
    console.log("Date filter:", date);
  };

  const handleLocationFilter = (location) => {
    setLocationFilter(location);
    // TODO: Call API: GET /api/jobs?location=${location}
    console.log("Location filter:", location);
  };

  const totalPages = meta?.last_page || 1;
  const paginatedJobs = jobs;

  return (
    <main className="flex-1 p-6 text-primary">
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
          onClick={handleCreateNewJob}
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
            onChange={handleSearch}
            placeholder="Search by job title, client name, or keywords"
            className="w-full pl-10 pr-4 py-2 bg-card/80 border border-white/5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => handleStatusFilter(e.target.value)}
              className="appearance-none bg-card/80 border border-white/5 rounded-xl px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>Status: All</option>
              <option>Status: Open</option>
              <option>Status: in_progress</option>
              <option>Status: Completed</option>
              <option>Status: Closed</option>
            </select>
            <ChevronDown
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-muted pointer-events-none"
              size={16}
            />
          </div>

          <div className="relative">
            <select
              value={dateFilter}
              onChange={(e) => handleDateFilter(e.target.value)}
              className="appearance-none bg-card/80 border border-white/5 rounded-xl px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>Date Posted</option>
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 90 days</option>
            </select>
            <ChevronDown
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-muted pointer-events-none"
              size={16}
            />
          </div>

          <div className="relative">
            <select
              value={locationFilter}
              onChange={(e) => handleLocationFilter(e.target.value)}
              className="appearance-none bg-card/80 border border-white/5 rounded-xl px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>Location</option>
              <option>Remote</option>
              <option>On-site</option>
              <option>Hybrid</option>
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
              {paginatedJobs.map((job) => (
                <tr key={job.id} className="hover:bg-white/5">
                  <td className="py-4 font-medium">{job.title}</td>
                  <td className="py-4">{job.client?.name || "Unknown"}</td>
                  <td className="py-4 text-muted">
                    {new Date(job.created_at).toLocaleDateString()}
                  </td>
                  <td className="py-4">
                    {job.is_remote ? "Remote" : job.location}
                  </td>
                  <td className="py-4">
                    <StatusPill status={job.status} />
                  </td>
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleViewJob(job.id)}
                        className="text-blue-400 hover:text-blue-300"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => handleApproveJob(job.id)}
                        className="text-emerald-400 hover:text-emerald-300"
                        title="Approve"
                      >
                        ✓
                      </button>
                      <button
                        onClick={() => {
                          console.log("Edit job:", job.id);
                          // TODO: GET /api/jobs/${job.id} and open edit modal
                          // TODO: On save: PUT /api/jobs/${job.id}
                        }}
                        className="text-blue-400 hover:text-blue-300"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => {
                          console.log("Delete job:", job.id);
                          // TODO: DELETE /api/jobs/${job.id}
                          if (
                            confirm("Are you sure you want to delete this job?")
                          ) {
                            // TODO: Call DELETE API
                          }
                        }}
                        className="text-rose-400 hover:text-rose-300"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
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
      {selectedJob && (
        <JobViewModal job={selectedJob} onClose={() => setSelectedJob(null)} />
      )}
    </main>
  );
}
