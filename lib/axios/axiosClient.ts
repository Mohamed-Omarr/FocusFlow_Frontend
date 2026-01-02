import axios, { AxiosError, AxiosResponse } from "axios";

const axiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  withCredentials: true, // Important! Sends cookies automatically
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

// Optional: global response handling
axiosClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // User is not authenticated
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
