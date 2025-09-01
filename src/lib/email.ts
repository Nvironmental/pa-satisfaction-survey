import sgMail from "@sendgrid/mail";
import { render } from "@react-email/render";
import OTPEmail from "../../emails/otp-email";
import ClientSatisfactionSurveyEmail from "../../emails/client-satisfaction-survey";
import CandidateSatisfactionSurveyEmail from "../../emails/candidate-satisfaction-survey";

// Initialize SendGrid with API key
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

export interface SendOTPEmailParams {
  to: string;
  otp: string;
  type: "sign-in" | "email-verification" | "forget-password";
}

export async function sendOTPEmail({ to, otp, type }: SendOTPEmailParams) {
  try {
    // Render the email template - render() returns a Promise<string>
    const emailHtml = await render(OTPEmail({ otp, type, email: to }));

    // Ensure emailHtml is a string
    if (typeof emailHtml !== "string") {
      throw new Error(
        `Failed to render email template. Got type: ${typeof emailHtml}`
      );
    }

    // Prepare email content
    const msg = {
      to,
      from: process.env.FROM_EMAIL || "connect@peopleasset.in", // Replace with your verified sender
      subject:
        type === "sign-in"
          ? "PeopleAsset Survey Dashboard - Login OTP"
          : type === "email-verification"
            ? "Email Verification OTP"
            : "PeopleAsset Survey Dashboard - Password Reset OTP",
      html: emailHtml,
      text: `PeopleAsset Survey Dashboard - Your OTP code is: ${otp}. This code will expire in 5 minutes.`,
    };

    // Send email
    await sgMail.send(msg);

    console.log(`OTP email sent successfully to ${to}`);
    return { success: true };
  } catch (error) {
    console.error("Error sending OTP email:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function sendVerificationEmail({
  to,
  url,
  token,
}: {
  to: string;
  url: string;
  token: string;
}) {
  try {
    const msg = {
      to,
      from: process.env.FROM_EMAIL || "connect@peopleasset.in",
      subject: "Verify your email address",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Verify Your Email</h2>
          <p>Please click the link below to verify your email address:</p>
          <a href="${url}" style="display: inline-block; padding: 12px 24px; background-color: #007bff; color: white; text-decoration: none; border-radius: 4px;">Verify Email</a>
          <p>Or copy and paste this link in your browser: ${url}</p>
          <p>This link will expire in 24 hours.</p>
        </div>
      `,
      text: `Please click this link to verify your email: ${url}`,
    };

    await sgMail.send(msg);
    console.log(`Verification email sent successfully to ${to}`);
    return { success: true };
  } catch (error) {
    console.error("Error sending verification email:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export interface SendClientSurveyEmailParams {
  to: string;
  representativeName: string;
  surveyLink: string;
}

export async function sendClientSurveyEmail({
  to,
  representativeName,
  surveyLink,
}: SendClientSurveyEmailParams) {
  try {
    // Render the email template
    const emailHtml = await render(
      ClientSatisfactionSurveyEmail({
        representativeName,
        surveyLink,
      })
    );

    // Ensure emailHtml is a string
    if (typeof emailHtml !== "string") {
      throw new Error(
        `Failed to render email template. Got type: ${typeof emailHtml}`
      );
    }

    // Prepare email content
    const msg = {
      to,
      from: process.env.FROM_EMAIL || "connect@peopleasset.in",
      subject: "PeopleAsset - Client Satisfaction Survey",
      html: emailHtml,
      text: `Dear ${representativeName}, please complete our client satisfaction survey at: ${surveyLink}`,
    };

    // Send email
    await sgMail.send(msg);

    console.log(`Client survey email sent successfully to ${to}`);
    return { success: true };
  } catch (error) {
    console.error("Error sending client survey email:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export interface SendCandidateSurveyEmailParams {
  to: string;
  candidateName: string;
  surveyLink: string;
}

export async function sendCandidateSurveyEmail({
  to,
  candidateName,
  surveyLink,
}: SendCandidateSurveyEmailParams) {
  try {
    // Render the email template
    const emailHtml = await render(
      CandidateSatisfactionSurveyEmail({
        candidateName,
        surveyLink,
      })
    );

    // Ensure emailHtml is a string
    if (typeof emailHtml !== "string") {
      throw new Error(
        `Failed to render email template. Got type: ${typeof emailHtml}`
      );
    }

    // Prepare email content
    const msg = {
      to,
      from: process.env.FROM_EMAIL || "connect@peopleasset.in",
      subject: "PeopleAsset - Candidate Satisfaction Survey",
      html: emailHtml,
      text: `Dear ${candidateName}, please complete our candidate satisfaction survey at: ${surveyLink}`,
    };

    // Send email
    await sgMail.send(msg);

    console.log(`Candidate survey email sent successfully to ${to}`);
    return { success: true };
  } catch (error) {
    console.error("Error sending candidate survey email:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
