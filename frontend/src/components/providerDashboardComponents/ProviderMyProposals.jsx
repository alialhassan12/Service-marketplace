import { useEffect, useState } from "react";
import useProviderDashboardStore from "../../store/providerDashboardStore";
import { Badge, Button, Card, Dialog, Flex, Grid, Heading, IconButton, ScrollArea, Separator, Skeleton, Text, Avatar, Box } from "@radix-ui/themes";
import { MapPin } from "lucide-react";
import { Cross2Icon } from "@radix-ui/react-icons";

export default function ProviderMyProposals(){
    const {myProposalsData, myProposalsLoading, getMyProposals} = useProviderDashboardStore();
    const [selectedJob, setSelectedJob] = useState(null);

    useEffect(()=>{
        getMyProposals();
    },[]);
    
    const getStatusColor = (status) => {
        switch(status) {
            case 'accepted': return 'green';
            case 'rejected': return 'red';
            case 'pending': return 'orange';
            default: return 'gray';
        }
    };

    return(
        <div className="w-full p-6 md:p-10" data-aos="fade-up">
            <Heading size="6" weight="bold" className="text-primary">My Proposals</Heading>

            {myProposalsLoading ? (
                <Grid columns={{ initial: '1', md: '2', lg: '3' }} gap="4" className="mt-6">
                    {[1,2,3,4,5,6,7,8,9].map((i) => (
                        <Card key={i} className="animate-pulse">
                            <Flex direction="column" gap="3">
                                <Skeleton width="70%" height="24px" />
                                <Skeleton width="40%" height="20px" />
                                <Skeleton width="100%" height="32px" className="mt-2" />
                            </Flex>
                        </Card>
                    ))}
                </Grid>
            ) : myProposalsData.length > 0 ? (
                <Grid columns={{ initial: '1', md: '2', lg: '3' }} gap="4" className="mt-6">
                    {myProposalsData.map((proposal) => (
                        <Card key={proposal.id} className="hover:shadow-soft transition-all duration-200 border-t-4 bg-card" style={{ borderColor: proposal.status === 'accepted' ? 'var(--green-9)' : proposal.status === 'rejected' ? 'var(--red-9)' : 'var(--orange-9)' }}>
                            <Flex direction="column" height="100%" justify="between" gap="4">
                                <Box>
                                    <Flex justify="between" align="start" gap="2" mb="2">
                                        <Heading size="4" weight="bold" className="text-primary line-clamp-1">
                                            {proposal.job?.title}
                                        </Heading>
                                        <Badge color={getStatusColor(proposal.status)} variant="soft" radius="full">
                                            {proposal.status}
                                        </Badge>
                                    </Flex>
                                    <Text size="2" className="line-clamp-2 text-secondary">
                                        {proposal.description}
                                    </Text>
                                    <Text size="2" weight="bold" className="text-primary mt-2 block">
                                        Proposed: ${proposal.price}
                                    </Text>
                                </Box>
                                
                                <Button 
                                    variant="solid" 
                                    className="w-full cursor-pointer"
                                    onClick={() => setSelectedJob(proposal.job)}
                                >
                                    View Job Details
                                </Button>
                            </Flex>
                        </Card>
                    ))}
                </Grid>
            ) : (
                <div className="mt-6 text-center text-secondary">You haven't submitted any proposals yet.</div>
            )}

            {/* Job Details Dialog */}
            <Dialog.Root open={!!selectedJob} onOpenChange={(open) => !open && setSelectedJob(null)}>
                <Dialog.Content style={{ maxWidth: 600 }}>
                    <Flex justify="between" align="center" mb="4">
                        <Dialog.Title size="6" weight="bold" className="text-primary" mb="0">
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
                            <Flex align="center" gap="3" className="p-3 bg-hover-bg rounded-xl border border-border-subtle">
                                <Avatar 
                                    src={selectedJob.client?.profile_picture ? `http://localhost:8000/storage/${selectedJob.client.profile_picture}` : undefined} 
                                    fallback={selectedJob.client?.name?.[0] || 'C'}
                                    radius="full"
                                    size="3"
                                />
                                <Box>
                                    <Text size="2" weight="bold" className="block text-primary">
                                        {selectedJob.client?.name}
                                    </Text>
                                    <Text size="1" className="text-secondary">
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
                                <Text size="3" weight="bold" className="block mb-2 text-primary">Description</Text>
                                <ScrollArea type="auto" scrollbars="vertical" style={{ maxHeight: 200 }}>
                                    <Text as="p" size="3" className="text-secondary leading-relaxed whitespace-pre-wrap">
                                        {selectedJob.description}
                                    </Text>
                                </ScrollArea>
                            </Box>

                            <Flex gap="3" mt="4" justify="end">
                                <Dialog.Close>
                                    <Button variant="soft" color="gray" className="cursor-pointer">Close</Button>
                                </Dialog.Close>
                            </Flex>
                        </Flex>
                    )}
                </Dialog.Content>
            </Dialog.Root>
        </div>
    )
}