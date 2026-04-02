import axios from 'axios';

// Create an Axios instance
const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    // We can also use import.meta.env.VITE_API_URL if it exists in a real app
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to include the token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('hd_auth_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor to handle token expiry or global errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Unauthorized, possibly clear token and redirect to login
            console.error('Unauthorized! Token may have expired.');
            // Only clear if it's an invalid token, not if it's a failed login attempt
            if (error.config.url !== '/auth/login') {
                localStorage.removeItem('hd_auth_token');
                localStorage.removeItem('hd_current_user');
                // Could dispatch an event or use a global navigation if needed
            }
        }
        return Promise.reject(error);
    }
);

export default api;
