"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Candidate } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  MoreHorizontal,
  Edit,
  Trash2,
  Mail,
  Copy,
  CheckCircle,
  Clock,
  XCircle,
  User,
  CircleUserRound,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { format, formatDistanceToNow } from "date-fns";
import { CandidateForm } from "@/components/forms/candidate-form";
import CandidateSurveyResultsSheet from "@/components/candidate-survey-results-sheet";
import { toast } from "sonner";
import { DeleteConfirmationDialog } from "@/components/ui/delete-confirmation-dialog";
import { candidateApi } from "@/lib/api";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { useCreateQueryString } from "@/hooks/queryString";
import { useRouter } from "next/navigation";
import { usePathname, useSearchParams } from "next/navigation";

interface CandidateColumnsProps {
  onSuccess?: () => void;
  currentUserId?: string;
  onDeleteClick?: (candidateId: string, candidateName: string) => void;
}

export function createCandidateColumns({
  onSuccess,
  currentUserId,
  onDeleteClick,
}: CandidateColumnsProps): ColumnDef<Candidate>[] {
  const handleSendSurveyEmail = async (candidate: Candidate) => {
    if (!currentUserId) {
      toast.error("User not authenticated");
      return;
    }

    try {
      toast.loading("Sending survey email...");
      // Call the API endpoint which handles both email sending and candidate record update
      const result = await candidateApi.sendSurveyEmail(candidate.id, {
        surveyEmailSentBy: currentUserId,
        surveyEmailSentAt: new Date(),
      });

      toast.dismiss();

      if (result) {
        toast.success("Survey email sent successfully!");
        onSuccess?.();
      }
    } catch (error) {
      toast.error("Failed to send survey email");
      console.error("Error sending survey email:", error);
    }
  };

  const copySurveyLink = (candidateId: string) => {
    const surveyLink = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/candidate-satisfaction-survey/${candidateId}`;
    navigator.clipboard.writeText(surveyLink);
    toast.success("Survey link copied to clipboard");
  };

  return [
    {
      accessorKey: "candidateName",
      header: "Candidate Name",
      cell: ({ row }) => {
        const candidate = row.original;

        if (candidate.surveyCompleted) {
          return (
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-sm font-medium text-gray-600">
                  {candidate?.candidateName?.charAt(0).toUpperCase()}
                </span>
              </div>
              <CandidateSurveyResultsSheet
                candidateId={candidate.id}
                candidateName={candidate.candidateName}
              >
                <div className="border-b border-dotted border-gray-400 hover:border-gray-600 transition-colors cursor-pointer">
                  <div className="font-medium">{candidate.candidateName}</div>
                  {/* <div className="text-sm text-gray-500">
                    {candidate.candidateEmail}
                  </div> */}
                </div>
              </CandidateSurveyResultsSheet>
            </div>
          );
        }

        return (
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-sm font-medium text-gray-600">
                {candidate?.candidateName?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <div className="font-medium">{candidate.candidateName}</div>
              {/* <div className="text-sm text-gray-500">
                {candidate.candidateEmail}
              </div> */}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "candidateEmail",
      header: "Email",
      cell: ({ row }) => (
        <div className="text-sm">{row.getValue("candidateEmail")}</div>
      ),
    },
    {
      accessorKey: "surveyEmailSent",
      header: "Survey Email Status",
      cell: ({ row }) => {
        const isSent = row.getValue("surveyEmailSent") as boolean;
        const sentAt = row.original.surveyEmailSentAt;

        return (
          <div className="flex flex-col">
            {isSent ? (
              <>
                <Badge className="flex items-center gap-1 bg-pa-carmine-rush/10 text-pa-carmine-rush font-bold">
                  <CheckCircle className="h-4 w-4" />
                  Sent -{" "}
                  {sentAt ? (
                    <span className="opacity-50">
                      {formatDistanceToNow(new Date(sentAt), {
                        addSuffix: true,
                      })}
                    </span>
                  ) : null}
                </Badge>
              </>
            ) : (
              <Badge
                variant="secondary"
                className="flex items-center gap-1 font-bold"
              >
                <XCircle className="h-4 w-4" />
                Not Sent
              </Badge>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "surveyCompleted",
      header: "Completion Status",
      cell: ({ row }) => {
        const isCompleted = row.getValue("surveyCompleted") as boolean;
        const isSent = row.getValue("surveyEmailSent") as boolean;

        let status: "Not Taken" | "In Progress" | "Completed";
        let style: string = "";
        let variant: "secondary" | "default" | "destructive" = "secondary";
        let icon = <XCircle className="h-4 w-4" />;

        if (isCompleted) {
          status = "Completed";
          variant = "default";
          style = "bg-pa-carmine-rush/10 text-pa-carmine-rush font-bold";
          icon = <CheckCircle className="h-4 w-4" />;
        } else if (isSent) {
          status = "In Progress";
          variant = "default";
          style = "bg-pa-royal-azure/10 text-pa-royal-azure font-bold";
          icon = <Clock className="h-4 w-4" />;
        } else {
          status = "Not Taken";
          variant = "secondary";
          style = "font-bold";
          icon = <XCircle className="h-4 w-4" />;
        }

        return (
          <Badge
            variant={variant}
            className={`flex items-center gap-1 ${style}`}
          >
            {icon}
            {status}
            {isCompleted && row.original.surveyCompletedAt && (
              <span className="text-xs opacity-50">
                -{" "}
                {formatDistanceToNow(new Date(row.original.surveyCompletedAt), {
                  addSuffix: true,
                })}
              </span>
            )}
          </Badge>
        );
      },
    },
    {
      accessorKey: "score",
      header: "CSAT Score",
      cell: ({ row }) => {
        const score = (row.original.score as number) || 0;
        const isCompleted = row.original.surveyCompleted;
        const badgeClasses = {
          low: "bg-pa-cardinal-red text-white font-bold",
          medium: "bg-amber-600 text-white font-bold",
          high: "bg-pa-imperial-indigo text-white font-bold",
          perfect: "bg-pa-carmine-rush text-white font-bold",
        };

        // https://www.marcomrobot.com/blog/what-is-a-good-csat-score

        const badgeClass =
          score < 0.4
            ? badgeClasses.low
            : score > 0.4 && score < 0.6
              ? badgeClasses.medium
              : score > 0.6 && score < 0.8
                ? badgeClasses.high
                : badgeClasses.perfect;

        return (
          <>
            {isCompleted ? (
              <div className="flex justify-center">
                <Badge className={`${badgeClass} text-xs`}>
                  {(score * 100).toFixed(0) + "%"}
                </Badge>
              </div>
            ) : (
              <p className="text-xs opacity-50 text-center">-</p>
            )}
          </>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "Created",
      cell: ({ row }) => {
        const candidate = row.original;
        return (
          // <div className="text-sm">
          //   {formatDistanceToNow(new Date(candidate.createdAt), {
          //     addSuffix: true,
          //   })}
          // </div>
          <div className="flex flex-col items-start space-x-2 text-xs">
            <div className="flex items-start gap-2">
              <CircleUserRound className="h-4 w-4 opacity-25" />
              <div className="flex flex-col">
                <span>{candidate.creator?.name}</span>
                <span className="text-xs opacity-50">
                  {formatDistanceToNow(new Date(candidate.createdAt), {
                    addSuffix: true,
                  })}
                </span>
              </div>
            </div>
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const candidate = row.original;
        const isCompleted = candidate.surveyCompleted;
        const isEmailSent = candidate.surveyEmailSent;

        return (
          <Dialog>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="min-w-[200px] max-w-[250px] font-sans text-xs"
              >
                <DropdownMenuItem
                  className="text-xs"
                  onClick={() => copySurveyLink(candidate.id)}
                >
                  <Copy className="mr-2 h-4 w-4" />
                  Copy Survey Link
                </DropdownMenuItem>

                <DialogTrigger asChild>
                  <DropdownMenuItem asChild className="text-xs">
                    <CandidateForm
                      mode="edit"
                      candidate={candidate}
                      onSuccess={onSuccess}
                      currentUserId={currentUserId}
                    />
                  </DropdownMenuItem>
                </DialogTrigger>

                <DropdownMenuItem
                  onClick={() => handleSendSurveyEmail(candidate)}
                  disabled={isCompleted}
                  className={`text-xs ${
                    isCompleted ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  <Mail className="mr-2 h-4 w-4" />
                  Send Survey Email
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DeleteConfirmationDialog
                  trigger={
                    <DropdownMenuItem
                      onSelect={(e) => e.preventDefault()}
                      className="text-red-600 text-xs"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete Candidate
                    </DropdownMenuItem>
                  }
                  title="Delete Candidate"
                  description={`Are you sure you want to delete "${candidate.candidateName}"? This action cannot be undone and will also delete all associated survey responses.`}
                  onConfirm={() =>
                    onDeleteClick?.(candidate.id, candidate.candidateName)
                  }
                />
              </DropdownMenuContent>
            </DropdownMenu>
          </Dialog>
        );
      },
    },
  ];
}
