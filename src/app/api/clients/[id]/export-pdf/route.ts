import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/auth";

// GET /api/clients/[id]/export-pdf - Export individual client survey as PDF
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  console.log("🚀 PDF Export API - Starting client PDF export");
  console.log("🚀 Request method:", request.method);
  console.log("🚀 Request URL:", request.url);
  console.log("🚀 Request headers:", Object.fromEntries(request.headers.entries()));
  
  try {
    const { id } = await params;
    console.log("🚀 Client ID:", id);

    // Get client to verify it exists and is completed
    const client = await prisma.client.findUnique({
      where: { id },
      select: {
        id: true,
        clientName: true,
        surveyCompleted: true,
      },
    });

    if (!client) {
      return NextResponse.json(
        { success: false, error: "Client not found" },
        { status: 404 }
      );
    }

    if (!client.surveyCompleted) {
      return NextResponse.json(
        { success: false, error: "Survey not completed yet" },
        { status: 400 }
      );
    }

    // Generate PDF using Puppeteer
    const puppeteer = await import("puppeteer");
    const browser = await puppeteer.default.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage", // Overcome limited resource problems
        "--disable-accelerated-2d-canvas",
        "--no-first-run",
        "--no-zygote",
        "--single-process", // This will help in environments with limited resources
        "--disable-gpu",
        "--disable-features=VizDisplayCompositor", // Disable GPU compositing
      ],
    });

    const page = await browser.newPage();

    // Pass cookies for authentication
    const cookies = request.headers.get("cookie");
    console.log("🔍 PDF Export Debug - Starting cookie processing");
    console.log("🔍 Request URL:", request.nextUrl.toString());
    console.log("🔍 Request protocol:", request.nextUrl.protocol);
    console.log("🔍 Request hostname:", request.nextUrl.hostname);
    
    // Get the correct domain from forwarded headers (for production deployments)
    const forwardedHost = request.headers.get("x-forwarded-host");
    const forwardedProto = request.headers.get("x-forwarded-proto");
    
    // Use environment variables for base URL configuration
    const envAppUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL;
    let actualHost: string;
    let actualProtocol: string;
    
    if (envAppUrl) {
      const envUrl = new URL(envAppUrl);
      actualHost = envUrl.hostname;
      actualProtocol = envUrl.protocol.replace(':', '');
      console.log("🔍 Using environment URL:", envAppUrl);
    } else {
      actualHost = forwardedHost || request.nextUrl.hostname;
      actualProtocol = forwardedProto || request.nextUrl.protocol;
      console.log("🔍 Using forwarded headers");
    }
    
    console.log("🔍 Forwarded host:", forwardedHost);
    console.log("🔍 Forwarded proto:", forwardedProto);
    console.log("🔍 Environment URL:", envAppUrl);
    console.log("🔍 Actual host for cookies:", actualHost);
    console.log("🔍 Actual protocol for cookies:", actualProtocol);
    
    if (cookies) {
      console.log("🍪 Raw cookies from request:", cookies);
      
      const cookieArray = cookies.split("; ").map((cookieString, index) => {
        console.log(`🍪 Processing cookie ${index + 1}:`, cookieString);
        
        const equalIndex = cookieString.indexOf("=");
        if (equalIndex === -1) {
          console.log(`❌ Invalid cookie format (no = found):`, cookieString);
          return null;
        }
        
        const name = cookieString.substring(0, equalIndex).trim();
        const rawValue = cookieString.substring(equalIndex + 1).trim();
        
        console.log(`🍪 Cookie name:`, name);
        console.log(`🍪 Cookie raw value:`, rawValue);
        
        try {
          const decodedValue = decodeURIComponent(rawValue);
          console.log(`🍪 Cookie decoded value:`, decodedValue);
          
          const cookieObj = {
            name,
            value: decodedValue,
            domain: actualHost,
            path: "/",
            httpOnly: false,
            secure: actualProtocol === "https",
          };
          
          console.log(`✅ Cookie object created:`, cookieObj);
          return cookieObj;
        } catch (error) {
          console.error(`❌ Error decoding cookie value:`, error);
          console.log(`🍪 Using raw value instead`);
          return {
            name,
            value: rawValue,
            domain: actualHost,
            path: "/",
            httpOnly: false,
            secure: actualProtocol === "https",
          };
        }
      }).filter((cookie): cookie is NonNullable<typeof cookie> => cookie !== null);
      
      console.log(`🍪 Total valid cookies: ${cookieArray.length}`);
      
      if (cookieArray.length > 0) {
        try {
          await page.setCookie(...cookieArray);
          console.log("✅ Cookies set successfully in Puppeteer");
        } catch (error) {
          console.error("❌ Error setting cookies in Puppeteer:", error);
          throw error;
        }
      } else {
        console.log("⚠️ No valid cookies to set");
      }
    } else {
      console.log("❌ No cookies found in request headers");
    }

    // Get the base URL from the request
    const baseUrl = `${actualProtocol}//${actualHost}`;
    const previewUrl = `${baseUrl}/dashboard/clients/${id}/preview`;
    
    console.log("🌐 Base URL:", baseUrl);
    console.log("🌐 Preview URL:", previewUrl);

    // Navigate to the preview page
    console.log("🚀 Navigating to preview page...");
    try {
      await page.goto(previewUrl, {
        waitUntil: "networkidle0",
        timeout: 30000,
      });
      console.log("✅ Successfully navigated to preview page");
      console.log("🌐 Final page URL:", page.url());
      console.log("📄 Page title:", await page.title());
    } catch (error) {
      console.error("❌ Error navigating to preview page:", error);
      throw error;
    }

    // Wait for the page to fully load and render
    console.log("⏳ Waiting for page to fully load (3 seconds)...");
    await new Promise((resolve) => setTimeout(resolve, 3000));
    console.log("✅ Page load wait completed");

    // Wait for the PDF preview content to be visible
    console.log("🔍 Looking for PDF preview content (.cover-page selector)...");
    try {
      await page.waitForSelector(".cover-page", { timeout: 10000 });
      console.log("✅ PDF preview content (.cover-page) found");
    } catch (error) {
      console.error("❌ PDF preview content (.cover-page) not found within timeout");
      console.log("🔍 Checking page content for debugging...");
      
      const pageContent = await page.content();
      const pageTitle = await page.title();
      const currentUrl = page.url();
      
      console.log("📄 Page title:", pageTitle);
      console.log("🌐 Current page URL:", currentUrl);
      console.log("📝 Page content length:", pageContent.length);
      
      // Check if we're on a 404 page
      if (pageContent.includes("404") || pageContent.includes("not found")) {
        console.error("❌ Preview page returned 404 - authentication or routing issue");
        throw new Error(
          "Preview page returned 404 - authentication or routing issue"
        );
      }
      
      // Check for authentication issues
      if (pageContent.includes("login") || pageContent.includes("sign in")) {
        console.error("❌ Appears to be redirected to login page - authentication issue");
        throw new Error("Authentication failed - redirected to login page");
      }

      // If PDF preview not found but no 404, continue anyway
      console.log("⚠️ Continuing without PDF preview selector - content may not be fully loaded");
    }

    // Additional wait to ensure all content is rendered
    console.log("⏳ Additional wait for content rendering (2 seconds)...");
    await new Promise((resolve) => setTimeout(resolve, 2000));
    console.log("✅ Content rendering wait completed");

    // Generate PDF with different settings for cover page vs content pages
    console.log("📄 Starting PDF generation...");
    let pdfBuffer: Uint8Array;
    try {
      pdfBuffer = await page.pdf({
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
      console.log("✅ PDF generated successfully, buffer size:", pdfBuffer.length, "bytes");
      
      await browser.close();
      console.log("✅ Browser closed successfully");
    } catch (error) {
      console.error("❌ Error generating PDF:", error);
      await browser.close();
      throw error;
    }

    // Set response headers
    console.log("📤 Setting response headers...");
    const response = new NextResponse(pdfBuffer as BodyInit);
    response.headers.set("Content-Type", "application/pdf");
    const filename = `${client.clientName.replace(/[^a-zA-Z0-9]/g, "_")}-SurveyReport-${new Date().toISOString().split("T")[0]}.pdf`;
    response.headers.set("Content-Disposition", `attachment; filename="${filename}"`);
    console.log("✅ Response headers set, filename:", filename);

    return response;
  } catch (error) {
    console.error("💥 CRITICAL ERROR in PDF generation:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    const errorStack = error instanceof Error ? error.stack : undefined;

    console.error("💥 Error details:", errorMessage);
    if (errorStack) {
      console.error("💥 Error stack:", errorStack);
    }

    // Additional debugging info
    console.error("💥 Error type:", typeof error);
    console.error("💥 Error constructor:", error?.constructor?.name);
    if (error instanceof Error) {
      console.error("💥 Error name:", error.name);
      console.error("💥 Error cause:", error.cause);
    }

    return NextResponse.json(
      { success: false, error: `Failed to generate PDF: ${errorMessage}` },
      { status: 500 }
    );
  }
}
