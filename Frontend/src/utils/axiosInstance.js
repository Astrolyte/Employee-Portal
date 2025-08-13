// import axios from "axios";
// import { BASE_URL } from "./apiPaths";

// const axiosInstance = axios.create({
//     baseURL: import.meta.env.VITE_API_BASE_URL,
//     // baseURL: BASE_URL,
//     timeout: 100000,
//     headers:{
//         "Content-Type":"application/json",
//         Accept: "application/json",
//     },
//     withCredentials: true,
// });

// export default axiosInstance
import axios from "axios";
import { BASE_URL } from "./apiPaths";

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    timeout: 100000,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
    withCredentials: true, // Important for cookies
});

// Store token in memory as backup
let accessToken = null;

// Request interceptor to add token to headers as backup
axiosInstance.interceptors.request.use(
    (config) => {
        // Add token to header if available and not already present
        if (accessToken && !config.headers.Authorization) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        
        // Debug logging
        console.log(`Making ${config.method?.toUpperCase()} request to:`, config.url);
        
        return config;
    },
    (error) => {
        console.error("Request interceptor error:", error);
        return Promise.reject(error);
    }
);

// Response interceptor for token refresh and error handling
axiosInstance.interceptors.response.use(
    (response) => {
        // Store token from successful login
        if (response.config.url?.includes('/login') && response.data?.data?.accessToken) {
            accessToken = response.data.data.accessToken;
            console.log('Token stored from login response');
        }
        return response;
    },
    async (error) => {
        const original = error.config;
        
        console.log('Request failed:', {
            status: error.response?.status,
            url: error.config?.url,
            message: error.response?.data?.message
        });
        
        // Handle 401 errors (unauthorized)
        if (error.response?.status === 401 && !original._retry) {
            original._retry = true;
            
            try {
                console.log('Attempting token refresh...');
                const refreshResponse = await axiosInstance.post('/api/v1/users/refresh-token');
                
                if (refreshResponse.data?.data?.accessToken) {
                    accessToken = refreshResponse.data.data.accessToken;
                    console.log('Token refreshed successfully');
                    
                    // Retry the original request with new token
                    if (accessToken) {
                        original.headers.Authorization = `Bearer ${accessToken}`;
                    }
                    return axiosInstance(original);
                }
            } catch (refreshError) {
                console.log('Token refresh failed:', refreshError.response?.data || refreshError.message);
                
                // Clear token and redirect to login
                accessToken = null;
                localStorage.removeItem('user');
                
                // Redirect to login page
                if (typeof window !== 'undefined') {
                    window.location.href = '/login';
                }
                
                return Promise.reject(refreshError);
            }
        }
        
        return Promise.reject(error);
    }
);

// Helper functions to manage token
export const setAuthToken = (token) => {
    accessToken = token;
    console.log('Auth token set manually');
};

export const clearAuthToken = () => {
    accessToken = null;
    console.log('Auth token cleared');
};

export const getAuthToken = () => {
    return accessToken;
};

export default axiosInstance;