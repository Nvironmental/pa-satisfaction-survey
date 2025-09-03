import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/auth";
import { CreateClientInput, UpdateClientInput } from "@/lib/types";

// GET /api/clients - Get all clients with pagination
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
            { clientName: { contains: search, mode: "insensitive" as const } },
            {
              representativeName: {
                contains: search,
                mode: "insensitive" as const,
              },
            },
            {
              representativeEmail: {
                contains: search,
                mode: "insensitive" as const,
              },
            },
          ],
        }
      : {};

    // Get total count
    const total = await prisma.client.count({ where });

    // Get clients with pagination
    const clients = await prisma.client.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        clientName: true,
        clientLogo: true,
        representativeName: true,
        representativeEmail: true,
        representativeMobile: true,
        surveyEmailSent: true,
        surveyEmailSentAt: true,
        createdAt: true,
        updatedAt: true,
        surveyCompleted: true,
        surveyCompletedAt: true,
        score: true,
        createdBy: true,
        creator: {
          select: {
            name: true,
            id: true,
          },
        },
      },
    });

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      data: clients,
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
    console.error("Error fetching clients:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch clients" },
      { status: 500 }
    );
  }
}

// POST /api/clients - Create a new client
export async function POST(request: NextRequest) {
  try {
    const body: CreateClientInput = await request.json();
    const {
      clientName,
      clientLogo,
      representativeName,
      representativeEmail,
      representativeMobile,
    } = body;

    // Validate required fields
    if (
      !clientName ||
      !representativeName ||
      !representativeEmail ||
      !representativeMobile
    ) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Get the creator ID from the request body and filter out surveySchema
    const { createdBy, surveySchema: _, ...clientData } = body;

    if (!createdBy) {
      return NextResponse.json(
        { success: false, error: "Creator ID is required" },
        { status: 400 }
      );
    }

    const client = await prisma.client.create({
      data: {
        ...clientData,
        createdBy,
        surveyCompleted: false, // Default to false
        surveyCompletedAt: null, // Default to null
      },
    });

    return NextResponse.json({
      success: true,
      data: client,
      message: "Client created successfully",
    });
  } catch (error) {
    console.error("Error creating client:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create client" },
      { status: 500 }
    );
  }
}
