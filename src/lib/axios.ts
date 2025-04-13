import axios, { InternalAxiosRequestConfig } from 'axios';
import { auth } from './firebase';
import { getIdToken } from 'firebase/auth';

const instance = axios.create({
  baseURL: 'https://plivoback.onrender.com/api',
});

// Using the correct typing for Axios v1.x
instance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const user = auth.currentUser;
    if (user) {
      const token = await getIdToken(user);
      config.headers.set('Authorization', `Bearer ${token}`);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default instance;