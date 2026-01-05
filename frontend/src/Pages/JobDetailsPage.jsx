import React, { useEffect,useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useClientDashboardStore from '../store/clientDashboardStore';
import { Theme } from '@radix-ui/themes';
import { useTheme } from '../contexts/useTheme';
import { Select, Avatar, Text, Skeleton, Button, TextField as RadixTextField, Dialog as RadixDialog, Flex, Box, Switch as RadixSwitch, TextArea } from '@radix-ui/themes';
import { ChatBubbleIcon, ArrowLeftIcon } from '@radix-ui/react-icons';
import { Edit, Briefcase, DollarSign, MapPin, Calendar, ExternalLink } from "lucide-react";
import { useMessagesStore } from '../store/messagesStore';


const JobDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { theme } = useTheme();
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
            updatedJobStatus,
            updatedProposalStatus,
            setPage} = useClientDashboardStore();
    const {setSelectedContact}=useMessagesStore();
    const [openEdit,setOpenEdit]=useState(false);
    useEffect(() => {
        getJob(id);
    }, [getJob,updatedJob]);
    
    const changeJobStatus=(state)=>{
        updateJobStatus(id,state);
    }
    const changeProposalState=(proposalId,state,provider_id,amount,description)=>{
        updateProposalState(id,proposalId,state,provider_id,amount,description);
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

    const handleOpenChat=(provider)=>{
        navigate(-1);
        setPage("messages");
        setSelectedContact(provider);
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
            <Theme appearance={theme}>
                <div className="w-full min-h-screen bg-bg-1 p-6 md:p-10">
                    <div className="max-w-4xl mx-auto flex flex-col gap-6">
                        {/* Header Skeleton */}
                        <div className="flex justify-between items-center mb-6 w-full">
                            <Skeleton width="80px" height="36px" />
                            <Skeleton width="180px" height="36px" />
                        </div>

                        {/* Main Job Details Card Skeleton */}
                        <div className="bg-card border border-border-subtle rounded-2xl p-8 shadow-soft space-y-6">
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

                            <div className="border-t border-border-subtle my-6" />

                            <div className="space-y-2">
                                <Skeleton width="120px" height="28px" />
                                <div className="space-y-1">
                                    <Skeleton width="100%" height="20px" />
                                    <Skeleton width="100%" height="20px" />
                                    <Skeleton width="80%" height="20px" />
                                </div>
                            </div>

                            <div className="border-t border-border-subtle my-6" />

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
                        <div className='mt-8 space-y-4'>
                            <Skeleton width="150px" height="28px" />
                            <div className="bg-card border border-border-subtle rounded-2xl p-8 shadow-soft h-32 flex items-center justify-center">
                                <Skeleton width="100%" height="100%" />
                            </div>
                        </div>
                    </div>
                </div>
            </Theme>
        );
    }

    if (!job) {
        return (
            <div className="flex flex-col justify-center items-center h-screen space-y-4 bg-bg-1">
                <Text size="6" weight="bold" className="text-primary">Job not found</Text>
                <Button size="3" variant="solid" onClick={() => navigate('/dashboard')}>
                    Back to Dashboard
                </Button>
            </div>
        );
    }

    return (
        <Theme appearance={theme}>
            <div className="w-full min-h-screen bg-bg-1 p-6 md:p-10">
                <div className="max-w-4xl mx-auto flex flex-col gap-6">
                    <div className="flex justify-between items-center mb-6">
                        <Button variant="soft" color="gray" onClick={() => navigate(-1)}>
                            <ArrowLeftIcon className="mr-2"/>Back
                        </Button>
                        <Text size="6" weight="bold" className="text-primary">Job Details</Text>
                    </div>

            <div className="bg-card border border-border-subtle rounded-2xl p-8 shadow-soft space-y-6">
                <div className="flex justify-between items-start">
                    <div>
                        <Text size="6" weight="bold" className="block mb-2 text-primary">{job.title}</Text>
                        <div className="flex items-center gap-3">
                            <Select.Root value={jobStatus} onValueChange={(value)=>{
                                changeJobStatus(value);
                            }}>
                                <Select.Trigger color="blue" variant="soft" />
                                <Select.Content color="blue">
                                    <Select.Item value="open">Open</Select.Item>
                                    <Select.Item value="in_progress">In Progress</Select.Item>
                                    <Select.Item value="completed">Completed</Select.Item>
                                    <Select.Item value="closed">Closed</Select.Item>
                                </Select.Content>
                            </Select.Root>
                            {updatingJobStatus && <span className="loading loading-infinity loading-md text-blue-500"/>}
                            {job.is_remote && <div className="badge badge-soft badge-info">Remote</div>}
                        </div>
                    </div>
                    <div className="text-right">
                        <Text size="2" color="gray" className="block text-secondary">Budget</Text>
                        <Text size="6" weight="bold" className="text-green-600">${job.budget}</Text>
                    </div>
                </div>

                <div className="border-t border-border-subtle my-2" />

                <div>
                    <h3 className="text-lg font-semibold mb-2 text-primary">Description</h3>
                    <p className="whitespace-pre-wrap text-secondary leading-relaxed">{job.description}</p>
                </div>

                <div className="border-t border-border-subtle my-2" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
                            <MapPin size={20} />
                        </div>
                        <div>
                            <Text size="1" color="gray" className="block text-secondary">Location</Text>
                            <Text size="2" weight="medium" className="text-primary">{job.location || "Remote"}</Text>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-500/10 rounded-lg text-purple-500">
                            <Calendar size={20} />
                        </div>
                        <div>
                            <Text size="1" color="gray" className="block text-secondary">Posted Date</Text>
                            <Text size="2" weight="medium" className="text-primary">{new Date(job.created_at).toLocaleDateString()}</Text>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <Button size="3" variant="soft" color="blue" className="cursor-pointer" onClick={handleOpenEdit}>
                        <Edit size={18} />
                        Edit Job
                    </Button>
                </div>
            </div>
            {/* proposals */}
            <div className='mt-10'>
                <Text size="5" weight="bold" className="text-primary mb-4 block">Proposals ({proposals.length})</Text>
                <div className="grid grid-cols-1 gap-4 mt-6">
                    {proposals.length === 0 ? (
                        <div className="bg-card border border-border-subtle rounded-2xl p-12 text-center shadow-soft">
                            <Briefcase className="mx-auto text-secondary mb-4 opacity-20" size={48} />
                            <Text size="4" className="text-secondary font-medium">No proposals received yet.</Text>
                        </div>
                    ) : (
                        proposals.map((proposal) => (
                            <div key={proposal.id} className="bg-card border border-border-subtle rounded-2xl p-6 shadow-soft hover:shadow-lg transition-all duration-300">
                                <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-4">
                                    <div 
                                        className="flex items-center gap-4 cursor-pointer group" 
                                        onClick={() => navigate(`/provider-profile/${proposal.provider.id}`)}
                                    >
                                        <Avatar
                                            size="3"
                                            src={`http://localhost:8000/storage/${proposal.provider.profile_picture}`}
                                            fallback={proposal.provider.name?.[0]}
                                            radius="full"
                                            className="ring-2 ring-blue-500/10"
                                        />
                                        <div>
                                            <h4 className="font-bold text-lg text-primary group-hover:text-blue-600 transition-colors">{proposal.provider.name}</h4>
                                            <div className="flex items-center gap-2 mt-0.5">
                                                <div className="w-2 h-2 rounded-full bg-green-500" />
                                                <p className="text-xs text-secondary font-medium uppercase tracking-wider">Top Provider</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                                        <Button variant="soft" color="blue" onClick={() => { handleOpenChat(proposal.provider)}}>
                                            <ChatBubbleIcon />
                                            Chat
                                        </Button>
                                        
                                        <Select.Root defaultValue={proposal.status || "pending"} onValueChange={(value)=>changeProposalState(proposal.id,value,proposal.provider_id,proposal.price,proposal.description)}>
                                            <Select.Trigger variant="soft" color={
                                                proposal.status === 'accepted' ? 'green' : 
                                                proposal.status === 'rejected' ? 'red' : 'blue'
                                            } className="min-w-[120px]" />
                                            <Select.Content>
                                                <Select.Item value="pending">Pending</Select.Item>
                                                <Select.Item value="accepted">Accepted</Select.Item>
                                                <Select.Item value="rejected">Rejected</Select.Item>
                                            </Select.Content>
                                        </Select.Root>
                                        {updatingProposalStatusId === proposal.id && <span className="loading loading-infinity loading-md text-blue-500"/>}
                                    </div>
                                </div>
                                <div className="pl-0 md:pl-14">
                                    <p className="text-secondary leading-relaxed whitespace-pre-wrap mb-4 bg-hover-bg/30 p-4 rounded-xl border border-border-subtle/50">
                                        {proposal.description}
                                    </p>
                                    <div className="flex items-center gap-6 text-sm">
                                        <div className="flex items-center gap-2 text-primary font-bold">
                                            <DollarSign size={16} className="text-green-500" />
                                            <span>Price: ${proposal.price}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-secondary">
                                            <Calendar size={16} />
                                            <span>{new Date(proposal.created_at).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* edit job dialog */}
            <RadixDialog.Root open={openEdit} onOpenChange={setOpenEdit}>
                <RadixDialog.Content style={{ maxWidth: 500 }} className="bg-card p-6 rounded-2xl">
                    <RadixDialog.Title className="text-2xl font-bold text-primary mb-2">Edit Job Details</RadixDialog.Title>
                    <RadixDialog.Description size="2" className="text-secondary mb-6 block">
                        Update the information for this job posting.
                    </RadixDialog.Description>

                    <Flex direction="column" gap="5">
                        <Box>
                            <Text as="label" size="2" weight="bold" mb="2" className="text-secondary block">
                                Job Title
                            </Text>
                            <RadixTextField.Root
                                variant="soft"
                                size="3"
                                required
                                value={formData.title}
                                onChange={(e)=>setFormData({...formData,title:e.target.value})}
                                placeholder="Enter job title"
                            />
                        </Box>

                        <Box>
                            <Text as="label" size="2" weight="bold" mb="2" className="text-secondary block">
                                Description
                            </Text>
                            <TextArea
                                variant="soft"
                                size="3"
                                className="min-h-[120px]"
                                value={formData.description}
                                onChange={(e)=>setFormData({...formData,description:e.target.value})}
                                placeholder="Detailed job description..."
                            />
                        </Box>

                        <Flex gap="4" align="start" direction={{ initial: 'column', sm: 'row' }}>
                            <Box className="flex-1 w-full">
                                <Text as="label" size="2" weight="bold" mb="2" className="text-secondary block">
                                    Location
                                </Text>
                                <RadixTextField.Root
                                    variant="soft"
                                    size="3"
                                    disabled={formData.is_remote}
                                    value={formData.location}
                                    onChange={(e)=>setFormData({...formData,location:e.target.value})}
                                    placeholder="City, Country"
                                />
                            </Box>
                            
                            <Box className="w-full sm:w-[140px] pt-[28px]">
                                <Flex align="center" gap="3" className="h-[40px] px-3 bg-hover-bg rounded-lg border border-border-subtle hover:border-blue-500/30 transition-colors cursor-pointer" onClick={() => setFormData({...formData, is_remote: !formData.is_remote})}>
                                    <RadixSwitch
                                        size="2"
                                        checked={formData.is_remote}
                                        onCheckedChange={(checked)=>setFormData({...formData,is_remote:checked})}
                                    />
                                    <Text size="2" weight="medium" className="text-primary cursor-pointer">Remote</Text>
                                </Flex>
                            </Box>
                        </Flex>

                        <Box>
                            <Text as="label" size="2" weight="bold" mb="2" className="text-secondary block">
                                Budget ($)
                            </Text>
                            <RadixTextField.Root
                                variant="soft"
                                size="3"
                                type="number"
                                value={formData.budget}
                                onChange={(e)=>setFormData({...formData,budget:Number(e.target.value)})}
                                placeholder="500"
                            >
                                <RadixTextField.Slot>
                                    <DollarSign size={16} className="text-gray-500" />
                                </RadixTextField.Slot>
                            </RadixTextField.Root>
                        </Box>
                    </Flex>

                    <Flex gap="3" mt="6" justify="end">
                        <RadixDialog.Close>
                            <Button variant="soft" color="gray" size="3" className="cursor-pointer">Cancel</Button>
                        </RadixDialog.Close>
                        <Button variant="solid" color="blue" size="3" loading={updatingJob} onClick={submitEditJob} className="cursor-pointer shadow-md">
                            Update Job
                        </Button>
                    </Flex>
                </RadixDialog.Content>
            </RadixDialog.Root>
            
                </div>
            </div>
        </Theme>
    );
};

export default JobDetailsPage;
