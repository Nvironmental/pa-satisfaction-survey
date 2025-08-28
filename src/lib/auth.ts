import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { emailOTP } from "better-auth/plugins";
import { PrismaClient } from "@prisma/client";
import { sendOTPEmail, sendVerificationEmail } from "./email";

const prisma = new PrismaClient();

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  plugins: [
    emailOTP({
      disableSignUp: true, // Disable signups as requested
      otpLength: 6,
      expiresIn: 300, // 5 minutes
      allowedAttempts: 3,
      async sendVerificationOTP({ email, otp, type }) {
        // Send OTP email using SendGrid
        const result = await sendOTPEmail({ to: email, otp, type });

        if (!result.success) {
          console.error(`Failed to send OTP email to ${email}:`, result.error);
          throw new Error(`Failed to send OTP email: ${result.error}`);
        }

        console.log(`OTP email sent successfully to ${email}`);
      },
    }),
  ],
  pages: {
    signIn: "/dashboard", // Redirect to dashboard for OTP input
  },
  // Add email verification support
  emailVerification: {
    sendVerificationEmail: async ({ user, url, token }, request) => {
      const result = await sendVerificationEmail({
        to: user.email,
        url,
        token,
      });

      if (!result.success) {
        console.error(
          `Failed to send verification email to ${user.email}:`,
          result.error
        );
        throw new Error(`Failed to send verification email: ${result.error}`);
      }

      console.log(`Verification email sent successfully to ${user.email}`);
    },
  },
});

export { prisma };
