"use client";
import Image from "next/image";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { ClockIcon } from "lucide-react";
import Link from "next/link";
import { IconLoader2 } from "@tabler/icons-react";

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
  const [loading, setLoading] = useState(false);
  const handleClick = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 6000);
  };
  return (
    <div className="row-start-auto md:row-start-auto relative text-pa-noble-black flex items-center md:justify-center">
      <div className="block md:hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-pa-noble-black/50 via-pa-midnight-regent/50 to-pa-royal-azure/50   z-10" />
        <Image
          src="/banner.jpg"
          alt="pa-satisfaction-survey-bg"
          fill
          className="object-cover"
        />
      </div>
      <div className="max-w-2xl mx-auto p-8 relative z-50 text-white md:text-pa-noble-black">
        <h1 className="text-[40px] md:text-[46px] font-bold font-sentient leading-[1.2] w-full md:w-9/12">
          {title}
        </h1>
        <p className="font-sans text-sm leading-relaxed mt-6">{description}</p>
        <div className="mt-8 flex items-center gap-4">
          <Link
            onClick={handleClick}
            href={url}
            className="flex flux items-center gap-2 justify-center bg-pa-carmine-rush font-sans text-sm text-white px-4 py-2 rounded-md"
          >
            <span>Take the Survey</span>
            <IconLoader2
              className={`animate-spin ${loading ? "w-4 h-4" : "w-0 h-0"}`}
            />
          </Link>
          <p className="font-sans text-[10px] leading-relaxed flex items-center gap-1">
            <ClockIcon className="w-3 h-3" />
            <span>Takes only {time} minutes</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Intro;
