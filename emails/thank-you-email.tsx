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

interface QuestionAnswer {
  questionId: string;
  question: string;
  answer: string;
  type: string;
}

const sampleData = {
  name: "John Smith",
  surveyType: "client" as const,
  totalScore: 4.25,
  questionsAndAnswers: [
    {
      questionId: "question_1",
      question:
        "Which of the following best describes your engagement with PeopleAsset?",
      answer: "Executive Search (CXO/ Board)",
      type: "radio",
    },
    {
      questionId: "question_2",
      question: "How did you first hear about PeopleAsset?",
      answer: "Other (specify)",
      type: "radio",
    },
    {
      questionId: "question_2.1",
      question: "Please specify the other source",
      answer: "LinkedIn referral from a colleague",
      type: "input",
    },
    {
      questionId: "question_3",
      question:
        "How would you describe the outcome of your engagement with PeopleAsset?",
      answer: "5 - Fully achieved",
      type: "radio",
    },
    {
      questionId: "question_4",
      question:
        "How satisfied are you with your overall experience of working with the PeopleAsset team?",
      answer: "5 - Highly Satisfied",
      type: "radio",
    },
    {
      questionId: "question_5",
      question:
        "Did PeopleAsset follow a formal cadence to review engagement progress?",
      answer: "Yes",
      type: "radio",
    },
    {
      questionId: "question_5.1",
      question:
        "How frequently was this progress communicated to you and other stakeholders?",
      answer: "Weekly",
      type: "radio",
    },
    {
      questionId: "question_6",
      question:
        "To what extent did PeopleAsset adhere to the agreed delivery milestones and timelines?",
      answer: "5 - Fully on time / exceeded expectations",
      type: "radio",
    },
    {
      questionId: "question_7",
      question:
        "How likely are you to engage with PeopleAsset again in the future?",
      answer: "5 - Extremely likely",
      type: "radio",
    },
    {
      questionId: "question_8",
      question:
        "How likely are you to recommend PeopleAsset to your associates or industry peers?",
      answer: "5 - Extremely likely",
      type: "radio",
    },
    {
      questionId: "question_9",
      question:
        "How satisfied are you with the engagement progress reports, MIS, candidate reports, and other updates shared by PeopleAsset?",
      answer: "4 - Satisfied",
      type: "radio",
    },
    {
      questionId: "question_10",
      question:
        "What was the primary reason you chose to engage with PeopleAsset?",
      answer: "Other (please specify)",
      type: "radio",
    },
    {
      questionId: "question_10.1",
      question: "Please specify the other reason",
      answer: "Previous positive experience with the team",
      type: "input",
    },
    {
      questionId: "question_11",
      question:
        "How clearly were the goals and expectations defined at the beginning of your engagement with PeopleAsset?",
      answer: "5 - Extremely clear",
      type: "radio",
    },
    {
      questionId: "question_12",
      question:
        "To what extent did PeopleAsset meet the objectives agreed upon at the start of the engagement?",
      answer: "5 - Fully met all objectives",
      type: "radio",
    },
    {
      questionId: "question_13",
      question:
        "Are there any areas where the PeopleAsset team could have improved your overall engagement experience?",
      answer: "Yes",
      type: "radio",
    },
    {
      questionId: "question_13.1",
      question: "Please specify the areas for improvement",
      answer:
        "Could have provided more frequent updates during the search process",
      type: "input",
    },
    {
      questionId: "question_14",
      question:
        "Do you have any additional feedback, suggestions, or comments you'd like to share with us?",
      answer:
        "Overall excellent experience. The team was professional, responsive, and delivered exactly what was promised. Would definitely work with them again.",
      type: "text",
    },
  ],
};

interface ThankYouEmailProps {
  name: string;
  surveyType: "client" | "candidate";
  questionsAndAnswers: QuestionAnswer[];
  totalScore?: number;
}

export default function ThankYouEmail({
  name,
  surveyType,
  questionsAndAnswers,
  totalScore,
}: ThankYouEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>PeopleAsset - Thank You</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Row>
              <Column align="center">
                <Img
                  src="https://peopleasset.in/mail-assets/survey-header.png"
                  srcSet="https://peopleasset.in/mail-assets/survey-header.png 1x, https://peopleasset.in/mail-assets/survey-header-2.png 2x"
                  alt="PeopleAsset Logo"
                  width="560px"
                  height="178px"
                  className="mx-auto my-0 bg-cover bg-center"
                />
              </Column>
            </Row>
          </Section>

          {/* <Heading style={h1}>Thank You</Heading> */}

          <Section style={section}>
            <Text style={text}>Dear {name},</Text>

            <Text style={{ ...text, margin: "0px" }}>
              Thank you! Your responses have been recorded. Your feedback helps
              us to improve our services and better serve our clients and
              candidates.
            </Text>
          </Section>

          <Section style={{ ...section, padding: "0px 48px" }}>
            <Text style={headingText}>Survey Responses Summary</Text>
            {questionsAndAnswers.map((qa, index) => {
              const isSubQuestion = qa.questionId.includes(".");
              return (
                <div
                  key={qa.questionId}
                  style={
                    isSubQuestion ? subQuestionContainer : questionContainer
                  }
                >
                  <Text style={isSubQuestion ? subQuestionText : questionText}>
                    <strong>
                      {isSubQuestion
                        ? ""
                        : `Q${qa.questionId.replace("question_", "")}:`}
                    </strong>{" "}
                    {qa.question}
                  </Text>
                  <Text style={isSubQuestion ? subAnswerText : answerText}>
                    <strong>Answer:</strong> {qa.answer}
                  </Text>
                </div>
              );
            })}
          </Section>

          <Section style={section}>
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

const main = {
  backgroundColor: "#F4F4F4",
  textColor: "#333333",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
  maxWidth: "560px",
};

const header = {
  textAlign: "center" as const,
  backgroundColor: "#001640",
  // backgroundImage: "url('https://survey.peopleasset.in/email-bg.jpg')",
  // backgroundSize: "cover",
  // backgroundPosition: "center",
  // backgroundRepeat: "no-repeat",
  height: "178px",
  margin: "0px 0",
  maxWidth: "560px",
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
  color: "#333",
  fontSize: "14px",
  lineHeight: "20px",
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

const copyrightText = {
  color: "#333333",
  opacity: 0.5,
  fontSize: "8px",
  lineHeight: "16px",
  margin: "16px 0 0 0",
  textAlign: "left" as const,
};

const headingText = {
  color: "#001640",
  fontSize: "18px",
  fontWeight: "bold",
  lineHeight: "24px",
  //   margin: "24px 0 16px 0",
  textAlign: "left" as const,
};

const questionContainer = {
  margin: "16px 0",
  padding: "16px",
  //   backgroundColor: "#f8f9fa",
  borderRadius: "8px",
  border: "1px solid #e9ecef",
};

const questionText = {
  color: "#333",
  fontSize: "14px",
  lineHeight: "20px",
  margin: "8px 0 8px 0",
  textAlign: "left" as const,
};

const answerText = {
  color: "#001640",
  fontSize: "14px",
  lineHeight: "20px",
  margin: "0",
  textAlign: "left" as const,
};

const subQuestionContainer = {
  margin: "8px 0 8px 0",
  marginLeft: "20px",
  padding: "12px",
  //   backgroundColor: "#f1f3f4",
  borderRadius: "6px",
  border: "1px solid #e9ecef",
  borderLeft: "3px solid #001640",
};

const subQuestionText = {
  color: "#555",
  fontSize: "13px",
  lineHeight: "18px",
  margin: "0 0 6px 0",
  textAlign: "left" as const,
  fontStyle: "italic",
};

const subAnswerText = {
  color: "#001640",
  fontSize: "13px",
  lineHeight: "18px",
  margin: "0",
  textAlign: "left" as const,
  fontWeight: "500",
};
