import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import EmailIcon from '@mui/icons-material/Email';
import Avatar from "@mui/material/Avatar";
import { useAuthStore } from "../../store/authStore";
import { Badge, Button, Card, Flex, Text, Heading, Separator } from '@radix-ui/themes';
import { useNavigate } from "react-router-dom";

export default function ProviderProfile(){
    const {authUser}=useAuthStore();
    const navigate = useNavigate();
    
    // Safe skills parsing
    const skills = (() => {
        if (!authUser?.skills) return [];
        if (Array.isArray(authUser.skills)) return authUser.skills;
        try {
            return JSON.parse(authUser.skills);
        } catch (e) {
            return [];
        }
    })();

    return(
        <div className="flex flex-col w-full p-4 md:p-8 gap-6" data-aos="fade-up">
            <div className="flex justify-between items-center">
                <Heading size="8" className="text-gray-800">My Profile</Heading>
                <Button 
                    size="3" 
                    variant="solid" 
                    className="cursor-pointer shadow-md hover:bg-teal-600 transition-all font-medium"
                    onClick={()=>{navigate('/provider/update-profile')}}
                >
                    Edit Profile
                </Button>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
                {/* Left Column: Identity Card */}
                <div className="w-full lg:w-1/3 flex flex-col gap-6">
                    <div className="bg-white gap-2 rounded-3xl p-8 shadow-[0_2px_12px_rgba(0,0,0,0.08)] flex flex-col items-center text-center border border-gray-100">
                        <div className="relative group">
                            {authUser?.profile_picture ? (
                                <Avatar 
                                    sx={{ width: 140, height: 140 }} 
                                    className="rounded-full shadow-lg border-4 border-white ring-2 ring-gray-100 object-cover" 
                                    src={`http://localhost:8000/storage/${authUser?.profile_picture}`}
                                />
                            ) : (
                                <Avatar 
                                    sx={{ width: 140, height: 140 }} 
                                    className="rounded-full shadow-lg border-4 border-white ring-2 ring-gray-100 bg-linear-to-br from-teal-400 to-blue-500 text-5xl text-white font-bold"
                                >
                                    {authUser?.name?.charAt(0)}
                                </Avatar>
                            )}
                        </div>
                        
                        <Heading size="6" className="mt-4 text-gray-900">{authUser?.name}</Heading>
                        <Text size="2" color="gray" className="font-medium">Service Provider</Text>
                        
                        <Separator size="4" className="my-1 w-full" />
                        
                        <div className="flex flex-col gap-2 w-full">
                            <div className="flex items-center gap-3 text-gray-600 bg-gray-50 p-3 rounded-xl border border-gray-100">
                                <EmailIcon className="text-teal-600" fontSize="small" />
                                <Text size="2" className="break-all">{authUser?.email}</Text>
                            </div>
                            <div className="flex items-center gap-3 text-gray-600 bg-gray-50 p-3 rounded-xl border border-gray-100">
                                <PhoneIcon className="text-teal-600" fontSize="small" />
                                <Text size="2">{authUser?.phone_number || "No phone added"}</Text>
                            </div>
                            <div className="flex items-center gap-3 text-gray-600 bg-gray-50 p-3 rounded-xl border border-gray-100">
                                <LocationOnIcon className="text-teal-600" fontSize="small" />
                                <Text size="2">{authUser?.location || "No location added"}</Text>
                            </div>
                            <div className="flex items-center gap-3 text-gray-600 bg-gray-50 p-3 rounded-xl border border-gray-100">
                                <CalendarMonthIcon className="text-teal-600" fontSize="small" />
                                <Text size="2">Joined {new Date(authUser?.created_at).toLocaleDateString()}</Text>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Details */}
                <div className="w-full lg:w-2/3 flex flex-col gap-6">
                    {/* Bio Section */}
                    <div className="flex flex-col bg-white gap-2 rounded-3xl p-8 shadow-[0_2px_12px_rgba(0,0,0,0.08)] border border-gray-100 h-fit">
                        <Heading size="5" className="text-gray-800 flex items-center gap-2">
                            About Me
                        </Heading>
                        <Text as="p" size="3" className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                            {authUser?.bio || "No bio information provided yet."}
                        </Text>
                    </div>

                    {/* Skills Section */}
                    <div className="flex flex-col bg-white gap-2 rounded-3xl p-8 shadow-[0_2px_12px_rgba(0,0,0,0.08)] border border-gray-100 h-fit">
                        <Heading size="5" className="text-gray-800">Skills & Expertise</Heading>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {skills.length > 0 ? (
                                skills.map((skill, index) => (
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
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}