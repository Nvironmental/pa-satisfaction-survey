import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/auth";
import { candidate_questions } from "@/lib/questions";

// Function to calculate CSAT score for a single candidate answer
function calculateCandidateAnswerScore(
  questionId: string,
  answer: string
): number {
  const question = candidate_questions.find(
    (q) => "question_" + q.id.toString() === questionId
  );

  // Skip if question doesn't exist or doesn't have weight
  if (!question || !question.weight) {
    return 0;
  }

  // Skip if no score_qualifiers defined
  if (!question.score_qualifiers || question.score_qualifiers.length === 0) {
    return 0;
  }

  // Check if answer matches any score_qualifier
  const isQualified = question.score_qualifiers.includes(answer);

  // Return 1 * weight if qualified, 0 if not
  return isQualified ? 1 * question.weight : 0;
}

interface SubmitSurveyRequest {
  answers: Array<{
    questionId: string;
    answer: string;
  }>;
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { answers }: SubmitSurveyRequest = await request.json();

    if (!answers || !Array.isArray(answers) || answers.length === 0) {
      return NextResponse.json(
        { error: "Answers are required and must be an array" },
        { status: 400 }
      );
    }

    // Check if candidate exists
    const candidate = await prisma.candidate.findUnique({
      where: { id },
      select: { id: true, surveyCompleted: true },
    });

    if (!candidate) {
      return NextResponse.json(
        { error: "Candidate not found" },
        { status: 404 }
      );
    }

    if (candidate.surveyCompleted) {
      return NextResponse.json(
        { error: "Survey already completed" },
        { status: 400 }
      );
    }

    // Use a transaction to ensure data consistency
    const result = await prisma.$transaction(async (tx) => {
      // Save all survey answers with calculated scores
      let totalScore = 0;

      const surveyAnswers = await Promise.all(
        answers.map(async (answer) => {
          // Calculate score for this answer
          const answerScore = calculateCandidateAnswerScore(
            answer.questionId,
            answer.answer
          );
          totalScore += answerScore;

          return tx.candidateSurveyAnswer.create({
            data: {
              candidateId: id,
              questionId: answer.questionId,
              answer: answer.answer,
              answer_score: answerScore,
            },
          });
        })
      );

      // Update candidate survey completion status with calculated score
      const updatedCandidate = await tx.candidate.update({
        where: { id },
        data: {
          surveyCompleted: true,
          surveyCompletedAt: new Date(),
          score: totalScore,
        },
      });

      return { surveyAnswers, updatedCandidate, totalScore };
    });

    return NextResponse.json({
      message: `Survey submitted successfully with CSAT score: ${result.totalScore.toFixed(3)}`,
      data: result,
    });
  } catch (error) {
    console.error("Error submitting candidate survey:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
