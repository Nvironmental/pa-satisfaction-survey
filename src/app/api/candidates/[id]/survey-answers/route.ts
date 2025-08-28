import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check if candidate exists
    const candidate = await prisma.candidate.findUnique({
      where: { id },
      select: { id: true, candidateName: true, surveyCompleted: true },
    });

    if (!candidate) {
      return NextResponse.json(
        { error: "Candidate not found" },
        { status: 404 }
      );
    }

    if (!candidate.surveyCompleted) {
      return NextResponse.json(
        { error: "Survey not completed yet" },
        { status: 400 }
      );
    }

    // Fetch survey answers
    const surveyAnswers = await prisma.candidateSurveyAnswer.findMany({
      where: { candidateId: id },
      orderBy: { answeredAt: "asc" },
    });

    return NextResponse.json({
      data: {
        candidate,
        surveyAnswers,
      },
    });
  } catch (error) {
    console.error("Error fetching candidate survey answers:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
