import axios, { AxiosError, AxiosResponse } from "axios";

const axiosClient = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_BASE_URL}`,
  withCredentials: true,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

// Token verification function
const verifyToken = async (token: string) => {
  try {
    await axios.get(
      `https://focusbackend.vercel.app/api/v1/users/refreshToken`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      }
    );
    return true;
  } catch {
    return false;
  }
};

// Request interceptor — verify token and attach if valid
axiosClient.interceptors.request.use(async (config) => {
  const accessToken = localStorage.getItem("accessToken");

  if (accessToken) {
    const isValid = await verifyToken(accessToken);
    if (!isValid) {
    localStorage.removeItem("accessToken");
      window.location.href = "/login";
      return Promise.reject("Token invalid or expired");
    }

    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

// Response interceptor — handle unauthorized globally
axiosClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("accessToken");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
