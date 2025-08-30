"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ClientSurveyProvider, useClientSurvey } from "./ClientSurveyProvider";
import { SurveyQuestion } from "@/lib/types";
import { FormItem } from "@/components/ui/form";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import { toast } from "sonner";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ChevronLeft,
  Loader2,
} from "lucide-react";

interface SurveyFormProps {
  clientId: string;
}

const SurveyForm = ({ clientId }: SurveyFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    answers,
    currentQuestionIndex,
    processedQuestions,
    setAnswer,
    goToNext,
    goToPrevious,
    canProceed,
    isFirstQuestion,
    isLastQuestion,
    shouldShowSubQuestion,
    getCurrentQuestionGroup,
  } = useClientSurvey();

  const currentQuestionGroup = getCurrentQuestionGroup();
  const currentQuestion = currentQuestionGroup.mainQuestion;
  const shouldShowSub = shouldShowSubQuestion(currentQuestion.id);

  const onSubmit = async () => {
    if (isSubmitting) return; // Prevent multiple submissions

    setIsSubmitting(true);
    try {
      console.log("Submitting survey for client:", clientId);
      console.log("Survey answers:", answers);

      const response = await fetch(`/api/clients/${clientId}/submit-survey`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ answers }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to submit survey");
      }

      const result = await response.json();
      console.log("Survey submitted successfully:", result);

      // Redirect to thank you page
      window.location.href = "/client-satisfaction-survey/thank-you";
    } catch (error) {
      console.error("Error submitting survey:", error);
      toast.error(
        `Failed to submit survey: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderQuestion = (question: SurveyQuestion, questionId: number) => {
    const fieldName = `question_${questionId}`;
    const currentValue = answers[fieldName] || "";

    switch (question.type) {
      case "radio":
        return (
          <RadioGroup
            onValueChange={(value) => {
              setAnswer(questionId, value);

              // Only clear sub-question if this is a main question (not a sub-question itself)
              if (
                questionId === currentQuestion.id && // This is the main question
                currentQuestionGroup.subQuestion &&
                value !== currentQuestionGroup.subQuestion.parentValue
              ) {
                setAnswer(currentQuestionGroup.subQuestion.id, "");
              }
            }}
            value={currentValue}
            className="flex flex-col mt-4"
          >
            {question.options?.map((option: string) => (
              <FormItem
                key={option}
                className="flex font-sans items-center gap-3"
              >
                <div className="has-data-[state=checked]:opacity-100 opacity-50 border-pa-sterling-mist/20 has-data-[state=checked]:border-pa-carmine-rush relative flex w-full items-center flux gap-2 rounded-md border p-4 shadow-xs outline-none">
                  <RadioGroupItem
                    value={option}
                    id={`${fieldName}_${option
                      .replace(/\s+/g, "-")
                      .toLowerCase()}`}
                    aria-describedby={`${fieldName}_${option
                      .replace(/\s+/g, "-")
                      .toLowerCase()}-description`}
                    className="order-1 after:absolute after:inset-0"
                  />
                  <div className="grid grow gap-2">
                    <Label
                      htmlFor={`${fieldName}_${option
                        .replace(/\s+/g, "-")
                        .toLowerCase()}`}
                      className="leading-snug"
                    >
                      {option}
                    </Label>
                  </div>
                </div>
              </FormItem>
            ))}
          </RadioGroup>
        );

      case "input":
        return (
          <Input
            placeholder={question.placeholder}
            value={currentValue}
            onChange={(e) => setAnswer(questionId, e.target.value)}
            className="mt-4 placeholder:text-pa-sterling-mist/50 placeholder:text-xs placeholder:md:text-sm"
          />
        );

      case "text":
        return (
          <Textarea
            placeholder={question.placeholder}
            value={currentValue}
            onChange={(e) => setAnswer(questionId, e.target.value)}
            className="mt-4 font-sans placeholder:text-pa-sterling-mist/50 placeholder:text-xs placeholder:md:text-sm min-h-[200px]"
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-8 w-full md:w-[600px] relative">
      {/* Progress indicator */}
      <div className="w-full bg-pa-noble-black rounded-full h-1 fixed top-0 left-0">
        <div
          className="bg-pa-royal-azure h-1 rounded-full transition-all duration-300"
          style={{
            width: `${
              ((currentQuestionIndex + 1) / processedQuestions.length) * 100
            }%`,
          }}
        />
      </div>

      {/* Question counter
    //   <div className="text-sm font-sans text-gray-600 text-center">
    //     Question {currentQuestionIndex + 1} of {processedQuestions.length}
    //   </div> */}

      <div className="h-[calc(100dvh-190px)] md:h-[calc(100dvh-320px)] pb-2 pr-8 w-full overflow-y-auto pa-scrollbar">
        {/* Main Question */}

        <div>
          <div className="flex items-start gap-2">
            <span className="flex items-center gap-1">
              <span className="font-sans text-lg font-medium">
                {currentQuestion.id}
              </span>
              <ArrowRightIcon className="w-4 h-4" />
            </span>

            <h2 className="font-sans text-lg font-medium mb-4 relative">
              <span>{currentQuestion.question}</span>
            </h2>
          </div>

          {renderQuestion(currentQuestion, currentQuestion.id)}
        </div>

        {/* Sub Question (if applicable) */}
        {shouldShowSub && currentQuestionGroup.subQuestion && (
          <div className="mt-9">
            {currentQuestionGroup.subQuestion.type !== "input" && (
              <h3 className="font-sans text-base font-medium mb-4">
                {currentQuestionGroup.subQuestion.question}
              </h3>
            )}
            {renderQuestion(
              currentQuestionGroup.subQuestion,
              currentQuestionGroup.subQuestion.id
            )}
          </div>
        )}
      </div>

      {/* Navigation buttons */}
      <div className="fixed bottom-0 flex justify-center items-center left-0 w-full  ">
        <div className="flex justify-end gap-2 font-sans w-full md:w-[600px] border-t border-pa-sterling-mist/10  py-8 px-8 md:px-0">
          <Button
            type="button"
            variant="outline"
            className="opacity-40 hover:opacity-100"
            onClick={goToPrevious}
            disabled={isFirstQuestion}
          >
            <ChevronLeft className="w-4 h-4 text-pa-noble-black" />
          </Button>

          {isLastQuestion ? (
            <Button
              type="button"
              onClick={onSubmit}
              disabled={!canProceed || isSubmitting}
              className="bg-pa-carmine-rush text-white"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Survey"
              )}
            </Button>
          ) : (
            <Button
              className="bg-pa-carmine-rush text-white"
              type="button"
              onClick={goToNext}
              disabled={!canProceed}
            >
              Next
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

interface ClientSurveyProps {
  clientId: string;
}

const ClientSurvey = ({ clientId }: ClientSurveyProps) => {
  return (
    <ClientSurveyProvider>
      <SurveyForm clientId={clientId} />
    </ClientSurveyProvider>
  );
};

export default ClientSurvey;
