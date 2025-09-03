import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/auth";
import { client_questions } from "@/lib/questions";

// Function to calculate CSAT score for a single answer
function calculateAnswerScore(questionId: string, answer: string): number {
  const question = client_questions.find(
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

// POST /api/clients/[id]/submit-survey - Submit survey answers and mark as completed
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { answers } = body;

    if (!answers || typeof answers !== "object") {
      return NextResponse.json(
        { success: false, error: "Survey answers are required" },
        { status: 400 }
      );
    }

    // Check if client exists and hasn't completed survey
    const client = await prisma.client.findUnique({
      where: { id },
      select: {
        id: true,
        surveyCompleted: true,
      },
    });

    if (!client) {
      return NextResponse.json(
        { success: false, error: "Client not found" },
        { status: 404 }
      );
    }

    if (client.surveyCompleted) {
      return NextResponse.json(
        { success: false, error: "Survey already completed" },
        { status: 400 }
      );
    }

    // Use a transaction to ensure data consistency
    const result = await prisma.$transaction(async (tx) => {
      // Save all survey answers with calculated scores
      const surveyAnswers = [];
      let totalScore = 0;

      for (const [questionId, answer] of Object.entries(answers)) {
        if (answer && answer !== "") {
          // Convert answer to string for score calculation
          const answerString =
            typeof answer === "string" ? answer : JSON.stringify(answer);

          // Calculate score for this answer
          const answerScore = calculateAnswerScore(questionId, answerString);
          totalScore += answerScore;

          const surveyAnswer = await tx.clientSurveyAnswer.create({
            data: {
              clientId: id,
              questionId: questionId,
              answer: answerString,
              answer_score: answerScore,
            },
          });
          surveyAnswers.push(surveyAnswer);
        }
      }

      // Update client as completed with calculated score
      const updatedClient = await tx.client.update({
        where: { id },
        data: {
          surveyCompleted: true,
          surveyCompletedAt: new Date(),
          score: totalScore,
        },
      });

      return {
        surveyAnswers,
        client: updatedClient,
        totalScore,
      };
    });

    return NextResponse.json({
      success: true,
      data: result,
      message: `Survey submitted successfully with CSAT score: ${result.totalScore.toFixed(3)}`,
    });
  } catch (error) {
    console.error("Error submitting survey:", error);
    return NextResponse.json(
      { success: false, error: "Failed to submit survey" },
      { status: 500 }
    );
  }
}
