import IconButton from "@mui/material/IconButton";
import { useAuthStore } from "../../store/authStore"
import "aos/dist/aos.css";

//icons
import SearchIcon from '@mui/icons-material/Search';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import PaidIcon from '@mui/icons-material/Paid';
import useProviderDashboardStore from "../../store/providerDashboardStore";

export default function ProviderHome(){
    const {authUser}=useAuthStore();
    const{setPage}=useProviderDashboardStore();

    return(
        <div className="flex flex-col w-full p-10" data-aos="fade-up">
            {/* header */}
            <div className="w-full bg-blue-500 p-5 rounded-xl">
                <h1 className="text-2xl font-bold text-white">Welcome back, {authUser.name}!</h1>
                <p className="text-gray-200 font-light">Ready to find your next Project and showcase your skills</p>
            </div>
            {/* quick actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mt-5">
                <div className="flex flex-col justify-center items-center w-full p-5 gap-2 rounded-xl bg-white">
                    <IconButton color="primary" sx={{width:"50px",height:"50px"}}
                        onClick={()=>setPage("browseJobs")}>
                        <SearchIcon sx={{fontSize:"30px"}}/>
                    </IconButton>
                    <p className=" font-bold">Browse Jobs</p>
                </div>
                <div className="flex flex-col justify-center items-center w-full p-5 gap-2 rounded-xl bg-white">
                    <IconButton color="secondary" sx={{width:"50px",height:"50px"}}
                        onClick={()=>setPage("myProposals")}>
                        <WorkOutlineIcon sx={{fontSize:"30px"}}/>
                    </IconButton>
                    <p className=" font-bold">My Proposals</p>
                </div>
                <div className="flex flex-col justify-center items-center w-full p-5 gap-2 rounded-xl bg-white">
                    <IconButton color="primary" sx={{width:"50px",height:"50px"}}
                        onClick={()=>setPage("messages")}>
                        <ChatBubbleOutlineIcon sx={{fontSize:"30px"}}/>
                    </IconButton>
                    <p className=" font-bold">Messages</p>
                </div>
                <div className="flex flex-col justify-center items-center w-full p-5 gap-2 rounded-xl bg-white">
                    <IconButton color="secondary" sx={{width:"50px",height:"50px"}}
                        onClick={()=>setPage("earnings")}>
                        <PaidIcon sx={{fontSize:"30px"}}/>
                    </IconButton>
                    <p className=" font-bold">Earnings</p>
                </div>
            </div>
        </div>
    )
}