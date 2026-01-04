import React, { useState } from 'react';
import { useAuthStore } from "../../store/authStore";
import useClientDashboardStore from "../../store/clientDashboardStore";
import * as Dialog from '@radix-ui/react-dialog';
import { Avatar as RadixAvatar, Separator } from "@radix-ui/themes";

// icons
import HomeIcon from '@mui/icons-material/Home';
import LogoutIcon from '@mui/icons-material/Logout';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import PaidIcon from '@mui/icons-material/Paid';
import SettingsIcon from '@mui/icons-material/Settings';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const SidebarContent = ({ active, setPage, authUser, logout, isLoggingOut, isCollapsed, onClose }) => {
    return (
        <div className="flex flex-col h-full overflow-hidden bg-card text-primary pt-4 relative">
             {/* Header/Profile Section */}
            <div className={`flex flex-col items-center ${isCollapsed ? "px-2" : "px-4"} mb-6`}>
                <div className={`flex w-full ${isCollapsed ? "justify-center" : "justify-between"} items-center mb-4`}>
                    {!isCollapsed && <h1 className="text-xl font-bold bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">SkillHub</h1>}
                    {onClose && (
                        <button onClick={onClose} className="p-1 hover:bg-hover-bg rounded-full md:hidden text-secondary">
                            <CloseIcon />
                        </button>
                    )}
                </div>
                
                <div className={`flex flex-col items-center transition-all duration-300 ${isCollapsed ? "scale-75 mb-2" : "mb-6"}`}>
                    <RadixAvatar
                        size={isCollapsed ? "3" : "6"}
                        src={authUser?.profile_picture ? `http://localhost:8000/storage/${authUser.profile_picture}` : undefined}
                        fallback={authUser?.name?.[0]}
                        radius="full"
                        className="mb-3 ring-4 ring-blue-500/10 shadow-lg border border-border-subtle"
                    />
                    {!isCollapsed && (
                        <>
                            <h2 className="text-base font-bold text-primary truncate w-full text-center px-2">{authUser?.name}</h2>
                            <p className="text-xs text-secondary truncate w-full text-center px-2">{authUser?.email}</p>
                        </>
                    )}
                </div>
            </div>

            <Separator size="4" className="mb-4 opacity-50" />

            {/* Links */}
            <div className="flex-1 overflow-y-auto px-2 space-y-1 scrollbar-hide">
                {[
                    { page: "home", icon: HomeIcon, label: "Home" },
                    { page: "myJobs", icon: WorkOutlineIcon, label: "My Jobs" },
                    { page: "payments", icon: PaidIcon, label: "Payments" },
                    { page: "messages", icon: ChatBubbleOutlineIcon, label: "Messages" },
                    { page: "profile", icon: AccountCircleIcon, label: "Profile" },
                    { page: "settings", icon: SettingsIcon, label: "Settings" },
                ].map((link) => {
                    const isActive = active === link.page;
                    const Icon = link.icon;
                    return (
                        <button 
                            key={link.page}
                            className={`
                                flex items-center w-full p-3 rounded-xl transition-all duration-200 group relative
                                ${isActive ? "bg-blue-500/10 text-blue-500 font-bold" : "text-secondary hover:bg-hover-bg hover:text-primary"}
                                ${isCollapsed ? "justify-center px-0" : "gap-4"}
                            `}
                            onClick={() => {
                                setPage(link.page);
                                if(onClose) onClose();
                            }}
                            title={isCollapsed ? link.label : ""}
                        >
                            {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-500 rounded-r-full" />}
                            <Icon className={`${isActive ? "text-blue-500" : "text-secondary group-hover:text-primary"} transition-colors`} sx={{ fontSize: isCollapsed ? 24 : 20 }} />
                            {!isCollapsed && <span className="text-sm">{link.label}</span>}
                        </button>
                    );
                })}
            </div>

            {/* Footer / Logout */}
            <div className="p-4 mt-auto border-t border-border-subtle bg-card/50 backdrop-blur-sm">
                <button 
                    className={`
                        flex items-center w-full p-3 transition-all duration-300 font-medium
                        bg-rose-500/10 text-rose-600 rounded-xl hover:bg-rose-500 hover:text-white group
                        ${isCollapsed ? "justify-center px-0" : "gap-3"}
                    `}
                    onClick={logout}
                    disabled={isLoggingOut}
                    title={isCollapsed ? "Logout" : ""}
                >
                    {isLoggingOut ? (
                        <span className="loading loading-spinner loading-xs"></span>
                    ) : (
                        <LogoutIcon sx={{ fontSize: isCollapsed ? 22 : 18 }} />
                    )}
                    {!isCollapsed && <span className="text-sm">Logout</span>}
                </button>
            </div>
        </div>
    );
};

export default function ClientSideBar(){
    const { page, setPage } = useClientDashboardStore();
    const { authUser, logout, isLoggingOut } = useAuthStore();
    
    // State
    const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
    const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(false);

    const active = page;

    return(
        <>
            {/* Mobile Toggle Button (Visible < md) */}
            <div className="md:hidden fixed top-4 left-4 z-40">
                <button 
                    onClick={() => setIsMobileDrawerOpen(true)}
                    className="p-2 bg-card border border-border-subtle rounded-lg shadow-md text-secondary hover:text-blue-500 focus:outline-none transition-colors"
                >
                    <MenuIcon />
                </button>
            </div>

            {/* Desktop Sidebar (Visible >= md) - Toggleable Collapsed/Expanded State */}
            <div 
                className={`
                    hidden md:flex flex-col h-screen sticky top-0 left-0 border-r border-border-subtle bg-card transition-all duration-300 z-30
                    ${isDesktopCollapsed ? "w-20" : "w-64"}
                `}
            >
                 {/* Expand/Collapse Button at Top */}
                <div className={`w-full flex ${isDesktopCollapsed ? "justify-center" : "justify-end pr-4"} py-4 border-b border-border-subtle`}>
                    <button 
                        onClick={() => setIsDesktopCollapsed(!isDesktopCollapsed)}
                        className="p-2 hover:bg-hover-bg rounded-xl text-secondary transition-colors"
                        title={isDesktopCollapsed ? "Expand Menu" : "Collapse Menu"}
                    >
                        <MenuIcon sx={{ fontSize: 20 }} /> 
                    </button>
                </div>
                {/* Sidebar Content */}
                <SidebarContent 
                    active={active} 
                    setPage={setPage} 
                    authUser={authUser} 
                    logout={logout} 
                    isLoggingOut={isLoggingOut} 
                    isCollapsed={isDesktopCollapsed} 
                />
            </div>

            {/* Full Drawer (Used ONLY for Mobile) */}
            <Dialog.Root open={isMobileDrawerOpen} onOpenChange={setIsMobileDrawerOpen}>
                <Dialog.Portal>
                    <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden" />
                    <Dialog.Content className="fixed left-0 top-0 bottom-0 w-64 z-50 md:hidden flex flex-col h-full bg-card shadow-xl border-r border-border-subtle overflow-hidden">
                        {/* Drawer Content - Always Expanded */}
                        <SidebarContent 
                            active={active} 
                            setPage={setPage} 
                            authUser={authUser} 
                            logout={logout} 
                            isLoggingOut={isLoggingOut} 
                            isCollapsed={false}
                            onClose={() => setIsMobileDrawerOpen(false)}
                        />
                        <Dialog.Title className="sr-only">Navigation Menu</Dialog.Title>
                        <Dialog.Description className="sr-only">Main navigation for client dashboard</Dialog.Description>
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>
        </>
    )
}
