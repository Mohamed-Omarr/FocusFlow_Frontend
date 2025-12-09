"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, CheckCircle2 } from "lucide-react"
import Image from "next/image"
import { Link } from "@/i18n/navigation"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    // TODO: Implement actual password reset logic
    // For now, simulate password reset
    setTimeout(() => {
      if (email) {
        setSuccess(true)
      } else {
        setError("Please enter your email address")
      }
      setLoading(false)
    }, 1000)
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left side - Image */}
      <div className="hidden lg:block relative bg-gradient-to-br from-primary/20 via-accent/20 to-primary/10">
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <div className="text-center space-y-6">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              FocusFlow
            </h1>
            <p className="text-xl text-muted-foreground max-w-md">We'll help you get back on track</p>
            <div className="relative w-full max-w-lg mx-auto aspect-square">
              <Image
                src="/person-recovering-finding-path-forward-calm-reassu.jpg"
                alt="Password recovery illustration"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8 lg:hidden">
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              FocusFlow
            </h1>
            <p className="text-muted-foreground">Reset your password</p>
          </div>

          <div className="hidden lg:block text-center mb-8">
            <h2 className="text-3xl font-bold mb-2">Reset Password</h2>
            <p className="text-muted-foreground">We'll send you instructions to reset it</p>
          </div>

          <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-3xl p-8 shadow-xl">
            {!success ? (
              <>
                <h2 className="text-2xl font-semibold mb-2 text-center lg:hidden">Forgot Password?</h2>
                <p className="text-sm text-muted-foreground text-center mb-6">
                  No worries, we'll send you reset instructions
                </p>

                <form onSubmit={handleResetPassword} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-11 rounded-xl"
                      required
                    />
                  </div>

                  {error && (
                    <div className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-xl p-3">
                      {error}
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full h-11 rounded-xl bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity"
                    disabled={loading}
                  >
                    {loading ? "Sending..." : "Send Reset Link"}
                  </Button>
                </form>
              </>
            ) : (
              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  <div className="rounded-full bg-primary/10 p-3">
                    <CheckCircle2 className="w-12 h-12 text-primary" />
                  </div>
                </div>
                <h2 className="text-2xl font-semibold">Check Your Email</h2>
                <p className="text-sm text-muted-foreground">
                  We've sent a password reset link to <span className="font-medium text-foreground">{email}</span>
                </p>
                <p className="text-xs text-muted-foreground">
                  Didn't receive the email? Check your spam folder or{" "}
                  <button
                    onClick={() => setSuccess(false)}
                    className="text-primary hover:text-primary/80 transition-colors underline"
                  >
                    try another email address
                  </button>
                </p>
              </div>
            )}

            <div className="mt-6">
              <Link
                href="/login"
                className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
