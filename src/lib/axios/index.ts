import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';

const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    return config;
  },
  (error) => Promise.reject(new Error(error)),
);

api.interceptors.response.use(
  async (response) => {
    // handle logic ...

    return response;
  },
  async (error) => {
    // handle logic ...

    return Promise.reject(new Error(error));
  },
);

export default api;
