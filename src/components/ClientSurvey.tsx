"use client";

import { useState, useEffect } from "react";
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

  // Handle keyboard events
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();

        // Check if current question is answered
        const mainQuestionField = `question_${currentQuestion.id}`;
        const mainAnswer = answers[mainQuestionField];

        let canProceedToNext = false;

        // Check if main question is answered
        if (mainAnswer && mainAnswer.trim() !== "") {
          // If there's a sub-question and it should be shown, check if it's answered
          if (shouldShowSub && currentQuestionGroup.subQuestion) {
            const subQuestionField = `question_${currentQuestionGroup.subQuestion.id}`;
            const subAnswer = answers[subQuestionField];
            canProceedToNext = Boolean(subAnswer && subAnswer.trim() !== "");
          } else {
            canProceedToNext = true;
          }
        }

        if (canProceedToNext) {
          if (isLastQuestion) {
            onSubmit();
          } else {
            goToNext();
          }
        } else {
          // Show a toast to indicate the question needs to be answered
          toast.error("Please answer the current question before proceeding");
        }
      } else if (event.key === "Escape") {
        event.preventDefault();

        // Go to previous question if not on the first question
        if (!isFirstQuestion) {
          goToPrevious();
        } else {
          // Show a toast to indicate we're already on the first question
          toast.info("You're already on the first question");
        }
      }
    };

    // Add event listener
    document.addEventListener("keydown", handleKeyPress);

    // Cleanup
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [
    answers,
    currentQuestion.id,
    shouldShowSub,
    currentQuestionGroup.subQuestion,
    isLastQuestion,
    isFirstQuestion,
    onSubmit,
    goToNext,
    goToPrevious,
  ]);

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
                <div className="focus-within:opacity-100 focus-within:border-pa-carmine-rush has-data-[state=checked]:opacity-100 opacity-50 border-pa-sterling-mist/20 has-data-[state=checked]:border-pa-carmine-rush relative flex w-full items-center flux gap-2 rounded-md border p-4 shadow-xs outline-none">
                  <RadioGroupItem
                    tabIndex={0}
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

      <div className="h-[calc(100dvh-190px)] md:h-[calc(100dvh-320px)] pb-2 pr-8 w-full overflow-y-auto pa-scrollbar relative">
        {/* Main Question */}

        <div>
          <div className="flex items-start gap-2 sticky top-0 bg-pa-midnight-regent z-10 py-2">
            <span className="flex items-center gap-1">
              <span className="font-sans md:text-lg text-base font-medium">
                {currentQuestion.id}
              </span>
              <ArrowRightIcon className="w-4 h-4" />
            </span>

            <h2 className="font-sans md:text-lg text-base font-medium mb-4 relative">
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
