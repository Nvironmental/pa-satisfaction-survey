import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/auth";
import { launchPuppeteerBrowser } from "@/lib/puppeteer-config";

// GET /api/candidates/[id]/export-pdf - Export individual candidate survey as PDF
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Get candidate to verify it exists and is completed
    const candidate = await prisma.candidate.findUnique({
      where: { id },
      select: {
        id: true,
        candidateName: true,
        surveyCompleted: true,
      },
    });

    if (!candidate) {
      return NextResponse.json(
        { success: false, error: "Candidate not found" },
        { status: 404 }
      );
    }

    if (!candidate.surveyCompleted) {
      return NextResponse.json(
        { success: false, error: "Survey not completed yet" },
        { status: 400 }
      );
    }

    // Generate PDF using Puppeteer with environment-aware configuration
    const browser = await launchPuppeteerBrowser();

    const page = await browser.newPage();

    // Pass cookies for authentication
    const cookies = request.headers.get("cookie");
    if (cookies) {
      console.log("Setting cookies for Puppeteer:", cookies);
      const cookieArray = cookies.split("; ").map((cookieString) => {
        const [name, value] = cookieString.split("=");
        return {
          name: name.trim(),
          value: value?.trim() || "",
          domain: request.nextUrl.hostname,
          path: "/",
          httpOnly: false,
          secure: false,
        };
      });
      await page.setCookie(...cookieArray);
      console.log("Cookies set successfully");
    } else {
      console.log("No cookies found in request");
    }

    // Get the base URL from the request
    const baseUrl = `${request.nextUrl.protocol}//${request.nextUrl.host}`;
    const previewUrl = `${baseUrl}/dashboard/candidates/${id}/preview`;

    // Navigate to the preview page
    await page.goto(previewUrl, {
      waitUntil: "networkidle0",
      timeout: 30000,
    });

    // Wait for the page to fully load and render
    await new Promise((resolve) => setTimeout(resolve, 3000)); // Wait 3 seconds for auth and content to load

    // Wait for the PDF preview content to be visible
    try {
      await page.waitForSelector(".cover-page", { timeout: 10000 });
      console.log("PDF preview content found");
    } catch (error) {
      console.error("PDF preview content not found, checking page content...");
      const pageContent = await page.content();
      console.log("Page title:", await page.title());
      console.log("Page URL:", page.url());

      // Check if we're on a 404 page
      if (pageContent.includes("404") || pageContent.includes("not found")) {
        throw new Error(
          "Preview page returned 404 - authentication or routing issue"
        );
      }

      // If PDF preview not found but no 404, continue anyway
      console.log("Continuing without PDF preview selector...");
    }

    // Additional wait to ensure all content is rendered
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Generate PDF with different settings for cover page vs content pages
    const pdfBuffer = await page.pdf({
      format: "A4",
      margin: {
        top: "0mm",
        right: "0mm",
        bottom: "0mm",
        left: "0mm",
      },
      printBackground: true,
      displayHeaderFooter: false, // No header/footer for cover page
      // Use CSS @page rules in the component for different page styles
    });

    await browser.close();

    // Set response headers
    const response = new NextResponse(pdfBuffer as BodyInit);
    response.headers.set("Content-Type", "application/pdf");
    response.headers.set(
      "Content-Disposition",
      `attachment; filename="${candidate.candidateName.replace(/[^a-zA-Z0-9]/g, "_")}-SurveyReport-${new Date().toISOString().split("T")[0]}.pdf"`
    );

    return response;
  } catch (error) {
    console.error("Error generating PDF:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    const errorStack = error instanceof Error ? error.stack : undefined;

    console.error("Error details:", errorMessage);
    if (errorStack) {
      console.error("Error stack:", errorStack);
    }

    return NextResponse.json(
      { success: false, error: `Failed to generate PDF: ${errorMessage}` },
      { status: 500 }
    );
  }
}
