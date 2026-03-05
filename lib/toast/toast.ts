import { toast } from "sonner";

export const toasting = {
  success: (message: string, onFinish?: () => void) => {
  toast(message, {
    onAutoClose: () =>{
      onFinish()
    }
  });
},
  error: (message: string) => {
    toast(message);
  },
  alert: (message: string) => {
    toast(message); // or "default"
  },
};
