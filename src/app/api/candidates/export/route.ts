import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/auth";

// GET /api/candidates/export - Export all candidates with their survey answers as CSV
export async function GET(request: NextRequest) {
  try {
    // Get all candidates with their survey answers
    const candidates = await prisma.candidate.findMany({
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
        updater: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    // Get all unique question IDs from survey answers to create consistent columns
    const allQuestionIds = new Set<string>();
    candidates.forEach((candidate) => {
      candidate.surveyAnswers.forEach((answer) => {
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
      "Candidate ID",
      "Candidate Name",
      "Candidate Email",
      "Candidate Mobile",
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
      "Updated By",
      "Updater Name",
      "Updater Email",
      ...sortedQuestionIds.map(
        (qId) => `Question ${qId.replace("question_", "")}`
      ),
      ...sortedQuestionIds.map(
        (qId) => `Question Score ${qId.replace("question_", "")} (%)`
      ),
    ];

    // Create CSV rows
    const rows = candidates.map((candidate) => {
      const baseData = [
        candidate.id,
        candidate.candidateName,
        candidate.candidateEmail,
        candidate.candidateMobile,
        candidate.surveyEmailSent ? "Yes" : "No",
        candidate.surveyEmailSentAt?.toISOString() || "",
        candidate.surveyCompleted ? "Yes" : "No",
        candidate.surveyCompletedAt?.toISOString() || "",
        candidate.score !== null && candidate.score !== undefined
          ? `${(candidate.score * 100).toFixed(1)}%`
          : "",
        candidate.createdAt.toISOString(),
        candidate.updatedAt.toISOString(),
        candidate.createdBy,
        candidate.creator.name || "",
        candidate.creator.email || "",
        candidate.updatedBy || "",
        candidate.updater?.name || "",
        candidate.updater?.email || "",
      ];

      // Add survey answers for each question
      const surveyData = sortedQuestionIds.map((qId) => {
        const answer = candidate.surveyAnswers.find(
          (a) => a.questionId === qId
        );
        return answer ? answer.answer : "";
      });

      // Add survey answer scores for each question (as percentages)
      const scoreData = sortedQuestionIds.map((qId) => {
        const answer = candidate.surveyAnswers.find(
          (a) => a.questionId === qId
        );
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
      `attachment; filename="candidates-export-${new Date().toISOString().split("T")[0]}.csv"`
    );

    return response;
  } catch (error) {
    console.error("Error exporting candidates:", error);
    return NextResponse.json(
      { success: false, error: "Failed to export candidates" },
      { status: 500 }
    );
  }
}
