"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { candidate_questions } from "@/lib/questions";
import { SurveyQuestion } from "@/lib/types";

interface SurveyState {
  [key: string]: string;
}

interface CandidateSurveyContextType {
  // State
  answers: SurveyState;
  currentQuestionIndex: number;
  processedQuestions: QuestionWithSubQuestion[];

  // Actions
  setAnswer: (questionId: number, answer: string) => void;
  setCurrentQuestionIndex: (index: number) => void;
  goToNext: () => void;
  goToPrevious: () => void;

  // Computed values
  canProceed: boolean;
  isFirstQuestion: boolean;
  isLastQuestion: boolean;
  shouldShowSubQuestion: (questionId: number) => boolean;
  getCurrentQuestionGroup: () => QuestionWithSubQuestion;
}

interface QuestionWithSubQuestion {
  mainQuestion: SurveyQuestion;
  subQuestion?: SurveyQuestion;
}

const CandidateSurveyContext = createContext<
  CandidateSurveyContextType | undefined
>(undefined);

export const useCandidateSurvey = () => {
  const context = useContext(CandidateSurveyContext);
  if (!context) {
    throw new Error(
      "useCandidateSurvey must be used within a CandidateSurveyProvider"
    );
  }
  return context;
};

interface CandidateSurveyProviderProps {
  children: ReactNode;
}

export const CandidateSurveyProvider: React.FC<
  CandidateSurveyProviderProps
> = ({ children }) => {
  const [answers, setAnswers] = useState<SurveyState>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // Process questions to group main questions with their sub-questions
  const processedQuestions: QuestionWithSubQuestion[] = React.useMemo(() => {
    const processed: QuestionWithSubQuestion[] = [];

    candidate_questions.forEach((question) => {
      if (
        (question as SurveyQuestion & { isSubQuestion?: boolean }).isSubQuestion
      )
        return;

      // Find standalone sub-questions
      let standaloneSubQuestion: SurveyQuestion | undefined;
      if (question.id === 2) {
        standaloneSubQuestion = candidate_questions.find(
          (q) => q.id === 2.1
        ) as SurveyQuestion | undefined;
      }

      processed.push({
        mainQuestion: question as SurveyQuestion,
        subQuestion:
          (question.subQuestion as SurveyQuestion | undefined) ||
          standaloneSubQuestion,
      });
    });

    return processed;
  }, []);

  const currentQuestionGroup = processedQuestions[currentQuestionIndex];
  const isFirstQuestion = currentQuestionIndex === 0;
  const isLastQuestion = currentQuestionIndex === processedQuestions.length - 1;

  const setAnswer = (questionId: number, answer: string) => {
    setAnswers((prev) => ({
      ...prev,
      [`question_${questionId}`]: answer,
    }));
  };

  const shouldShowSubQuestion = (questionId: number): boolean => {
    const question = processedQuestions.find(
      (q) => q.mainQuestion.id === questionId
    );
    if (!question?.subQuestion) return false;

    const parentAnswer = answers[`question_${questionId}`];
    return parentAnswer === question.subQuestion.parentValue;
  };

  const canProceed = (): boolean => {
    const currentQuestion = currentQuestionGroup.mainQuestion;
    const currentAnswer = answers[`question_${currentQuestion.id}`];

    if (!currentAnswer) return false;

    // If there's a sub-question and it should be shown, check if it's answered
    if (
      shouldShowSubQuestion(currentQuestion.id) &&
      currentQuestionGroup.subQuestion
    ) {
      const subAnswer =
        answers[`question_${currentQuestionGroup.subQuestion.id}`];
      return !!subAnswer;
    }

    return true;
  };

  const goToNext = () => {
    if (!isLastQuestion && canProceed()) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const goToPrevious = () => {
    if (!isFirstQuestion) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const getCurrentQuestionGroup = () => currentQuestionGroup;

  const value: CandidateSurveyContextType = {
    answers,
    currentQuestionIndex,
    processedQuestions,
    setAnswer,
    setCurrentQuestionIndex,
    goToNext,
    goToPrevious,
    canProceed: canProceed(),
    isFirstQuestion,
    isLastQuestion,
    shouldShowSubQuestion,
    getCurrentQuestionGroup,
  };

  return (
    <CandidateSurveyContext.Provider value={value}>
      {children}
    </CandidateSurveyContext.Provider>
  );
};
