import { useParams } from "react-router-dom";
import useClientDashboardStore from "../store/clientDashboardStore";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import EmailIcon from '@mui/icons-material/Email';
import Avatar from "@mui/material/Avatar";
import { Theme, Button, Heading, Text, Skeleton, Separator, Badge } from "@radix-ui/themes";
import { useTheme } from "../contexts/useTheme";
import { ArrowLeftIcon, ChatBubbleIcon } from "@radix-ui/react-icons";

export default function ViewProviderProfile(){
    const {id} = useParams();
    const {getProviderProfile,providerProfile,gettingProviderProfile}=useClientDashboardStore();
    const navigate = useNavigate();
    const { theme } = useTheme();

    useEffect(()=>{
        getProviderProfile(id);
    },[id]);
    
    return(
        <Theme appearance={theme}>
            <div className="w-full min-h-screen bg-bg-1 p-6 md:p-10">
                <div className="max-w-6xl mx-auto flex flex-col gap-8" data-aos="fade-up">
                    <div className="flex justify-start">
                        <Button onClick={()=>navigate(-1)} variant="soft" color="gray" size="2">
                            <ArrowLeftIcon />
                            Back
                        </Button>
                    </div>
                    <div className="flex flex-col lg:flex-row gap-6">
                        {/* Left Column: Identity Card */}
                        <div className="w-full lg:w-1/3 flex flex-col gap-6">
                            <div className="bg-card gap-2 rounded-3xl p-8 shadow-soft flex flex-col items-center text-center border border-border-subtle">
                                <Skeleton loading={gettingProviderProfile} width={140} height={140} style={{borderRadius:"50%"}}>
                                    <div className="relative group">
                                        {providerProfile?.profile_picture ? (
                                            <Avatar 
                                                sx={{ width: 140, height: 140 }} 
                                                className="rounded-full shadow-lg border-4 border-card ring-2 ring-blue-500/10 object-cover" 
                                                src={`http://localhost:8000/storage/${providerProfile?.profile_picture}`}
                                            />
                                        ) : (
                                            <Avatar 
                                                sx={{ width: 140, height: 140 }} 
                                                className="rounded-full shadow-lg border-4 border-card ring-2 ring-blue-500/10 bg-linear-to-br from-blue-400 to-blue-600 text-5xl text-white font-bold"
                                            >
                                                {providerProfile?.name?.charAt(0)}
                                            </Avatar>
                                        )}
                                    </div>
                                </Skeleton>
                                
                                <Skeleton loading={gettingProviderProfile}>
                                    <Heading size="6" className="mt-4 text-primary">{providerProfile?.name || "Provider Name"}</Heading>
                                </Skeleton>
                                <Skeleton loading={gettingProviderProfile}>
                                    <Text size="2" color="gray" className="font-medium text-secondary">Service Provider</Text>
                                </Skeleton>
                                
                                <Separator size="4" className="my-1 w-full" />
                                
                                <div className="flex flex-col gap-3 w-full">
                                    <Skeleton loading={gettingProviderProfile}>
                                        <div className="flex items-center gap-3 text-secondary bg-hover-bg p-3 rounded-xl border border-border-subtle">
                                            <EmailIcon className="text-blue-500" fontSize="small" />
                                            <Text size="2" className="break-all">{providerProfile?.email || "email@example.com"}</Text>
                                        </div>
                                    </Skeleton>
                                    <Skeleton loading={gettingProviderProfile}>
                                        <div className="flex items-center gap-3 text-secondary bg-hover-bg p-3 rounded-xl border border-border-subtle">
                                            <PhoneIcon className="text-blue-500" fontSize="small" />
                                            <Text size="2">{providerProfile?.phone_number || "No phone added"}</Text>
                                        </div>
                                    </Skeleton>
                                    <Skeleton loading={gettingProviderProfile}>
                                        <div className="flex items-center gap-3 text-secondary bg-hover-bg p-3 rounded-xl border border-border-subtle">
                                            <LocationOnIcon className="text-blue-500" fontSize="small" />
                                            <Text size="2">{providerProfile?.location || "No location added"}</Text>
                                        </div>
                                    </Skeleton>
                                    <Skeleton loading={gettingProviderProfile}>
                                        <div className="flex items-center gap-3 text-secondary bg-hover-bg p-3 rounded-xl border border-border-subtle">
                                            <CalendarMonthIcon className="text-blue-500" fontSize="small" />
                                            <Text size="2">Joined {providerProfile?.created_at ? new Date(providerProfile?.created_at).toLocaleDateString() : "Date"}</Text>
                                        </div>
                                    </Skeleton>
                                </div>

                                <Skeleton loading={gettingProviderProfile} className="w-full mt-2">
                                    <Button size="3" variant="solid" color="blue" className="w-full cursor-pointer transition mt-2">
                                        <ChatBubbleIcon />
                                        Contact Provider
                                    </Button>
                                </Skeleton>
                            </div>
                        </div>

                        {/* Right Column: Details */}
                        <div className="w-full lg:w-2/3 flex flex-col gap-6">
                            {/* Bio Section */}
                            <div className="flex flex-col bg-card gap-5 rounded-3xl p-8 shadow-soft border border-border-subtle h-fit">
                                <Heading size="5" className="text-primary flex items-center gap-2">
                                    About Me
                                </Heading>
                                <Skeleton loading={gettingProviderProfile}>
                                    <Text as="p" size="3" className="text-secondary leading-relaxed whitespace-pre-wrap min-h-[100px]">
                                        {providerProfile?.bio || "No bio information provided yet."}
                                    </Text>
                                </Skeleton>
                            </div>

                            {/* Skills Section */}
                            <div className="flex flex-col bg-card gap-5 rounded-3xl p-8 shadow-soft border border-border-subtle h-fit">
                                <Heading size="5" className="text-primary">Skills & Expertise</Heading>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    <Skeleton loading={gettingProviderProfile}>
                                        {providerProfile?.skills?.length > 0 ? (
                                            providerProfile?.skills?.map((skill, index) => (
                                                <Badge
                                                    key={index} 
                                                    color="blue" 
                                                    variant="soft" 
                                                    className="px-4 py-1.5 text-sm font-medium rounded-full border border-blue-100/10"
                                                >
                                                    {skill}
                                                </Badge>
                                            ))
                                        ) : (
                                            <Text size="3" color="gray" className="italic text-secondary">No skills listed yet.</Text>
                                        )}
                                    </Skeleton>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Theme>
    )
}