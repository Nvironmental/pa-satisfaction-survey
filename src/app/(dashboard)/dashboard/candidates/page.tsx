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
import { useRouter, useSearchParams } from "next/navigation";
import { PaBarChartDemo } from "@/components/charts/PaBarChartDemo";
import { PaBarChart } from "@/components/charts/PaBarChart";
import { candidate_questions } from "@/lib/questions";

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
    } catch (error) {
      console.error("Error refreshing candidates:", error);
    }
  };

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
      <SidebarInset>
        <SiteHeader title="Candidates" />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <Tabs defaultValue="candidate-list" className="w-full">
                <TabsList className="mx-5">
                  <TabsTrigger value="candidate-list">
                    Candidate List
                  </TabsTrigger>
                  <TabsTrigger value="analytics">
                    Candidate Survey Analytics
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="candidate-list">
                  <DataTable<Candidate, unknown>
                    forClient={false}
                    forCandidate={true}
                    columns={createCandidateColumns({
                      onSuccess: handleRefresh,
                      currentUserId: user.id,
                      onDeleteClick: (
                        candidateId: string,
                        candidateName: string
                      ) => {
                        // This will be handled by the column actions
                      },
                    })}
                    data={candidates}
                    searchPlaceholder="Search candidates..."
                    currentUserId={user.id}
                  />
                </TabsContent>

                <TabsContent value="analytics">
                  <div className="space-y-6 px-5 mt-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
