import { useState } from "react";
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
  Menu,
  X
} from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import * as Dialog from "@radix-ui/react-dialog";
import { Separator } from "@radix-ui/themes";

function NavItem({ icon, label, to, active, isCollapsed, onClick }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      title={isCollapsed ? label : ""}
      className={`flex items-center gap-3 px-3 py-2 rounded-xl transition group relative
      ${active
          ? "bg-white/10 text-white"
          : "text-muted hover:text-white hover:bg-white/5"
        }
      ${isCollapsed ? "justify-center" : ""}
      `}
    >
      {icon}
      {!isCollapsed && <span className="text-sm">{label}</span>}
      {isCollapsed && active && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-indigo-500 rounded-r-full" />
      )}
    </Link>
  );
}

const SidebarContent = ({ authUser, location, handleLogout, isLoggingOut, isCollapsed, onClose }) => {
  return (
    <div className="flex flex-col h-full">
      {/* Profile Section */}
      <div className={`flex items-center gap-3 mb-8 ${isCollapsed ? "justify-center mb-4" : ""} relative`}>
        {onClose && (
            <button onClick={onClose} className="absolute right-0 -top-2 p-1 text-muted hover:text-white md:hidden">
                <X size={20} />
            </button>
        )}
        <div className={`rounded-full overflow-hidden border border-white/10 relative shrink-0 ${isCollapsed ? "h-8 w-8" : "h-10 w-10"}`}>
          <img className="w-full h-full object-cover"
            src={authUser?.profile_picture ? `http://localhost:8000/storage/${authUser.profile_picture}` : undefined}
            alt={authUser?.name}
          />
        </div>
        {!isCollapsed && (
          <div className="flex flex-col overflow-hidden">
            <p className="font-medium text-white truncate max-w-[150px]">{authUser?.name || 'Admin'}</p>
            <p className="text-xs text-muted leading-tight">Administrator</p>
          </div>
        )}
      </div>

      <nav className="space-y-1 flex-1 overflow-y-auto scrollbar-hide">
        <NavItem
          icon={<Home size={18} />}
          label="Dashboard"
          to="/dashboard"
          active={
            location.pathname === "/dashboard/Dashboard" ||
            location.pathname === "/dashboard" ||
            location.pathname === "/dashboard/"
          }
          isCollapsed={isCollapsed}
          onClick={onClose}
        />
        <NavItem
          icon={<Users2 size={18} />}
          label="Users"
          to="/dashboard/UserManagement"
          active={location.pathname === "/dashboard/UserManagement"}
          isCollapsed={isCollapsed}
          onClick={onClose}
        />
        <NavItem
          icon={<Layers size={18} />}
          label="Jobs"
          to="/dashboard/JobPostings"
          active={location.pathname === "/dashboard/JobPostings"}
          isCollapsed={isCollapsed}
          onClick={onClose}
        />
        <NavItem
          icon={<Handshake size={18} />}
          label="Proposals"
          to="/dashboard/ProposalManagement"
          active={location.pathname === "/dashboard/ProposalManagement"}
          isCollapsed={isCollapsed}
          onClick={onClose}
        />
        <NavItem
          icon={<FileText size={18} />}
          label="Content"
          to="/dashboard/ContentManagement"
          active={location.pathname === "/dashboard/ContentManagement"}
          isCollapsed={isCollapsed}
          onClick={onClose}
        />
        <NavItem
          icon={<BarChart3 size={18} />}
          label="Payments"
          to="/dashboard/PaymentHistory"
          active={location.pathname === "/dashboard/PaymentHistory"}
          isCollapsed={isCollapsed}
          onClick={onClose}
        />
      </nav>

      <div className="mt-auto pt-4 space-y-1 border-t border-white/5">
        <NavItem
          icon={<User size={18} />}
          label="Profile"
          to="/dashboard/Profile"
          active={location.pathname === "/dashboard/Profile"}
          isCollapsed={isCollapsed}
          onClick={onClose}
        />
        <NavItem
          icon={<Settings size={18} />}
          label="Settings"
          to="/dashboard/Settings"
          active={location.pathname === "/dashboard/Settings"}
          isCollapsed={isCollapsed}
          onClick={onClose}
        />
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          title={isCollapsed ? "Logout" : ""}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition text-muted hover:text-white hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed ${isCollapsed ? "justify-center" : ""}`}
        >
          {isLoggingOut ? (
             <span className="loading loading-spinner loading-xs"></span>
          ) : (
             <LogOut size={18} />
          )}
          {!isCollapsed && <span className="text-sm">Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, isLoggingOut, authUser } = useAuthStore();
  
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <>
        {/* Mobile Toggle Button */}
        <div className="md:hidden fixed top-4 left-4 z-40">
            <button
                onClick={() => setIsMobileDrawerOpen(true)}
                className="p-2 bg-bg-2/80 backdrop-blur border border-white/10 rounded-lg shadow-md text-white hover:bg-white/10 transition-colors"
            >
                <Menu size={24} />
            </button>
        </div>

        {/* Desktop Sidebar */}
        <aside 
            className={`
                hidden md:flex flex-col h-screen sticky top-0 left-0 
                bg-bg-2/60 backdrop-blur border-r border-white/5 
                transition-all duration-300 z-30 p-4
                ${isDesktopCollapsed ? "w-20" : "w-64"}
            `}
        >
            {/* Toggle Button */}
            <div className={`w-full flex ${isDesktopCollapsed ? "justify-center" : "justify-end"} mb-2`}>
                <button
                    onClick={() => setIsDesktopCollapsed(!isDesktopCollapsed)}
                    className="p-1 text-muted hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                >
                    <Menu size={20} />
                </button>
            </div>

            <SidebarContent 
                authUser={authUser}
                location={location}
                handleLogout={handleLogout}
                isLoggingOut={isLoggingOut}
                isCollapsed={isDesktopCollapsed}
            />
        </aside>

        {/* Mobile Drawer */}
        <Dialog.Root open={isMobileDrawerOpen} onOpenChange={setIsMobileDrawerOpen}>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden" />
                <Dialog.Content className="fixed left-0 top-0 bottom-0 w-64 z-50 md:hidden bg-[#0f172a] border-r border-white/10 p-4 shadow-2xl focus:outline-none">
                    <SidebarContent
                        authUser={authUser}
                        location={location}
                        handleLogout={handleLogout}
                        isLoggingOut={isLoggingOut}
                        isCollapsed={false}
                        onClose={() => setIsMobileDrawerOpen(false)}
                    />
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    </>
  );
}
