import axios from 'axios';

<<<<<<< HEAD
// Configure base URL for API
const API_BASE_URL = 'http://localhost:5000/api';
=======
// Configure base URL for API from environment variables
// Falls back to localhost if not set
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
>>>>>>> ef4bf6774ac4b7ca23a59a08549d3557d5cbda3b

// Create axios instance with default config
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000, // 10 seconds
});

<<<<<<< HEAD
// API methods
export const api = {
=======
// Add request interceptor to include auth token
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// API methods
export const api = {
    // Authentication
    signup: async (name, email, password) => {
        const response = await apiClient.post('/auth/signup', {
            name,
            email,
            password,
        });
        return response.data;
    },

    login: async (email, password) => {
        const response = await apiClient.post('/auth/login', {
            email,
            password,
        });
        return response.data;
    },

    getCurrentUser: async () => {
        const response = await apiClient.get('/auth/me');
        return response.data;
    },
>>>>>>> ef4bf6774ac4b7ca23a59a08549d3557d5cbda3b
    // Health check
    healthCheck: async () => {
        const response = await apiClient.get('/health');
        return response.data;
    },

    // Schedule a meeting
    scheduleMeeting: async (query, emails) => {
        const response = await apiClient.post('/schedule', {
            query,
            emails,
        });
        return response.data;
    },

    // Get all meetings
    getMeetings: async () => {
        const response = await apiClient.get('/meetings');
        return response.data;
    },

    // Get email logs
    getEmailLogs: async () => {
        const response = await apiClient.get('/email-logs');
        return response.data;
    },

    // Get dashboard statistics
    getStats: async () => {
        const response = await apiClient.get('/stats');
        return response.data;
    },
};

// Error handler helper
export const handleApiError = (error) => {
    if (error.response) {
        // Server responded with error status
        return error.response.data.error || 'Server error occurred';
    } else if (error.request) {
        // Request made but no response
<<<<<<< HEAD
        return 'Cannot connect to server. Please ensure the backend is running on http://localhost:5000';
=======
        const backendUrl = API_BASE_URL.replace('/api', '');
        return `Cannot connect to server. Please ensure the backend is running on ${backendUrl}`;
>>>>>>> ef4bf6774ac4b7ca23a59a08549d3557d5cbda3b
    } else {
        // Something else happened
        return error.message || 'An unexpected error occurred';
    }
};

export default api;
