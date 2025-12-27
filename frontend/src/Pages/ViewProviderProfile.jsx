import { useParams } from "react-router-dom";
import useClientDashboardStore from "../store/clientDashboardStore";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import EmailIcon from '@mui/icons-material/Email';
import Avatar from "@mui/material/Avatar";
import { Button, Heading, Text, Skeleton, Separator, Badge } from "@radix-ui/themes";
import { ArrowLeftIcon, ChatBubbleIcon } from "@radix-ui/react-icons";

export default function ViewProviderProfile(){
    const {id} = useParams();
    const {getProviderProfile,providerProfile,gettingProviderProfile}=useClientDashboardStore();
    const navigate = useNavigate();

    useEffect(()=>{
        getProviderProfile(id);
    },[id]);
    
    return(
        <div className="flex flex-col w-full p-4 md:p-8 gap-6" data-aos="fade-up">
            <div className="flex justify-start">
                <Button onClick={()=>navigate(-1)} variant="soft" color="gray"><ArrowLeftIcon />Back</Button>
            </div>
            <div className="flex flex-col lg:flex-row gap-6">
                {/* Left Column: Identity Card */}
                <div className="w-full lg:w-1/3 flex flex-col gap-6">
                    <div className="bg-white gap-2 rounded-3xl p-8 shadow-[0_2px_12px_rgba(0,0,0,0.08)] flex flex-col items-center text-center border border-gray-100">
                        <Skeleton loading={gettingProviderProfile} width={140} height={140} style={{borderRadius:"50%"}}>
                            <div className="relative group">
                                {providerProfile?.profile_picture ? (
                                    <Avatar 
                                        sx={{ width: 140, height: 140 }} 
                                        className="rounded-full shadow-lg border-4 border-white ring-2 ring-gray-100 object-cover" 
                                        src={`http://localhost:8000/storage/${providerProfile?.profile_picture}`}
                                        fallback={providerProfile?.name?.charAt(0)}
                                    />
                                ) : (
                                    <Avatar 
                                        sx={{ width: 140, height: 140 }} 
                                        className="rounded-full shadow-lg border-4 border-white ring-2 ring-gray-100 bg-linear-to-br from-teal-400 to-blue-500 text-5xl text-white font-bold"
                                        fallback={providerProfile?.name?.charAt(0)}
                                    >
                                        {providerProfile?.name?.charAt(0)}
                                    </Avatar>
                                )}
                            </div>
                        </Skeleton>
                        
                        <Skeleton loading={gettingProviderProfile}>
                            <Heading size="6" className="mt-4 text-gray-900">{providerProfile?.name || "Provider Name"}</Heading>
                        </Skeleton>
                        <Skeleton loading={gettingProviderProfile}>
                            <Text size="2" color="gray" className="font-medium">Service Provider</Text>
                        </Skeleton>
                        
                        <Separator size="4" className="my-1 w-full" />
                        
                        <div className="flex flex-col gap-2 w-full">
                            <Skeleton loading={gettingProviderProfile}>
                                <div className="flex items-center gap-3 text-gray-600 bg-gray-50 p-3 rounded-xl border border-gray-100">
                                    <EmailIcon className="text-teal-600" fontSize="small" />
                                    <Text size="2" className="break-all">{providerProfile?.email || "email@example.com"}</Text>
                                </div>
                            </Skeleton>
                            <Skeleton loading={gettingProviderProfile}>
                                <div className="flex items-center gap-3 text-gray-600 bg-gray-50 p-3 rounded-xl border border-gray-100">
                                    <PhoneIcon className="text-teal-600" fontSize="small" />
                                    <Text size="2">{providerProfile?.phone_number || "No phone added"}</Text>
                                </div>
                            </Skeleton>
                            <Skeleton loading={gettingProviderProfile}>
                                <div className="flex items-center gap-3 text-gray-600 bg-gray-50 p-3 rounded-xl border border-gray-100">
                                    <LocationOnIcon className="text-teal-600" fontSize="small" />
                                    <Text size="2">{providerProfile?.location || "No location added"}</Text>
                                </div>
                            </Skeleton>
                            <Skeleton loading={gettingProviderProfile}>
                                <div className="flex items-center gap-3 text-gray-600 bg-gray-50 p-3 rounded-xl border border-gray-100">
                                    <CalendarMonthIcon className="text-teal-600" fontSize="small" />
                                    <Text size="2">Joined {providerProfile?.created_at ? new Date(providerProfile?.created_at).toLocaleDateString() : "Date"}</Text>
                                </div>
                            </Skeleton>
                        </div>

                        <Skeleton loading={gettingProviderProfile} className="w-full mt-2">
                            <Button size="3" variant="solid" className="w-full cursor-pointer bg-teal-600 hover:bg-teal-700 transition mt-2">
                                <ChatBubbleIcon />
                                Contact Provider
                            </Button>
                        </Skeleton>
                    </div>
                </div>

                {/* Right Column: Details */}
                <div className="w-full lg:w-2/3 flex flex-col gap-6">
                    {/* Bio Section */}
                    <div className="flex flex-col bg-white gap-3 rounded-3xl p-8 shadow-[0_2px_12px_rgba(0,0,0,0.08)] border border-gray-100 h-fit">
                        <Heading size="5" className="text-gray-800 flex items-center gap-2">
                            About Me
                        </Heading>
                        <Skeleton loading={gettingProviderProfile}>
                            <Text as="p" size="3" className="text-gray-600 leading-relaxed whitespace-pre-wrap min-h-[100px]">
                                {providerProfile?.bio || "No bio information provided yet."}
                            </Text>
                        </Skeleton>
                    </div>

                    {/* Skills Section */}
                    <div className="flex flex-col bg-white gap-3 rounded-3xl p-8 shadow-[0_2px_12px_rgba(0,0,0,0.08)] border border-gray-100 h-fit">
                        <Heading size="5" className="text-gray-800">Skills & Expertise</Heading>
                        <div className="flex flex-wrap gap-2 mt-2">
                            <Skeleton loading={gettingProviderProfile}>
                                {providerProfile?.skills?.length > 0 ? (
                                    providerProfile?.skills?.map((skill, index) => (
                                        <Badge
                                            key={index} 
                                            color="teal" 
                                            variant="soft" 
                                            className="px-4 py-1.5 text-sm font-medium rounded-full border border-teal-100"
                                        >
                                            {skill}
                                        </Badge>
                                    ))
                                ) : (
                                    <Text size="3" color="gray" className="italic">No skills listed yet.</Text>
                                )}
                            </Skeleton>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}