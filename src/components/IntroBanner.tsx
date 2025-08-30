import { cn } from "@/lib/utils";
import Image from "next/image";
import React from "react";

const IntroBanner = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn(
        "relative h-full md:h-full w-full bg-pa-midnight-regent row-start-1 md:row-start-auto",
        className
      )}
    >
      <div className="absolute inset-0 bg-pa-midnight-regent/50 z-10" />
      <Image
        src="/banner.jpg?t=1"
        alt="pa-satisfaction-survey-banner"
        fill
        className="object-cover"
      />
    </div>
  );
};

export default IntroBanner;
