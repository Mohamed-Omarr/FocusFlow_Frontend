"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  PasswordSchema,
  PasswordSchemaType,
} from "@/lib/zod/settings/validation/password";
import { updatePasswordAction } from "@/lib/actions/update-password";

export default function PasswordSettings() {
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PasswordSchemaType>({
    resolver: zodResolver(PasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: PasswordSchemaType) => {
    setServerError(null);
    setSuccess(false);

    try {
      await updatePasswordAction(data);
      setSuccess(true);
      reset();
    } catch (err: any) {
      setServerError(err.message || "Something went wrong");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="rounded-2xl border bg-card/50 backdrop-blur-xl p-8 shadow-xl space-y-8 max-w-xl mx-auto"
    >
      <h2 className="text-2xl font-bold">Change Password</h2>

      <div className="space-y-5">
        <div className="flex flex-col gap-2">
          <Label>Current Password</Label>
          <Input type="password" {...register("currentPassword")} />
          {errors.currentPassword && (
            <p className="text-sm text-red-500 mt-1">
              {errors.currentPassword.message}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Label>New Password</Label>
          <Input type="password" {...register("newPassword")} />
          {errors.newPassword && (
            <p className="text-sm text-red-500 mt-1">
              {errors.newPassword.message}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Label>Confirm Password</Label>
          <Input type="password" {...register("confirmPassword")} />
          {errors.confirmPassword && (
            <p className="text-sm text-red-500 mt-1">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {serverError && <p className="text-sm text-red-600">{serverError}</p>}

        {success && (
          <p className="text-sm text-green-600">
            Password updated successfully
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-3 bg-primary text-primary-foreground rounded-xl disabled:opacity-50"
        >
          {isSubmitting ? "Updating..." : "Update Password"}
        </button>
      </div>
    </form>
  );
}
