import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000',
  timeout: 120000, // 2 minutes to accommodate LLM retries
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`📡 API Request: ${config.method.toUpperCase()} ${config.url}`, config.data || '');
    return config;
  },
  (error) => {
    console.error('❌ API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for logging
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status}`, response.data);
    return response;
  },
  (error) => {
    console.error('❌ API Response Error:', error.response?.status, error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Main API endpoints
export const analyzeScan = (text, sourceUrl, userId) =>
  api.post('/analyze', {
    text,
    source_url: sourceUrl,
    user_id: userId,
  });

export const getScan = (scanId) => api.get(`/scan/${scanId}`);

export const getHistory = (userId) => api.get(`/history/${userId}`);

export const getStats = (userId) => api.get(`/stats/${userId}`);

export const postFeedback = (scanId, userId, feedback) =>
  api.post('/feedback', { scan_id: scanId, user_id: userId, feedback });

export default api;

// Check backend health
export const checkHealth = async () => {
  try {
    const response = await api.get('/health');
    return response.data;
  } catch (error) {
    return { status: 'error', backend: 'unhealthy' };
  }
};


