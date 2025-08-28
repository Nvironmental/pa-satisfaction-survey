import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/auth";

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
      // Save all survey answers
      const surveyAnswers = [];
      for (const [questionId, answer] of Object.entries(answers)) {
        if (answer && answer !== "") {
          const surveyAnswer = await tx.clientSurveyAnswer.create({
            data: {
              clientId: id,
              questionId: questionId,
              answer:
                typeof answer === "string" ? answer : JSON.stringify(answer),
            },
          });
          surveyAnswers.push(surveyAnswer);
        }
      }

      // Update client as completed
      const updatedClient = await tx.client.update({
        where: { id },
        data: {
          surveyCompleted: true,
          surveyCompletedAt: new Date(),
        },
      });

      return {
        surveyAnswers,
        client: updatedClient,
      };
    });

    return NextResponse.json({
      success: true,
      data: result,
      message: "Survey submitted successfully",
    });
  } catch (error) {
    console.error("Error submitting survey:", error);
    return NextResponse.json(
      { success: false, error: "Failed to submit survey" },
      { status: 500 }
    );
  }
}
