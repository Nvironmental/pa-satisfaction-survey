import React from "react";
import { Document, Page, Text, View } from "@react-pdf/renderer";
import { client_questions } from "@/lib/questions";

interface Client {
  id: string;
  clientName: string;
  representativeName: string;
  representativeEmail: string;
  surveyCompletedAt: Date | null;
  surveyAnswers: Array<{
    id: string;
    questionId: string;
    answer: string;
    answeredAt: Date;
  }>;
}

interface PdfDocumentProps {
  client: Client;
}

export const ClientSurveyPdfDocument: React.FC<PdfDocumentProps> = ({
  client,
}) => {
  // Helper function to get question by ID
  const getQuestionById = (questionId: string) => {
    const id = questionId.replace("question_", "");
    if (id.includes(".")) {
      const [parentId, subId] = id.split(".");
      const parentQuestion = client_questions.find(
        (q) => q.id === parseInt(parentId)
      );
      return parentQuestion?.subQuestion || null;
    }
    return client_questions.find((q) => q.id === parseInt(id)) || null;
  };

  // Helper function to get answer for a question
  const getAnswerForQuestion = (questionId: string) => {
    const answer = client.surveyAnswers.find(
      (a) => a.questionId === questionId
    );
    return answer ? answer.answer : "";
  };

  // Process questions in order
  const sortedQuestionIds = Array.from(
    new Set(client.surveyAnswers.map((a) => a.questionId))
  ).sort((a, b) => {
    const aId = a.replace("question_", "");
    const bId = b.replace("question_", "");
    const aParts = aId.split(".").map(Number);
    const bParts = bId.split(".").map(Number);
    if (aParts[0] !== bParts[0]) {
      return aParts[0] - bParts[0];
    }
    return (aParts[1] || 0) - (bParts[1] || 0);
  });

  return (
    <Document>
      <Page size="A4" style={{ padding: 50 }}>
        {/* Cover Page */}
        <View style={{ marginBottom: 30 }}>
          <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>
            PeopleAsset
          </Text>
          <Text style={{ fontSize: 16, color: "#666", marginBottom: 30 }}>
            Client Satisfaction Survey Report
          </Text>

          <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 20 }}>
            Survey Report
          </Text>

          <Text style={{ fontSize: 16, fontWeight: "bold", marginBottom: 15 }}>
            Client Details:
          </Text>

          <View style={{ marginLeft: 20 }}>
            <Text style={{ fontSize: 12, marginBottom: 8 }}>
              <Text style={{ fontWeight: "bold" }}>Client Name:</Text>{" "}
              {client.clientName}
            </Text>
            <Text style={{ fontSize: 12, marginBottom: 8 }}>
              <Text style={{ fontWeight: "bold" }}>Representative Name:</Text>{" "}
              {client.representativeName}
            </Text>
            <Text style={{ fontSize: 12, marginBottom: 8 }}>
              <Text style={{ fontWeight: "bold" }}>Representative Email:</Text>{" "}
              {client.representativeEmail}
            </Text>
            <Text style={{ fontSize: 12, marginBottom: 8 }}>
              <Text style={{ fontWeight: "bold" }}>Survey Completed:</Text>{" "}
              {client.surveyCompletedAt?.toLocaleDateString() || "N/A"}
            </Text>
          </View>
        </View>

        <Text
          style={{
            fontSize: 10,
            color: "#666",
            position: "absolute",
            bottom: 30,
            left: 50,
          }}
        >
          Generated on {new Date().toLocaleDateString()}
        </Text>
      </Page>

      {/* Questions Page */}
      <Page size="A4" style={{ padding: 50 }}>
        <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 30 }}>
          Survey Questions & Responses
        </Text>

        {sortedQuestionIds.map((questionId) => {
          const question = getQuestionById(questionId);
          const answer = getAnswerForQuestion(questionId);

          if (!question) return null;

          const questionNumber = questionId.replace("question_", "");

          return (
            <View key={questionId} style={{ marginBottom: 30 }}>
              <Text
                style={{ fontSize: 14, fontWeight: "bold", marginBottom: 10 }}
              >
                Question {questionNumber}:
              </Text>
              <Text style={{ fontSize: 12, marginBottom: 10, lineHeight: 1.5 }}>
                {question.question}
              </Text>
              <Text style={{ fontSize: 11, color: "#666", marginBottom: 5 }}>
                Answer:
              </Text>
              <Text style={{ fontSize: 11, marginLeft: 20, lineHeight: 1.4 }}>
                {answer || "No answer provided"}
              </Text>
            </View>
          );
        })}
      </Page>
    </Document>
  );
};
