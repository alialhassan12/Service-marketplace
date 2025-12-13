import IconButton from "@mui/material/IconButton";
import { useAuthStore } from "../../store/authStore"
import "aos/dist/aos.css";

//icons
import SearchIcon from '@mui/icons-material/Search';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import PaidIcon from '@mui/icons-material/Paid';
import useProviderDashboardStore from "../../store/providerDashboardStore";
import { useEffect } from "react";
import { Skeleton } from "@radix-ui/themes";

export default function ProviderHome(){
    const {authUser}=useAuthStore();
    const{setPage,getRecommendedJobs,recommendedJobsData,recommendedJobsLoading}=useProviderDashboardStore();

    useEffect(() => {
        getRecommendedJobs();
    }, []);

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
            {/* Recomended jobs */}
            <div className="mt-8">
                <h2 className="text-xl font-bold mb-4">Recommended Jobs</h2>
                {recommendedJobsLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-3">
                                <div className="flex justify-between items-start">
                                    <Skeleton width="60%" height="24px" />
                                    <Skeleton width="60px" height="20px" style={{ borderRadius: '12px' }} />
                                </div>
                                <Skeleton width="100%" height="20px" />
                                <Skeleton width="80%" height="20px" />
                                <div className="pt-4 flex justify-between items-center border-t border-gray-100 mt-2">
                                    <Skeleton width="80px" height="24px" />
                                    <Skeleton width="100px" height="20px" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : recommendedJobsData.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {recommendedJobsData.map((job) => {
                            const daysAgo = Math.floor((new Date() - new Date(job.created_at)) / (1000 * 60 * 60 * 24));
                            const dateString = daysAgo === 0 ? "Today" : daysAgo === 1 ? "Yesterday" : `${daysAgo} days ago`;

                            return (
                                <div key={job.id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col justify-between">
                                    <div>
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-bold text-lg text-gray-800 line-clamp-1">{job.title}</h3>
                                            <div className={`badge badge-soft ${job.status === 'open' ? 'badge-info' : 'badge-neutral'}`}>
                                                {job.status}
                                            </div>
                                        </div>
                                        <p className="text-gray-600 text-sm line-clamp-2 mb-4">{job.description}</p>
                                    </div>
                                    <div className="flex justify-between items-center pt-4 border-t border-gray-100 mt-2">
                                        <div className="flex items-center gap-1 text-green-600 font-bold">
                                            <PaidIcon fontSize="small"/>
                                            <span>${job.budget}</span>
                                        </div>
                                        <span className="text-xs text-gray-400">Posted {dateString}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <p className="text-gray-500">No recommended jobs found.</p>
                )}
            </div>
        </div>
    )
}