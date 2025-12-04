import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useClientDashboardStore from '../store/clientDashboardStore';
import Button from '@mui/material/Button';
import 'aos/dist/aos.css';

const JobDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { getJob, job, gettingJob,proposals } = useClientDashboardStore();

    useEffect(() => {
        getJob(id);
    }, [id, getJob]);

    if (gettingJob) {
        return (
            <div className="flex justify-center items-center h-screen">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    if (!job) {
        return (
            <div className="flex flex-col justify-center items-center h-screen space-y-4">
                <h1 className="text-2xl font-bold">Job not found</h1>
                <Button variant="contained" onClick={() => navigate('/dashboard')}>
                    Back to Dashboard
                </Button>
            </div>
        );
    }

    return (
        <div className="flex flex-col w-full p-10 max-w-4xl mx-auto" >
            <div className="flex justify-between items-center mb-6">
                <Button variant="outlined" onClick={() => navigate('/dashboard')}>
                    Back
                </Button>
                <h1 className="text-3xl font-bold">Job Details</h1>
            </div>

            <div className="bg-white border-2 border-gray-200 rounded-xl p-8 shadow-sm space-y-6" data-aos="fade-up">
                <div className="flex justify-between items-start">
                    <div>
                        <h2 className="text-2xl font-bold mb-2">{job.title}</h2>
                        <div className="flex gap-2">
                            {job.status === "open" && <div className="badge badge-soft badge-info">Open</div>}
                            {job.status === "in_progress" && <div className="badge badge-soft badge-warning">In Progress</div>}
                            {job.status === "completed" && <div className="badge badge-soft badge-success">Completed</div>}
                            {job.status === "closed" && <div className="badge badge-soft badge-error">Closed</div>}
                            {job.is_remote ? <div className="badge badge-outline">Remote</div> : <div className="badge badge-outline">{job.location}</div>}
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-gray-500">Budget</p>
                        <p className="text-xl font-bold text-green-600">${job.budget}</p>
                    </div>
                </div>

                <div className="divider"></div>

                <div>
                    <h3 className="text-lg font-semibold mb-2">Description</h3>
                    <p className="whitespace-pre-wrap text-gray-700">{job.description}</p>
                </div>

                <div className="divider"></div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <p className="text-gray-500">Location</p>
                        <p className="font-medium">{job.location}</p>
                    </div>
                    <div>
                        <p className="text-gray-500">Posted Date</p>
                        <p className="font-medium">{new Date(job.created_at).toLocaleDateString()}</p>
                    </div>
                </div>
            </div>
            <div className='mt-6' data-aos="fade-up">
                <h3 className="text-lg font-semibold mb-2">Proposals</h3>
                <div className="grid grid-cols-2 gap-4 text-sm bg-white border-2 border-gray-200 rounded-xl p-8 shadow-sm space-y-6">
                    {proposals.map((proposal) => (
                        <div key={proposal.id}>
                            <p className="text-gray-500">Provider</p>
                            {/* <p className="font-medium">{proposal.provider.name}</p> */}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default JobDetailsPage;
