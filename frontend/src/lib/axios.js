import axios from "axios";

const axiosInstance = axios.create({
    baseURL:import.meta.env.MODE === "development"?"http://localhost:8000/api":"/api",
    withCredentials: true,
    headers:{
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

// Response interceptor to handle common auth errors
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            const status = error.response.status;
            if (status === 401) {
                // Unauthenticated - redirect to login
                localStorage.removeItem('token');
                window.location.href = '/login';
            }
            if (status === 403) {
                // Forbidden - show an alert for now; a toast system would be better
                alert('Access denied: you do not have permission to perform this action.');
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;