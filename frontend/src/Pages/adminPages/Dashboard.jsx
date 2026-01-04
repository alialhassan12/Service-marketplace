import Header from "../../components/adminDashboardComponents/Header";
import StatCard from "../../components/adminDashboardComponents/StatCard";
import { useEffect, useState } from "react";
import adminStore from "../../store/adminStore";
import ActivityChart from "../../components/adminDashboardComponents/ActivityChart";
import DonutChart from "../../components/adminDashboardComponents/DonutChart";
import TransactionsTable from "../../components/adminDashboardComponents/TransactionsTable";

export default function Dashboard() {
  const [stats, setStats] = useState({
    users_count: 0,
    jobs_count: 0,
    proposals_count: 0,
  });
  const [revenueStats, setRevenueStats] = useState({});
  const [revenueChartData, setRevenueChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    const loadData = async () => {
      try {
        const [basicStats, tranStats, chartData] = await Promise.all([
          adminStore.fetchStats(),
          adminStore.fetchTransactionStats(),
          adminStore.fetchRevenueChartData()
        ]);
        
        if (mounted) {
          setStats(basicStats);
          setRevenueStats(tranStats);
          setRevenueChartData(chartData);
        }
      } catch (err) {
        console.error("Failed to load dashboard data", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadData();
    return () => (mounted = false);
  }, []);

  const handleDownloadReport = () => {
    window.print();
  };

  return (
    <main className="flex-1 p-6 text-primary">
      <div className="flex justify-between items-center mb-6">
        <Header />
        <button 
          onClick={handleDownloadReport}
          className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
        >
          Download Report
        </button>
      </div>

      {/* Stats */}
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Users"
          value={loading ? "—" : stats.users_count}
          positive
        />
        <StatCard
          title="New Job Postings"
          value={loading ? "—" : stats.jobs_count}
          positive
        />
        <StatCard
          title="Proposals"
          value={loading ? "—" : stats.proposals_count}
          positive={false}
        />
        <StatCard
          title="Total Revenue"
          value={loading ? "—" : `$${Number(revenueStats.total_volume?.value || 0).toLocaleString()}`}
          positive
        />
      </section>

      {/* Charts */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6 items-stretch print:hidden">
        <div className="lg:col-span-2">
          <ActivityChart data={revenueChartData} />
        </div>
        <div>
          <DonutChart stats={stats} />
        </div>
      </section>

      {/* Table */}
      <section className="print:block">
         <TransactionsTable />
      </section>
    </main>
  );
}
