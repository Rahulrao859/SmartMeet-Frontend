import axios from 'axios';

// Configure base URL for API from environment variables
// Falls back to localhost if not set
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000, // 10 seconds
});

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

// Add response interceptor to handle 401 globally
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Clear auth data and redirect to login
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            // Only redirect if not already on an auth page
            const currentPath = window.location.pathname;
            if (!['/', '/login', '/signup'].includes(currentPath)) {
                window.location.href = '/login';
            }
        }
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
    // Health check — uses root /health (not /api/health)
    healthCheck: async () => {
        const rootUrl = API_BASE_URL.replace('/api', '');
        const response = await axios.get(`${rootUrl}/health`, { timeout: 8000 });
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

    // Get recent activity feed
    getRecentActivity: async () => {
        const response = await apiClient.get('/v1/activity');
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
        const backendUrl = API_BASE_URL.replace('/api', '');
        return `Cannot connect to server. Please ensure the backend is running on ${backendUrl}`;
    } else {
        // Something else happened
        return error.message || 'An unexpected error occurred';
    }
};

export default api;
