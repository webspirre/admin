import axios, { AxiosInstance } from 'axios';

const axiosInstance: AxiosInstance = axios.create({
  baseURL: 'https://nawqzhetlcutvfqhyjsv.supabase.co/auth/v1', // Your API base URL
  timeout: 5000, // Request timeout
  headers: {
    'Content-Type': 'application/json',
    // Add any other headers here
  },
});

// Add a request interceptor to include the JWT token in the headers
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken'); // Assuming you store the token in localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // Handle request errors
    return Promise.reject(error);
  }
);

// Add any response interceptors or other configurations here

export default axiosInstance;
