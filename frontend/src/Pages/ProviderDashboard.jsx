import ProviderSideBar from "../components/providerDashboardComponents/ProviderSideBar";
import ProviderHome from "../components/providerDashboardComponents/ProviderHome";
import ProviderBrowseJobs from "../components/providerDashboardComponents/ProviderBrowseJobs";
import ProviderProfile from "../components/providerDashboardComponents/ProviderProfile";
import useProviderDashboardStore from "../store/providerDashboardStore";

export default function ProviderDashboard(){
    const {page}=useProviderDashboardStore();
    return(
        <div className="flex  bg-gray-100">
            <ProviderSideBar/>
            {/* page content */}
            <div className="w-full bg-gray-100 ">
                {page==="home" && <ProviderHome/>}
                {page==="browseJobs" && <ProviderBrowseJobs/>}
                {page==="profile" && <ProviderProfile/>}
            </div>
        </div>
    )
}