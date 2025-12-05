import { toast } from 'react-toastify';

type IncomingMsg =
  | string
  | { message: string }
  | { data: { message: string } };

export const toastingSuccess = (
  msgOfSuccess: IncomingMsg,
  onClose?: () => void
) => {
  let finalMessage = 'Done Successfully';

  if (typeof msgOfSuccess === 'string') {
    finalMessage = msgOfSuccess.trim();
  } else if (
    typeof msgOfSuccess === 'object' &&
    'message' in msgOfSuccess &&
    typeof msgOfSuccess.message === 'string'
  ) {
    finalMessage = msgOfSuccess.message.trim();
  } else if (
    typeof msgOfSuccess === 'object' &&
    'data' in msgOfSuccess &&
    typeof msgOfSuccess.data === 'object' &&
    msgOfSuccess.data !== null &&
    'message' in msgOfSuccess.data &&
    typeof msgOfSuccess.data.message === 'string'
  ) {
    finalMessage = msgOfSuccess.data.message.trim();
  }

  toast.success(finalMessage, {
    autoClose: 500,
    ...(onClose && { onClose }),
  });
};
