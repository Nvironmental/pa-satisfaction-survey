import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/auth";
import { sendClientSurveyEmail } from "@/lib/email";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { surveyEmailSentBy, surveyEmailSentAt } = await request.json();

    // Get the client
    const client = await prisma.client.findUnique({
      where: { id },
    });

    if (!client) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    // Send the email
    const emailResult = await sendClientSurveyEmail({
      to: client.representativeEmail,
      representativeName: client.representativeName,
      surveyLink: `${process.env.APP_URL || "http://localhost:3000"}/client-satisfaction-survey/${client.id}`,
    });

    if (!emailResult.success) {
      return NextResponse.json(
        { error: "Failed to send email" },
        { status: 500 }
      );
    }

    // Update the client record
    const updatedClient = await prisma.client.update({
      where: { id },
      data: {
        surveyEmailSent: true,
        surveyEmailSentAt: new Date(surveyEmailSentAt),
        surveyEmailSentBy,
      },
    });

    return NextResponse.json({
      success: true,
      data: updatedClient,
    });
  } catch (error) {
    console.error("Error sending survey email:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
