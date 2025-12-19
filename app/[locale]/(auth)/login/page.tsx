"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock, Sparkles } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  LoginFormInterface,
  ValidateUserLogin,
} from "@/lib/zod/auth/validation/auth";
import { toasting } from "@/lib/toast/toast";
import { signIn, useSession } from "next-auth/react";
import { Link, useRouter } from "@/i18n/navigation";
import { useEffect } from "react";

export default function LoginPage() {
  const router = useRouter();
  const { data: session, status } = useSession(); // ✅ session

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormInterface>({
    resolver: zodResolver(ValidateUserLogin),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // ✅ REDIRECT IF ALREADY LOGGED IN
  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/home"); // locale-safe via i18n router
    }
  }, [status, router]);

  // ✅ SUBMIT HANDLER
  const onSubmit = async (data: LoginFormInterface) => {
    try {
      const res = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
      });

      if (res?.error) {
        toasting.error(res.error || "Invalid credentials");
        return;
      }

      toasting.success("Login successful", () => {
        router.push("/home");
      });
    } catch {
      toasting.error("Login failed");
    } finally {
      reset();
    }
  };

  // ⏳ Optional: prevent flicker while checking session
  if (status === "loading") return null;

  return (
    <div className="w-full max-w-md flex flex-col gap-3">
      {/* HEADER */}
      <div className="text-center">
        <div className="flex justify-center">
          <div className="relative">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent rounded-xl blur-lg opacity-40" />
          </div>
        </div>

        <h1 className="text-2xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
          Welcome Back
        </h1>

        <p className="text-sm text-muted-foreground">
          Sign in to continue your focus journey
        </p>
      </div>

      {/* FORM */}
      <div className="bg-card/80 backdrop-blur-xl border rounded-3xl p-8 shadow-2xl">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          {/* EMAIL */}
          <div className="space-y-3">
            <Label>Email Address</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="email"
                placeholder="you@example.com"
                {...register("email")}
                className="h-12 rounded-xl pl-10"
              />
            </div>
            {errors.email && (
              <p className="text-xs text-destructive">{errors.email.message}</p>
            )}
          </div>

          {/* PASSWORD */}
          <div className="space-y-3">
            <Label>Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="password"
                placeholder="••••••••"
                {...register("password")}
                className="h-12 rounded-xl pl-10"
              />
            </div>
            {errors.password && (
              <p className="text-xs text-destructive">
                {errors.password.message}
              </p>
            )}
          </div>

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <p className="text-center text-sm mt-6">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-primary font-semibold">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
