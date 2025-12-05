import PostJobButton from './PostJobButton';
import useClientDashboardStore from '../../store/clientDashboardStore';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

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
            <div className="flex justify-between border-2 border-gray-200 w-full p-5 rounded-xl">
                <h1 className="text-2xl font-bold ">My Jobs</h1>
                <PostJobButton/>
            </div>
            <div className='flex justify-center items-center mt-5'>
                <ToggleButtonGroup
                    color="primary"
                    value={status}
                    exclusive
                    onChange={(event, newValue) => {
                        if (newValue) {
                            setStatus(newValue);
                            
                        }
                    }}
                >   
                    <ToggleButton value="all">All</ToggleButton>
                    <ToggleButton value="open">Open</ToggleButton>
                    <ToggleButton value="in_progress">In Progress</ToggleButton>
                    <ToggleButton value="completed">Completed</ToggleButton>
                    <ToggleButton value="closed">Closed</ToggleButton>
                </ToggleButtonGroup>
            </div>
            {/* jobs */}
            <div className="flex flex-col w-full mt-5">
                {gettingMyJobs
                ?
                    <div className="flex justify-center items-center w-full h-[200px]">
                        <span className="loading loading-spinner loading-lg"></span>
                    </div>
                :   
                    myJobs.length === 0 ? (
                        <p className='text-center text-xl text-gray-500 font-bold'>Post a job to get started</p>
                    ) : (
                        myJobs.map((job) =>{
                            if(status === "all" || job.status === status){
                                return(
                                    <div data-aos="fade-up" key={job.id} className="flex justify-between items-center w-full p-5 mb-3 bg-white border-2 border-gray-200 rounded-xl">
                                        <div className='space-y-1'>
                                            <h1 className="text-2xl font-bold ">{job.title}</h1>
                                            {job.status === "open" && <div className="badge badge-soft badge-info">Open</div>}
                                            {job.status === "in_progress" && <div className="badge badge-soft badge-warning">In Progress</div>}
                                            {job.status === "completed" && <div className="badge badge-soft badge-success">Completed</div>}
                                            {job.status === "closed" && <div className="badge badge-soft badge-error">Closed</div>}
                                        </div>
                                        <div>
                                            <Button variant="contained" onClick={()=>navigate(`/job/${job.id}`)}>View job</Button>
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