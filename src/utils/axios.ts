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
    if (err.response?.status.toString().startsWith('4')) {
      localStorage.removeItem('access_token');
      location.reload();
    }
    return Promise.reject(err);
  }
);

export { axios };
export default axios;
