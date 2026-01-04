import { Cross2Icon } from "@radix-ui/react-icons";
import { Dialog, Button, TextField, TextArea, Flex, Box, Text, Switch } from '@radix-ui/themes';
import { useState } from "react";
import useClientDashboardStore from "../../store/clientDashboardStore";
import { DollarSign, Plus } from "lucide-react";

export default function PostJobButton(){
    const {addJob,addingJob}=useClientDashboardStore();
    const [open, setOpen] = useState(false);
    
    const [formData,setFormData]=useState({
        title:"",
        description:"",
        location:"",
        is_remote:false,
        budget:0
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const dataToSubmit = { ...formData };
        if(dataToSubmit.is_remote){
            dataToSubmit.location="Remote";
        }
        const success = await addJob(dataToSubmit);
        if(success){
            setOpen(false);
            setFormData({
                title:"",
                description:"",
                location:"",
                is_remote:false,
                budget:0
            });
        }
    }

    return(
        <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Trigger>
                <Button variant="solid" size="3" className="cursor-pointer shadow-md hover:shadow-lg transition-all">
                    <Plus size={18} />
                    Post new job
                </Button>
            </Dialog.Trigger>

            <Dialog.Content style={{ maxWidth: 500 }} className="bg-card p-6 rounded-2xl">
                <Dialog.Title className="text-2xl font-bold text-primary mb-2">Post new job</Dialog.Title>
                <Dialog.Description size="2" className="text-secondary mb-6 block">
                    Create a new job posting to find the perfect provider.
                </Dialog.Description>

                <Flex direction="column" gap="5">
                    <Box>
                        <Text as="label" size="2" weight="bold" mb="2" className="text-secondary block">
                            Job Title
                        </Text>
                        <TextField.Root
                            variant="soft"
                            size="3"
                            required
                            value={formData.title}
                            onChange={(e)=>setFormData({...formData,title:e.target.value})}
                            placeholder="e.g. Broken Pipe Repair"
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
                            placeholder="Describe the job requirements details..."
                        />
                    </Box>

                    <Flex gap="4" align="start" direction={{ initial: 'column', sm: 'row' }}>
                        <Box className="flex-1 w-full">
                            <Text as="label" size="2" weight="bold" mb="2" className="text-secondary block">
                                Location
                            </Text>
                            <TextField.Root
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
                                <Switch
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
                        <TextField.Root
                            variant="soft"
                            size="3"
                            type="number"
                            value={formData.budget}
                            onChange={(e)=>setFormData({...formData,budget:Number(e.target.value)})}
                            placeholder="0.00"
                        >
                            <TextField.Slot>
                                <DollarSign size={16} className="text-gray-500" />
                            </TextField.Slot>
                        </TextField.Root>
                    </Box>
                </Flex>

                <Flex gap="3" mt="6" justify="end">
                    <Dialog.Close>
                        <Button variant="soft" color="gray" size="3" className="cursor-pointer">Cancel</Button>
                    </Dialog.Close>
                    <Button variant="solid" color="blue" size="3" loading={addingJob} onClick={handleSubmit} className="cursor-pointer shadow-md">
                        Post Job
                    </Button>
                </Flex>
            </Dialog.Content>
        </Dialog.Root>
    )
}