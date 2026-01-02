import TaskPlannerClient from "./Index";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export default async function TaskPlannerPage() {
  const queryClient = new QueryClient();
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    await queryClient.prefetchQuery({
      queryKey: ["tasks"],
      queryFn: async () => {
        const { data, error } = await supabase
          .from("tasks")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (error) throw error;
        return data;
      },
    });
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <TaskPlannerClient />
    </HydrationBoundary>
  );
}
