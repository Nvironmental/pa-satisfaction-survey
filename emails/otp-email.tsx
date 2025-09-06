import {
  Body,
  Column,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Row,
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
          <Section style={header}>
            <Row>
              <Column align="center">
                <Img
                  src="https://peopleasset.in/mail-assets/survey-header-2.png"
                  srcSet="https://peopleasset.in/mail-assets/survey-header.png 1x, https://peopleasset.in/mail-assets/survey-header-2.png 2x"
                  alt="PeopleAsset Logo"
                  width="560"
                  height="178"
                  className="mx-auto my-0 bg-cover bg-center"
                />
              </Column>
            </Row>
          </Section>

          {/* <Heading style={h1}>Your OTP</Heading> */}

          <Section style={section}>
            <Text style={text}>
              Please use this code to login to the PeopleAsset Survey Dashboard
            </Text>

            <Row>
              <Column align="center">
                <Text style={otpCode}>{otp}</Text>
              </Column>
            </Row>

            <Text style={text}>
              This code will expire in 5 minutes for security reasons. If you
              did not request this code, please ignore this email.
            </Text>

            <Text style={text}>
              Best regards,
              <br />
              Team PeopleAsset
            </Text>

            <Text style={copyrightText}>
              ExecHunt (India) Pvt Ltd has the exclusive and legal rights for
              usage of PeopleAsset as its logo/trademark.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// const main = {
//   backgroundColor: "#ffffff",
//   fontFamily:
//     '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
// };

// const container = {
//   margin: "0 auto",
//   padding: "20px 0 48px",
//   maxWidth: "560px",
// };

// const h1 = {
//   color: "#333",
//   fontSize: "24px",
//   fontWeight: "bold",
//   margin: "40px 0",
//   padding: "0",
//   textAlign: "center" as const,
// };

// const section = {
//   padding: "24px",
//   // backgroundColor: "#f6f9fc",
//   borderRadius: "8px",
// };

// const text = {
//   color: "#333",
//   fontSize: "16px",
//   lineHeight: "24px",
//   margin: "16px 0",
// };

const main = {
  backgroundColor: "#F4F4F4",
  textColor: "#333333",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
  maxWidth: "560px",
};
const header = {
  textAlign: "center" as const,
  // backgroundImage: "url('https://survey.peopleasset.in/email-bg.jpg')",
  // backgroundSize: "cover",
  // backgroundPosition: "center",
  // backgroundRepeat: "no-repeat",
  // height: "217px",
  margin: "0px 0",
  maxWidth: "560px",
};

const otpCodeContainer = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  margin: "16px 0",
  textAlign: "center" as const,
};

const container = {
  margin: "0 auto",
  padding: "0px 0 48px",
  maxWidth: "560px",
  backgroundColor: "#fff",
};

const h1 = {
  color: "#ebebed",
  fontSize: "48px",
  fontFamily: "sans-serif",
  fontWeight: "bold",
  margin: "40px 0 0px 0",
  padding: "0",
  textAlign: "left" as const,
};

const section = {
  padding: "24px 48px",
  backgroundColor: "#fff",
  maxWidth: "560px",
};

const text = {
  color: "#333333",
  fontSize: "14px",
  lineHeight: "22px",
  margin: "16px 0",
};

const buttonContainer = {
  textAlign: "center" as const,
  margin: "0px 0",
  maxWidth: "560px",
};

const button = {
  // backgroundColor: "#009b77",
  backgroundColor: "#001640",
  borderRadius: "6px",
  color: "#ebebed",
  fontSize: "16px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "12px 24px",
  border: "none",
  cursor: "pointer",
};

const otpCode = {
  backgroundColor: "#DDDFE4",
  width: "220px",
  borderRadius: "4px",
  color: "#333",
  fontSize: "24px",
  fontWeight: 600,
  letterSpacing: "20px",
  lineHeight: "24px",
  padding: "16px 24px",
  // margin: "32px 0",
  textAlign: "center" as const,
};

const copyrightText = {
  color: "#333333",
  opacity: 0.5,
  fontSize: "8px",
  lineHeight: "16px",
  margin: "16px 0 0 0",
  textAlign: "left" as const,
};
