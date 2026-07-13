import axios from "axios";

let getToken: (() => Promise<string | null>) | null = null;

export const setTokenGetter = (fn: () => Promise<string | null>) => {
  getToken = fn;
};

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_NODE_ENV === "development" ? "http://localhost:5000/api" : "/api",
});

axiosInstance.interceptors.request.use(async (config) => {
  if (getToken) {
    const token = await getToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});
