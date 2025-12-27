import { create } from "zustand";
import axiosInstance from "../lib/axios";
import {toast} from "react-hot-toast";

export const useAuthStore=create((set)=>({
    authUser:null,
    isLogging:false,
    isLoggingOut:false,
    isChecking:false,

    check:async()=>{
        set({isChecking:true});
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                set({authUser:null});
                return;
            }
            const response=await axiosInstance.get("/check");
            set({authUser:response.data});
        } catch (error) {
            set({authUser:null});
            localStorage.removeItem("token");
        } finally {
            set({isChecking:false});
        }
    },

    login:async(formData)=>{
        set({isLogging:true});
        try {
            console.log("Attempting login with:", formData);
            console.log("Sending JSON to /login");
            const response=await axiosInstance.post("/login", formData);
            console.log("Login response:", response.data);
            set({authUser:response.data.user});
            localStorage.setItem("token",response.data.token);
            toast.success(response.data.message);
            return {success:true, user:response.data.user};
        } catch (error) {
            toast.error(error.response?.data?.message || "Login failed");
            return {success:false, error:error.response?.data?.message};
        } finally {
            set({isLogging:false});
        }
    },
    logout:async()=>{
        set({isLoggingOut:true});
        try {
            await axiosInstance.post("/logout");
            set({authUser:null});
            localStorage.removeItem("token");
            toast.success("Logout successful");
        } catch (error) {
            toast.error(error.response.data.message);
        }finally{
            set({isLoggingOut:false});
        }
    },
    register:async(formData)=>{
        set({isLogging:true});
        try {
            console.log("Attempting registration with:", formData);
            const response=await axiosInstance.post("/register", formData);
            console.log("Registration response:", response.data);
            set({authUser:response.data.user});
            localStorage.setItem("token",response.data.token);
            toast.success(response.data.message);
            return {success:true, user:response.data.user};
        } catch (error) {
            toast.error(error.response?.data?.message || "Registration failed");
            return {success:false, error:error.response?.data?.message};
        } finally {
            set({isLogging:false});
        }
    },
    setUser: (user) => set({ authUser: user }),
}));