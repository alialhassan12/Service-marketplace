import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  Users2,
  Layers,
  Handshake,
  FileText,
  BarChart3,
  Settings,
  LogOut,
  User,
} from "lucide-react";
import { useAuthStore } from "../../store/authStore";

function NavItem({ icon, label, to, active }) {
  return (
    <Link
      to={to}
      className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition
      ${active
          ? "bg-white/10 text-white"
          : "text-muted hover:text-white hover:bg-white/5"
        }`}
    >
      {icon}
      <span className="text-sm">{label}</span>
    </Link>
  );
}

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, isLoggingOut, authUser } = useAuthStore();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <aside className="fixed left-0 top-0 w-64 h-screen bg-bg-2/60 backdrop-blur border-r border-white/5 p-4 flex flex-col z-10">
      <div className="flex items-center gap-3 mb-8">
        <div className="h-10 w-10 rounded-full overflow-hidden border border-white/10 relative">
          <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center text-white font-bold text-sm uppercase">
            {authUser?.name?.charAt(0).toUpperCase() || 'A'}
          </div>
        </div>
        <div className="flex flex-col">
          <p className="font-medium text-white truncate max-w-[150px]">{authUser?.name || 'Admin'}</p>
          <p className="text-xs text-muted leading-tight">Administrator</p>
        </div>
      </div>

      <nav className="space-y-1">
        <NavItem
          icon={<Home size={18} />}
          label="Dashboard"
          to="/dashboard"
          active={
            location.pathname === "/dashboard/Dashboard" ||
            location.pathname === "/dashboard" ||
            location.pathname === "/dashboard/"
          }
        />
        <NavItem
          icon={<Users2 size={18} />}
          label="Users"
          to="/dashboard/UserManagement"
          active={location.pathname === "/dashboard/UserManagement"}
        />
        <NavItem
          icon={<Layers size={18} />}
          label="Jobs"
          to="/dashboard/JobPostings"
          active={location.pathname === "/dashboard/JobPostings"}
        />
        <NavItem
          icon={<Handshake size={18} />}
          label="Proposals"
          to="/dashboard/ProposalManagement"
          active={location.pathname === "/dashboard/ProposalManagement"}
        />
        <NavItem
          icon={<FileText size={18} />}
          label="Content"
          to="/dashboard/ContentManagement"
          active={location.pathname === "/dashboard/ContentManagement"}
        />
        <NavItem
          icon={<BarChart3 size={18} />}
          label="Payments"
          to="/dashboard/PaymentHistory"
          active={location.pathname === "/dashboard/PaymentHistory"}
        />
      </nav>

      <div className="mt-auto pt-10 space-y-1">
        <NavItem
          icon={<User size={18} />}
          label="Profile"
          to="/dashboard/Profile"
          active={location.pathname === "/dashboard/Profile"}
        />
        <NavItem
          icon={<Settings size={18} />}
          label="Settings"
          to="/dashboard/Settings"
          active={location.pathname === "/dashboard/Settings"}
        />
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl transition text-muted hover:text-white hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoggingOut ? (
            <>
              <span className="loading loading-spinner loading-sm"></span>
              <span className="text-sm">Logging out...</span>
            </>
          ) : (
            <>
              <LogOut size={18} />
              <span className="text-sm">Logout</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
