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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    adminStore
      .fetchStats()
      .then((data) => {
        if (mounted) setStats(data);
      })
      .catch((err) => {
        console.error("Failed to load stats", err);
      })
      .finally(() => mounted && setLoading(false));
    return () => (mounted = false);
  }, []);
  return (
    <main className="flex-1 p-6 text-primary">
      <Header />

      {/* Stats */}
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Active Users"
          value={loading ? "—" : stats.users_count}
          delta="+2.5%"
          positive
        />
        <StatCard
          title="New Job Postings"
          value={loading ? "—" : stats.jobs_count}
          delta="+10.1%"
          positive
        />
        <StatCard
          title="Pending Proposals"
          value={loading ? "—" : stats.proposals_count}
          delta="-1.2%"
          positive={false}
        />
        <StatCard
          title="Revenue (Month)"
          value="$25,840"
          delta="+15.3%"
          positive
        />
      </section>

      {/* Charts */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6 items-stretch">
        <div className="lg:col-span-2">
          <ActivityChart />
        </div>
        <div>
          <DonutChart stats={stats} />
        </div>
      </section>

      {/* Table */}
      <TransactionsTable />
    </main>
  );
}
