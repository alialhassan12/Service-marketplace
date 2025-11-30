import axios from "axios";

const axiosInstance = axios.create({
    baseURL:import.meta.env.MODE === "development"?"http://localhost:8000/api":"/api",
    withCredentials:true,
    headers:{
        "Content-Type":"application/json",
        "Accept":"application/json"
    }
});

// Add interceptor to attach token
axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default axiosInstance;