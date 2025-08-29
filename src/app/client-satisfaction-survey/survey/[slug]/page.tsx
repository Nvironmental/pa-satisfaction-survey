import { redirect } from "next/navigation";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { prisma } from "@/lib/auth";
import BaseHeader from "@/components/BaseHeader";
import React from "react";
import ClientSurvey from "@/components/ClientSurvey";
import { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const metadata: Metadata = {
  title: "PeopleAsset - Client Satisfaction Survey",
  description:
    "At PeopleAsset, our candidates and clients are at the center of everything we do. To ensure we continue delivering excellence in executive search, talent advisory, and leadership development, we’d greatly value your feedback on your experience with us. Your insights will help us refine our approach, strengthen our partnerships, and serve you better in the future. This survey will take only a few minutes, and your responses will remain confidential.",
  openGraph: {
    title: "PeopleAsset - Client Satisfaction Survey",
    description:
      "At PeopleAsset, our candidates and clients are at the center of everything we do. To ensure we continue delivering excellence in executive search, talent advisory, and leadership development, we’d greatly value your feedback on your experience with us. Your insights will help us refine our approach, strengthen our partnerships, and serve you better in the future. This survey will take only a few minutes, and your responses will remain confidential.",

    siteName: "PeopleAsset - Client Satisfaction Survey",
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
    title: "PeopleAsset - Client Satisfaction Survey",
    description:
      "At PeopleAsset, our candidates and clients are at the center of everything we do. To ensure we continue delivering excellence in executive search, talent advisory, and leadership development, we’d greatly value your feedback on your experience with us. Your insights will help us refine our approach, strengthen our partnerships, and serve you better in the future. This survey will take only a few minutes, and your responses will remain confidential.",
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

const Page = async ({ params }: PageProps) => {
  const { slug } = await params;

  // Server-side client validation
  try {
    console.log("🔍 Survey page - Fetching client with ID:", slug);

    const client = await prisma.client.findUnique({
      where: { id: slug },
      select: {
        id: true,
        clientName: true,
        clientLogo: true,
        representativeName: true,
        representativeEmail: true,
        surveyCompleted: true,
        surveyCompletedAt: true,
        createdAt: true,
      },
    });

    console.log("📊 Survey page - Client data:", client);

    // Client doesn't exist, redirect to home page
    if (!client) {
      console.log("❌ Survey page - Client not found, redirecting to home");
      redirect("/");
    }

    // Client has already completed the survey, redirect to thank you page
    if (client.surveyCompleted) {
      console.log(
        "✅ Survey page - Client survey completed, redirecting to thank you page"
      );
      redirect("/client-satisfaction-survey/thank-you");
    }

    console.log(
      "🎯 Survey page - Client valid and survey not completed, showing survey form"
    );

    // Client exists and hasn't completed the survey - show the survey form
    return (
      <section className=" bg-pa-midnight-regent text-white h-[100dvh] relative flex items-center justify-center">
        <BaseHeader logoClassName="text-white" />

        <div className="max-w-2xl mx-auto p-8">
          <ClientSurvey clientId={client.id} />
        </div>
      </section>
    );
  } catch (error) {
    // Check if this is a redirect error (from our redirect() calls)
    if (isRedirectError(error)) {
      // Re-throw redirect errors so Next.js can handle them
      throw error;
    }

    console.error("Survey page - Error fetching client:", error);
    // If there's a real error, redirect to home page
    redirect("/");
  }
};

export default Page;
