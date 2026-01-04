import ProviderSideBar from "../components/providerDashboardComponents/ProviderSideBar";
import ProviderHome from "../components/providerDashboardComponents/ProviderHome";
import ProviderBrowseJobs from "../components/providerDashboardComponents/ProviderBrowseJobs";
import ProviderProfile from "../components/providerDashboardComponents/ProviderProfile";
import useProviderDashboardStore from "../store/providerDashboardStore";
import ProviderMyProposals from "../components/providerDashboardComponents/ProviderMyProposals";
import ProviderMessagesPage from "../components/providerDashboardComponents/ProviderMessagesPage";
import ProviderSettings from "../components/providerDashboardComponents/ProviderSettings";
import ProviderUpdateProfile from "../components/providerDashboardComponents/ProviderUpdateProfile";
import ProviderEarningsPage from "../components/providerDashboardComponents/ProviderEarningsPage";
import { Theme } from "@radix-ui/themes";
import { useTheme } from "../contexts/useTheme";

export default function ProviderDashboard(){
    const {page}=useProviderDashboardStore();
    const {theme}=useTheme();
    return(
        <Theme appearance={theme} accentColor="blue" grayColor="slate" panelBackground="translucent" radius="large">
            <div className="flex bg-bg-1 min-h-screen">
                <ProviderSideBar/>
                {/* page content */}
                <div className="w-full bg-bg-1 pt-16 md:pt-0">
                    {page==="home" && <ProviderHome/>}
                    {page==="browseJobs" && <ProviderBrowseJobs/>}
                    {page==="profile" && <ProviderProfile/>}
                    {page==="myProposals" && <ProviderMyProposals/>}
                    {page==="messages" && <ProviderMessagesPage/>}
                    {page==="settings" && <ProviderSettings/>}
                    {page==="update" && <ProviderUpdateProfile/>}
                    {page==="earnings" && <ProviderEarningsPage/>}
                </div>
            </div>
        </Theme>
    )
}