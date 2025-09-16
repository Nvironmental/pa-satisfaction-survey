"use client";

import { client_questions, candidate_questions } from "@/lib/questions";
import Logo from "./Logo";
import { useEffect, useState } from "react";
import Image from "next/image";
import { ArrowRightIcon } from "lucide-react";

interface SurveyAnswer {
  questionId: string;
  answer: string;
}

interface PdfPreviewProps {
  type: "client" | "candidate";
  name: string;
  representativeName?: string;
  representativeEmail?: string;
  surveyCompletedAt: Date | null;
  surveyAnswers: SurveyAnswer[];
}

export function PdfPreview({
  type,
  name,
  representativeName,
  representativeEmail,
  surveyCompletedAt,
  surveyAnswers,
}: PdfPreviewProps) {
  const [isPuppeteer, setIsPuppeteer] = useState(false);

  useEffect(() => {
    // Detect if accessed by Puppeteer
    const userAgent = navigator.userAgent;
    setIsPuppeteer(
      userAgent.includes("HeadlessChrome") || userAgent.includes("Puppeteer")
    );
  }, []);

  // Helper function to get question by ID
  const getQuestionById = (questionId: string) => {
    const questions =
      type === "client" ? client_questions : candidate_questions;
    const id = questionId.replace("question_", "");

    if (id.includes(".")) {
      const [parentId, subId] = id.split(".");
      const parentQuestion = questions.find((q) => q.id === parseInt(parentId));
      return parentQuestion?.subQuestion || null;
    }

    return questions.find((q) => q.id === parseInt(id)) || null;
  };

  // Helper function to get answer for a question
  const getAnswerForQuestion = (questionId: string) => {
    const answer = surveyAnswers.find((a) => a.questionId === questionId);
    return answer ? answer.answer : "";
  };

  // Process questions in order
  const sortedQuestionIds = Array.from(
    new Set(surveyAnswers.map((a) => a.questionId))
  ).sort((a: string, b: string) => {
    const aId = a.replace("question_", "");
    const bId = b.replace("question_", "");
    const aParts = aId.split(".").map(Number);
    const bParts = bId.split(".").map(Number);
    if (aParts[0] !== bParts[0]) {
      return aParts[0] - bParts[0];
    }
    return (aParts[1] || 0) - (bParts[1] || 0);
  });

  const questionsHtml = sortedQuestionIds.map((questionId: string) => {
    const question = getQuestionById(questionId);
    const answer = getAnswerForQuestion(questionId);

    if (!question) return null;

    const questionNumber = questionId.replace("question_", "");

    return (
      <div
        key={questionId}
        className="question-section mb-10 p-8 border border-gray-300 rounded-xl bg-gray-50"
      >
        {/* <p className="text-pa-dark-azure mb-5 text-base leading-tight">
          {question.question}
        </p> */}
        <div className="flex items-start gap-2">
          <span className="flex items-center gap-1">
            <span className="font-sans text-sm font-medium">
              {questionNumber}
            </span>
            <ArrowRightIcon className="w-4 h-4" />
          </span>

          <h2 className="font-sans text-sm mb-4 relative">
            <span>{question.question}</span>
          </h2>
        </div>

        <div className="bg-white border rounded-md p-4">
          <p className="text-gray-900 text-sm font-bold">
            {answer || "No answer provided"}
          </p>
        </div>

        {/* <p className="text-gray-500 mb-3 text-sm font-semibold uppercase tracking-wide">
          Answer:
        </p>
        <p className="text-pa-noble-black text-sm leading-normal bg-white p-5 rounded-lg border border-[#001640]">
          {answer || "No answer provided"}
        </p> */}
      </div>
    );
  });

  return (
    <div className="font-sans leading-relaxed text-pa-noble-black m-0 p-0 bg-white">
      <style
        dangerouslySetInnerHTML={{
          __html: `
          @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700&display=swap');
          
          .cover-page {
            page-break-after: always;
            margin: 0 !important;
            padding: 0 !important;
            width: 100vw;
            height: 100vh;
            box-sizing: border-box;
          }
          
          .questions-page {
            page-break-before: always;
          }
          
          .question-section {
            page-break-inside: avoid;
          }
          
          @media print {
            .pdf-preview { margin: 0; }
            .question-section { page-break-inside: avoid; }
            .cover-page { page-break-after: always; }
            .questions-page { page-break-before: always; }
          }
          
          /* Cover page - no margins, no header/footer */
          @page :first {
            margin: 0;
            @top-right { content: ""; }
            @bottom-left { content: ""; }
            @bottom-right { content: ""; }
          }
          
          /* Content pages - normal margins with header/footer */
          @page {
            margin: 15mm;
            @top-right {
              content: "PeopleAsset";
              font-family: 'Manrope', sans-serif;
              font-size: 10px;
              color: #001640;
            }
            @bottom-left {
              content: "ExecHunt (India) Pvt Ltd has the exclusive and legal rights for usage of PeopleAsset as its logo/trademark.";
              font-family: 'Manrope', sans-serif;
              font-size: 8px;
              color: #888;
            }
            @bottom-right {
              content: "Page " counter(page) " of " counter(pages);
              font-family: 'Manrope', sans-serif;
              font-size: 10px;
              color: #888;
            }
          }
        `,
        }}
      />

      {/* Cover Page */}
      <div className="cover-page min-h-screen flex flex-col gap-10 w-full h-screen">
        <div className="text-center">
          <div className="w-full h-full absolute overflow-hidden">
            <Image
              src="/banner.jpg"
              alt="PeopleAsset BG"
              fill
              className="w-full h-auto mx-auto block object-cover"
            />
          </div>
        </div>
        <div className="">
          <div className="relative overflow-hidden w-10/12 mx-auto">
            {/* <Image
              src="https://peopleasset.in/mail-assets/survey-header-2.png"
              alt="PeopleAsset Logo"
              fill
              className="w-full h-auto mx-auto mb-10 block object-cover rounded-md"
            /> */}
            <Logo className="w-[250px] h-auto text-white  mt-10 mb-20 block object-cover rounded-md" />
          </div>
        </div>

        <div className="relative z-50 w-10/12 mx-auto mb-10">
          <h2 className=" text-5xl text-white font-bold w-10/12">
            {type === "client" ? "Client" : "Candidate"} Satisfaction Survey
            Report
          </h2>
          <p className="text-white text-sm my-4 w-10/12">
            Thank you for taking the time to complete the{" "}
            {type === "client" ? "Client" : "Candidate"} Satisfaction Survey.
            This report confirms that your responses have been successfully
            recorded. We appreciate your valuable feedback, which will help us
            improve our services and better serve you in the future.
          </p>
        </div>

        <div className="bg-gray-100 p-6 rounded-md mb-10 w-10/12 mx-auto relative z-50 border">
          {/* <h3 className="mb-8 text-[#001640] text-3xl font-semibold">
            {type === "client" ? "Client" : "Candidate"} Details
          </h3> */}
          {/* <h2 className=" text-2xl text-pa-dark-azure font-bold mb-8">
            {type === "client" ? "Client" : "Candidate"} Satisfaction Survey
            Report
          </h2> */}

          <div className="flex mb-5 items-center">
            <span className="font-semibold w-48 text-pa-noble-black text-base">
              {type === "client" ? "Client" : "Candidate"} Name:
            </span>
            <span className="text-pa-noble-black text-base">{name}</span>
          </div>
          {representativeName && (
            <div className="flex mb-5 items-center">
              <span className="font-semibold w-48 text-pa-noble-black text-base">
                {type === "client" ? "Representative Name:" : "Email:"}
              </span>
              <span className="text-pa-noble-black text-base">
                {representativeName}
              </span>
            </div>
          )}
          {representativeEmail && type === "client" && (
            <div className="flex mb-5 items-center">
              <span className="font-semibold w-48 text-pa-noble-black text-base">
                Representative Email:
              </span>
              <span className="text-pa-noble-black text-base">
                {representativeEmail}
              </span>
            </div>
          )}
          {type === "candidate" && (
            <div className="flex mb-5 items-center">
              <span className="font-semibold w-48 text-pa-noble-black text-base">
                Mobile:
              </span>
              <span className="text-pa-noble-black text-base">
                {representativeEmail}
              </span>
            </div>
          )}
          <div className="flex  items-center">
            <span className="font-semibold w-48 text-pa-noble-black text-base">
              Survey Completed:
            </span>
            <span className="text-pa-noble-black text-base">
              {surveyCompletedAt
                ? surveyCompletedAt
                    .toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })
                    .replace(/ /g, " ")
                : "N/A"}
            </span>
          </div>
        </div>
      </div>

      {/* Questions Page */}
      <div className="questions-page px-4 py-10">
        <h2 className="text-[#001640] border-b-2 border-[#001640] pb-4 mb-10 text-3xl font-semibold">
          Survey Responses
        </h2>
        {questionsHtml}

        {/* <div className="mt-15 text-center text-pa-noble-black text-xs border-t border-gray-300 pt-5">
          <div className="float-left text-xs text-gray-500">
            ExecHunt (India) Pvt Ltd has the exclusive and legal rights for
            usage of PeopleAsset as its logo/trademark.
          </div>
          <div className="float-right text-xs text-gray-500">
            Generated on {new Date().toLocaleDateString()}
          </div>
        </div> */}
      </div>
    </div>
  );
}
