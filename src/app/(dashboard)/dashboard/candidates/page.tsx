"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataTable } from "@/components/tables/data-table";
import { createCandidateColumns } from "@/components/tables/candidate-columns";
import { CandidateForm } from "@/components/forms/candidate-form";
import { candidateApi } from "@/lib/api";
import { authClient } from "@/lib/auth-client";
import { Candidate, SurveyQuestion } from "@/lib/types";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import DashboardLayoutLoader from "@/components/DashboardLayoutLoader";
import { SiteHeader } from "@/components/site-header";
import { useRouter } from "next/navigation";
import { PaBarChartDemo } from "@/components/charts/PaBarChartDemo";
import { PaBarChart } from "@/components/charts/PaBarChart";
import { candidate_questions } from "@/lib/questions";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

export default function CandidatesPage() {
  const router = useRouter();
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [user, setUser] = useState<{
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get user session
        const { data: session } = await authClient.getSession();
        if (session?.user) {
          setUser(session.user);

          // Fetch candidates
          const candidatesData = await candidateApi.getCandidates();
          // Extract the data from the paginated response
          setCandidates(candidatesData?.data || []);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return <DashboardLayoutLoader />;
  }

  // if (!user) {
  //   return (
  //     <div className="flex items-center justify-center h-full">
  //       <p>Please sign in to view candidates</p>
  //     </div>
  //   );
  // }

  if (!user) {
    router.push("/dashboard");
    return null;
  }

  const handleRefresh = async () => {
    try {
      const candidatesData = await candidateApi.getCandidates();
      setCandidates(candidatesData?.data || []);

      // Also trigger URL refresh for DataTable
      const params = new URLSearchParams(window.location.search);
      params.set("refresh", Date.now().toString());
      router.push(`${window.location.pathname}?${params.toString()}`);
    } catch (error) {
      console.error("Error refreshing candidates:", error);
    }
  };

  const score =
    (candidates.reduce((acc, candidate) => acc + (candidate.score || 0), 0) /
      candidates.filter((candidate) => candidate.surveyCompleted).length) *
    100;

  const badgeClasses = {
    low: "bg-pa-cardinal-red text-white font-bold",
    medium: "bg-amber-600 text-white font-bold",
    high: "bg-pa-imperial-indigo text-white font-bold",
    perfect: "bg-pa-carmine-rush text-white font-bold",
  };

  // https://www.marcomrobot.com/blog/what-is-a-good-csat-score

  const badgeClass =
    score < 40
      ? badgeClasses.low
      : score > 40 && score < 60
        ? badgeClasses.medium
        : score > 60 && score < 80
          ? badgeClasses.high
          : badgeClasses.perfect;

  return (
    <SidebarProvider
      className="min-h-[100dvh] font-sans"
      style={
        {
          "--sidebar-width": "calc(var(--spacing)*72)",
          "--header-height": "calc(var(--spacing)*12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar
        variant="inset"
        user={{
          name: user.name || user.email?.split("@")[0] || "User",
          email: user.email || "",
          avatar: user.image || "/avatars/default-avatar.svg",
        }}
      />
      <SidebarInset
        className="!ml-4 bg-no-repeat bg-cover bg-center"
        style={{ backgroundImage: "url('/bg.jpg')" }}
      >
        <SiteHeader title="Candidate Survey Dashboard" />
        <div className="flex flex-1 flex-col rounded-md bg-[rgba(255,255,255,0.55)]">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <Tabs defaultValue="candidate-list" className="w-full">
                <div className="flex items-center justify-between">
                  <TabsList className="mx-5 bg-pa-midnight-regent/10">
                    <TabsTrigger value="candidate-list">
                      Candidate List
                    </TabsTrigger>
                    <TabsTrigger value="analytics">
                      Candidate Survey Analytics
                    </TabsTrigger>
                  </TabsList>

                  <div className="px-5">
                    <Badge variant="outline" className={`py-2`}>
                      <span>Average CSAT Score</span>

                      <span
                        className={`font-bold p-1 ${badgeClass} rounded-md flex items-center gap-0.5`}
                      >
                        <span>{score.toFixed(0)}%</span>
                      </span>
                    </Badge>
                  </div>
                </div>
                <TabsContent value="candidate-list">
                  <DataTable<Candidate, unknown>
                    forClient={false}
                    forCandidate={true}
                    columns={createCandidateColumns({
                      onSuccess: handleRefresh,
                      currentUserId: user.id,
                      isSendingEmail,
                      setIsSendingEmail,
                      onDeleteClick: async (
                        candidateId: string,
                        candidateName: string
                      ) => {
                        try {
                          toast.loading("Deleting candidate...");
                          await candidateApi.deleteCandidate(candidateId);
                          toast.dismiss();
                          toast.success("Candidate deleted successfully");
                          handleRefresh(); // Refresh the table
                        } catch (error) {
                          console.error("Error deleting candidate:", error);
                          toast.error("Failed to delete candidate");
                        }
                      },
                    })}
                    data={candidates}
                    searchPlaceholder="Search candidates..."
                    currentUserId={user.id}
                    apiEndpoint="/api/candidates"
                  />
                </TabsContent>

                <TabsContent value="analytics">
                  <div className="space-y-6 px-5 mt-8">
                    <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                      <PaBarChart
                        question={candidate_questions[1] as SurveyQuestion}
                        type="candidate"
                      />
                      <PaBarChart
                        question={candidate_questions[2] as SurveyQuestion}
                        type="candidate"
                      />
                      <PaBarChart
                        question={candidate_questions[3] as SurveyQuestion}
                        type="candidate"
                      />
                      <PaBarChart
                        question={candidate_questions[4] as SurveyQuestion}
                        type="candidate"
                      />
                      <PaBarChart
                        question={candidate_questions[5] as SurveyQuestion}
                        type="candidate"
                      />
                      <PaBarChart
                        question={candidate_questions[6] as SurveyQuestion}
                        type="candidate"
                      />
                      <PaBarChart
                        question={candidate_questions[7] as SurveyQuestion}
                        type="candidate"
                      />
                      <PaBarChart
                        question={candidate_questions[8] as SurveyQuestion}
                        type="candidate"
                      />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
