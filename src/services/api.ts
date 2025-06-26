import axios from "axios";
import type { AxiosInstance } from "axios";

    const API_URL_LOCAL: string = 'http://localhost:3000/api';
    //const API_URL_PRODUCTION: string = '';
    // >>>desde un env leer el url, mas dinamico

    const api: AxiosInstance = axios.create({
        baseURL: API_URL_LOCAL,
        headers: {
        "Content-Type": "application/json",
        },
    });
    api.interceptors.request.use(config => {
    const token = localStorage.getItem('accessToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
    });
export default api;
