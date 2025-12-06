import {create} from "zustand";

const useProviderDashboardStore=create((set)=>({
    page:"home",
    setPage:(page)=>set({page}),
}));

export default useProviderDashboardStore;
