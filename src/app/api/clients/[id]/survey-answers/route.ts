import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/auth";

// GET /api/clients/[id]/survey-answers - Get survey answers for a client
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check if client exists
    const client = await prisma.client.findUnique({
      where: { id },
      select: {
        id: true,
        clientName: true,
        surveyCompleted: true,
      },
    });

    if (!client) {
      return NextResponse.json(
        { success: false, error: "Client not found" },
        { status: 404 }
      );
    }

    // Get all survey answers for this client
    const surveyAnswers = await prisma.clientSurveyAnswer.findMany({
      where: { clientId: id },
      orderBy: { answeredAt: "asc" },
      select: {
        id: true,
        clientId: true,
        questionId: true,
        answer: true,
        answeredAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: surveyAnswers,
    });
  } catch (error) {
    console.error("Error fetching survey answers:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch survey answers" },
      { status: 500 }
    );
  }
}
