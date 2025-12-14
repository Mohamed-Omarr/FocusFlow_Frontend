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
import axios from "axios";
import { Link, useRouter } from "@/i18n/navigation";
import { LoginResponse } from "../types";

export default function LoginPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting,isValid},
  } = useForm<LoginFormInterface>({
    resolver: zodResolver(ValidateUserLogin),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // SUBMIT HANDLER
  const onSubmit = async (data: LoginFormInterface) => {
    try {
      const res: LoginResponse = await axios.post(
        "https://focusbackend.vercel.app/api/v1/users/login",
        {
          email: data.email,
          password: data.password,
        },
        { withCredentials: true }
      );
      console.log(res);

      localStorage.setItem("accessToken", res.data.accessToken);
      if (res.data) {
        toasting.success(res.data.message, () => router.push("/home"));
      }
    } catch (err: any) {
      console.log(err);
      toasting.error(err.response.data.message || `Login error:${err}`);
    } finally {
      reset();
    }
  };

  return (
    <div className="w-full max-w-md flex flex-col gap-3 ">
      {/* HEADER */}
      <div className="text-center ">
        <div className="flex flex-row justify-center">
          <div className="relative">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent rounded-xl blur-lg opacity-40"></div>
          </div>
        </div>

        <h1 className="text-2xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
          Welcome Back
        </h1>

        <p className="text-sm text-muted-foreground">
          Sign in to continue your focus journey
        </p>
      </div>

      {/* FORM CARD */}
      <div className="bg-card/80 backdrop-blur-xl border border-border/50 rounded-3xl p-8 shadow-2xl">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          {/* EMAIL */}
          <div className="space-y-3">
            <Label htmlFor="email">Email Address</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />

              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                autoComplete="new-email"
                {...register("email")}
                className="h-12 rounded-xl pl-10 bg-background/50 border-border/50 focus:border-primary/50"
              />
            </div>

            {errors.email && (
              <p className="text-xs text-destructive">{errors.email.message}</p>
            )}
          </div>

          {/* PASSWORD */}
          <div className="space-y-3">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />

              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                {...register("password")}
                className="h-12 rounded-xl pl-10 bg-background/50 border-border/50 focus:border-primary/50"
              />
            </div>

            {errors.password && (
              <p className="text-xs text-destructive">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="flex justify-end">
            <Link
              href="/forgot-password"
              className="text-sm text-primary hover:text-primary/80"
            >
              Forgot password?
            </Link>
          </div>

          {/* SUBMIT */}
          <Button
            type="submit"
            className="w-full h-12 rounded-xl bg-gradient-to-r from-primary to-accent hover:opacity-90 shadow-lg hover:shadow-xl"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border/50"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-card text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>

        {/* Google Button */}
        <Button
          type="button"
          variant="outline"
          className="w-full h-12 rounded-xl border-border/50 hover:bg-muted/50"
          onClick={() => console.log("google login")}
        >
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Continue with Google
        </Button>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Don't have an account?{" "}
          <Link
            href="/register"
            className="text-primary hover:text-primary/80 font-semibold"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
