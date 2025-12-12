import { MagnifyingGlassIcon, CalendarIcon, ClockIcon, ArrowLeftIcon, ArrowRightIcon, Cross2Icon, ChatBubbleIcon } from "@radix-ui/react-icons";
import { TextField, Card, Text, Flex, Button, Grid, Heading, Box, Select, Switch, Badge, Skeleton, IconButton, Dialog, Avatar, Separator, ScrollArea, Popover, TextArea, Checkbox } from "@radix-ui/themes";
import * as Slider from "@radix-ui/react-slider";
import { useEffect, useState, useRef } from "react";
import { MapPin } from "lucide-react";
import useProviderDashboardStore from "../../store/providerDashboardStore";
import { useAuthStore } from "../../store/authStore";
import toast from "react-hot-toast";

export default function ProviderBrowseJobs(){
    const {authUser}=useAuthStore();
    const [range, setRange] = useState([100, 1000]);
    const [isRemote, setIsRemote] = useState(false);
    const {browseJobs,browseJobsLoading,browseJobsData,submitProposal,submittingProposal}=useProviderDashboardStore();
    const [selectedJob, setSelectedJob] = useState(null);
    
    const [filters,setFilters]=useState({
        title:"",
        location:"",
        datePosted:"any",
        priceRange:[100,1000],
        remote:false,
        page: 1
    });
    const [proposalDescription,setProposalDescription]=useState("");

    useEffect(() => {
        browseJobs(filters);
    }, []);
    console.log(browseJobsData);

    const submitFilters=()=>{
        browseJobs({...filters, page: 1});
        setFilters({...filters, page: 1});
    }

    const submitProposalClick = async () => {
        if (!selectedJob) {
            toast.error("Please select a job");
            return;
        }
        
        const proposalData = {
            job_id: selectedJob.id,
            provider_id: authUser?.id,
            description: proposalDescription,
            price: selectedJob.budget, 
            status: "pending"
        };

        const success = await submitProposal(proposalData);
        
        if (success) {
            setSelectedJob(null);
            setProposalDescription("");
        }
    }

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= browseJobsData.last_page) {
            setFilters({...filters, page: newPage});
            browseJobs({ ...filters, page: newPage });
        }
    };
    
    // Safety check for data
    const jobs = browseJobsData?.data || [];
    const lastPage = browseJobsData?.last_page || 1;
    const currentPage = browseJobsData?.current_page || 1;

    return(
        <div className="w-full p-6 md:p-10" data-aos="fade-up">
            <Card size="4" className="shadow-sm">
                <Flex direction="column" gap="6">
                    <Flex justify="between" align="center">
                        <Heading size="6" weight="bold" className="text-gray-800">Browse Jobs</Heading>
                    </Flex>

                    {/* Search Bar */}
                    <Box width="100%">
                        <TextField.Root size="3"
                            value={filters.title}
                            onChange={(e)=>setFilters({...filters,title:e.target.value, page: 1})}
                            placeholder="Search by job title, keywords...">
                            <TextField.Slot>
                                <MagnifyingGlassIcon height="18" width="18" className="text-gray-500"/>
                            </TextField.Slot>
                        </TextField.Root>
                    </Box>

                    {/* Filters Grid */}
                    <Grid columns={{ initial: '1', sm: '2', md: '4' }} gap="5" align="end">
                        
                        {/* Location */}
                        <Box>
                            <Text as="label" size="2" weight="medium" mb="2" className="block text-gray-700">Location</Text>
                            <TextField.Root disabled={isRemote} 
                                value={filters.location}
                                onChange={(e)=>setFilters({...filters,location:e.target.value, page: 1})}
                                size="2" placeholder="e.g. Beirut, Lebanon">
                                <TextField.Slot>
                                    <MagnifyingGlassIcon height="16" width="16" />
                                </TextField.Slot>
                            </TextField.Root>
                        </Box>

                        {/* Date Posted */}
                        <Box>
                            <Text as="label" size="2" weight="medium" mb="2" className="block text-gray-700">Date Posted</Text>
                            <Select.Root defaultValue="any"
                                value={filters.datePosted}
                                onValueChange={(value)=>setFilters({...filters,datePosted:value, page: 1})}
                            >
                                <Select.Trigger className="w-full" placeholder="Any time" />
                                <Select.Content>
                                    <Select.Item value="any">Any time</Select.Item>
                                    <Select.Item value="today">Last 24 hours</Select.Item>
                                    <Select.Item value="week">Last 7 days</Select.Item>
                                    <Select.Item value="month">Last 30 days</Select.Item>
                                </Select.Content>
                            </Select.Root>
                        </Box>
                        
                        {/* Price Range */}
                        <Box className="w-full">
                            <Flex justify="between" mb="2">
                                <Text size="2" weight="medium" className="text-gray-700">Price Range</Text>
                                <Text size="2" className="text-gray-600">${range[0]} - ${range[1]}</Text>
                            </Flex>
                            <Slider.Root
                                className="relative flex items-center select-none touch-none w-full h-5"
                                value={range}
                                onValueChange={(value)=>{setRange(value);setFilters({...filters,priceRange:value, page: 1})}}
                                min={0}
                                max={5000}
                                step={10}
                            >
                                <Slider.Track className="bg-gray-200 relative grow rounded-full h-[4px]">
                                    <Slider.Range className="absolute h-full rounded-full bg-indigo-600" />
                                </Slider.Track>
                                <Slider.Thumb className="block w-4 h-4 bg-white shadow-md border border-gray-300 rounded-full hover:scale-110 focus:outline-none transition-transform" />
                                <Slider.Thumb className="block w-4 h-4 bg-white shadow-md border border-gray-300 rounded-full hover:scale-110 focus:outline-none transition-transform" />
                            </Slider.Root>
                        </Box>

                        {/* Remote Switch */}
                        <Flex direction="column" justify="end" height="100%" pb="1">
                            <Flex align="center" gap="3">
                                <Switch 
                                    checked={isRemote} 
                                    onCheckedChange={()=>{setIsRemote(!isRemote);setFilters({...filters,remote:!isRemote, page: 1})}} 
                                    size="2"
                                />
                                <Text size="2" weight="medium" className="text-gray-700">Remote Only</Text>
                            </Flex>
                        </Flex>
                    </Grid>
                    <Button size="2" onClick={submitFilters}>Search</Button>
                </Flex>
            </Card>

            {/* Job Results */}
            <div className="mt-8 space-y-4">
                {browseJobsLoading ? (
                    // Skeleton Loading
                    Array.from({ length: 5 }).map((_, i) => (
                        <Card key={i} size="2" className="animate-pulse">
                            <Flex gap="4" align="center">
                                <Box className="w-full space-y-2">
                                    <Skeleton width="60%" height="24px" />
                                    <Skeleton width="40%" height="16px" />
                                    <Skeleton width="30%" height="16px" />
                                </Box>
                                <Skeleton width="100px" height="32px" />
                            </Flex>
                        </Card>
                    ))
                ) : (
                    <>
                        <Grid columns="1" gap="4">
                            {jobs.map((job) => (
                                <Card key={job.id} size="3" className="hover:shadow-md transition-shadow duration-200 border-l-4 border-indigo-500">
                                    <Flex justify="between" align="center" wrap="wrap" gap="4">
                                        
                                        {/* Job Details */}
                                        <Box className="space-y-2 flex-grow">
                                            <Flex align="center" gap="3">
                                                <Heading size="4" weight="bold" className="text-gray-900">{job.title}</Heading>
                                                <Badge color="green" radius="full">{job.status}</Badge>
                                            </Flex>
                                            
                                            <Flex gap="4" align="center" className="text-gray-500 text-sm">
                                                <Flex align="center" gap="1">
                                                    <CalendarIcon />
                                                    <Text>{new Date(job.created_at || job.datePosted).toLocaleDateString()}</Text>
                                                </Flex>
                                                <Flex align="center" gap="1">
                                                    <MapPin size={14} />
                                                    <Text>{job.location}</Text>
                                                </Flex>
                                            </Flex>

                                            <Text size="5" weight="bold" className="text-indigo-600 block pt-1">
                                                ${job.price || job.budget}
                                            </Text>
                                        </Box>

                                        {/* Action */}
                                        <Button 
                                            size="3" 
                                            variant="solid" 
                                            onClick={() => setSelectedJob(job)}
                                            className="cursor-pointer bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm"
                                        >
                                            View Job    
                                        </Button>
                                    </Flex>
                                </Card>
                            ))}
                        </Grid>
                        
                         {/* Pagination */}
                        {lastPage > 1 && (
                            <Flex justify="center" align="center" gap="4" mt="6">
                                <IconButton 
                                    variant="soft" 
                                    disabled={currentPage === 1}
                                    onClick={() => handlePageChange(currentPage - 1)}
                                >
                                    <ArrowLeftIcon />
                                </IconButton>
                                <Text size="2" color="gray">
                                    Page {currentPage} of {lastPage}
                                </Text>
                                <IconButton 
                                    variant="soft" 
                                    disabled={currentPage === lastPage}
                                    onClick={() => handlePageChange(currentPage + 1)}
                                >
                                    <ArrowRightIcon />
                                </IconButton>
                            </Flex>
                        )}

                        {jobs.length === 0 && (
                            <Flex justify="center" p="8" className="text-gray-500">
                                <Text>No jobs found matching your criteria.</Text>
                            </Flex>
                        )}
                    </>
                )}
            </div>

            {/* Job Details Dialog */}
            <Dialog.Root open={!!selectedJob} onOpenChange={(open) => !open && setSelectedJob(null)}>
                <Dialog.Content style={{ maxWidth: 600 }}>
                    <Flex justify="between" align="center" mb="4">
                        <Dialog.Title size="6" weight="bold" mb="0">
                            {selectedJob?.title}
                        </Dialog.Title>
                        <Dialog.Close>
                            <IconButton variant="ghost" color="gray">
                                <Cross2Icon />
                            </IconButton>
                        </Dialog.Close>
                    </Flex>
                    
                    {selectedJob && (
                        <Flex direction="column" gap="4">
                            {/* Client Info */}
                            <Flex align="center" gap="3" className="p-3 bg-gray-50 rounded-lg">
                                <Avatar 
                                    src={selectedJob.client?.profile_picture} 
                                    fallback={selectedJob.client?.name?.[0] || 'C'}
                                    radius="full"
                                    size="3"
                                />
                                <Box>
                                    <Text size="2" weight="bold" className="block text-gray-900">
                                        {selectedJob.client?.name}
                                    </Text>
                                    <Text size="1" color="gray">
                                        Posted on {new Date(selectedJob.created_at).toLocaleDateString()}
                                    </Text>
                                </Box>
                            </Flex>

                            {/* Job Details Grid */}
                            <Grid columns="2" gap="3">
                                <Box>
                                    <Text size="1" weight="medium" color="gray" className="uppercase">Budget </Text>
                                    <Text size="3" weight="bold" className="text-indigo-600">${selectedJob.budget}</Text>
                                </Box>
                                <Box>
                                    <Text size="1" weight="medium" color="gray" className="uppercase">Location</Text>
                                    <Flex align="center" gap="1">
                                        <MapPin size={14} className="text-gray-500"/>
                                        <Text size="2">{selectedJob.location} {selectedJob.is_remote ? '(Remote)' : ''}</Text>
                                    </Flex>
                                </Box>
                            </Grid>
                            
                            <Separator size="4" />

                            {/* Description */}
                            <Box>
                                <Text size="3" weight="bold" className="block mb-2">Description</Text>
                                <ScrollArea type="auto" scrollbars="vertical" style={{ maxHeight: 200 }}>
                                    <Text as="p" size="3" className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                                        {selectedJob.description}
                                    </Text>
                                </ScrollArea>
                            </Box>

                            <Flex gap="3" mt="4" justify="end">
                                <Dialog.Close>
                                    <Button variant="soft" color="gray">Close</Button>
                                </Dialog.Close>
                                {/* Apply button*/}

                                <Popover.Root>
                                        <Popover.Trigger>
                                            <Button variant="soft" disabled={submittingProposal}>
                                                {submittingProposal 
                                                ? 
                                                    <span className="loading loading-infinity loading-xl text-blue-500 text-center"/>
                                                : 
                                                    <p className="flex items-center gap-2"><ChatBubbleIcon width="16" height="16" />Submit Proposal</p>
                                                }
                                            </Button>
                                        </Popover.Trigger>
                                    <Popover.Content width="360px">
                                        <Flex gap="3">
                                            <Avatar
                                                size="2"
                                                src={`http://localhost:8000/storage/${authUser?.profile_picture}`}
                                                fallback={authUser?.name?.[0] || 'A'}
                                                radius="full"
                                            />
                                            <Box flexGrow="1">
                                                <TextArea placeholder="Write a proposal…"
                                                        value={proposalDescription}
                                                        onChange={(e)=>setProposalDescription(e.target.value)}
                                                        style={{ height: 80 }} />
                                                <Flex gap="3" mt="3" justify="end">
                                                    <Popover.Close>
                                                        <Button size="1" disabled={proposalDescription.length<10 ||submittingProposal}
                                                            onClick={submitProposalClick}>
                                                            Submit
                                                        </Button>
                                                    </Popover.Close>
                                                </Flex>
                                            </Box>
                                        </Flex>
                                    </Popover.Content>
                                </Popover.Root>
                            </Flex>
                        </Flex>
                    )}
                </Dialog.Content>
            </Dialog.Root>

        </div>
    )
}