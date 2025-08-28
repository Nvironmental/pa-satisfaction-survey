import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/auth";
import { UpdateCandidateInput } from "@/lib/types";

// GET /api/candidates/[id] - Get a specific candidate
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const candidate = await prisma.candidate.findUnique({
      where: { id },
      include: {
        surveyAnswers: true,
      },
    });

    if (!candidate) {
      return NextResponse.json(
        { success: false, error: "Candidate not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: candidate,
    });
  } catch (error) {
    console.error("Error fetching candidate:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch candidate" },
      { status: 500 }
    );
  }
}

// PUT /api/candidates/[id] - Update a candidate
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body: UpdateCandidateInput = await request.json();

    // Check if candidate exists
    const existingCandidate = await prisma.candidate.findUnique({
      where: { id },
    });

    if (!existingCandidate) {
      return NextResponse.json(
        { success: false, error: "Candidate not found" },
        { status: 404 }
      );
    }

    // If email is being updated, check for duplicates
    if (
      body.candidateEmail &&
      body.candidateEmail !== existingCandidate.candidateEmail
    ) {
      const duplicateCandidate = await prisma.candidate.findUnique({
        where: { candidateEmail: body.candidateEmail },
      });

      if (duplicateCandidate) {
        return NextResponse.json(
          { success: false, error: "Candidate with this email already exists" },
          { status: 400 }
        );
      }
    }

    // Filter out fields that shouldn't be updated
    const { createdBy, surveySchema, ...updateData } = body;

    const updatedCandidate = await prisma.candidate.update({
      where: { id },
      data: {
        ...updateData,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      data: updatedCandidate,
      message: "Candidate updated successfully",
    });
  } catch (error) {
    console.error("Error updating candidate:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update candidate" },
      { status: 500 }
    );
  }
}

// DELETE /api/candidates/[id] - Delete a candidate
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check if candidate exists
    const existingCandidate = await prisma.candidate.findUnique({
      where: { id },
    });

    if (!existingCandidate) {
      return NextResponse.json(
        { success: false, error: "Candidate not found" },
        { status: 404 }
      );
    }

    // Delete candidate (this will cascade delete survey answers)
    await prisma.candidate.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Candidate deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting candidate:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete candidate" },
      { status: 500 }
    );
  }
}
