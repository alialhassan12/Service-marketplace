import { create } from "zustand";
import axiosInstance from "../lib/axios";
import {toast} from "react-hot-toast";

const useProviderDashboardStore=create((set)=>({
    page:"home",
    setPage:(page)=>set({page}),
    browseJobsData:[],
    browseJobsLoading:false,
    providerProfile:{},
    providerProfileLoading:false,
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
    },
    browseJobs:async(filters)=>{
        set({browseJobsLoading:true});
        try {
            const response=await axiosInstance.get("/provider/browseJobs", { params: filters });
            set({browseJobsData:response.data.jobs});
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }finally{
            set({browseJobsLoading:false})
        }
    },
    submittingProposal:false,
    submitProposal:async(proposal)=>{
        set({submittingProposal:true});
        try {
            const response=await axiosInstance.post("/provider/submitProposal",proposal);
            toast.success(response.data.message);
            return response.data;
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message);
            return false;
        }finally{
            set({submittingProposal:false})
        }
    },
    recommendedJobsData:[],
    recommendedJobsLoading:false,
    getRecommendedJobs:async()=>{
        set({recommendedJobsLoading:true});
        try {
            const response=await axiosInstance.get("/provider/recommended-jobs");
            set({recommendedJobsData:response.data.jobs});
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }finally{
            set({recommendedJobsLoading:false})
        }
    },
    myProposalsData:[],
    myProposalsLoading:false,
    getMyProposals:async()=>{
        set({myProposalsLoading:true});
        try {
            const response=await axiosInstance.get("/provider/my-proposals");
            set({myProposalsData:response.data.proposals});
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }finally{
            set({myProposalsLoading:false})
        }
    },
    searchClientsResult:[],
    searchClientsLoading:false,
    searchClients:async(query)=>{
        set({searchClientsLoading:true});
        try {
            const response=await axiosInstance.get("/provider/search-clients", { params: { query } });
            set({searchClientsResult:response.data.clients});
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }finally{
            set({searchClientsLoading:false})
        }
    }
}));

export default useProviderDashboardStore;
