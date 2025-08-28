import React from "react";
import Intro from "./Intro";
import IntroBanner from "./IntroBanner";

const TakeSurvey = ({
  title,
  description,
  url,
  time,
}: {
  title: string;
  description: string;
  url: string;
  time: string;
}) => {
  return (
    <div className="h-[100dvh] grid grid-cols-1 md:grid-cols-2">
      <Intro title={title} description={description} url={url} time={time} />
      <IntroBanner />
    </div>
  );
};

export default TakeSurvey;
