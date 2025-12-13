import { toast } from "sonner";

export const toasting = {
  success: (message: string,fn:()=>void) => {
    toast(message,{onAutoClose() {
        fn();
    },duration:1200});
  },
  error: (message: string) => {
    toast(message);
  },
  alert: (message: string) => {
    toast(message); // or "default"
  },
};
