import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import EmailIcon from '@mui/icons-material/Email';
import Avatar from "@mui/material/Avatar";
import { useAuthStore } from "../../store/authStore";
import { Button, Heading, Separator, Text } from '@radix-ui/themes';
import { useNavigate } from "react-router-dom";

export default function AdminProfile() {
    const { authUser } = useAuthStore();
    const navigate = useNavigate();

    return (
        <div className="flex flex-col w-full p-4 md:p-8 gap-6" data-aos="fade-up">
            <div className="flex justify-between items-center">
                <Heading size="8" className="text-primary">My Profile</Heading>
                <Button
                    size="3"
                    variant="solid"
                    className="cursor-pointer shadow-md hover:bg-teal-600 transition-all font-medium"
                    onClick={() => { navigate('/admin/update-profile') }}
                >
                    Edit Profile
                </Button>
            </div>

            <div className="flex flex-col items-center justify-center w-full">
                {/* Identity Card */}
                <div className="w-full max-w-2xl flex flex-col gap-6">
                    <div className="bg-card gap-2 rounded-3xl p-8 shadow-soft flex flex-col items-center text-center border border-border-subtle">
                        <div className="relative group">
                            {authUser?.profile_picture ? (
                                <Avatar
                                    sx={{ width: 140, height: 140 }}
                                    className="rounded-full shadow-lg border-4 border-card ring-2 ring-border-subtle object-cover"
                                    src={`http://localhost:8000/storage/${authUser?.profile_picture}`}
                                />
                            ) : (
                                <Avatar
                                    sx={{ width: 140, height: 140 }}
                                    className="rounded-full shadow-lg border-4 border-card ring-2 ring-border-subtle bg-linear-to-br from-teal-400 to-blue-500 text-5xl text-white font-bold"
                                >
                                    {authUser?.name?.charAt(0)}
                                </Avatar>
                            )}
                        </div>

                        <Heading size="6" className="mt-4 text-primary">{authUser?.name}</Heading>
                        <Text size="2" className="font-medium text-secondary">Administrator</Text>

                        <Separator size="4" className="my-1 w-full" />

                        <div className="flex flex-col gap-2 w-full">
                            <div className="flex items-center gap-3 text-secondary bg-hover-bg p-3 rounded-xl border border-border-subtle">
                                <EmailIcon className="text-teal-600" fontSize="small" />
                                <Text size="2" className="break-all">{authUser?.email}</Text>
                            </div>
                            <div className="flex items-center gap-3 text-secondary bg-hover-bg p-3 rounded-xl border border-border-subtle">
                                <PhoneIcon className="text-teal-600" fontSize="small" />
                                <Text size="2">{authUser?.phone_number || "No phone added"}</Text>
                            </div>
                            <div className="flex items-center gap-3 text-secondary bg-hover-bg p-3 rounded-xl border border-border-subtle">
                                <LocationOnIcon className="text-teal-600" fontSize="small" />
                                <Text size="2">{authUser?.location || "No location added"}</Text>
                            </div>
                            <div className="flex items-center gap-3 text-secondary bg-hover-bg p-3 rounded-xl border border-border-subtle">
                                <CalendarMonthIcon className="text-teal-600" fontSize="small" />
                                <Text size="2">Joined {new Date(authUser?.created_at).toLocaleDateString()}</Text>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}