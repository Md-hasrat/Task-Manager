import axios from 'axios';
import { BASE_URL } from './apiPaths';

// Create a custom Axios instance
const axiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
});

// Request interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.authorization = `${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            if (error.response.status === 401) {
                window.location.href = '/login'; // 
            } else if (error.response.status === 500) {
                console.error("Server error, please try again later");
            }
        } else if (error.code === 'ECONNABORTED') {
            console.error("Request timed out, please try again later");
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;

