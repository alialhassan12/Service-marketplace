import { create } from "zustand";
import axiosInstance from "../lib/axios";
import { toast } from "react-hot-toast";

const useClientDashboardStore = create((set) => ({
    page: "home",
    setPage: (page) => set({ page: page }),
    myJobs: [],
    gettingMyJobs: false,
    addedJob: null,
    addingJob: false,
    getMyJobs: async () => {
        set({ gettingMyJobs: true });
        try {
            const response = await axiosInstance.get('/jobs');
            set({ myJobs: response.data.jobs });
            return true;
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message);
            return false;
        } finally {
            set({ gettingMyJobs: false })
        }
    },
    addJob: async (formData) => {
        set({ addingJob: true });
        try {
            const response = await axiosInstance.post('/jobs', formData);
            set({ addedJob: response.data.job });
            toast.success(response.data.message);
            return true;
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message);
            return false;
        } finally {
            set({ addingJob: false })
        }
    },
    job: null,
    jobStatus: null,
    proposals: [],
    gettingJob: false,
    getJob: async (id) => {
        set({ gettingJob: true });
        try {
            const response = await axiosInstance.get(`/jobs/${id}`);
            set({ job: response.data.job });
            set({ proposals: response.data.job.proposals });
            set({ jobStatus: response.data.job.status });
            return true;
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message);
            return false;
        } finally {
            set({ gettingJob: false })
        }
    },
    updatingJob: false,
    updatedJob: null,
    updateJob: async (id, formData) => {
        set({ updatingJob: true });
        try {
            const response = await axiosInstance.put(`/jobs/${id}`, formData);
            set({ updatedJob: response.data.job });
            toast.success(response.data.message);
            return true;
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message);
            return false;
        } finally {
            set({ updatingJob: false });
        }
    },
    updatingJobStatus: false,
    updatedJobStatus: null,
    updateJobStatus: async (id, status) => {
        set({ updatingJobStatus: true });
        try {
            const response = await axiosInstance.put(`/jobs/status/${id}`, { job_id: id, status });
            set({ updatedJobStatus: response.data.job });
            set({ jobStatus: response.data.job.status });
            toast.success(response.data.message);
            return true;
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message);
            return false;
        } finally {
            set({ updatingJobStatus: false });
        }
    },
    updatingProposalStatusId: null,
    updateProposalState: async (jobId, proposal_id, state, provider_id, amount, description) => {
        set({ updatingProposalStatusId: proposal_id });
        try {
            const response = await axiosInstance.put(`/jobs/${jobId}/proposal/${proposal_id}`, {job_id: jobId, proposal_id, state, provider_id, amount, description });
            toast.success(response.data.message);
            return true;
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message);
            return false;
        } finally {
            set({ updatingProposalStatusId: null })
        }
    },
    suggestedProviders: [],
    gettingSuggestedProviders: false,
    getSuggestedProviders: async () => {
        set({ gettingSuggestedProviders: true });
        try {
            const response = await axiosInstance.get('/client/suggested-providers');
            set({ suggestedProviders: response.data.providers });
            return true;
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message);
            return false;
        } finally {
            set({ gettingSuggestedProviders: false })
        }
    },
    providerProfile: null,
    gettingProviderProfile: false,
    getProviderProfile: async (id) => {
        set({ gettingProviderProfile: true });
        try {
            const response = await axiosInstance.get(`/client/provider-profile/${id}`);
            set({ providerProfile: response.data.user });
            return true;
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message);
            return false;
        } finally {
            set({ gettingProviderProfile: false })
        }
    },
    updatingProfile: false,
    updateProfile: async (formData) => {
        set({ updatingProfile: true });
        try {
            const response = await axiosInstance.post(`/client/update-profile`, formData);
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
    acceptedProviders: [],
    gettingAcceptedProviders: false,
    getAcceptedProviders: async () => {
        set({ gettingAcceptedProviders: true });
        try {
            const response = await axiosInstance.get('/client/accepted-providers');
            set({ acceptedProviders: response.data.providers });
            console.log(response.data.providers);
            return true;
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message);
            return false;
        } finally {
            set({ gettingAcceptedProviders: false })
        }
    },
    searchProvidersResults: [],
    searchingProviders: false,
    searchProviders: async (query) => {
        if (!query.trim()) {
            set({ searchProvidersResults: [] });
            return;
        }
        set({ searchingProviders: true });
        try {
            const response = await axiosInstance.get(`/client/search-providers?query=${query}`);
            set({ searchProvidersResults: response.data.providers });
            return true;
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message);
            return false;
        } finally {
            set({ searchingProviders: false })
        }
    },
}));

export default useClientDashboardStore