import { create } from "zustand";
import axiosInstance from "../lib/axios";
import {toast} from "react-hot-toast";

const useProviderDashboardStore=create((set)=>({
    page:"home",
    providerProfile:{},
    providerProfileLoading:false,
    setPage:(page)=>set({page}),
    updatedProfile:{},
    updatingProfile:false,
    updateProfile:async(formData)=>{
        set({updatingProfile:true});
        try {
            const response=await axiosInstance.post("/provider/profile",formData);
            toast.success(response.data.message);
            set({updatedProfile:response.data.user});
            return response.data.user;
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message);
            return false;
        }finally{
            set({updatingProfile:false})
        }
    },
    getProviderProfile:async()=>{
        set({providerProfileLoading:true});
        try {
            const response=await axiosInstance.get("/provider/profile");
            set({providerProfile:response.data.user});
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }finally{
            set({providerProfileLoading:false})
        }
    }
}));

export default useProviderDashboardStore;
