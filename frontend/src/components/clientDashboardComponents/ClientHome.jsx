import IconButton from "@mui/material/IconButton";
import { useAuthStore } from "../../store/authStore"
import "aos/dist/aos.css";

//icons
import AddIcon from '@mui/icons-material/Add';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import useClientDashboardStore from "../../store/clientDashboardStore";
import { useEffect } from "react";
import { Avatar, Button, Skeleton } from "@radix-ui/themes";
import { useNavigate } from "react-router-dom";

export default function ClientHome(){
    const {authUser}=useAuthStore();
    const{setPage,getSuggestedProviders,gettingSuggestedProviders,suggestedProviders}=useClientDashboardStore();
    const navigate = useNavigate();

    useEffect(()=>{
        getSuggestedProviders();
    },[]);
    
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
                        onClick={()=>setPage("profile")}>
                        <AccountCircleIcon sx={{fontSize:"30px"}}/>
                    </IconButton>
                    <p className=" font-bold">Profile</p>
                </div>
            </div>
            {/* suggested providers */}
            <div className="mt-8">
                <h2 className="text-xl font-bold mb-4">Suggested Providers</h2>
                {gettingSuggestedProviders ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center gap-3">
                                <Skeleton width="64px" height="64px" style={{ borderRadius: '9999px' }} />
                                <Skeleton width="120px" height="20px" />
                                <Skeleton width="80px" height="32px" />
                            </div>
                        ))}
                    </div>
                ) : suggestedProviders.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {suggestedProviders.map((provider) => (
                            <div key={provider.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center gap-3 hover:shadow-md transition-all duration-300">
                                <Avatar
                                    size="5"
                                    src={provider.profile_picture ? `http://localhost:8000/storage/${provider.profile_picture}` : undefined}
                                    fallback={provider.name?.[0]}
                                    radius="full"
                                />
                                <div className="text-center">
                                    <h3 className="font-bold text-lg text-gray-800 line-clamp-1">{provider.name}</h3>
                                </div>
                                <Button 
                                    className="w-full cursor-pointer mt-2" 
                                    variant="soft" 
                                    onClick={() => navigate(`/provider-profile/${provider.id}`)}
                                >
                                    View Profile
                                </Button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500">No providers found.</p>
                )}
            </div>
        </div>
    )
}