"use client";

import { PaBarChart } from "./PaBarChart";
import { SurveyQuestion } from "@/lib/types";

// Sample questions for demonstration
const sampleClientQuestion: SurveyQuestion = {
  id: 1,
  question: "How satisfied are you with our service quality?",
  type: "radio",
  options: [
    "Very Satisfied",
    "Satisfied",
    "Neutral",
    "Dissatisfied",
    "Very Dissatisfied",
  ],
  placeholder: "",
};

const sampleCandidateQuestion: SurveyQuestion = {
  id: 2,
  question: "How would you rate the communication during the hiring process?",
  type: "radio",
  options: ["Excellent", "Good", "Average", "Poor", "Very Poor"],
  placeholder: "",
};

export function PaBarChartDemo() {
  return (
    <div className="space-y-6 px-5 mt-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Client Survey Chart */}
        <PaBarChart
          question={sampleClientQuestion}
          type="client"
          title="Client Service Satisfaction"
          description="Distribution of client satisfaction ratings"
        />

        {/* Candidate Survey Chart */}
        <PaBarChart
          question={sampleCandidateQuestion}
          type="candidate"
          title="Candidate Communication Rating"
          description="Distribution of communication quality ratings"
        />
      </div>

      <div className="text-sm text-muted-foreground">
        <p>
          <strong>Note:</strong> These charts will display real data once
          surveys are completed. The charts automatically fetch response counts
          from the database and update in real-time.
        </p>
      </div>
    </div>
  );
}
