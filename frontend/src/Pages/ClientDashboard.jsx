import ClientSideBar from "../components/clientDashboardComponents/ClientSideBar";
import ClientHome from "../components/clientDashboardComponents/ClientHome";
import ClientMyJobs from "../components/clientDashboardComponents/ClientMyJobs";
import ClientProfile from "../components/clientDashboardComponents/ClientProfile";
import useClientDashboardStore from "../store/clientDashboardStore";
import ClientPaymentPage from "../components/clientDashboardComponents/ClientPaymentPage";
import ClientMessagesPage from "../components/clientDashboardComponents/ClientMessagesPage";
import ClientSettings from "../components/clientDashboardComponents/ClientSettings";
import ClientUpdateProfile from "../components/clientDashboardComponents/ClientUpdateProfile";
import { Theme } from "@radix-ui/themes";
import { useTheme } from "../contexts/useTheme";

export default function ClientDashboard(){
    const {page}=useClientDashboardStore();
    const {theme}=useTheme();
    return(
        <Theme appearance={theme} accentColor="blue" grayColor="slate" panelBackground="translucent" radius="large">
            <div className="flex bg-bg-1 min-h-screen">
                <ClientSideBar/>
                {/* page content */}
                <div className="w-full bg-bg-1 pt-16 md:pt-0">
                    {page==="home" && <ClientHome/>}
                    {page==="myJobs" && <ClientMyJobs/>}
                    {page==="payments" && <ClientPaymentPage/>}
                    {page==="messages" && <ClientMessagesPage/>}
                    {page==="profile" && <ClientProfile/>}
                    {page==="settings" && <ClientSettings/>}
                    {page==="update" && <ClientUpdateProfile/>}
                </div>
            </div>
        </Theme>
    )
}