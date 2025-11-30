import { create } from "zustand";
import axiosInstance from "../lib/axios";
import {toast} from "react-hot-toast";

export const useAuthStore=create((set)=>({
    authUser:null,
    isLogging:false,
    
    login:async(formData)=>{
        set({isLogging:true});
        try {
            const response=await axiosInstance.post("/login",formData);
            set({authUser:response.data.user});
            toast.success("Login successful");
        } catch (error) {
            console.log(error);
            toast.error("Login failed");
        } finally {
            set({isLogging:false});
        }
    }
}));