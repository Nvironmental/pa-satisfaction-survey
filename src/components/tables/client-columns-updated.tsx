"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { format, formatDistanceToNow } from "date-fns";
import {
  MoreHorizontal,
  Edit,
  Mail,
  Trash2,
  Copy,
  CheckCircle,
  Clock,
  XCircle,
  User,
  CircleUserRound,
} from "lucide-react";
import { Client } from "@/lib/types";
import { ClientForm } from "@/components/forms/client-form";
import SurveyResultsSheet from "@/components/survey-results-sheet";
import { toast } from "sonner";
import { DeleteConfirmationDialog } from "@/components/ui/delete-confirmation-dialog";
import { clientApi } from "@/lib/api";
import { useRouter } from "next/navigation";
import { usePathname, useSearchParams } from "next/navigation";
import { useCreateQueryString } from "@/hooks/queryString";

interface ClientColumnsProps {
  onSuccess?: () => void;
  currentUserId?: string;
  onDeleteClick?: (clientId: string, clientName: string) => void;
}

export function createClientColumns({
  onSuccess,
  currentUserId,
  onDeleteClick,
}: ClientColumnsProps): ColumnDef<Client>[] {
  const handleSendSurveyEmail = async (client: Client) => {
    if (!currentUserId) {
      toast.error("User not authenticated");
      return;
    }

    try {
      toast.loading("Sending survey email...");
      // Call the API endpoint which handles both email sending and client record update
      const result = await clientApi.sendSurveyEmail(client.id, {
        surveyEmailSentBy: currentUserId,
        surveyEmailSentAt: new Date(),
      });

      toast.dismiss();

      if (result) {
        toast.success("Survey email sent successfully!");
        //close the loading toast
        onSuccess?.();
      }
    } catch (error) {
      toast.error("Failed to send survey email");
      console.error("Error sending survey email:", error);
    }
  };

  const copySurveyLink = (clientId: string) => {
    const surveyLink = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/client-satisfaction-survey/${clientId}`;
    navigator.clipboard.writeText(surveyLink);
    toast.success("Survey link copied to clipboard");
  };

  return [
    {
      accessorKey: "clientName",
      header: "Client Name",
      cell: ({ row }) => {
        const client = row.original;

        if (client.surveyCompleted) {
          return (
            <div className="flex items-center space-x-3">
              {client.clientLogo && (
                <img
                  src={client.clientLogo}
                  alt={client.clientName}
                  className="h-8 w-8 rounded-full object-cover"
                />
              )}
              <SurveyResultsSheet
                clientId={client.id}
                clientName={client.clientName}
              >
                <div className="border-b border-dotted border-gray-400 hover:border-gray-600 transition-colors cursor-pointer">
                  <div className="font-medium">{client.clientName}</div>
                </div>
              </SurveyResultsSheet>
            </div>
          );
        }

        return (
          <div className="flex items-center space-x-3">
            {client.clientLogo && (
              <img
                src={client.clientLogo}
                alt={client.clientName}
                className="h-8 w-8 rounded-full object-cover"
              />
            )}
            <div>
              <div className="font-medium">{client.clientName}</div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "representativeName",
      header: "Representative",
      cell: ({ row }) => {
        const client = row.original;
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="font-sans">
                  <span className="border-b border-dotted border-gray-400">
                    {client.representativeName}
                  </span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <div className="space-y-1 font-sans">
                  <div>
                    <strong>Email:</strong> {client.representativeEmail}
                  </div>
                  <div>
                    <strong>Mobile:</strong> {client.representativeMobile}
                  </div>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      },
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
                <Badge className="flex items-center gap-1 bg-pa-carmine-rush">
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
              <Badge variant="secondary" className="flex items-center gap-1">
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
          style = "bg-pa-carmine-rush";
          icon = <CheckCircle className="h-4 w-4" />;
        } else if (isSent) {
          status = "In Progress";
          variant = "default";
          style = "bg-pa-royal-azure";
          icon = <Clock className="h-4 w-4" />;
        } else {
          status = "Not Taken";
          variant = "secondary";
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
      accessorKey: "createdAt",
      header: "Created",
      cell: ({ row }) => {
        const client = row.original;
        return (
          <div className="flex flex-col items-start space-x-2 text-xs">
            <div className="flex items-start gap-2">
              <CircleUserRound className="h-4 w-4 opacity-25" />
              <div className="flex flex-col">
                <span>{client.creator?.name}</span>
                <span className="text-xs opacity-50">
                  {formatDistanceToNow(new Date(client.createdAt), {
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
        const client = row.original;
        const isCompleted = client.surveyCompleted;
        const isEmailSent = client.surveyEmailSent;

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
                  onClick={() => copySurveyLink(client.id)}
                >
                  <Copy className="mr-2 h-4 w-4" />
                  Copy Survey Link
                </DropdownMenuItem>

                <DialogTrigger asChild>
                  <DropdownMenuItem asChild className="text-xs">
                    <ClientForm
                      mode="edit"
                      client={client}
                      onSuccess={onSuccess}
                      currentUserId={currentUserId}
                    />
                  </DropdownMenuItem>
                </DialogTrigger>

                <DropdownMenuItem
                  onClick={() => handleSendSurveyEmail(client)}
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
                      Delete Client
                    </DropdownMenuItem>
                  }
                  title="Delete Client"
                  description={`Are you sure you want to delete "${client.clientName}"? This action cannot be undone and will also delete all associated survey responses.`}
                  onConfirm={() =>
                    onDeleteClick?.(client.id, client.clientName)
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
