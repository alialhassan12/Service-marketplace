import ClientSideBar from "../components/clientDashboardComponents/ClientSideBar";
import ClientHome from "../components/clientDashboardComponents/ClientHome";
import ClientMyJobs from "../components/clientDashboardComponents/ClientMyJobs";
import ClientProfile from "../components/clientDashboardComponents/ClientProfile";
import useClientDashboardStore from "../store/clientDashboardStore";
import ClientPaymentPage from "../components/clientDashboardComponents/ClientPaymentPage";
import ClientMessagesPage from "../components/clientDashboardComponents/ClientMessagesPage";

export default function ClientDashboard(){
    const {page}=useClientDashboardStore();
    return(
        <div className="flex  bg-gray-100">
            <ClientSideBar/>
            {/* page content */}
            <div className="w-full bg-gray-100 ">
                {page==="home" && <ClientHome/>}
                {page==="myJobs" && <ClientMyJobs/>}
                {page==="payments" && <ClientPaymentPage/>}
                {page==="profile" && <ClientProfile/>}
                {page==="messages" && <ClientMessagesPage/>}
            </div>
        </div>
    )
}