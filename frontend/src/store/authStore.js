import { create } from "zustand";
import axiosInstance from "../lib/axios";
import {toast} from "react-hot-toast";

export const useAuthStore=create((set)=>({
    authUser:null,
    isLogging:false,

    check:async()=>{
        try {
            const response=await axiosInstance.get("/check");
            set({authUser:response.data});
            console.log(response.data);
        } catch (error) {
            console.log(error);
        }
    },

    login:async(formData)=>{
        set({isLogging:true});
        try {
            const response=await axiosInstance.post("/login",formData);
            set({authUser:response.data.user});
            localStorage.setItem("token",response.data.token);
            toast.success(response.data.message);
        } catch (error) {
            // console.log(error);
            toast.error(error.response.data.message);
        } finally {
            set({isLogging:false});
        }
    },
    logout:async()=>{
        try {
            await axiosInstance.post("/logout");
            set({authUser:null});
            localStorage.removeItem("token");
            toast.success("Logout successful");
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        }
    }
}));