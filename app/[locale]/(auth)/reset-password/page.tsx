"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { createSupabaseClient } from "@/lib/supabase/client";

const ResetPasswordSchema = z
  .object({
    password: z.string().min(8),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export default function ResetPasswordPage() {
  const supabase = createSupabaseClient();
  const router = useRouter();
  const [ready, setReady] = useState(false);

  // Supabase auto-injects recovery session
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        router.replace("/forgot-password");
      } else {
        setReady(true);
      }
    });
  }, [supabase, router]);

  const { register, handleSubmit, formState } = useForm({
    resolver: zodResolver(ResetPasswordSchema),
  });

  const onSubmit = async ({ password }: any) => {
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      alert(error.message);
      return;
    }

    await supabase.auth.signOut();
    router.replace("/login");
  };

  if (!ready) {
    return <p className="text-center mt-10">Verifying reset link…</p>;
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 max-w-sm mx-auto"
    >
      <Input type="password" {...register("password")} />
      <Input type="password" {...register("confirmPassword")} />
      <Button className="w-full">Reset password</Button>
    </form>
  );
}
