// store/useUserInfo.ts
import { create } from "zustand";

interface UserInformation {
  name: string;
  email: string;
  avatar: string | null;
  language:string;
}

interface UserState {
  info?: UserInformation;
  setUser: (user: UserInformation) => void;
}

export const useUserInfo = create<UserState>((set) => ({
  info: undefined,
  setUser: (user) => set({ info: user }),
}));
