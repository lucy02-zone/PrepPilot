// src/api/axios.js
import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000/api/',  // Backend API URL
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000, // 10 second timeout
});

// Request interceptor
api.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

// Response interceptor
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

api.interceptors.response.use(
    response => response,
    error => {
        const originalRequest = error.config;
        
        // If error is due to an expired token
        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                .then(token => {
                    originalRequest.headers['Authorization'] = 'Bearer ' + token;
                    return api(originalRequest);
                })
                .catch(err => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            const storedUser = JSON.parse(localStorage.getItem('user'));
            if (!storedUser?.refresh) {
                return Promise.reject(error);
            }

            return api.post('/auth/token/refresh/', {
                refresh: storedUser.refresh
            })
            .then(response => {
                const { access } = response.data;
                localStorage.setItem('token', access);
                
                api.defaults.headers.common['Authorization'] = 'Bearer ' + access;
                originalRequest.headers['Authorization'] = 'Bearer ' + access;
                
                processQueue(null, access);
                return api(originalRequest);
            })
            .catch(err => {
                processQueue(err, null);
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                return Promise.reject(err);
            })
            .finally(() => {
                isRefreshing = false;
            });
        }

        // Network or server error
        if (!error.response) {
            return Promise.reject({
                ...error,
                isConnectionError: true,
                message: 'Unable to connect to the server. Please check your internet connection and try again.'
            });
        }

        return Promise.reject(error);
    }
);

export default api;
