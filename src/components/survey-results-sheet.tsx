"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { client_questions } from "@/lib/questions";
import { IconLoader2 } from "@tabler/icons-react";
import { ArrowRightIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { Skeleton } from "./ui/skeleton";

interface SurveyAnswer {
  id: string;
  clientId: string;
  questionId: string;
  answer: string;
  answer_score: number;
  answeredAt: string;
}

interface SurveyResultsSheetProps {
  clientId: string;
  clientName: string;
  children: React.ReactNode;
}

const SurveyResultsSheet = ({
  clientId,
  clientName,
  children,
}: SurveyResultsSheetProps) => {
  const [answers, setAnswers] = useState<SurveyAnswer[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const fetchSurveyAnswers = async () => {
    if (!isOpen) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/clients/${clientId}/survey-answers`);
      if (response.ok) {
        const data = await response.json();
        setAnswers(data.data || []);
      }
    } catch (error) {
      console.error("Error fetching survey answers:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchSurveyAnswers();
    }
  }, [isOpen, clientId]);

  const getQuestionById = (questionId: string) => {
    // Remove 'question_' prefix and convert to number
    const id = questionId.replace("question_", "");

    // Handle sub-questions (e.g., "2.1")
    if (id.includes(".")) {
      const [parentId, subId] = id.split(".");
      const parentQuestion = client_questions.find(
        (q) => q.id === parseInt(parentId)
      );
      return parentQuestion?.subQuestion || null;
    }

    // Handle main questions
    return client_questions.find((q) => q.id === parseInt(id)) || null;
  };

  const formatAnswer = (questionId: string, answer: string) => {
    try {
      // Try to parse JSON answers (for complex data)
      const parsed = JSON.parse(answer);
      return typeof parsed === "string" ? parsed : answer;
    } catch {
      // If not JSON, return as is
      return answer;
    }
  };

  const score = (
    answers.reduce((acc, answer) => acc + (answer.answer_score || 0), 0) * 100
  ).toFixed(0);

  const badgeClasses = {
    low: "bg-pa-cardinal-red text-white font-bold",
    medium: "bg-amber-600 text-white font-bold",
    high: "bg-pa-imperial-indigo text-white font-bold",
    perfect: "bg-pa-carmine-rush text-white font-bold",
  };

  // https://www.marcomrobot.com/blog/what-is-a-good-csat-score

  const badgeClass =
    parseInt(score) < 40
      ? badgeClasses.low
      : parseInt(score) > 40 && parseInt(score) < 60
        ? badgeClasses.medium
        : parseInt(score) > 60 && parseInt(score) < 80
          ? badgeClasses.high
          : badgeClasses.perfect;

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="overflow-y-auto font-sans !max-w-[800px] p-12">
        <SheetHeader>
          <SheetTitle className="text-2xl font-light flex items-center gap-1.5 ">
            <span>Showing survey responses for </span>
            <span className="flex items-center gap-2 ">
              <span className="font-bold">{clientName}</span>
              <span className={`p-1 rounded-md ${badgeClass}`}>
                {" "}
                {answers.length > 0 ? (
                  `${score}%`
                ) : (
                  <IconLoader2 className="w-4 h-4 animate-spin" />
                )}
              </span>
            </span>
          </SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-8">
              <Skeleton className="w-full h-[136px] mb-8" />
              <Skeleton className="w-full h-[136px] mb-8" />
              <Skeleton className="w-full h-[136px] mb-8" />
              <Skeleton className="w-full h-[136px] mb-8" />
              <Skeleton className="w-full h-[136px] mb-8" />
              <Skeleton className="w-full h-[136px] mb-8" />
              <Skeleton className="w-full h-[136px] mb-8" />
              <Skeleton className="w-full h-[136px]" />
            </div>
          ) : answers.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No survey answers found
            </div>
          ) : (
            answers.map((answer) => {
              const question = getQuestionById(answer.questionId);
              if (!question) return null;

              return (
                <div
                  key={answer.id}
                  className={`border rounded-md p-4 bg-gray-50 ${
                    answer.questionId.includes(".") ? "ml-8" : ""
                  }`}
                >
                  <div className="mb-3">
                    <div className="flex items-start gap-2">
                      <span className="flex items-center gap-1">
                        <span className="font-sans text-sm font-medium">
                          {question.id}
                        </span>
                        <ArrowRightIcon className="w-4 h-4" />
                      </span>

                      <h2 className="font-sans text-sm mb-4 relative">
                        <span>{question.question}</span>
                      </h2>
                    </div>
                    {/* <h3 className=" text-gray-700 text-base">
                      {question.question}
                    </h3> */}
                  </div>
                  <div className="bg-white border rounded-md p-4">
                    <p className="text-gray-900 text-sm font-bold">
                      {formatAnswer(answer.questionId, answer.answer)}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default SurveyResultsSheet;
