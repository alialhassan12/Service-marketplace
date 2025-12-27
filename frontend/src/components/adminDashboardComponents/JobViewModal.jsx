export default function JobViewModal({ job, onClose }) {
    if (!job) return null;
  
    return (
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
        <div className="bg-card w-full max-w-2xl rounded-xl p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Job Details</h2>
            <button
              onClick={onClose}
              className="text-muted hover:text-white"
            >
              ✕
            </button>
          </div>
  
          {/* Job info */}
          <div className="space-y-3 text-sm">
            <p><b>Title:</b> {job.title}</p>
            <p><b>Description:</b> {job.description}</p>
            <p><b>Status:</b> {job.status}</p>
            <p><b>Budget:</b> {job.budget}</p>
            <p>
              <b>Location:</b>{" "}
              {job.is_remote ? "Remote" : job.location}
            </p>
  
            <hr className="border-white/10" />
  
            {/* Client */}
            <p><b>Client:</b> {job.client?.name}</p>
            <p className="text-muted">{job.client?.email}</p>
  
            <hr className="border-white/10" />
  
            {/* Proposals */}
            <p className="font-semibold">Proposals</p>
  
            {job.proposals.length === 0 && (
              <p className="text-muted">No proposals yet</p>
            )}
  
            {job.proposals.map((p) => (
              <div
                key={p.id}
                className="bg-white/5 p-3 rounded-lg"
              >
                <p><b>Provider:</b> {p.provider?.name}</p>
                <p><b>Price:</b> ${p.price}</p>
                <p><b>Status:</b> {p.status}</p>
                <p className="text-muted">{p.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  