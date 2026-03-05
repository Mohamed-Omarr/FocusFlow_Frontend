import axios, { AxiosError, AxiosResponse } from "axios";

export const base_url = process.env.NEXT_PUBLIC_SITE_URL!;

const axiosClient = axios.create({
  baseURL: `${base_url}/api/v1`,
  withCredentials: true, // Important Sends cookies automatically
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
