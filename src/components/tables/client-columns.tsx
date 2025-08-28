"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Client } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Edit, Trash2, Mail } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export const clientColumns: ColumnDef<Client>[] = [
  {
    accessorKey: "clientName",
    header: "Client Name",
    cell: ({ row }) => {
      const client = row.original;
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
            <div className="text-sm text-gray-500">
              {client.representativeName}
            </div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "representativeEmail",
    header: "Email",
    cell: ({ row }) => (
      <div className="text-sm">{row.getValue("representativeEmail")}</div>
    ),
  },
  {
    accessorKey: "representativeMobile",
    header: "Mobile",
    cell: ({ row }) => (
      <div className="text-sm">{row.getValue("representativeMobile")}</div>
    ),
  },
  {
    accessorKey: "surveyEmailSent",
    header: "Survey Status",
    cell: ({ row }) => {
      const isSent = row.getValue("surveyEmailSent") as boolean;
      return (
        <Badge variant={isSent ? "default" : "secondary"}>
          {isSent ? "Sent" : "Pending"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "surveyEmailSentAt",
    header: "Sent Date",
    cell: ({ row }) => {
      const sentAt = row.getValue("surveyEmailSentAt") as Date | null;
      return (
        <div className="text-sm">
          {sentAt ? format(new Date(sentAt), "MMM dd, yyyy") : "-"}
        </div>
      );
    },
  },
  {
    accessorKey: "surveyCompleted",
    header: "Completion Status",
    cell: ({ row }) => {
      const isCompleted = row.getValue("surveyCompleted") as boolean;
      const completedAt = row.original.surveyCompletedAt;
      return (
        <div className="flex flex-col">
          <Badge variant={isCompleted ? "default" : "secondary"}>
            {isCompleted ? "Completed" : "Pending"}
          </Badge>
          {isCompleted && completedAt && (
            <div className="text-xs text-gray-500 mt-1">
              {format(new Date(completedAt), "MMM dd, yyyy")}
            </div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ row }) => {
      const createdAt = row.getValue("createdAt") as Date;
      return (
        <div className="text-sm">
          {format(new Date(createdAt), "MMM dd, yyyy")}
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const client = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(client.id)}
            >
              Copy client ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Mail className="mr-2 h-4 w-4" />
              Send Survey
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
