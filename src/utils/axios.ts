import type { AxiosError } from 'axios';
import axiosRoot from 'axios';

const axios = axiosRoot.create({
  baseURL: import.meta.env.VITE_API_ADDRESS ?? '/api'
});

axios.interceptors.request.use(config => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.set('Authorization', `Bearer ${token}`);
  }
  return config;
});

axios.interceptors.response.use(
  res => res,
  (err: AxiosError) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('access_token');
      if (!location.hash.startsWith('#/login')) {
        location.reload();
      }
    }
    if (err.response?.status === 404) {
      if ((err.response.data as any)?.detail === 'User not found') {
        localStorage.removeItem('access_token');
        if (!location.hash.startsWith('#/login')) {
          location.reload();
        }
      }
    }
    return Promise.reject(err);
  }
);

export { axios };
export default axios;
