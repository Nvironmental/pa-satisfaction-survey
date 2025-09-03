import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/auth";

interface QuestionResponsesRequest {
  questionId: string;
  options: string[];
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ type: string }> }
) {
  try {
    const { type } = await params;
    const { questionId, options }: QuestionResponsesRequest =
      await request.json();

    if (!questionId || !options || !Array.isArray(options)) {
      return NextResponse.json(
        { error: "Invalid request data" },
        { status: 400 }
      );
    }

    if (type !== "client" && type !== "candidate") {
      return NextResponse.json(
        { error: "Invalid type. Must be 'client' or 'candidate'" },
        { status: 400 }
      );
    }

    // Build the question filter based on the question ID
    // Both client and candidate surveys now use "question_" prefix
    const questionFilter = `question_${questionId}`;

    let responseCounts: Array<{ option: string; count: number }> = [];
    let totalResponses = 0;
    let totalScore = 0;
    let csatScore = 0;

    if (type === "client") {
      // Count client survey responses for each option
      const responses = await prisma.clientSurveyAnswer.findMany({
        where: {
          questionId: questionFilter,
        },
        select: {
          answer: true,
          answer_score: true,
        },
      });

      // Count occurrences of each option and calculate total score
      const optionCounts = new Map<string, number>();
      options.forEach((option) => optionCounts.set(option, 0));

      responses.forEach((response) => {
        const answer = response.answer;
        if (optionCounts.has(answer)) {
          optionCounts.set(answer, (optionCounts.get(answer) || 0) + 1);
        }
        // Add to total score
        if (response.answer_score !== null) {
          totalScore += response.answer_score;
        }
      });

      responseCounts = Array.from(optionCounts.entries()).map(
        ([option, count]) => ({
          option,
          count,
        })
      );

      totalResponses = responses.length;
      csatScore = totalResponses > 0 ? totalScore / totalResponses : 0;
    } else {
      // Count candidate survey responses for each option
      const responses = await prisma.candidateSurveyAnswer.findMany({
        where: {
          questionId: questionFilter,
        },
        select: {
          answer: true,
          answer_score: true,
        },
      });

      // Count occurrences of each option and calculate total score
      const optionCounts = new Map<string, number>();
      options.forEach((option) => optionCounts.set(option, 0));

      responses.forEach((response) => {
        const answer = response.answer;
        if (optionCounts.has(answer)) {
          optionCounts.set(answer, (optionCounts.get(answer) || 0) + 1);
        }
        // Add to total score
        if (response.answer_score !== null) {
          totalScore += response.answer_score;
        }
      });

      responseCounts = Array.from(optionCounts.entries()).map(
        ([option, count]) => ({
          option,
          count,
        })
      );

      totalResponses = responses.length;
      csatScore = totalResponses > 0 ? totalScore / totalResponses : 0;
    }

    return NextResponse.json({
      success: true,
      data: responseCounts,
      totalResponses,
      totalScore: Number(totalScore.toFixed(3)),
      csatScore: Number(csatScore.toFixed(3)),
      questionId,
      type,
    });
  } catch (error) {
    console.error("Error fetching question responses:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
