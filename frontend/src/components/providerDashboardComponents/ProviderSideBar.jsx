import "aos/dist/aos.css";
import React, { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import { useAuthStore } from "../../store/authStore"
import useProviderDashboardStore from "../../store/providerDashboardStore";
import * as Dialog from '@radix-ui/react-dialog';

//icons
import HomeIcon from '@mui/icons-material/Home';
import LogoutIcon from '@mui/icons-material/Logout';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import MessageIcon from '@mui/icons-material/Message';
import PaymentIcon from '@mui/icons-material/Payment';
import SettingsIcon from '@mui/icons-material/Settings';
import ContentPasteSearchIcon from '@mui/icons-material/ContentPasteSearch';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';

const SidebarLink = ({ page, icon: Icon, label, active, setPage, isCollapsed, onClick }) => {
    const isActive = active === page;
    return (
        <a 
            onClick={() => {
                setPage(page);
                if(onClick) onClick();
            }} 
            className={`
                flex items-center p-3 rounded-lg cursor-pointer transition-colors
                ${isActive ? "bg-blue-100 text-blue-600" : "text-gray-600 hover:bg-gray-100"}
                ${isCollapsed ? "justify-center" : "space-x-3"}
            `}
            title={isCollapsed ? label : ""}
        >
            <Icon className={`${isActive ? "text-blue-600" : "text-gray-500"}`} />
            {!isCollapsed && <span className="font-medium">{label}</span>}
        </a>
    );
};

const SidebarContent = ({ active, setPage, authUser, logout, isLoggingOut, isCollapsed, onClose }) => {
    const links = [
        { page: "home", icon: HomeIcon, label: "Home" },
        { page: "myProposals", icon: WorkOutlineIcon, label: "My Proposals" },
        { page: "browseJobs", icon: ContentPasteSearchIcon, label: "Browse Jobs" },
        { page: "messages", icon: MessageIcon, label: "Messages" },
        { page: "earnings", icon: PaymentIcon, label: "Earnings" },
        { page: "settings", icon: SettingsIcon, label: "Settings" },
    ];

    return (
        <div className="flex flex-col h-full overflow-hidden">
             {/* Header */}
            <div className={`flex items-center ${isCollapsed ? "justify-center" : "justify-between px-4"} mb-8 pt-4 min-h-[48px]`}>
                {!isCollapsed && <h1 className="text-2xl font-bold text-gray-800 whitespace-nowrap">SkillHub</h1>}
                {onClose && (
                    <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full md:hidden">
                        <CloseIcon />
                    </button>
                )}
            </div>

            {/* Links */}
            <div className="flex-1 space-y-1 px-2 overflow-y-auto">
                {links.map((link) => (
                    <SidebarLink 
                        key={link.page} 
                        {...link} 
                        active={active} 
                        setPage={setPage} 
                        isCollapsed={isCollapsed}
                        onClick={onClose}
                    />
                ))}
            </div>

            {/* Footer */}
            <div className="p-2 space-y-1 border-t border-gray-100 mt-2">
                <a 
                    onClick={logout} 
                    className={`
                        flex items-center p-3 rounded-lg cursor-pointer hover:bg-red-50 text-red-500 transition-colors
                        ${isCollapsed ? "justify-center" : "space-x-3"}
                    `}
                    title="Logout"
                >
                    {isLoggingOut ? (
                        <span className="loading loading-spinner loading-sm"></span>
                    ) : (
                        <LogoutIcon />
                    )}
                    {!isCollapsed && <span className="whitespace-nowrap">Logout</span>}
                </a>

                <a 
                    onClick={() => {
                        setPage("profile"); // Changed from userProfile to profile based on original file
                        if(onClose) onClose();
                    }}
                    className={`
                        flex items-center p-2 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors
                        ${isCollapsed ? "justify-center" : "space-x-3"}
                        ${active === "profile" ? "bg-blue-50" : ""} 
                    `}
                    title={authUser?.name}
                >
                    {authUser?.profile_picture ? (
                        <Avatar className="w-8 h-8" src={`http://localhost:8000/storage/${authUser?.profile_picture}`} />
                    ) : (
                        <Avatar className="w-8 h-8 bg-blue-500 text-white text-sm">
                            {authUser?.name?.[0]?.toUpperCase()}
                        </Avatar>
                    )}
                    {!isCollapsed && (
                        <div className="flex flex-col overflow-hidden">
                            <p className="text-sm font-semibold truncate text-gray-700">{authUser?.name}</p>
                            <p className="text-xs text-gray-500 truncate">{authUser?.email}</p>
                        </div>
                    )}
                </a>
            </div>
        </div>
    );
};

export default function ProviderSideBar(){
    const { page, setPage } = useProviderDashboardStore();
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
                    className="p-2 bg-white rounded-lg shadow-md text-gray-600 hover:text-blue-600 focus:outline-none"
                >
                    <MenuIcon />
                </button>
            </div>

            {/* Desktop Sidebar (Visible >= md) */}
            <div 
                className={`
                    hidden md:flex flex-col h-screen sticky top-0 left-0 border-r border-gray-200 bg-white transition-all duration-300 z-30
                    ${isDesktopCollapsed ? "w-20" : "w-64"}
                `}
            >
                 {/* Expand/Collapse Button */}
                <div className={`w-full flex ${isDesktopCollapsed ? "justify-center" : "justify-end pr-4"} py-4 border-b border-gray-100`}>
                    <button 
                        onClick={() => setIsDesktopCollapsed(!isDesktopCollapsed)}
                        className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors"
                        title={isDesktopCollapsed ? "Expand Menu" : "Collapse Menu"}
                    >
                        <MenuIcon />
                    </button>
                </div>
                 {/* Content */}
                <SidebarContent 
                    active={active} 
                    setPage={setPage} 
                    authUser={authUser} 
                    logout={logout} 
                    isLoggingOut={isLoggingOut} 
                    isCollapsed={isDesktopCollapsed} 
                />
            </div>

            {/* Mobile Drawer */}
            <Dialog.Root open={isMobileDrawerOpen} onOpenChange={setIsMobileDrawerOpen}>
                <Dialog.Portal>
                    <Dialog.Overlay className="DialogOverlay md:hidden" />
                    <Dialog.Content className="DialogContent md:hidden flex flex-col h-full bg-white shadow-xl">
                        <SidebarContent 
                            active={active} 
                            setPage={setPage} 
                            authUser={authUser} 
                            logout={logout} 
                            isLoggingOut={isLoggingOut} 
                            isCollapsed={false} // Always expanded in drawer
                            onClose={() => setIsMobileDrawerOpen(false)}
                        />
                        <Dialog.Title className="sr-only">Provider Navigation</Dialog.Title>
                        <Dialog.Description className="sr-only">Main navigation for provider dashboard</Dialog.Description>
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>
        </>
    )
}