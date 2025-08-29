import React from "react";
import Logo from "./Logo";
import Link from "next/link";
import { cn } from "@/lib/utils";

const BaseHeader = ({
  className,
  logoClassName,
}: {
  className?: string;
  logoClassName?: string;
}) => {
  return (
    <div className={cn("fixed top-0 left-0 right-0 z-50 p-8", className)}>
      <Link target="_blank" href="https://peopleasset.com" className="block">
        <Logo
          className={cn("text-pa-midnight-regent w-[300px]", logoClassName)}
        />
      </Link>
    </div>
  );
};

export default BaseHeader;
