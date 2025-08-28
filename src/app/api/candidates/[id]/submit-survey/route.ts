import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/auth";

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
      // Save all survey answers
      const surveyAnswers = await Promise.all(
        answers.map((answer) =>
          tx.candidateSurveyAnswer.create({
            data: {
              candidateId: id,
              questionId: answer.questionId,
              answer: answer.answer,
            },
          })
        )
      );

      // Update candidate survey completion status
      const updatedCandidate = await tx.candidate.update({
        where: { id },
        data: {
          surveyCompleted: true,
          surveyCompletedAt: new Date(),
        },
      });

      return { surveyAnswers, updatedCandidate };
    });

    return NextResponse.json({
      message: "Survey submitted successfully",
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
