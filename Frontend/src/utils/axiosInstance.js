import axios from "axios";
import { BASE_URL } from "./apiPaths";

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    // baseURL: BASE_URL,
    timeout: 100000,
    headers:{
        "Content-Type":"application/json",
        Accept: "application/json",
    },
    withCredentials: true,
});

export default axiosInstance