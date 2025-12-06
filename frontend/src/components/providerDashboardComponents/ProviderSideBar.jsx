import "aos/dist/aos.css";
import Avatar from '@mui/material/Avatar';
import { useAuthStore } from "../../store/authStore"
//icons
import HomeIcon from '@mui/icons-material/Home';
import LogoutIcon from '@mui/icons-material/Logout';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import MessageIcon from '@mui/icons-material/Message';
import PaymentIcon from '@mui/icons-material/Payment';
import SettingsIcon from '@mui/icons-material/Settings';
import ContentPasteSearchIcon from '@mui/icons-material/ContentPasteSearch';
import useProviderDashboardStore from "../../store/providerDashboardStore";


export default function ProviderSideBar(){
    const {page,setPage}=useProviderDashboardStore();
    
    const active=page;

    const {authUser,logout,isLoggingOut}=useAuthStore();
    //handlers
    const handleLogout=()=>{
        logout();
    }

    return(
        <div className="h-[100vh] sticky top-0 left-0 border-r-1 border-gray-200" data-aos="fade-right">
            <ul className="menu bg-white h-full min-w-60 p-4 space-y-2 flex flex-col">
                {/* logo */}
                <div className="w-full flex justify-center  mb-10">
                    <h1 className="text-2xl font-bold">SkillHub</h1>
                </div>

                {/* Sidebar content here */}
                <div className="flex flex-col flex-1 justify-between">
                    <div className="flex flex-col space-y-1">
                        {/* home */}
                        <li ><a onClick={()=>setPage("home")} className={active==="home"? "bg-blue-200 text-blue-500" : ""}>
                        <HomeIcon/>Home
                        </a></li>
                        {/* my Proposals */}
                        <li><a onClick={()=>setPage("myProposals")} className={active==="myProposals"? "bg-blue-200 text-blue-500" : ""}>
                        <WorkOutlineIcon/>My Proposals
                            </a></li>
                        {/* Browse Jobs */}
                        <li><a onClick={()=>setPage("browseJobs")} className={active==="browseJobs"? "bg-blue-200 text-blue-500" : ""}>
                        <ContentPasteSearchIcon/>Browse Jobs
                            </a></li>
                        {/* messages */}
                        <li><a onClick={()=>setPage("messages")} className={active==="messages"? "bg-blue-200 text-blue-500" : ""}>
                        <MessageIcon/>Messages
                            </a></li>
                        {/* earnings */}
                        <li><a onClick={()=>setPage("earnings")} className={active==="earnings"? "bg-blue-200 text-blue-500" : ""}>
                        <PaymentIcon/>Earnings
                            </a></li>
                        {/* settings */}
                        <li><a onClick={()=>setPage("settings")} className={active==="settings"? "bg-blue-200 text-blue-500" : ""}>
                        <SettingsIcon/>Settings
                        </a></li>
                    </div>
                    <div className="flex flex-col space-y-1">
                        {/* logout */}
                        <li><a onClick={handleLogout} className={active==="logout"? "bg-blue-200 text-blue-500" : ""}>
                            {isLoggingOut ? <p>Logging out...<span className="loading loading-infinity loading-xl text-blue-500 text-center"></span></p>: <><LogoutIcon/><p>Logout</p></>}
                        </a></li>
                        {/* user profile */}
                        <li><a onClick={()=>setPage("userProfile")} className={active==="userProfile"? "bg-blue-200 text-blue-500" : ""}>
                            {authUser?.image ? <Avatar className="w-10 h-10" src={authUser?.image} /> : <Avatar className="w-10 h-10">{authUser?.name[0]}</Avatar>}
                            <div className="flex flex-col">
                                <p className="font-semibold">{authUser?.name}</p>
                                <p className="text-xs text-gray-500">{authUser?.email}</p>
                            </div>
                        </a></li>
                    </div>
                </div>
            </ul>
        </div>
    )
}