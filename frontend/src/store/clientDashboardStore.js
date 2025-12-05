import { create } from "zustand";
import axiosInstance from "../lib/axios";
import {toast} from "react-hot-toast";

const useClientDashboardStore=create((set)=>({
    page:"home",
    setPage:(page)=>set({page:page}),
    myJobs:[],
    gettingMyJobs:false,
    addedJob:null,
    addingJob:false,
    getMyJobs:async ()=>{
        set({gettingMyJobs:true});
        try {
            const response=await axiosInstance.get('/jobs');
            set({myJobs:response.data.jobs});
            return true;
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message);
            return false;
        }finally{
            set({gettingMyJobs:false})
        }
    },
    addJob:async (formData)=>{
        set({addingJob:true});
        try {
            const response=await axiosInstance.post('/jobs',formData);
            set({addedJob:response.data.job});
            toast.success(response.data.message);
            return true;
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message);
            return false;
        }finally{
            set({addingJob:false})
        }
    },
    job:null,
    proposals:[],
    gettingJob:false,
    getJob:async (id)=>{
        set({gettingJob:true});
        try {
            const response=await axiosInstance.get(`/jobs/${id}`);
            set({job:response.data.job});
            set({proposals:response.data.proposals});
            return true;
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message);
            return false;
        }finally{
            set({gettingJob:false})
        }
    },
    updatingJob:false,
    updatedJob:null,
    updateJob:async(id,formData)=>{
        set({updatingJob:true});
        try {
            const response=await axiosInstance.put(`/jobs/${id}`,formData);
            set({updatedJob:response.data.job});
            toast.success(response.data.message);
            return true;
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message);
            return false;
        }finally{
            set({updatingJob:false})
        }
    }

}));

export default useClientDashboardStore