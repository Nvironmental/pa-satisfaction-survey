import React from "react";
import { Skeleton } from "./ui/skeleton";

const DashboardLayoutLoader = () => {
  return (
    <div className="h-[100dvh] py-4">
      <div className="mx-auto px-4 grid grid-cols-[20%_1fr] gap-4 items-center h-full">
        <div className="border p-4  h-full rounded-md flex flex-col justify-between gap-2">
          <div>
            <Skeleton className="h-[20px] w-full" />
            <div className="flex flex-col gap-2 mt-12">
              <Skeleton className="h-[15px] w-full" />
              <Skeleton className="h-[15px] w-full" />
              <Skeleton className="h-[15px] w-full" />
            </div>
          </div>
          <div>
            <Skeleton className="h-[72px] w-full" />
          </div>
        </div>
        <div className="border p-4 h-full rounded-md flex flex-col gap-4">
          <div className="flex gap-4 items-center">
            <Skeleton className="h-[100px] w-1/4" />
            <Skeleton className="h-[100px] w-1/4" />
            <Skeleton className="h-[100px] w-1/4" />
            <Skeleton className="h-[100px] w-1/4" />
          </div>
          <Skeleton className="h-1/2 w-full" />
          <Skeleton className="h-1/2 w-full" />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayoutLoader;
