"use client";

import { ArrowRightIcon, TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { useEffect, useState } from "react";
import { SurveyQuestion } from "@/lib/types";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Skeleton } from "../ui/skeleton";

export const description = "A dynamic bar chart for survey responses";

interface PaBarChartProps {
  question: SurveyQuestion;
  type: "client" | "candidate";
  title?: string;
  description?: string;
}

interface ChartDataItem {
  option: string;
  count: number;
}

const chartConfig = {
  count: {
    label: "Responses",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export function PaBarChart({
  question,
  type,
  title,
  description,
}: PaBarChartProps) {
  const [chartData, setChartData] = useState<ChartDataItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalResponses, setTotalResponses] = useState(0);

  useEffect(() => {
    const fetchResponseCounts = async () => {
      if (!question.options || question.type !== "radio") {
        setIsLoading(false);
        return;
      }

      try {
        // Fetch response counts for each option
        const response = await fetch(
          `/api/survey-analytics/${type}/question-responses`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              questionId: question.id.toString(),
              options: question.options,
            }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          setChartData(data.data);
          setTotalResponses(data.totalResponses);
        }
      } catch (error) {
        console.error("Error fetching response counts:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResponseCounts();
  }, [question, type]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title || "Loading..."}</CardTitle>
          <CardDescription>
            {description || "Fetching survey data..."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[200px] w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!question.options || question.type !== "radio") {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title || "Chart Not Available"}</CardTitle>
          <CardDescription>
            This question type doesn&apos;t support chart visualization
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[200px] text-muted-foreground">
            Only radio questions with options can be displayed as charts
          </div>
        </CardContent>
      </Card>
    );
  }

  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title || "No Data Available"}</CardTitle>
          <CardDescription>
            No responses found for this question
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[200px] text-muted-foreground">
            No survey responses available
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        {/* <CardTitle>{title || `Question ${question.id}`}</CardTitle> */}
        <CardTitle>
          <div className="flex items-start gap-2 h-12">
            <span className="flex items-center gap-1">
              <span className="font-sans text-sm">{question.id}</span>
              <ArrowRightIcon className="w-4 h-4" />
            </span>

            <h2 className="font-sans text-sm mb-4 relative">
              <span>{question.question}</span>
            </h2>
          </div>
        </CardTitle>
        <CardDescription className=""></CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              className="text-[10px]"
              dataKey="option"
              tickLine={false}
              tickMargin={2}
              axisLine={false}
              tickFormatter={(value) =>
                value.length > 25 ? value.slice(0, 25) + "..." : value
              }
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  hideLabel={false}
                  formatter={(value) =>
                    `${((Number(value) / totalResponses) * 100).toFixed(1)} %`
                  }
                />
              }
            />
            <Bar dataKey="count" fill="var(--chart-1)" radius={8} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          Total Responses: {totalResponses} <TrendingUp className="h-4 w-4" />
        </div>
        {/* <div className="text-muted-foreground leading-tight text-sm">
           {question.question}
        </div> */}
      </CardFooter>
    </Card>
  );
}
