import { toast } from "react-toastify";
import { ZodError } from "zod";
import { formatZodError } from "../../../_lib_backend/validation/zodHelper/zodError";

interface RTQError {
  data?: { error?: string } | string;
}

function isZodErr(e: unknown): e is ZodError {
  return e instanceof ZodError;
}

function isRTQErr(e: unknown): e is RTQError {
  // Loose check: if it has a "data" prop of type object or string, treat it as RTQError.
  return (
    typeof e === "object" &&
    e !== null &&
    "data" in e &&
    (typeof (e).data === "string" ||
      typeof (e).data === "object")
  );
}

function extractRTQMessage(err: RTQError): string | undefined {
  const { data } = err;
  if (typeof data === "string") return data;
  if (data && typeof data === "object" && "error" in data) {
    const val = (data).error;
    if (typeof val === "string" && val.trim() !== "") return val;
  }
  return undefined;
}

export function toastingError(err: unknown) {
  let message: string;

  if (isZodErr(err)) {
    message = formatZodError(err);
  } else if (isRTQErr(err)) {
    message = extractRTQMessage(err) ?? "Request failed.";
  } else if (err instanceof Error && err.message) {
    message = err.message;
  } else {
    message = "An unexpected error occurred.";
  }

  toast.error(message, { autoClose: 1000 });
}
