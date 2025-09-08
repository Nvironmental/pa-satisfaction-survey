import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/auth";
import { sendCandidateSurveyEmail } from "@/lib/email";

// POST /api/candidates/[id]/send-survey - Send survey email to candidate
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { surveyEmailSentBy, surveyEmailSentAt } = await request.json();

    // Check if candidate exists
    const candidate = await prisma.candidate.findUnique({
      where: { id },
      select: {
        id: true,
        candidateName: true,
        candidateEmail: true,
        surveyEmailSent: true,
        surveyCompleted: true,
      },
    });

    if (!candidate) {
      return NextResponse.json(
        { success: false, error: "Candidate not found" },
        { status: 404 }
      );
    }

    // Check if survey is already completed
    if (candidate.surveyCompleted) {
      return NextResponse.json(
        { success: false, error: "Survey already completed" },
        { status: 400 }
      );
    }

    // // Check if survey email already sent
    // if (candidate.surveyEmailSent) {
    //   return NextResponse.json(
    //     { success: false, error: "Survey email already sent" },
    //     { status: 400 }
    //   );
    // }

    // Generate survey link
    const surveyLink = `${process.env.APP_URL || "http://localhost:3000"}/candidate-satisfaction-survey/${candidate.id}`;

    // Send email
    const emailResult = await sendCandidateSurveyEmail({
      to: candidate.candidateEmail,
      candidateName: candidate.candidateName,
      surveyLink,
    });

    if (!emailResult.success) {
      return NextResponse.json(
        { success: false, error: "Failed to send email" },
        { status: 500 }
      );
    }

    // Update candidate record
    const updatedCandidate = await prisma.candidate.update({
      where: { id },
      data: {
        surveyEmailSent: true,
        surveyEmailSentAt: new Date(surveyEmailSentAt),
        surveyEmailSentBy,
      },
    });

    return NextResponse.json({
      success: true,
      data: updatedCandidate,
    });
  } catch (error) {
    console.error("Error sending survey email:", error);
    return NextResponse.json(
      { success: false, error: "Failed to send survey email" },
      { status: 500 }
    );
  }
}
