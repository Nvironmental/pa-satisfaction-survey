import BaseHeader from "@/components/BaseHeader";
import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "PeopleAsset - Thank You",
  description: "Thank you for completing the candidate satisfaction survey.",
  robots: {
    index: false,
    follow: false,
  },
};

const ThankYouPage = () => {
  return (
    <section className="relative">
      <BaseHeader logoClassName="text-white" />

      <div className="h-[100dvh] bg-pa-midnight-regent flex items-center justify-center">
        <div className="max-w-2xl mx-auto p-8 text-center">
          <div className="mb-8">
            <h1 className="text-5xl font-bold font-sentient text-white mb-4">
              Thank You!
            </h1>
            <p className="text-white/80 text-lg leading-relaxed font-sans">
              Thank you for taking the time to complete our candidate
              satisfaction survey. Your feedback is invaluable to us and will
              help us improve our services and better support professionals like
              you in the future.
            </p>
          </div>

          <div className="space-y-4 font-sans">
            <div className="text-white/60 text-sm">
              <p>For any questions, please contact us at:</p>
              <a
                href="mailto:connect@peopleasset.in"
                className="text-pa-carmine-rush hover:underline"
              >
                connect@peopleasset.in
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ThankYouPage;
