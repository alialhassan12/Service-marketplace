import { create } from "zustand";
import axiosInstance from "../lib/axios.js";
import { toast } from "react-hot-toast";

export const usePaymentStore=create((set)=>({
    clientSecret:null,
    payment_id:null,
    isCreating:false,
    isConfirming:false,
    payments: [],
    pagination: {},
    totalSpent:0,
    pendingAmount:0,
    isLoadingHistory: false,
    
    payProvider:async(job_id,provider_id,amount,description)=>{
        set({ isCreating: true });
        try {
            const response=await axiosInstance.post("/payments/create-intent",{
                job_id,
                provider_id,
                amount,
                description
            });
            set({
                clientSecret:response.data.data.client_secret,
                payment_id:response.data.data.payment_id
            });

            return true;
        } catch (error) {
            toast.error(error.response?.data?.message || "Payment failed");
            return false;
        } finally {
            set({ isCreating: false });
        }
    },
    confirmPayment:async(payment_id, stripe_charge_id)=>{
        set({ isConfirming: true });
        try {
            const response = await axiosInstance.post("/payments/confirm", {
                payment_id,
                stripe_charge_id
            });
            toast.success("Payment confirmed successfully");
            return response.data;
        } catch (error) {
            toast.error(error.response?.data?.message || "Payment confirmation failed");
            return false;
        }finally{
            set({ isConfirming: false });
        }
    },
    getPaymentHistory: async (page = 1) => {
        set({ isLoadingHistory: true });
        try {
            const response = await axiosInstance.get(`/payments/history?page=${page}`);
            
            // Calculate totals for the current page
            let newTotalSpent = 0;
            let newPendingAmount = 0;

            response.data.data.forEach((payment) => {
                // Remove '$' and ',' from the string before parsing
                const numericAmount = parseFloat(payment.amount.replace(/[^0-9.-]+/g, ""));
                const amount = Number(numericAmount) || 0;
                
                if (payment.status.toLowerCase() === 'paid') {
                    newTotalSpent += amount;
                } else if (payment.status.toLowerCase() === 'pending') {
                    newPendingAmount += amount;
                }
            });

            set({
                payments: response.data.data,
                pagination: response.data.meta,
                totalSpent: newTotalSpent,
                pendingAmount: newPendingAmount
            });
        } catch (error) {
            toast.error("Failed to fetch payment history");
        } finally {
            set({ isLoadingHistory: false });
        }
    },
    isLoadingProviderHistory:false,
    providerPayments:[],
    providerPagination:{},
    getProviderPaymentHistory:async (page=1)=>{
        set({ isLoadingProviderHistory: true });
        try {
            const response =await axiosInstance.get(`/payments/provider-history?page=${page}`);
            set({
                providerPayments:response.data.data,
                providerPagination:response.data.meta
            });
        } catch (error) {
            toast.error("Failed to fetch provider payment history");
        } finally {
            set({ isLoadingProviderHistory: false });
        }
    },
    isDownloadingInvoice:false,
    downloadingInvoiceId:null,
    downloadInvoice:async(payment_id)=>{
        set({ isDownloadingInvoice: true, downloadingInvoiceId: payment_id });
        try {
            const response =await axiosInstance.get("/payments/download-invoice/"+payment_id,{
                responseType:"blob"
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'invoice.pdf');
            document.body.appendChild(link);
            link.click();
        } catch (error) {
            toast.error("Failed to download invoice");
        }finally{
            set({ isDownloadingInvoice: false, downloadingInvoiceId: null });
        }
    },
    isLoadingBalance:false,
    providerTotalEarned:0,
    providerPendingAmount:0,
    getProviderBalance:async()=>{
        set({ isLoadingBalance: true });
        try {
            const response = await axiosInstance.get("/payments/provider-balance");
            set({
                providerTotalEarned: response.data.data.total_earned,
                providerPendingAmount: response.data.data.pending_amount
            });
        } catch (error) {
            toast.error("Failed to fetch provider balance");
            return null;
        }finally{
            set({ isLoadingBalance: false });
        }
    },

}))
