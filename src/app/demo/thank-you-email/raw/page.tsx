import { render } from "@react-email/render";
import ThankYouEmail from "../../../../../emails/thank-you-email";

export default async function RawThankYouEmailDemo() {
  // Sample data with subquestions
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

  const emailHtml = await render(ThankYouEmail(sampleData));

  return (
    <div
      dangerouslySetInnerHTML={{ __html: emailHtml }}
      style={{
        maxWidth: "600px",
        margin: "0 auto",
        fontFamily: "Arial, sans-serif",
      }}
    />
  );
}
