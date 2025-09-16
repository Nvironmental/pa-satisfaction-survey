"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileText, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface PdfExportButtonProps {
  clientId: string;
  clientName: string;
  surveyCompleted: boolean;
  disabled?: boolean;
}

export function PdfExportButton({
  clientId,
  clientName,
  surveyCompleted,
  disabled = false,
}: PdfExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    if (!surveyCompleted) {
      toast.error("Survey must be completed before exporting PDF");
      return;
    }

    setIsExporting(true);

    try {
      const response = await fetch(`/api/clients/${clientId}/export-pdf`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `Failed to export PDF for ${clientName}`
        );
      }

      // Get the filename from the Content-Disposition header
      const contentDisposition = response.headers.get("Content-Disposition");
      const filename = contentDisposition
        ? contentDisposition.split("filename=")[1]?.replace(/"/g, "")
        : `${clientName.replace(/[^a-zA-Z0-9]/g, "_")}-SurveyReport-${new Date().toISOString().split("T")[0]}.pdf`;

      // Create blob and download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success(`PDF report exported successfully for ${clientName}!`);
    } catch (error) {
      console.error(`Error exporting PDF for ${clientName}:`, error);
      toast.error(`Failed to export PDF for ${clientName}. Please try again.`);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Button
      onClick={handleExport}
      disabled={disabled || isExporting || !surveyCompleted}
      size="sm"
      variant="outline"
      className="text-xs !p-0 border-none !bg-transparent !shadow-none !h-auto font-normal"
      title={
        !surveyCompleted
          ? "Survey must be completed to export PDF"
          : "Export PDF report"
      }
    >
      {isExporting ? (
        <>
          <Loader2 className="h-3 w-3 mr-2.5 animate-spin" />
          Exporting...
        </>
      ) : (
        <>
          <FileText className="h-3 w-3 mr-2.5" />
          Export PDF
        </>
      )}
    </Button>
  );
}
