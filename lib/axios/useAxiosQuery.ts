import { useQuery, useMutation, UseQueryOptions, UseMutationOptions } from "@tanstack/react-query";
import axiosClient from "./axiosClient";

// --- GET Hook ---
export const useAxiosGet = <TData>(
  key: string | unknown[],
  url: string,
  options?: UseQueryOptions<TData, Error>
) => {
  return useQuery<TData, Error>({
    queryKey: Array.isArray(key) ? key : [key],
    queryFn: async () => {
      const response = await axiosClient.get<TData>(url);
      return response.data;
    },
    ...options,
  });
};

// --- Mutation Hook ---
export const useAxiosMutation = <TData,TVariables>(
  url: string,
  method:  "PUT" | "PATCH" | "DELETE" ,
  options?: UseMutationOptions<TData, Error, TVariables>
) => {

  return useMutation<TData, Error, TVariables>({
    mutationFn: async (data: TVariables) => {
      const response = await axiosClient.request<TData>({
        url,
        method,
        data,
      });
      return response.data;
    },
    ...options,
  });
};
