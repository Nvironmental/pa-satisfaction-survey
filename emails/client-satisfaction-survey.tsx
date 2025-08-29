import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface ClientSatisfactionSurveyEmailProps {
  representativeName: string;
  surveyLink: string;
}

export default function ClientSatisfactionSurveyEmail({
  representativeName,
  surveyLink,
}: ClientSatisfactionSurveyEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Client Satisfaction Survey - Your Feedback Matters</Preview>
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

          <Heading style={h1}>Client Satisfaction Survey</Heading>

          <Section style={section}>
            <Text style={text}>Dear {representativeName},</Text>

            <Text style={text}>
              We value your partnership and would greatly appreciate your
              feedback on our services. Your insights help us continuously
              improve and provide better support to our clients.
            </Text>

            <Text style={text}>
              Please take a few minutes to complete our brief satisfaction
              survey. Your responses are confidential and will be used solely to
              enhance our service quality.
            </Text>
          </Section>

          <Section style={buttonContainer}>
            <Button style={button} href={surveyLink}>
              Take Survey
            </Button>
          </Section>

          <Section style={section}>
            <Text style={text}>
              If you have any questions or need assistance, please reach out to
              us by replying to this email.
            </Text>

            <Text style={text}>
              Thank you for your time and continued partnership.
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
  padding: "24px 0",
};

const text = {
  color: "#333",
  fontSize: "16px",
  lineHeight: "24px",
  margin: "16px 0",
};

const buttonContainer = {
  textAlign: "center" as const,
  margin: "0px 0",
};

const button = {
  backgroundColor: "#009b77",
  borderRadius: "6px",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "12px 24px",
  border: "none",
  cursor: "pointer",
};
