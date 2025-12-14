"use server";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import TaskPlannerClient from "./Index";
import axiosClient from "@/lib/axios/axiosClient";

// const fetchTask = async () => {
//   try {
//     const res = await axiosClient.get("/tasks");
//     return res.data;
//   } catch (err) {
//     console.error(err);
//     return [];
//   }
// };

export default async function TaskPlannerPage() {
  // const queryClient = new QueryClient();
  // await queryClient.prefetchQuery({
  //   queryKey: ["tasks"],
  //   queryFn: fetchTask,
  // });
  return (
    // <HydrationBoundary state={dehydrate(queryClient)}>
    <TaskPlannerClient />
    // </HydrationBoundary>
  );
}
