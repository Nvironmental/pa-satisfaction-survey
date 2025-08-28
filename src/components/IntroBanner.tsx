import Image from "next/image";
import React from "react";

const IntroBanner = () => {
  return (
    <div className="relative h-full w-full bg-pa-midnight-regent row-start-1 md:row-start-auto">
      <div className="absolute inset-0 bg-pa-midnight-regent/50 z-10" />
      <Image
        src="/banner.jpg"
        alt="pa-satisfaction-survey-banner"
        fill
        className="object-cover"
      />
    </div>
  );
};

export default IntroBanner;
