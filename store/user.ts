import { create } from "zustand";
import axiosClient from "@/lib/axios/axiosClient";

interface UserProgress {
  total_stars: number;
  current_streak: number;
  longest_streak: number;
}

interface UserState {
  progress: UserProgress | null;
  isLoading: boolean;
  error: string | null;
  fetchUser: () => Promise<void>;
}

export const useUserInfo = create<UserState>((set) => ({
  progress: null,
  isLoading: false,
  error: null,

  fetchUser: async () => {
    try {
      set({ isLoading: true, error: null });

      const res = await axiosClient.get<UserProgress>("/user/progress");

      set({ progress: res.data, isLoading: false });
    } catch (err: any) {
      set({
        error: err?.message ?? "Failed to fetch user progress",
        isLoading: false,
      });
    }
  },
}));
