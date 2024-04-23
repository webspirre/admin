import axios, { AxiosInstance } from 'axios';

const BASE_URL = 'https://nawqzhetlcutvfqhyjsv.supabase.co/auth/v1';

const axiosInstance: AxiosInstance = axios.create({
    baseURL: BASE_URL
});

export default axiosInstance;

export const axiosPrivate: AxiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true
});
