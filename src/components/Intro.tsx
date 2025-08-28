import Image from "next/image";
import React from "react";
import { Button } from "./ui/button";
import { ClockIcon } from "lucide-react";
import Link from "next/link";

const Intro = ({
  title,
  description,
  url,
  time,
}: {
  title: string;
  description: string;
  url: string;
  time: string;
  loading?: boolean;
}) => {
  return (
    <div className="bg-pa-midnight-regent row-start-2 md:row-start-auto relative text-white flex items-center justify-center ">
      <div className="absolute inset-0 bg-gradient-to-br from-pa-noble-black/50 via-pa-midnight-regent/50 to-pa-royal-azure/50   z-10" />
      <Image
        src="/survey-bg.jpg"
        alt="pa-satisfaction-survey-bg"
        fill
        className="object-cover"
      />
      <div className="max-w-2xl mx-auto p-8 relative z-50">
        <h1 className="text-5xl font-bold font-sentient">{title}</h1>
        <p className="font-sans text-xs leading-relaxed mt-8">{description}</p>
        <div className="mt-8">
          <Link
            href={url}
            className="bg-pa-carmine-rush font-sans text-sm text-white px-4 py-2 rounded-md"
          >
            Take the Survey
          </Link>
          <p className="font-sans text-[10px] leading-relaxed mt-4 flex items-center gap-1">
            <ClockIcon className="w-3 h-3" />
            <span>Takes only {time} minutes</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Intro;
