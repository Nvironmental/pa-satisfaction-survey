import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/auth";

// GET /api/clients/export - Export all clients with their survey answers as CSV
export async function GET(request: NextRequest) {
  try {
    // Get all clients with their survey answers
    const clients = await prisma.client.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        surveyAnswers: {
          orderBy: { answeredAt: "asc" },
        },
        creator: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    // Get all unique question IDs from survey answers to create consistent columns
    const allQuestionIds = new Set<string>();
    clients.forEach((client) => {
      client.surveyAnswers.forEach((answer) => {
        allQuestionIds.add(answer.questionId);
      });
    });

    // Sort question IDs numerically, handling sub-questions like 5.1
    const sortedQuestionIds = Array.from(allQuestionIds).sort((a, b) => {
      // Remove 'question_' prefix
      const aId = a.replace("question_", "");
      const bId = b.replace("question_", "");

      // Split by decimal point for proper numeric sorting
      const aParts = aId.split(".").map(Number);
      const bParts = bId.split(".").map(Number);

      // Compare main question numbers first
      if (aParts[0] !== bParts[0]) {
        return aParts[0] - bParts[0];
      }

      // If main question numbers are equal, compare sub-question numbers
      return (aParts[1] || 0) - (bParts[1] || 0);
    });

    // Create CSV headers
    const headers = [
      "Client ID",
      "Client Name",
      "Representative Name",
      "Representative Email",
      "Representative Mobile",
      "Survey Email Sent",
      "Survey Email Sent At",
      "Survey Completed",
      "Survey Completed At",
      "Score (%)",
      "Created At",
      "Updated At",
      "Created By",
      "Creator Name",
      "Creator Email",
      ...sortedQuestionIds.map(
        (qId) => `Question ${qId.replace("question_", "")}`
      ),
      ...sortedQuestionIds.map(
        (qId) => `Question Score ${qId.replace("question_", "")} (%)`
      ),
    ];

    // Create CSV rows
    const rows = clients.map((client) => {
      const baseData = [
        client.id,
        client.clientName,
        client.representativeName,
        client.representativeEmail,
        client.representativeMobile,
        client.surveyEmailSent ? "Yes" : "No",
        client.surveyEmailSentAt?.toISOString() || "",
        client.surveyCompleted ? "Yes" : "No",
        client.surveyCompletedAt?.toISOString() || "",
        client.score !== null && client.score !== undefined
          ? `${(client.score * 100).toFixed(1)}%`
          : "",
        client.createdAt.toISOString(),
        client.updatedAt.toISOString(),
        client.createdBy,
        client.creator.name || "",
        client.creator.email || "",
      ];

      // Add survey answers for each question
      const surveyData = sortedQuestionIds.map((qId) => {
        const answer = client.surveyAnswers.find((a) => a.questionId === qId);
        return answer ? answer.answer : "";
      });

      // Add survey answer scores for each question (as percentages)
      const scoreData = sortedQuestionIds.map((qId) => {
        const answer = client.surveyAnswers.find((a) => a.questionId === qId);
        if (
          answer?.answer_score !== null &&
          answer?.answer_score !== undefined
        ) {
          // Convert float score to percentage (assuming scores are 0-1 range)
          const percentage = (answer.answer_score * 100).toFixed(1);
          return `${percentage}%`;
        }
        return "";
      });

      return [...baseData, ...surveyData, ...scoreData];
    });

    // Escape CSV values
    const escapeCsvValue = (value: string) => {
      if (value.includes(",") || value.includes('"') || value.includes("\n")) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    };

    // Create CSV content
    const csvContent = [
      headers.map(escapeCsvValue).join(","),
      ...rows.map((row) => row.map(escapeCsvValue).join(",")),
    ].join("\n");

    // Set response headers for CSV download
    const response = new NextResponse(csvContent);
    response.headers.set("Content-Type", "text/csv");
    response.headers.set(
      "Content-Disposition",
      `attachment; filename="clients-export-${new Date().toISOString().split("T")[0]}.csv"`
    );

    return response;
  } catch (error) {
    console.error("Error exporting clients:", error);
    return NextResponse.json(
      { success: false, error: "Failed to export clients" },
      { status: 500 }
    );
  }
}
