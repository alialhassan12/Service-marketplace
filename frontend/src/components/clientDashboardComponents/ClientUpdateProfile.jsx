import { useRef, useState } from "react";
import { useAuthStore } from "../../store/authStore";
import { Button, TextArea, TextField } from "@radix-ui/themes";
import { useNavigate } from "react-router-dom";
import useClientDashboardStore from "../../store/clientDashboardStore";
import toast from "react-hot-toast";

export default function  ClientUpdateProfile() {
    const navigate = useNavigate();
    const { authUser, setUser } = useAuthStore();
    const { updateProfile, updatingProfile } = useClientDashboardStore();
    const [formData, setFormData] = useState({
        name: authUser?.name || "",
        email: authUser?.email || "",
        phone_number: authUser?.phone_number || "",
        location: authUser?.location || "",
        bio: authUser?.bio || "",
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
            toast.error("Phone number must be 8 digits");
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
        data.append("bio", formData.bio);

        // Append profile picture if it's a file (object)
        if (formData.profile_picture instanceof File) {
            data.append("profile_picture", formData.profile_picture);
        }

        // Method spoofing for Laravel if needed, assuming yes based on provider
        data.append("_method", "PUT");

        const updatedUser = await updateProfile(data);
        if (updatedUser) {
            setUser(updatedUser);
            navigate('/dashboard');
        }
    }
    function validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    return (
        <div className="flex flex-col w-full p-4 md:p-10" data-aos="fade-up">
            <Button variant="outline" size="2" className="mt-5 w-fit cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => { navigate('/dashboard') }}>Back</Button>
            <h1 className="text-2xl font-bold mt-5">Client Profile Setup</h1>
            <div className="flex flex-col w-full mt-5 gap-4">
                {/* profile image */}
                <div className="flex flex-col gap-2">
                    <p className="font-semibold text-gray-700">Profile Picture</p>
                    <div className="flex items-center gap-4">
                        {profileImage != undefined ?
                            (<img src={profileImage.includes("http") || profileImage.includes("data:") ? profileImage : `http://localhost:8000/storage/${profileImage}`} className="w-24 h-24 rounded-full object-cover shadow-sm" />) :
                            <div className="flex items-center justify-center text-2xl w-24 h-24 rounded-full bg-gray-200 text-gray-600">{authUser?.name?.charAt(0)}</div>}
                        <Button variant="soft" className="cursor-pointer hover:bg-gray-200 transition-colors" onClick={() => profileImageRef.current.click()}>Upload Photo</Button>
                        <input type="file" ref={profileImageRef} onChange={handleProfileImageChange} hidden />
                    </div>
                </div>
                {/* name */}
                <div className="flex flex-col gap-2">
                    <p className="font-semibold text-gray-700">Name</p>
                    <TextField.Root variant="soft" size="3" placeholder="e.g. John Doe"
                        value={formData.name}
                        onChange={(e) => { setFormData({ ...formData, name: e.target.value }) }}
                    />
                </div>
                {/* bio */}
                <div className="flex flex-col gap-2">
                    <p className="font-semibold text-gray-700">Bio</p>
                    <TextArea variant="soft" size="3" placeholder="Tell us about yourself" className="min-h-[100px]"
                        value={formData.bio}
                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    />
                </div>
                {/* phone number */}
                <div className="flex flex-col gap-2">
                    <p className="font-semibold text-gray-700">Phone Number</p>
                    <TextField.Root variant="soft" size="3" placeholder="e.g. +1234567890"
                        value={formData.phone_number}
                        onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                    />
                </div>
                {/* email */}
                <div className="flex flex-col gap-2">
                    <p className="font-semibold text-gray-700">Email</p>
                    <TextField.Root variant="soft" size="3" placeholder="e.g. example@gmail.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                </div>

                {/* location */}
                <div className="flex flex-col gap-2">
                    <p className="font-semibold text-gray-700">Location</p>
                    <TextField.Root variant="soft" size="3" placeholder="e.g. New York, USA"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    />
                </div>
                {/* save button */}
                <Button disabled={updatingProfile} variant="solid" size="3" className="mt-5 w-full md:w-fit cursor-pointer hover:bg-teal-600 transition-colors shadow-md"
                    onClick={handleSubmit}>{updatingProfile ? <span className="loading loading-infinity loading-xl text-blue-500" /> : 'Save Changes'}</Button>
            </div>
        </div>
    )
}
