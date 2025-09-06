import { render } from "@react-email/render";
import ThankYouEmail from "../../../../emails/thank-you-email";
import { QuestionAnswer } from "@/lib/email";

export default async function ThankYouEmailDemo() {
  // Sample data for client survey
  const clientSampleData = {
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

  // Sample data for candidate survey
  const candidateSampleData = {
    name: "Sarah Johnson",
    surveyType: "candidate" as const,
    totalScore: 3.875,
    questionsAndAnswers: [
      {
        questionId: "question_1",
        question:
          "Who from PeopleAsset's end reached out to you for the first time? (Name of the specific person @ PeopleAsset)?",
        answer: "Anil Kumar",
        type: "input",
      },
      {
        questionId: "question_2",
        question: "What source was used to reach out to you?",
        answer: "Other (specify)",
        type: "radio",
      },
      {
        questionId: "question_2.1",
        question: "Please specify the other source",
        answer: "Industry conference networking",
        type: "input",
      },
      {
        questionId: "question_3",
        question:
          "How would you rate the quality of your discussions with the PeopleAsset team?",
        answer: "5 - Highly Satisfied",
        type: "radio",
      },
      {
        questionId: "question_4",
        question:
          "Did the PeopleAsset team keep you posted on a regular basis on the progress of your candidature?",
        answer: "Yes",
        type: "radio",
      },
      {
        questionId: "question_5",
        question:
          "Did we assist you during your preparations for your discussions with the client?",
        answer: "Yes",
        type: "radio",
      },
      {
        questionId: "question_6",
        question:
          "Did PeopleAsset provide you clarity about the process at the client's end?",
        answer: "Yes",
        type: "radio",
      },
      {
        questionId: "question_7",
        question:
          "How was our post offer engagement with you - this was from the offer acceptance to the date that you onboarded?",
        answer: "4 - Satisfied",
        type: "radio",
      },
      {
        questionId: "question_8",
        question:
          "Would you refer PeopleAsset to any of your friends / anyone in your network?",
        answer: "Yes",
        type: "radio",
      },
      {
        questionId: "question_9",
        question:
          "How would you rate your experience / engagement with PeopleAsset?",
        answer: "5 - Highly Satisfied",
        type: "radio",
      },
    ],
  };

  // Render both email versions
  const clientEmailHtml = await render(ThankYouEmail(clientSampleData));
  const candidateEmailHtml = await render(ThankYouEmail(candidateSampleData));

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">
          Thank You Email Preview
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Client Survey Email */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-4 text-blue-600">
              Client Survey Thank You Email
            </h2>
            <div className="text-sm text-gray-600 mb-4">
              <p>
                <strong>Recipient:</strong> {clientSampleData.name}
              </p>
              <p>
                <strong>Survey Type:</strong> {clientSampleData.surveyType}
              </p>
              <p>
                <strong>CSAT Score:</strong> {clientSampleData.totalScore}
              </p>
              <p>
                <strong>Questions Answered:</strong>{" "}
                {clientSampleData.questionsAndAnswers.length}
              </p>
            </div>
            <div className="border rounded-lg overflow-hidden">
              <iframe
                srcDoc={clientEmailHtml}
                className="w-full h-[800px] border-0"
                title="Client Thank You Email Preview"
              />
            </div>
          </div>

          {/* Candidate Survey Email */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-4 text-green-600">
              Candidate Survey Thank You Email
            </h2>
            <div className="text-sm text-gray-600 mb-4">
              <p>
                <strong>Recipient:</strong> {candidateSampleData.name}
              </p>
              <p>
                <strong>Survey Type:</strong> {candidateSampleData.surveyType}
              </p>
              <p>
                <strong>CSAT Score:</strong> {candidateSampleData.totalScore}
              </p>
              <p>
                <strong>Questions Answered:</strong>{" "}
                {candidateSampleData.questionsAndAnswers.length}
              </p>
            </div>
            <div className="border rounded-lg overflow-hidden">
              <iframe
                srcDoc={candidateEmailHtml}
                className="w-full h-[800px] border-0"
                title="Candidate Thank You Email Preview"
              />
            </div>
          </div>
        </div>

        {/* Sample Data Display */}
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold mb-4">
            Sample Questions & Answers Data
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h4 className="text-lg font-medium mb-2 text-blue-600">
                Client Survey Sample
              </h4>
              <pre className="bg-gray-100 p-4 rounded text-xs overflow-auto max-h-96">
                {JSON.stringify(clientSampleData, null, 2)}
              </pre>
            </div>
            <div>
              <h4 className="text-lg font-medium mb-2 text-green-600">
                Candidate Survey Sample
              </h4>
              <pre className="bg-gray-100 p-4 rounded text-xs overflow-auto max-h-96">
                {JSON.stringify(candidateSampleData, null, 2)}
              </pre>
            </div>
          </div>
        </div>

        {/* Features Highlight */}
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold mb-4">
            Email Features Demonstrated
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-800">Subquestion Support</h4>
              <p className="text-sm text-blue-600">
                Shows how subquestions are displayed with indentation and arrow
                indicators
              </p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-medium text-green-800">CSAT Score Display</h4>
              <p className="text-sm text-green-600">
                Displays the calculated satisfaction score prominently
              </p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <h4 className="font-medium text-purple-800">Visual Hierarchy</h4>
              <p className="text-sm text-purple-600">
                Different styling for main questions vs subquestions
              </p>
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg">
              <h4 className="font-medium text-yellow-800">
                Question Numbering
              </h4>
              <p className="text-sm text-yellow-600">
                Sequential numbering for main questions, arrows for subquestions
              </p>
            </div>
            <div className="p-4 bg-red-50 rounded-lg">
              <h4 className="font-medium text-red-800">Answer Formatting</h4>
              <p className="text-sm text-red-600">
                Clear distinction between questions and answers with proper
                styling
              </p>
            </div>
            <div className="p-4 bg-indigo-50 rounded-lg">
              <h4 className="font-medium text-indigo-800">Responsive Design</h4>
              <p className="text-sm text-indigo-600">
                Works across different email clients and screen sizes
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
