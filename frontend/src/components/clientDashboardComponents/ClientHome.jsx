import IconButton from "@mui/material/IconButton";
import { useAuthStore } from "../../store/authStore"
import "aos/dist/aos.css";

//icons
import AddIcon from '@mui/icons-material/Add';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import useClientDashboardStore from "../../store/clientDashboardStore";

export default function ClientHome(){
    const {authUser}=useAuthStore();
    const{setPage}=useClientDashboardStore();

    return(
        <div className="flex flex-col w-full p-10" data-aos="fade-up">
            {/* header */}
            <div className="w-full bg-blue-500 p-5 rounded-xl">
                <h1 className="text-2xl font-bold text-white">Welcome back, {authUser.name}!</h1>
                <p className="text-gray-200 font-light">Here are some quick actions to get you started</p>
            </div>
            {/* quick actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mt-5">
                <div className="flex flex-col justify-center items-center w-full p-5 gap-2 rounded-xl bg-white">
                    <IconButton color="primary" sx={{width:"50px",height:"50px"}}
                        onClick={()=>setPage("myJobs")}>
                        <AddIcon sx={{fontSize:"30px"}}/>
                    </IconButton>
                    <p className=" font-bold">Post new job</p>
                </div>
                <div className="flex flex-col justify-center items-center w-full p-5 gap-2 rounded-xl bg-white">
                    <IconButton color="secondary" sx={{width:"50px",height:"50px"}}
                        onClick={()=>setPage("myJobs")}>
                        <WorkOutlineIcon sx={{fontSize:"30px"}}/>
                    </IconButton>
                    <p className=" font-bold">My Jobs</p>
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
                        onClick={()=>setPage("userProfile")}>
                        <AccountCircleIcon sx={{fontSize:"30px"}}/>
                    </IconButton>
                    <p className=" font-bold">Profile</p>
                </div>
            </div>
        </div>
    )
}