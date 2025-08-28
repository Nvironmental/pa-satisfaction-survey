import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/auth";
import { CreateCandidateInput } from "@/lib/types";

// GET /api/candidates - Get all candidates with pagination
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";

    const skip = (page - 1) * limit;

    // Build where clause for search
    const where = search
      ? {
          OR: [
            {
              candidateName: { contains: search, mode: "insensitive" as const },
            },
            {
              candidateEmail: {
                contains: search,
                mode: "insensitive" as const,
              },
            },
            {
              candidateMobile: {
                contains: search,
                mode: "insensitive" as const,
              },
            },
          ],
        }
      : {};

    // Get total count
    const total = await prisma.candidate.count({ where });

    // Get candidates with pagination
    const candidates = await prisma.candidate.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        candidateName: true,
        candidateEmail: true,
        candidateMobile: true,
        surveyEmailSent: true,
        surveyEmailSentAt: true,
        surveyCompleted: true,
        surveyCompletedAt: true,
        createdAt: true,
        updatedAt: true,
        createdBy: true,
        updatedBy: true,
        creator: {
          select: {
            name: true,
            email: true,
            id: true,
          },
        },
        updater: {
          select: {
            name: true,
            email: true,
            id: true,
          },
        },
      },
    });

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      data: candidates,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error("Error fetching candidates:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch candidates" },
      { status: 500 }
    );
  }
}

// POST /api/candidates - Create a new candidate
export async function POST(request: NextRequest) {
  try {
    const body: CreateCandidateInput = await request.json();
    const { createdBy, ...candidateData } = body;

    // Validate required fields
    if (
      !candidateData.candidateName ||
      !candidateData.candidateEmail ||
      !candidateData.candidateMobile
    ) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!createdBy) {
      return NextResponse.json(
        { success: false, error: "Creator ID is required" },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingCandidate = await prisma.candidate.findUnique({
      where: { candidateEmail: candidateData.candidateEmail },
    });

    if (existingCandidate) {
      return NextResponse.json(
        { success: false, error: "Candidate with this email already exists" },
        { status: 400 }
      );
    }

    const {
      surveySchema: _,
      surveyCompleted: __,
      surveyCompletedAt: ___,
      ...createData
    } = candidateData;

    const candidate = await prisma.candidate.create({
      data: {
        ...createData,
        createdBy,
      },
    });

    return NextResponse.json({
      success: true,
      data: candidate,
      message: "Candidate created successfully",
    });
  } catch (error) {
    console.error("Error creating candidate:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create candidate" },
      { status: 500 }
    );
  }
}
