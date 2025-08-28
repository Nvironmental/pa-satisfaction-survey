import BaseHeader from "@/components/BaseHeader";
import TakeSurvey from "@/components/TakeSurvey";
import React from "react";
import { Metadata } from "next";
import { prisma } from "@/lib/auth";
import { redirect } from "next/navigation";
import { isRedirectError } from "next/dist/client/components/redirect-error";

export const metadata: Metadata = {
  title: "PeopleAsset - Candidate Satisfaction Survey",
  description:
    "At PeopleAsset, our candidates and clients are at the center of everything we do. To ensure we continue delivering excellence in executive search, talent advisory, and leadership development, we'd greatly value your feedback on your experience with us. Your insights will help us refine our approach, strengthen our partnerships, and serve you better in the future. This survey will take only a few minutes, and your responses will remain confidential.",
  openGraph: {
    title: "PeopleAsset - Candidate Satisfaction Survey",
    description:
      "At PeopleAsset, our candidates and clients are at the center of everything we do. To ensure we continue delivering excellence in executive search, talent advisory, and leadership development, we'd greatly value your feedback on your experience with us. Your insights will help us refine our approach, strengthen our partnerships, and serve you better in the future. This survey will take only a few minutes, and your responses will remain confidential.",

    siteName: "PeopleAsset - Candidate Satisfaction Survey",
    images: [
      {
        url: "https://www.peopleasset.in/mail-assets/PA_Identity_FINAL_Blue_LOWRES.png",
        width: 400,
        height: 68,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PeopleAsset - Candidate Satisfaction Survey",
    description:
      "At PeopleAsset, our candidates and clients are at the center of everything we do. To ensure we continue delivering excellence in executive search, talent advisory, and leadership development, we'd greatly value your feedback on your experience with us. Your insights will help us refine our approach, strengthen our partnerships, and serve you better in the future. This survey will take only a few minutes, and your responses will remain confidential.",
    images: [
      {
        url: "https://www.peopleasset.in/mail-assets/PA_Identity_FINAL_Blue_LOWRES.png",
      },
    ], // Must be an absolute URL
  },
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
      "max-video-preview": -1,
      "max-image-preview": "none",
      "max-snippet": -1,
    },
  },
};

interface PageProps {
  params: Promise<{ slug: string }>;
}

const Page = async ({ params }: PageProps) => {
  try {
    const { slug } = await params;

    // Check if candidate exists and survey status
    const candidate = await prisma.candidate.findUnique({
      where: { id: slug },
      select: {
        id: true,
        candidateName: true,
        surveyCompleted: true,
      },
    });

    if (!candidate) {
      // Candidate not found, redirect to home page
      redirect("/");
    }

    if (candidate.surveyCompleted) {
      // Survey already completed, redirect to thank you page
      redirect("/candidate-satisfaction-survey/thank-you");
    }

    return (
      <section className="relative">
        <BaseHeader />

        <TakeSurvey
          title="Candidate Satisfaction Survey"
          description="At PeopleAsset, your candidate experience matters as much as our client outcomes. If you've engaged with us during an executive search, we'd value your feedback on the process—communication, role clarity, interview preparation, and follow-through. Your insights will help us refine how we support professionals like you and represent you to hiring organizations. This survey takes only a few minutes; your responses will not affect any current or future opportunities."
          url={`/candidate-satisfaction-survey/survey/${slug}`}
          time="5"
        />

        <div className="h-[100dvh] bg-pa-midnight-regent">
          <div className="max-w-2xl mx-auto p-8">
            <h1 className="text-5xl font-bold font-sentient">
              Candidate Satisfaction Survey
            </h1>
          </div>
        </div>
      </section>
    );
  } catch (error) {
    if (isRedirectError(error)) {
      throw error; // Re-throw redirect errors
    }

    console.error("Error in candidate survey page:", error);
    // Any other error, redirect to home page
    redirect("/");
  }
};

export default Page;
