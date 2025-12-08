import { Download } from "lucide-react";

export default function Header() {
  // TODO: Replace with database query: Generate report from aggregated data
  // TODO: SELECT * FROM dashboard_stats WHERE date_range = ? GROUP BY metric
  const handleDownloadReport = () => {
    console.log("Download Report clicked");
    // TODO: Call API: GET /api/reports/download?format=pdf&date_range=last_month
    // TODO: Generate PDF/CSV report from database data
    // TODO: Trigger file download
    alert(
      "Download Report functionality - Replace with API call to GET /api/reports/download"
    );
  };

  return (
    <header className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-2xl font-semibold text-primary">
          Dashboard Overview
        </h1>
        <p className="text-sm text-muted">
          A quick summary of the platform's activity and key metrics.
        </p>
      </div>
      <button
        onClick={handleDownloadReport}
        className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 transition px-4 py-2 rounded-xl shadow-[var(--shadow-soft)]"
      >
        <Download size={16} />
        <span className="text-sm font-medium">Download Report</span>
      </button>
    </header>
  );
}
