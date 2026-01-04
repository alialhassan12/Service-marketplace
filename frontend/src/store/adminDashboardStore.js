import { create } from "zustand";
import axiosInstance from "../lib/axios";
import { toast } from "react-hot-toast";

const useAdminDashboardStore = create((set) => ({
    updatingProfile: false,
    updateProfile: async (formData) => {
        set({ updatingProfile: true });
        try {
            const response = await axiosInstance.post(`/admin/update-profile`, formData);
            toast.success(response.data.message);
            return response.data.user;
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message);
            return null;
        } finally {
            set({ updatingProfile: false })
        }
    },
}));

export default useAdminDashboardStore;
