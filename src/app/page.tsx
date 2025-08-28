"use client";
import BaseHeader from "@/components/BaseHeader";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";

const ThankYouPage = () => {
  const router = useRouter();

  return (
    <section className="relative">
      <BaseHeader />

      <div className="h-[100dvh] bg-pa-midnight-regent flex items-center justify-center ">
        <div className="max-w-2xl mx-auto p-8 text-center">
          <div className="mb-8">
            <h1 className="text-5xl font-bold font-sentient text-white mb-4">
              Welcome to PeopleAsset Survey
            </h1>
            <p className="text-white/80 text-lg leading-relaxed font-sans">
              Thank you for your interest in our survey. To take the survey,
              please check your email and follow the link provided to you.
            </p>
          </div>

          <div className="space-y-4 font-sans">
            <div className="text-white/60 text-sm">
              <p>For any questions, please contact us at:</p>
              <Link
                href="mailto:info@peopleasset.in"
                className="text-pa-carmine-rush hover:underline flux"
              >
                info@peopleasset.in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ThankYouPage;
