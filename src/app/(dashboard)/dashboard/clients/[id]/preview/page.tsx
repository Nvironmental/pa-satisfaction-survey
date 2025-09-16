import { PdfPreview } from "@/components/pdf-preview";
import { prisma } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { cookies } from "next/headers";

interface ClientPreviewPageProps {
  params: Promise<{ id: string }>;
}

export default async function ClientPreviewPage({
  params,
}: ClientPreviewPageProps) {
  // For testing purposes, we'll bypass authentication
  // In production, you should implement proper session validation
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("better-auth.session_token")?.value;

  // If no session token, redirect to auth
  if (!sessionToken) {
    redirect("/auth");
  }

  // For now, we'll proceed without strict session validation
  // TODO: Implement proper session validation in production

  const { id } = await params;

  // Get client with survey answers
  const client = await prisma.client.findUnique({
    where: { id },
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

  if (!client) {
    notFound();
  }

  if (!client.surveyCompleted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Survey Not Completed
          </h1>
          <p className="text-gray-600">
            This client&apos;s survey is not yet completed. Please complete the
            survey before generating a PDF report.
          </p>
        </div>
      </div>
    );
  }

  return (
    <PdfPreview
      type="client"
      name={client.clientName}
      representativeName={client.representativeName}
      representativeEmail={client.representativeEmail}
      surveyCompletedAt={client.surveyCompletedAt}
      surveyAnswers={client.surveyAnswers}
    />
  );
}
