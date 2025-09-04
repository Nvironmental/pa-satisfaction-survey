import {
  Body,
  Button,
  Column,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Preview,
  Row,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface CandidateSatisfactionSurveyEmailProps {
  candidateName: string;
  surveyLink: string;
}

export default function CandidateSatisfactionSurveyEmail({
  candidateName,
  surveyLink,
}: CandidateSatisfactionSurveyEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>PeopleAsset - Candidate Satisfaction Survey</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Row>
              <Column align="center">
                <Img
                  src="https://peopleasset.in/mail-assets/PA_Identity_FINAL_White_LOWRES.png"
                  alt="Client Satisfaction Survey"
                  style={{
                    width: "300px",
                    height: "50px",
                    textAlign: "center" as const,
                    display: "block",
                    margin: "0 0",
                  }}
                />
              </Column>
            </Row>
          </Section>

          {/* <Heading style={h1}>Candidate Satisfaction Survey</Heading> */}

          <Section style={section}>
            <Text style={text}>Dear {candidateName},</Text>

            <Text style={text}>
              Thank you for your interest in opportunities with our clients. We
              value your experience and would greatly appreciate your feedback
              on our services and the recruitment process.
            </Text>

            <Text style={text}>
              Please take a few minutes to complete our brief satisfaction
              survey. Your responses are confidential and will be used solely to
              enhance our service quality and improve the candidate experience.
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

            <Text style={copyrightText}>
              ExecHunt (India) Pvt Ltd has the exclusive and legal rights for
              usage of TalentLab as its logo/trademark.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: "#F4F4F4",
  textColor: "#333333",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const header = {
  textAlign: "center" as const,
  backgroundImage: "url('https://survey.peopleasset.in/email-bg.jpg')",
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  height: "217px",
  margin: "0px 0",
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
};

const text = {
  color: "#333",
  fontSize: "14px",
  lineHeight: "20px",
  margin: "16px 0",
};

const buttonContainer = {
  textAlign: "center" as const,
  margin: "0px 0",
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

const copyrightText = {
  color: "#333333",
  opacity: 0.5,
  fontSize: "8px",
  lineHeight: "16px",
  margin: "16px 0 0 0",
  textAlign: "left" as const,
};
