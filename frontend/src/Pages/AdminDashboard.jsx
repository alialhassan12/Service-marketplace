import { Routes, Route } from "react-router-dom";
import Sidebar from "../components/adminDashboardComponents/Sidebar";
import Dashboard from "./adminPages/Dashboard";
import UserManagement from "./adminPages/UserManagement";
import JobPostings from "./adminPages/JobPostings";
import ProposalManagement from "./adminPages/ProposalManagement";
import ContentManagement from "./adminPages/ContentManagement";
import PaymentHistory from "./adminPages/PaymentHistory";
import Settings from "./adminPages/Settings";

import { Theme } from "@radix-ui/themes";

export default function AdminDashboard() {
  return (
    <Theme appearance="dark">
      <div className="min-h-screen flex bg-bg-1 text-primary">
        <Sidebar />
        <div className="flex-1 ml-64 overflow-auto bg-bg-1">
          <Routes>
            <Route index element={<Dashboard />} />
            <Route path="Dashboard" element={<Dashboard />} />
            <Route path="UserManagement" element={<UserManagement />} />
            <Route path="JobPostings" element={<JobPostings />} />
            <Route path="ProposalManagement" element={<ProposalManagement />} />
            <Route path="ContentManagement" element={<ContentManagement />} />
            <Route path="PaymentHistory" element={<PaymentHistory />} />
            <Route path="Settings" element={<Settings />} />
          </Routes>
        </div>
      </div>
    </Theme>
  );
}
