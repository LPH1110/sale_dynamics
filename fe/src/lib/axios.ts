/// <reference types="vite/client" />
import axios from 'axios';
import { getCookie } from '@/utils/cookies';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/';

const request = axios.create({
  baseURL: API_BASE,
});

request.interceptors.request.use(
  (config) => {
    const token = getCookie('jwt');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    config.headers.Accept = 'application/json';
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercept responses to handle 401 (Session expired) in-place
request.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Trigger a custom event for in-place re-authentication modal
      window.dispatchEvent(new CustomEvent('session-expired'));
    }
    return Promise.reject(error);
  }
);

export const get = async <T>(path: string, options = {}): Promise<T> => {
  const res = await request.get<T>(path, options);
  return res.data;
};

export const post = async <T>(path: string, params = {}, options = {}): Promise<T> => {
  const res = await request.post<T>(path, params, options);
  return res.data;
};

export const remove = async <T>(path: string, options = {}): Promise<T> => {
  const res = await request.delete<T>(path, options);
  return res.data;
};

export const update = async <T>(path: string, params = {}, options = {}): Promise<T> => {
  const res = await request.put<T>(path, params, options);
  return res.data;
};

export default request;
