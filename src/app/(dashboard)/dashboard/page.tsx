"use client";

import { useState, useEffect, useCallback } from "react";
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
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import IntroBanner from "@/components/IntroBanner";
import { toast } from "sonner";
import BaseHeader from "@/components/BaseHeader";
import { Skeleton } from "@/components/ui/skeleton";
import { IconLoader2 } from "@tabler/icons-react";

export default function DashboardPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on component mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: session } = await authClient.getSession();

        if (session?.user) {
          // User has a valid session, redirect to analytics
          setIsAuthenticated(true);
          setUserEmail(session.user.email || "");
          router.push("/dashboard/clients");
        }
      } catch (error) {
        console.error("Error checking session:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, [router]);

  const handleSendOtp = useCallback(async () => {
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    setIsSendingOtp(true);

    setOtpSent(true);

    try {
      // Send OTP using Better Auth
      const { data, error } = await authClient.emailOtp.sendVerificationOtp({
        email,
        type: "sign-in",
      });

      if (error) {
        toast.error(error.message || "There was an error sending the OTP");
        setOtpSent(false);
      } else {
        toast.success("OTP sent successfully! Check your email.");
      }
    } catch (err) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsSendingOtp(false);
    }
  }, [email]);

  const handleVerifyOtp = useCallback(async () => {
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
        setIsAuthenticated(true);
        setUserEmail(email);
        setOtpSent(false);
        setOtp("");

        toast.success("Authentication successful! Redirecting...");

        // Redirect to analytics page after successful authentication
        router.push("/dashboard/clients");
      }
    } catch (err) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsVerifyingOtp(false);
    }
  }, [otp, email, router]);

  // Handle keyboard events for Enter key support
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();

        if (!otpSent) {
          // On email input screen, Enter should trigger Continue/Send OTP
          if (email && !isSendingOtp) {
            handleSendOtp();
          }
        } else {
          // On OTP input screen, Enter should trigger Verify OTP
          if (otp.length === 6 && !isVerifyingOtp) {
            handleVerifyOtp();
          }
        }
      }
    };

    // Add event listener
    document.addEventListener("keydown", handleKeyPress);

    // Cleanup
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [
    email,
    otp,
    otpSent,
    isSendingOtp,
    isVerifyingOtp,
    handleSendOtp,
    handleVerifyOtp,
  ]);

  const handleSignOut = async () => {
    try {
      await authClient.signOut();
      toast.success("Signed out successfully");
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Error signing out");
    } finally {
      setIsAuthenticated(false);
      setUserEmail("");
      setEmail("");
      setOtp("");
      setOtpSent(false);
      router.push("/dashboard");
    }
  };

  return (
    <section className="h-[100dvh] grid grid-cols-1 md:grid-cols-2 relative">
      <BaseHeader logoClassName="text-white md:text-pa-midnight-regent" />
      {isLoading || isAuthenticated ? (
        <div className="h-full row-start-2 md:row-start-auto">
          <div className="flex items-center justify-center h-full w-full font-sans">
            <div className="px-4 w-full md:w-8/12 flex flex-col gap-8 items-center justify-center">
              <IconLoader2 className="size-10 animate-spin" />
              <h1 className="font-bold">
                Checking authentication and redirecting...
              </h1>
            </div>
          </div>
        </div>
      ) : (
        <div className="h-full row-start-2 md:row-start-auto">
          <div className="md:flex hidden items-center justify-center h-full w-full font-sans">
            <div className="px-4 w-full md:w-8/12">
              <h1 className="text-3xl font-bold">Login with OTP</h1>
              <p className="text-sm mt-2">
                {otpSent
                  ? `We've sent a 6-digit OTP to ${email}`
                  : "Enter your email to receive a one-time password"}
              </p>

              <div className="space-y-6 mt-8">
                {!otpSent ? (
                  <div className="space-y-4">
                    <div>
                      {/* <Label className="mb-2" htmlFor="email">
                    Email Address
                  </Label> */}
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
                    {/* <div className="">
                    <p className="text-sm mb-4">
                      We've sent a 6-digit OTP to <strong>{email}</strong>
                    </p>
                  </div> */}

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
          <div className="flex md:hidden items-center justify-center h-full w-full font-sans">
            <div className="px-4 w-full md:w-8/12">
              <h1 className="text-3xl font-bold">Mobile Access Restricted</h1>
              <p className="text-sm mt-2">
                Please access from desktop or laptop to continue using the
                dashboard.
              </p>
            </div>
          </div>
        </div>
      )}
      <div className="bg-pa-royal-azure row-start-1 md:row-start-auto">
        <IntroBanner />
      </div>
    </section>
  );

  //   // Show loading state while checking session
  //   if (isLoading) {
  //     return (

  //     );
  //   }

  // If user is authenticated, show a brief message before redirecting
  if (isAuthenticated) {
    return (
      <div className="h-[100dvh] bg-gradient-to-br from-pa-noble-black via-pa-midnight-regent to-pa-royal-azure py-12">
        <div className="max-w-md mx-auto px-4">
          <Card>
            <CardContent className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
                <p className="text-gray-600">Redirecting to analytics...</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[100dvh] bg-gradient-to-br from-pa-noble-black via-pa-midnight-regent to-pa-royal-azure py-12 flex items-center justify-center font-sans">
      <div className="max-w-md mx-auto px-4">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="">Login with OTP</CardTitle>
            <CardDescription>
              Enter your email to receive a one-time password
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {!otpSent ? (
              <div className="space-y-4">
                <div>
                  {/* <Label className="mb-2" htmlFor="email">
                    Email Address
                  </Label> */}
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
                  {isSendingOtp ? "Sending OTP..." : "Send OTP"}
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-4">
                    We&apos;ve sent a 6-digit OTP to <strong>{email}</strong>
                  </p>
                </div>

                <div>
                  <Label className="mb-2" htmlFor="otp">
                    Enter OTP
                  </Label>

                  <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                    </InputOTPGroup>
                    <InputOTPSeparator />
                    <InputOTPGroup>
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
