import { useRef, useState } from "react";
import { useAuthStore } from "../../store/authStore";
import { Theme, Button, TextField } from "@radix-ui/themes";
import { useNavigate } from "react-router-dom";
import useAdminDashboardStore from "../../store/adminDashboardStore";
import { useTheme } from "../../contexts/useTheme";
import toast from "react-hot-toast";
import { ArrowLeft, Save, Upload } from "lucide-react";

export default function AdminUpdateProfile() {
    const navigate = useNavigate();
    const { authUser, setUser } = useAuthStore();
    const { updateProfile, updatingProfile } = useAdminDashboardStore();
    const { theme } = useTheme();
    const [formData, setFormData] = useState({
        name: authUser?.name || "",
        email: authUser?.email || "",
        phone_number: authUser?.phone_number || "",
        location: authUser?.location || "",
        profile_picture: authUser?.profile_picture || "",
    });

    const profileImageRef = useRef();
    const [profileImage, setProfileImage] = useState(authUser?.profile_picture);

    const handleProfileImageChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            setFormData({ ...formData, profile_picture: file });
            reader.onloadend = () => {
                setProfileImage(reader.result);
            }
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isNaN(formData.phone_number)) {
            toast.error("Phone number must be a number");
            return;
        }
        if (formData.phone_number && formData.phone_number.length < 8) {
            toast.error("Phone number must be at least 8 digits");
            return;
        }
        if (!validateEmail(formData.email)) {
            toast.error("Invalid email");
            return;
        }

        const data = new FormData();
        data.append("name", formData.name);
        data.append("email", formData.email);
        data.append("phone_number", formData.phone_number);
        data.append("location", formData.location);

        // Append profile picture if it's a file (object)
        if (formData.profile_picture instanceof File) {
            data.append("profile_picture", formData.profile_picture);
        }

        // Method spoofing for Laravel
        data.append("_method", "PUT");

        const response = await updateProfile(data);
        if (response) {
            // The store returns the updated user object directly on success in my previous edit
            // But let's verify what updateProfile returns. 
            // In adminDashboardStore: return response.data.user;
            setUser(response);
            navigate(-1); // navigate to previous page
        }
    }
    function validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    return (
        <Theme appearance={theme}>
            <div className="flex flex-col w-full min-h-screen bg-bg-1 p-6 md:p-10">
                <div className="max-w-3xl mx-auto w-full flex flex-col gap-6" data-aos="fade-up">
                    <Button variant="soft" color="gray" size="2" className="w-fit cursor-pointer transition-colors" onClick={() => { navigate(-1) }}>
                        <ArrowLeft width="16" height="16" />
                        Back
                    </Button>
                    <h1 className="text-3xl font-bold text-primary">Admin Profile Setup</h1>
                    <div className="flex flex-col w-full gap-6 mt-4">
                        {/* profile image */}
                        <div className="flex flex-col gap-3">
                            <p className="font-semibold text-secondary">Profile Picture</p>
                            <div className="flex items-center gap-6">
                                {profileImage != undefined ?
                                    (<img src={profileImage.includes("http") || profileImage.includes("data:") ? profileImage : `http://localhost:8000/storage/${profileImage}`} className="w-24 h-24 rounded-full object-cover shadow-soft border-2 border-border-subtle" />) :
                                    <div className="flex items-center justify-center text-3xl w-24 h-24 rounded-full bg-hover-bg text-secondary border-2 border-border-subtle">{authUser?.name?.charAt(0)}</div>}
                                <Button variant="soft" size="2" className="cursor-pointer transition-colors" onClick={() => profileImageRef.current.click()}>
                                    <Upload width="16" height="16" />
                                    Upload Photo
                                </Button>
                                <input type="file" ref={profileImageRef} onChange={handleProfileImageChange} hidden />
                            </div>
                        </div>
                        {/* name */}
                        <div className="flex flex-col gap-2">
                            <p className="font-semibold text-secondary">Name</p>
                            <TextField.Root variant="soft" size="3" placeholder="e.g. John Doe"
                                value={formData.name}
                                onChange={(e) => { setFormData({ ...formData, name: e.target.value }) }}
                            />
                        </div>
                        
                        {/* phone number */}
                        <div className="flex flex-col gap-2">
                            <p className="font-semibold text-secondary">Phone Number</p>
                            <TextField.Root variant="soft" size="3" placeholder="e.g. +1234567890"
                                value={formData.phone_number}
                                onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                            />
                        </div>
                        {/* email */}
                        <div className="flex flex-col gap-2">
                            <p className="font-semibold text-secondary">Email</p>
                            <TextField.Root variant="soft" size="3" placeholder="e.g. example@gmail.com"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>

                        {/* location */}
                        <div className="flex flex-col gap-2">
                            <p className="font-semibold text-secondary">Location</p>
                            <TextField.Root variant="soft" size="3" placeholder="e.g. New York, USA"
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            />
                        </div>
                        {/* save button */}
                        <Button disabled={updatingProfile} variant="solid" size="3" className="mt-8 w-full md:w-32 cursor-pointer transition-all shadow-md active:scale-95"
                            onClick={handleSubmit}>
                            {updatingProfile ?
                                <span className="loading loading-infinity loading-xl text-white" />
                                :
                                <p className="flex items-center justify-center gap-2">
                                    <Save width="16" height="16" /> Save Changes
                                </p>
                            }
                        </Button>
                    </div>
                </div>
            </div>
        </Theme>
    )
}