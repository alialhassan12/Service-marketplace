import { create } from "zustand";
import axiosInstance from "../lib/axios";
import { toast } from "react-hot-toast";

export const useAuthStore = create((set) => ({
    authUser: null,
    isLogging: false,
    isLoggingOut: false,
    isChecking: false,
    isUpdatingProfile: false,

    check: async () => {
        set({ isChecking: true });
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                set({ authUser: null });
                return;
            }
            const response = await axiosInstance.get("/check");
            set({ authUser: response.data });
        } catch (error) {
            set({ authUser: null });
            localStorage.removeItem("token");
        } finally {
            set({ isChecking: false });
        }
    },

    login: async (formData) => {
        set({ isLogging: true });
        try {
            const response=await axiosInstance.post("/login", formData);
            set({authUser:response.data.user});
            localStorage.setItem("token",response.data.token);
            toast.success(response.data.message);
            return { success: true, user: response.data.user };
        } catch (error) {
            toast.error(error.response?.data?.message || "Login failed");
            return { success: false, error: error.response?.data?.message };
        } finally {
            set({ isLogging: false });
        }
    },
    logout: async () => {
        set({ isLoggingOut: true });
        try {
            await axiosInstance.post("/logout");
            set({ authUser: null });
            localStorage.removeItem("token");
            toast.success("Logout successful");
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isLoggingOut: false });
        }
    },
    updateProfile: async (data) => {
        set({ isUpdatingProfile: true });
        try {
            const response = await axiosInstance.put("/update-profile", data);
            set({ authUser: response.data.user });
            toast.success("Profile updated successfully");
            return { success: true, user: response.data.user };
        } catch (error) {
            toast.error(error.response?.data?.message || "Profile update failed");
            return { success: false, error: error.response?.data?.message };
        } finally {
            set({ isUpdatingProfile: false });
        }
    },
    register: async (formData) => {
        set({ isLogging: true });
        try {
            const response=await axiosInstance.post("/register", formData);
            set({authUser:response.data.user});
            localStorage.setItem("token",response.data.token);
            toast.success(response.data.message);
            return { success: true, user: response.data.user };
        } catch (error) {
            toast.error(error.response?.data?.message || "Registration failed");
            return { success: false, error: error.response?.data?.message };
        } finally {
            set({ isLogging: false });
        }
    },
    setUser: (user) => set({ authUser: user }),

    isResettingPassword:false,
    resetPassword:async(password,password_confirmation)=>{
        set({isResettingPassword:true});
        try {
            const response=await axiosInstance.put("/reset-password",{password,password_confirmation});
            toast.success(response.data.message);
            return {success:true}
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong. Please try again.");
            return {success:false}
        } finally {
            set({isResettingPassword:false})
        }
    },

    isDeletingAccount:false,
    deleteAccount:async()=>{
        set({isDeletingAccount:true});
        try{
            const response=await axiosInstance.delete("/delete-account");
            toast.success(response.data.message);
            set({authUser:null});
            localStorage.removeItem("token");
            return {success:true}
        }catch(error){
            toast.error(error.response?.data?.message || "Something went wrong. Please try again.");
            return {success:false};
        }finally{
            set({isDeletingAccount:false})
        }
    }
}));