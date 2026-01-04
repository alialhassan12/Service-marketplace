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
            <div className="w-full bg-blue-600 p-6 rounded-2xl shadow-soft">
                <h1 className="text-2xl font-bold text-white">Welcome back, {authUser.name}!</h1>
                <p className="text-blue-100 font-medium">Ready to find your next Project and showcase your skills</p>
            </div>
            {/* quick actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mt-5">
                <div className="flex flex-col justify-center items-center w-full p-5 gap-2 rounded-2xl bg-card border border-border-subtle shadow-soft hover:shadow-lg transition-all duration-300">
                    <IconButton color="primary" sx={{width:"50px",height:"50px"}}
                        onClick={()=>setPage("browseJobs")}>
                        <SearchIcon sx={{fontSize:"30px"}}/>
                    </IconButton>
                    <p className="font-bold text-primary">Browse Jobs</p>
                </div>
                <div className="flex flex-col justify-center items-center w-full p-5 gap-2 rounded-2xl bg-card border border-border-subtle shadow-soft hover:shadow-lg transition-all duration-300">
                    <IconButton color="secondary" sx={{width:"50px",height:"50px"}}
                        onClick={()=>setPage("myProposals")}>
                        <WorkOutlineIcon sx={{fontSize:"30px"}}/>
                    </IconButton>
                    <p className="font-bold text-primary">My Proposals</p>
                </div>
                <div className="flex flex-col justify-center items-center w-full p-5 gap-2 rounded-2xl bg-card border border-border-subtle shadow-soft hover:shadow-lg transition-all duration-300">
                    <IconButton color="primary" sx={{width:"50px",height:"50px"}}
                        onClick={()=>setPage("messages")}>
                        <ChatBubbleOutlineIcon sx={{fontSize:"30px"}}/>
                    </IconButton>
                    <p className="font-bold text-primary">Messages</p>
                </div>
                <div className="flex flex-col justify-center items-center w-full p-5 gap-2 rounded-2xl bg-card border border-border-subtle shadow-soft hover:shadow-lg transition-all duration-300">
                    <IconButton color="secondary" sx={{width:"50px",height:"50px"}}
                        onClick={()=>setPage("earnings")}>
                        <PaidIcon sx={{fontSize:"30px"}}/>
                    </IconButton>
                    <p className="font-bold text-primary">Earnings</p>
                </div>
            </div>
            {/* Recomended jobs */}
            <div className="mt-8">
                <h2 className="text-xl font-bold mb-4 text-primary">Recommended Jobs</h2>
                {recommendedJobsLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="bg-card p-6 rounded-2xl border border-border-subtle shadow-soft space-y-3">
                                <div className="flex justify-between items-start">
                                    <Skeleton width="60%" height="24px" />
                                    <Skeleton width="60px" height="20px" style={{ borderRadius: '12px' }} />
                                </div>
                                <Skeleton width="100%" height="20px" />
                                <Skeleton width="80%" height="20px" />
                                <div className="pt-4 flex justify-between items-center border-t border-border-subtle mt-2">
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
                                <div key={job.id} className="bg-card p-6 rounded-2xl border border-border-subtle shadow-soft hover:shadow-lg transition-all duration-300 flex flex-col justify-between">
                                    <div>
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-bold text-lg text-primary line-clamp-1">{job.title}</h3>
                                            <div className={`badge badge-soft ${job.status === 'open' ? 'badge-info' : 'badge-neutral'}`}>
                                                {job.status}
                                            </div>
                                        </div>
                                        <p className="text-secondary text-sm line-clamp-2 mb-4">{job.description}</p>
                                    </div>
                                    <div className="flex justify-between items-center pt-4 border-t border-border-subtle mt-2">
                                        <div className="flex items-center gap-1 text-green-500 font-bold">
                                            <PaidIcon fontSize="small"/>
                                            <span>${job.budget}</span>
                                        </div>
                                        <span className="text-xs text-secondary">Posted {dateString}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <p className="text-secondary">No recommended jobs found.</p>
                )}
            </div>
        </div>
    )
}