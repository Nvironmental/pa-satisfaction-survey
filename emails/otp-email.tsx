import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface OTPEmailProps {
  otp: string;
  type: "sign-in" | "email-verification" | "forget-password";
  email: string;
}

export default function OTPEmail({ otp, type, email }: OTPEmailProps) {
  const getSubject = () => {
    switch (type) {
      case "sign-in":
        return "Sign In OTP";
      case "email-verification":
        return "Email Verification OTP";
      case "forget-password":
        return "Password Reset OTP";
      default:
        return "OTP Code";
    }
  };

  const getMessage = () => {
    switch (type) {
      case "sign-in":
        return "Please use this code to login to the PeopleAsset Survey Dashboard";
      case "email-verification":
        return "Use this code to verify your email address:";
      case "forget-password":
        return "Use this code to reset your password:";
      default:
        return "Use this code:";
    }
  };

  return (
    <Html>
      <Head />
      <Preview>{getSubject()}</Preview>
      <Body style={main}>
        <Container style={container}>
          <div style={{ textAlign: "center", margin: "20px 0" }}>
            <Img
              src="https://peopleasset.in/mail-assets/PA_Identity_FINAL_Blue_LOWRES.png"
              alt="Client Satisfaction Survey"
              style={{
                width: "200px",
                height: "auto",
                display: "block",
                margin: "0 auto",
              }}
            />
          </div>

          <Heading style={h1}>Your OTP</Heading>

          <Section style={section}>
            <Text style={text}>{getMessage()}</Text>

            <Text style={otpCode}>{otp}</Text>

            <Text style={text}>
              This code will expire in 5 minutes for security reasons.
            </Text>

            <Text style={text}>
              If you did not request this code, please ignore this email.
            </Text>

            <Text style={text}>
              Best regards,
              <br />
              Team PeopleAsset
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: "#ffffff",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
  maxWidth: "560px",
};

const h1 = {
  color: "#333",
  fontSize: "24px",
  fontWeight: "bold",
  margin: "40px 0",
  padding: "0",
  textAlign: "center" as const,
};

const section = {
  padding: "24px",
  // backgroundColor: "#f6f9fc",
  borderRadius: "8px",
};

const text = {
  color: "#333",
  fontSize: "16px",
  lineHeight: "24px",
  margin: "16px 0",
};

const otpCode = {
  backgroundColor: "#f4f4f4",
  borderRadius: "4px",
  color: "#333",
  fontSize: "32px",
  fontWeight: "bold",
  letterSpacing: "6px",
  lineHeight: "40px",
  padding: "16px",
  margin: "32px 0",
  textAlign: "center" as const,
  fontFamily: "monospace",
};
