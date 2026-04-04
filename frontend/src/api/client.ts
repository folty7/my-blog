import axios from 'axios';
import { useAuthStore } from '../store/authStore';

// We create a base instance of Axios. 
// This way we only change the BASE_URL in ONE place if needed.
const apiClient = axios.create({
  baseURL: 'http://localhost:3000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// We use a separate "Interception" layer to automatically
// attach the JWT token from our Zustand store to EVERY request.
apiClient.interceptors.request.use(
  (config) => {
    // We access the token directly from the store state
    const token = useAuthStore.getState().token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// We can also intercept 401 (Unauthorized) errors globally 
// to automatically log out the user if the token expires.
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      // Optional: window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
