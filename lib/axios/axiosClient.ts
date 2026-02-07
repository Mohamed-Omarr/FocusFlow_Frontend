import axios, { AxiosError, AxiosResponse } from "axios";


const PRODUCTION_Url = process.env.NEXT_PUBLIC_PRODUCTION_URL
const localhost_Url = process.env.NEXT_PUBLIC_BASE_URL

export const base_url = PRODUCTION_Url ? PRODUCTION_Url :localhost_Url


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
