import { toast } from "sonner";

export const toasting = {
  success: (message: string) => {
    toast(message);
  },
  error: (message: string) => {
    toast(message);
  },
  alert: (message: string) => {
    toast(message); // or "default"
  },
};
