import axios from "axios";
import type { AxiosInstance } from "axios";
import { AuthService } from "./auth.service"; 

const API_URL_LOCAL: string = 'http://localhost:3000/api';
const API_URL_PRODUCTION: string = 'https://yachaywasiback.shop/api';

const api: AxiosInstance = axios.create({
  baseURL: API_URL_PRODUCTION, 
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(config => {
  const accessToken = localStorage.getItem('accessToken');
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        console.log('Refreshing token...');
        const newAccessToken = await AuthService.refreshToken();
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        return api(originalRequest); 
      } catch (refreshError) {
        AuthService.logout();
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
