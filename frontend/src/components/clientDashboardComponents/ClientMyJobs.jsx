import PostJobButton from './PostJobButton';
import useClientDashboardStore from '../../store/clientDashboardStore';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Button, SegmentedControl, Text, Skeleton } from '@radix-ui/themes';


export default function ClientMyJobs(){
    const {getMyJobs,myJobs,gettingMyJobs,addedJob}=useClientDashboardStore();
    const navigate = useNavigate();
    const [status, setStatus] = useState("all");

    useEffect(()=>{
        getMyJobs();
    },[getMyJobs,addedJob]);

    return(
        <div className="flex flex-col w-full p-10" data-aos="fade-up">
            {/* header */}
            <div className="flex justify-between border border-border-subtle w-full p-5 rounded-2xl bg-card shadow-soft">
                <h1 className="text-2xl font-bold text-primary">My Jobs</h1>
                <PostJobButton/>
            </div>
            <div className='flex justify-center items-center mt-6 w-full overflow-x-auto pb-2 scrollbar-hide'>
                <SegmentedControl.Root
                    size="3"
                    value={status}
                    onValueChange={(value) => setStatus(value)}
                    className="min-w-max md:min-w-[500px]"
                >
                    <SegmentedControl.Item value="all">All</SegmentedControl.Item>
                    <SegmentedControl.Item value="open">Open</SegmentedControl.Item>
                    <SegmentedControl.Item value="in_progress">In Progress</SegmentedControl.Item>
                    <SegmentedControl.Item value="completed">Completed</SegmentedControl.Item>
                    <SegmentedControl.Item value="closed">Closed</SegmentedControl.Item>
                </SegmentedControl.Root>
            </div>
            {/* jobs */}
            <div className="flex flex-col w-full mt-5" data-aos="fade-up">
                {gettingMyJobs
                ?
                        <div className='space-y-5'>
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex justify-between items-center w-full p-5 bg-card border border-border-subtle rounded-2xl">
                                    <div className='space-y-2 w-full'>
                                        <Skeleton width="40%" height="32px" />
                                        <Skeleton width="80px" height="24px" />
                                    </div>
                                    <div className="pl-4">
                                        <Skeleton width="100px" height="40px" />
                                    </div>
                                </div>
                            ))}
                        </div>
                :   
                    myJobs.length === 0 ? (
                        <p className='text-center text-xl text-secondary font-bold'>Post a job to get started</p>
                    ) : (
                        myJobs.map((job) =>{
                            if(status === "all" || job.status === status){
                                return(
                                    <div key={job.id} className="flex justify-between items-center w-full p-5 mb-3 bg-card border border-border-subtle rounded-2xl transition-all duration-300 hover:shadow-soft hover:translate-x-1">
                                        <div className='space-y-1'>
                                            <h1 className="text-xl font-bold text-primary">{job.title}</h1>
                                            {job.status === "open" && <div className="badge badge-soft badge-info">Open</div>}
                                            {job.status === "in_progress" && <div className="badge badge-soft badge-warning">In Progress</div>}
                                            {job.status === "completed" && <div className="badge badge-soft badge-success">Completed</div>}
                                            {job.status === "closed" && <div className="badge badge-soft badge-error">Closed</div>}
                                        </div>
                                        <div>
                                            <Button variant="soft" style={{cursor:"pointer"}} onClick={()=>navigate(`/job/${job.id}`)}>View job</Button>
                                        </div>
                                    </div>
                                );
                            }
                        })
                    )
                }
            </div>
        </div>
    )
}