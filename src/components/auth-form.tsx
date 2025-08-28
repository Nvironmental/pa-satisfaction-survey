"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import IntroBanner from "@/components/IntroBanner";
import { toast } from "sonner";
import BaseHeader from "@/components/BaseHeader";

export default function AuthForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  const handleSendOtp = async () => {
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    setIsSendingOtp(true);

    try {
      // Send OTP using Better Auth
      const { data, error } = await authClient.emailOtp.sendVerificationOtp({
        email,
        type: "sign-in",
      });

      if (error) {
        toast.error(error.message || "Failed to send OTP");
      } else {
        setOtpSent(true);
        toast.success("OTP sent successfully! Check your email.");
      }
    } catch (err) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp || otp.length !== 6) {
      toast.error("Please enter the 6-digit OTP");
      return;
    }

    setIsVerifyingOtp(true);

    try {
      // Verify OTP using Better Auth
      const { data, error } = await authClient.signIn.emailOtp({
        email,
        otp,
      });

      if (error) {
        toast.error(error.message || "Invalid OTP");
      } else {
        // Successfully authenticated
        setOtpSent(false);
        setOtp("");

        toast.success("Authentication successful! Redirecting...");

        // Redirect to dashboard home after successful authentication
        router.push("/dashboard/clients");
      }
    } catch (err) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  return (
    <section className="h-[100dvh] grid grid-cols-1 md:grid-cols-2 relative">
      <BaseHeader logoClassName="text-pa-midnight-regent" />
      <div className="h-full row-start-2 md:row-start-auto">
        <div className="flex items-center justify-center h-full w-full font-sans">
          <div className="px-4 w-full md:w-8/12">
            <h1 className="text-3xl font-bold">Sign In with OTP</h1>
            <p className="text-sm mt-2">
              {otpSent
                ? `We've sent a 6-digit OTP to ${email}`
                : "Enter your email to receive a one-time password"}
            </p>

            <div className="space-y-6 mt-8">
              {!otpSent ? (
                <div className="space-y-4">
                  <div>
                    <Input
                      className="h-[48px]"
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isSendingOtp}
                    />
                  </div>

                  <Button
                    onClick={handleSendOtp}
                    disabled={isSendingOtp || !email}
                    className="w-full"
                  >
                    {isSendingOtp ? "Sending..." : "Continue"}
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                      <InputOTPGroup>
                        <InputOTPSlot className="h-12 w-14" index={0} />
                        <InputOTPSlot className="h-12 w-14" index={1} />
                        <InputOTPSlot className="h-12 w-14" index={2} />
                      </InputOTPGroup>
                      <InputOTPSeparator />
                      <InputOTPGroup>
                        <InputOTPSlot className="h-12 w-14" index={3} />
                        <InputOTPSlot className="h-12 w-14" index={4} />
                        <InputOTPSlot className="h-12 w-14" index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={handleVerifyOtp}
                      disabled={isVerifyingOtp || otp.length !== 6}
                      className="flex-1"
                    >
                      {isVerifyingOtp ? "Verifying..." : "Verify OTP"}
                    </Button>
                    <Button
                      onClick={() => {
                        setOtpSent(false);
                        setOtp("");
                      }}
                      variant="outline"
                    >
                      Back
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="bg-pa-royal-azure row-start-1 md:row-start-auto">
        <IntroBanner />
      </div>
    </section>
  );
}
