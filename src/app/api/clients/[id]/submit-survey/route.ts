import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/auth";
import { client_questions } from "@/lib/questions";
import { sendThankYouEmail, QuestionAnswer } from "@/lib/email";

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
        representativeEmail: true,
        representativeName: true,
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

    // Prepare questions and answers for thank you email
    const questionsAndAnswers: QuestionAnswer[] = [];

    for (const [questionId, answer] of Object.entries(answers)) {
      if (answer && answer !== "") {
        const questionIdNum = questionId.replace("question_", "");
        const question = client_questions.find(
          (q) => q.id.toString() === questionIdNum
        );

        if (question) {
          const answerString =
            typeof answer === "string" ? answer : JSON.stringify(answer);

          // Add main question
          questionsAndAnswers.push({
            questionId,
            question: question.question,
            answer: answerString,
            type: question.type,
          });

          // Check if there's a subquestion and if the answer matches the trigger
          if (
            question.subQuestion &&
            question.subQuestion.parentValue === answerString
          ) {
            const subQuestionId = `question_${question.subQuestion.id}`;
            const subAnswer = answers[subQuestionId];

            if (subAnswer && subAnswer !== "") {
              const subAnswerString =
                typeof subAnswer === "string"
                  ? subAnswer
                  : JSON.stringify(subAnswer);
              questionsAndAnswers.push({
                questionId: subQuestionId,
                question: question.subQuestion.question,
                answer: subAnswerString,
                type: question.subQuestion.type,
              });
            }
          }
        }
      }
    }

    // Send thank you email
    if (client.representativeEmail && client.representativeName) {
      try {
        await sendThankYouEmail({
          to: client.representativeEmail,
          name: client.representativeName,
          surveyType: "client",
          questionsAndAnswers,
          totalScore: result.totalScore,
        });
      } catch (emailError) {
        console.error("Failed to send thank you email:", emailError);
        // Don't fail the request if email sending fails
      }
    }

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
