import React, { useEffect,useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useClientDashboardStore from '../store/clientDashboardStore';
import Button from '@mui/material/Button';
import 'aos/dist/aos.css';
import EditIcon from '@mui/icons-material/Edit';
// dialog imports
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Input from '@mui/material/Input';
import InputAdornment from '@mui/material/InputAdornment';
import { Select, Avatar } from '@radix-ui/themes';
import { Skeleton } from "@radix-ui/themes";
import { ChatBubbleIcon,ArrowLeftIcon } from '@radix-ui/react-icons';


const JobDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { getJob,
            job,
            jobStatus,
            gettingJob,
            proposals,
            updateJob,
            updatingJob,
            updatedJob,
            updateProposalState,
            updatingProposalStatusId,
            updateJobStatus,
            updatingJobStatus,
            updatedJobStatus } = useClientDashboardStore();
    const [openEdit,setOpenEdit]=useState(false);
    useEffect(() => {
        getJob(id);
    }, [getJob,updatedJob]);
    
    const changeJobStatus=(state)=>{
        updateJobStatus(id,state);
    }
    const changeProposalState=(proposalId,state)=>{
        updateProposalState(id,proposalId,state);
    }

    const [formData,setFormData]=useState({
        title:"",
        description:"",
        is_remote:false,
        location:"",
        budget:0,
    });

    const updateFormValues=()=>{
        setFormData({
            title:job?.title,
            description:job?.description,
            is_remote:job?.is_remote,
            location:job?.location,
            budget:job?.budget,
        })
    }

    //dialog handlers
    const handleOpenEdit = () => {
        setOpenEdit(true);
        updateFormValues();
    }
    const handleCloseEdit = () => {
        setOpenEdit(false);
    }
    const submitEditJob=async()=>{
        await updateJob(id,formData);
        handleCloseEdit();
    }

    if (gettingJob) {
        return (
            <div className="flex flex-col w-full p-10 max-w-4xl mx-auto">
                {/* Header Skeleton */}
                <div className="flex justify-between items-center mb-6 w-full">
                    <Skeleton width="80px" height="36px" />
                    <Skeleton width="180px" height="36px" />
                </div>

                {/* Main Job Details Card Skeleton */}
                <div className="bg-white border-2 border-gray-200 rounded-xl p-8 shadow-sm space-y-6">
                    <div className="flex justify-between items-start">
                        <div className="space-y-2">
                            <Skeleton width="250px" height="32px" />
                            <div className="flex gap-2">
                                <Skeleton width="80px" height="24px" />
                                <Skeleton width="80px" height="24px" />
                            </div>
                        </div>
                        <div className="flex flex-col items-end space-y-1">
                            <Skeleton width="50px" height="20px" />
                            <Skeleton width="100px" height="32px" />
                        </div>
                    </div>

                    <div className="divider"></div>

                    <div className="space-y-2">
                        <Skeleton width="120px" height="28px" />
                        <div className="space-y-1">
                            <Skeleton width="100%" height="20px" />
                            <Skeleton width="100%" height="20px" />
                            <Skeleton width="80%" height="20px" />
                        </div>
                    </div>

                    <div className="divider"></div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <Skeleton width="80px" height="20px" />
                            <Skeleton width="150px" height="24px" />
                        </div>
                        <div className="space-y-1">
                            <Skeleton width="80px" height="20px" />
                            <Skeleton width="150px" height="24px" />
                        </div>
                    </div>

                    <Skeleton width="120px" height="36px" />
                </div>
                
                 {/* Proposals Skeleton */}
                <div className='mt-6 space-y-2'>
                    <Skeleton width="150px" height="28px" />
                    <div className="bg-white border-2 border-gray-200 rounded-xl p-8 shadow-sm h-32 flex items-center justify-center">
                        <Skeleton width="100%" height="100%" />
                    </div>
                </div>
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
                <Button variant="outlined" onClick={() => navigate(-1)}>
                    <ArrowLeftIcon className="mr-2"/>Back
                </Button>
                <h1 className="text-3xl font-bold">Job Details</h1>
            </div>

            <div className="bg-white border-2 border-gray-200 rounded-xl p-8 shadow-sm space-y-6" >
                <div className="flex justify-between items-start">
                    <div>
                        
                        <h2 className="text-2xl font-bold mb-2">{job.title}</h2>
                        <div className="flex gap-2">
                            <Select.Root value={jobStatus} onValueChange={(value)=>{
                                changeJobStatus(value);
                            }}>
                                <Select.Trigger color="indigo" variant="soft" />
                                <Select.Content color="indigo">
                                    <Select.Item value="open">Open</Select.Item>
                                    <Select.Item value="in_progress">In Progress</Select.Item>
                                    <Select.Item value="completed">Completed</Select.Item>
                                    <Select.Item value="closed">Closed</Select.Item>
                                </Select.Content>
                            </Select.Root>
                            {updatingJobStatus && <span className="loading loading-infinity loading-xl text-blue-500 text-center"/>}

                            {/* {job.status === "open" && <div className="badge badge-soft badge-info">Open</div>}
                            {job.status === "in_progress" && <div className="badge badge-soft badge-warning">In Progress</div>}
                            {job.status === "completed" && <div className="badge badge-soft badge-success">Completed</div>}
                            {job.status === "closed" && <div className="badge badge-soft badge-error">Closed</div>}
                            {job.is_remote ? <div className="badge badge-outline">Remote</div> : <div className="badge badge-outline">{job.location}</div>} */}
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
                {/* edit button */}
                <Button variant="outlined" startIcon={<EditIcon/>} onClick={handleOpenEdit}>
                        Edit Job
                </Button>
            </div>
            {/* proposals */}
            <div className='mt-6'>
                <h3 className="text-lg font-semibold mb-2">Proposals</h3>
                <div className="grid grid-cols-1 gap-4 mt-4">
                    {proposals.map((proposal) => (
                        <div key={proposal.id} className="bg-white border-2 border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
                            <div className="flex justify-between items-start mb-4">
                                <div 
                                    className="flex items-center gap-3 cursor-pointer group" 
                                    onClick={() => navigate(`/provider-profile/${proposal.provider.id}`)}
                                >
                                    <Avatar
                                        size="3"
                                        src={`http://localhost:8000/storage/${proposal.provider.profile_picture}`}
                                        fallback={proposal.provider.name?.[0]}
                                        radius="full"
                                    />
                                    <div>
                                        <h4 className="font-bold text-lg group-hover:text-indigo-600 transition-colors">{proposal.provider.name}</h4>
                                        <p className="text-xs text-gray-500">Provider</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button variant="soft" color="gray" onClick={(e) => { e.stopPropagation(); /* Add chat logic later */ }}>
                                        <ChatBubbleIcon />
                                    </Button>
                                    <Select.Root defaultValue={proposal.status || "pending"} onValueChange={(value)=>changeProposalState(proposal.id,value)}>
                                        <Select.Trigger variant="soft" color={
                                            proposal.status === 'accepted' ? 'green' : 
                                            proposal.status === 'rejected' ? 'red' : 'indigo'
                                        }  />
                                        <Select.Content>
                                            <Select.Item value="pending">Pending</Select.Item>
                                            <Select.Item value="accepted">Accepted</Select.Item>
                                            <Select.Item value="rejected">Rejected</Select.Item>
                                        </Select.Content>
                                    </Select.Root>
                                    {updatingProposalStatusId === proposal.id && <span className="loading loading-infinity loading-xl text-blue-500 text-center"/>}
                                </div>
                            </div>
                            <div className="pl-12">
                                <p className="text-gray-700 whitespace-pre-wrap">{proposal.description}</p>
                                <div className="mt-4 flex gap-4 text-sm text-gray-500 border-t pt-2 border-gray-100">
                                    <span>Price: <strong>${proposal.price}</strong></span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* edit job dialog */}
            <Dialog open={openEdit} onClose={handleCloseEdit}>
                <DialogTitle>Edit job</DialogTitle>
                <DialogContent>
                <form>
                    {/* job title */}
                    <TextField
                        autoFocus
                        required
                        margin="dense"
                        label="Job Title"
                        type="text"
                        fullWidth
                        variant="standard"
                        value={formData.title}
                        onChange={(e)=>setFormData({...formData,title:e.target.value})}
                    />
                    {/* job description */}
                    <TextField
                        autoFocus
                        required
                        margin="dense"
                        label="Job Description"
                        type="text"
                        fullWidth
                        variant="standard"
                        multiline
                        rows={4}
                        value={formData.description}
                        onChange={(e)=>setFormData({...formData,description:e.target.value})}
                    />
                    {/* is remote */}
                    <FormControlLabel
                        value={formData.is_remote}
                        control={<Switch color="primary" checked={formData.is_remote} />}
                        label="Remote"
                        labelPlacement="end"
                        onChange={(e)=>setFormData({...formData,is_remote:e.target.checked})}
                    />
                    {/* job location */}
                    <TextField
                        disabled={formData.is_remote}
                        required
                        margin="dense"
                        label="Job Location"
                        type="text"
                        fullWidth
                        variant="standard"
                        value={formData.location}
                        onChange={(e)=>setFormData({...formData,location:e.target.value})}
                    />
                    {/* budget */}
                    <FormControl fullWidth sx={{ m: 1 }} variant="standard">
                        <InputLabel htmlFor="standard-adornment-amount">Budget</InputLabel>
                        <Input
                            id="standard-adornment-amount"
                            startAdornment={<InputAdornment position="start">$</InputAdornment>}
                            value={formData.budget}
                            onChange={(e)=>setFormData({...formData,budget:Number(e.target.value)})}
                        />
                    </FormControl>
                </form>
                </DialogContent>
                <DialogActions>
                <Button onClick={handleCloseEdit}>Cancel</Button>
                <Button type="submit" disabled={updatingJob} variant="contained" onClick={submitEditJob}>
                    {updatingJob? <span className="loading loading-infinity loading-xl text-blue-500"></span> : "Edit"}
                </Button>
                </DialogActions>
            </Dialog>
            
        </div>
    );
};

export default JobDetailsPage;
