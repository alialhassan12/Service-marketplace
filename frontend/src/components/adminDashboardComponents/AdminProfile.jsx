import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import EmailIcon from '@mui/icons-material/Email';
import Avatar from "@mui/material/Avatar";
import { useAuthStore } from "../../store/authStore";
import { Button, Heading, Separator, Text } from '@radix-ui/themes';
import * as Dialog from "@radix-ui/react-dialog";
import { useNavigate } from "react-router-dom";
import { useState } from 'react';
import toast from 'react-hot-toast';

function InfoRow({ icon, value }) {
    return (
        <div className="flex items-center gap-3 text-muted bg-white/5 p-3 rounded-xl border border-white/5">
            <span className="text-teal-400">{icon}</span>
            <Text size="2">{value}</Text>
        </div>
    );
}

export default function AdminProfile() {
    const { authUser, updateProfile } = useAuthStore(); // Assuming updateProfile exists in store
    const navigate = useNavigate();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: authUser?.name || '',
        email: authUser?.email || '',
        phone_number: authUser?.phone_number || '',
        location: authUser?.location || '',
        profile_picture: null,
        imagePreview: null
    });

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const data = new FormData();
            data.append('name', formData.name);
            data.append('email', formData.email);
            data.append('phone_number', formData.phone_number);
            data.append('location', formData.location);
            if (formData.profile_picture) {
                data.append('profile_picture', formData.profile_picture);
            }

            await updateProfile(data);
            toast.success("Profile updated successfully");
            setIsDialogOpen(false);
        } catch (error) {
            toast.error("Failed to update profile");
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col w-full p-4 md:p-8 gap-8" data-aos="fade-up">

            {/* Header */}
            <div className="flex justify-between items-center">
                <Heading size="8" className="text-primary">
                    My Profile
                </Heading>

                <Dialog.Root open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <Dialog.Trigger asChild>
                        <Button
                            size="3"
                            variant="soft"
                            className="bg-white/10 text-white hover:bg-white/20 cursor-pointer"
                        >
                            Edit Profile
                        </Button>
                    </Dialog.Trigger>

                    {/* MODAL (UNCHANGED – ALREADY PERFECT) */}
                    <Dialog.Portal>
                        <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" />

                        <Dialog.Content
                            className="fixed left-1/2 top-1/2 z-50 max-h-[85vh] w-[90vw] max-w-[500px]
                       -translate-x-1/2 -translate-y-1/2 rounded-[24px]
                       bg-[#0f172a] p-6 border border-white/10
                       shadow-[0_10px_40px_-10px_rgba(0,0,0,0.6)]
                       overflow-y-auto focus:outline-none"
                        >
                            <form onSubmit={handleUpdateProfile} className="flex flex-col gap-5">
                                {/* Profile Picture Upload */}
                                <div className="flex flex-col items-center gap-4">
                                    <div className="relative group cursor-pointer">
                                        <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white/10 group-hover:border-indigo-500 transition-colors">
                                            {formData.imagePreview ? (
                                                <img
                                                    src={formData.imagePreview}
                                                    alt="Preview"
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : authUser?.profile_picture ? (
                                                <img
                                                    src={`http://localhost:8000/storage/${authUser.profile_picture}`}
                                                    alt="Profile"
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-slate-700 flex items-center justify-center text-2xl text-white font-bold">
                                                    {authUser?.name?.charAt(0)}
                                                </div>
                                            )}
                                        </div>
                                        <div
                                            className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                            onClick={() => document.getElementById('fileInput').click()}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" /><circle cx="12" cy="13" r="4" /></svg>
                                        </div>
                                        <input
                                            id="fileInput"
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(e) => {
                                                const file = e.target.files[0];
                                                if (file) {
                                                    setFormData({
                                                        ...formData,
                                                        profile_picture: file,
                                                        imagePreview: URL.createObjectURL(file)
                                                    });
                                                }
                                            }}
                                        />
                                    </div>
                                    <Text size="1" className="text-gray-400">Click to change photo</Text>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label className="text-sm text-gray-300">Full Name</label>
                                    <input
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="bg-[#1e293b] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-indigo-500 transition"
                                        placeholder="Enter your name"
                                    />
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label className="text-sm text-gray-300">Email Address</label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="bg-[#1e293b] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-indigo-500 transition"
                                        placeholder="Enter your email"
                                    />
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label className="text-sm text-gray-300">Phone Number</label>
                                    <input
                                        type="tel"
                                        value={formData.phone_number}
                                        onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                                        className="bg-[#1e293b] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-indigo-500 transition"
                                        placeholder="Enter phone number"
                                    />
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label className="text-sm text-gray-300">Location</label>
                                    <input
                                        value={formData.location}
                                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                        className="bg-[#1e293b] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-indigo-500 transition"
                                        placeholder="Enter location"
                                    />
                                </div>

                                <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                                    <Dialog.Close asChild>
                                        <button className="text-gray-400 hover:text-white px-4 py-2 transition-colors">Cancel</button>
                                    </Dialog.Close>
                                    <Button disabled={isLoading} className="cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white">
                                        {isLoading ? "Saving..." : "Save Changes"}
                                    </Button>
                                </div>
                            </form>

                        </Dialog.Content>
                    </Dialog.Portal>
                </Dialog.Root>
            </div>

            {/* Profile Card – CENTERED */}
            <div className="w-full flex justify-center">
                <div className="w-full max-w-2xl">
                    <div className="bg-bg-2/50 backdrop-blur rounded-3xl p-8
                        shadow-[0_2px_12px_rgba(0,0,0,0.08)]
                        flex flex-col items-center text-center
                        border border-white/5">

                        {/* Avatar */}
                        <Avatar
                            sx={{ width: 140, height: 140 }}
                            className="rounded-full shadow-lg border-4 border-bg-1
                       ring-2 ring-white/10 bg-linear-to-br
                       from-teal-400 to-blue-500 text-5xl
                       text-white font-bold"
                        >
                            {authUser?.name?.charAt(0)}
                        </Avatar>

                        <Heading size="6" className="mt-4 text-primary">
                            {authUser?.name}
                        </Heading>

                        <Text size="2" className="text-muted font-medium">
                            Administrator
                        </Text>

                        <Separator size="4" className="my-4 w-full opacity-20" />

                        <div className="flex flex-col gap-2 w-full">
                            <InfoRow icon={<EmailIcon />} value={authUser?.email} />
                            <InfoRow icon={<PhoneIcon />} value={authUser?.phone_number || "No phone added"} />
                            <InfoRow icon={<LocationOnIcon />} value={authUser?.location || "No location added"} />
                            <InfoRow
                                icon={<CalendarMonthIcon />}
                                value={authUser?.created_at ? `Joined ${new Date(authUser.created_at).toLocaleDateString()}` : "Joined"}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

}
