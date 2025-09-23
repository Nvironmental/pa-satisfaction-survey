import { PdfPreview } from "@/components/pdf-preview";
import { prisma } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { cookies } from "next/headers";

interface CandidatePreviewPageProps {
  params: Promise<{ id: string }>;
}

export default async function CandidatePreviewPage({
  params,
}: CandidatePreviewPageProps) {
  // For testing purposes, we'll bypass authentication
  // In production, you should implement proper session validation
  const cookieStore = await cookies();
  
  // Check for both cookie names (local vs production)
  const sessionToken = 
    cookieStore.get("better-auth.session_token")?.value ||
    cookieStore.get("__Secure-better-auth.session_token")?.value;

  // If no session token, redirect to auth
  if (!sessionToken) {
    redirect("/auth");
  }

  // For now, we'll proceed without strict session validation
  // TODO: Implement proper session validation in production

  const { id } = await params;

  // Get candidate with survey answers
  const candidate = await prisma.candidate.findUnique({
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

  if (!candidate) {
    notFound();
  }

  if (!candidate.surveyCompleted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Survey Not Completed
          </h1>
          <p className="text-gray-600">
            This candidate&apos;s survey is not yet completed. Please complete
            the survey before generating a PDF report.
          </p>
        </div>
      </div>
    );
  }

  return (
    <PdfPreview
      type="candidate"
      name={candidate.candidateName}
      representativeName={candidate.candidateEmail}
      representativeEmail={candidate.candidateMobile}
      surveyCompletedAt={candidate.surveyCompletedAt}
      surveyAnswers={candidate.surveyAnswers}
    />
  );
}
