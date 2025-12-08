import Header from "../../components/adminDashboardComponents/Header";
import StatCard from "../../components/adminDashboardComponents/StatCard";
import ActivityChart from "../../components/adminDashboardComponents/ActivityChart";
import DonutChart from "../../components/adminDashboardComponents/DonutChart";
import TransactionsTable from "../../components/adminDashboardComponents/TransactionsTable";

export default function Dashboard() {
  return (
    <main className="flex-1 p-6 text-primary">
      <Header />

      {/* Stats */}
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <StatCard title="Active Users" value="12,456" delta="+2.5%" positive />
        <StatCard
          title="New Job Postings"
          value="832"
          delta="+10.1%"
          positive
        />
        <StatCard
          title="Pending Proposals"
          value="157"
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
          <DonutChart />
        </div>
      </section>

      {/* Table */}
      <TransactionsTable />
    </main>
  );
}
