"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface ExportButtonProps {
  type: "clients" | "candidates";
  disabled?: boolean;
}

export function ExportButton({ type, disabled = false }: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);

    try {
      const response = await fetch(`/api/${type}/export`);

      if (!response.ok) {
        throw new Error(`Failed to export ${type}`);
      }

      // Get the filename from the Content-Disposition header
      const contentDisposition = response.headers.get("Content-Disposition");
      const filename = contentDisposition
        ? contentDisposition.split("filename=")[1]?.replace(/"/g, "")
        : `${type}-export-${new Date().toISOString().split("T")[0]}.csv`;

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

      toast.success(
        `${type.charAt(0).toUpperCase() + type.slice(1)} exported successfully!`
      );
    } catch (error) {
      console.error(`Error exporting ${type}:`, error);
      toast.error(`Failed to export ${type}. Please try again.`);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Button
      onClick={handleExport}
      disabled={disabled || isExporting}
      size="sm"
      variant="outline"
      className="bg-pa-sterling-mist text-pa-noble-black hover:bg-pa-sterling-mist/90"
    >
      {isExporting ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Exporting...
        </>
      ) : (
        <>
          <Download className="h-4 w-4 mr-2" />
          Export {type.slice(0, -1)} responses
        </>
      )}
    </Button>
  );
}
