import BaseHeader from "@/components/BaseHeader";

import Link from "next/link";

import { Metadata } from "next";

//meta tags
export const metadata: Metadata = {
  title: "Thank You!",
  description:
    "Your responses have been recorded. Your feedback helps us to improve our services and better serve our clients and candidates.",
  openGraph: {
    title: "Thank You!",
    description:
      "Your responses have been recorded. Your feedback helps us to improve our services and better serve our clients and candidates.",

    siteName: "Thank You!",
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
    title: "Thank You!",
    description:
      "Your responses have been recorded. Your feedback helps us to improve our services and better serve our clients and candidates.",
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

const ThankYouPage = () => {
  return (
    <section className="relative">
      <BaseHeader logoClassName="text-white" />

      <div className="h-[100dvh] bg-pa-midnight-regent flex items-center justify-center ">
        <div className="max-w-2xl mx-auto p-8 text-center">
          <div className="mb-8">
            <h1 className="text-5xl font-bold font-sentient text-white mb-4">
              Thank You!
            </h1>
            <p className="text-white/80 text-lg leading-relaxed font-sans mb-4">
              Your responses have been recorded. Your feedback helps us to
              improve our services and better serve our clients and candidates.
            </p>

            <p className="text-white/80 text-lg leading-relaxed font-sans">
              You can now close this window.
            </p>
          </div>

          <div className="space-y-4 font-sans">
            <div className="text-white/60 text-sm">
              <p>For any questions, please contact us at:</p>
              <Link
                href="mailto:connect@peopleasset.in"
                className="text-pa-carmine-rush hover:underline flux"
              >
                connect@peopleasset.in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ThankYouPage;
