"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { candidateApi } from "@/lib/api";
import { Candidate, CreateCandidateInput } from "@/lib/types";
import { toast } from "sonner";
import { Edit, Loader2, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { usePathname, useSearchParams } from "next/navigation";
import { useCreateQueryString } from "@/hooks/queryString";

interface CandidateFormProps {
  onSuccess?: () => void;
  currentUserId?: string;
  mode?: "add" | "edit";
  candidate?: Candidate;
}

// Form data type without createdBy for internal state
interface CandidateFormData {
  candidateName: string;
  candidateEmail: string;
  candidateMobile: string;
  surveySchema: Record<string, unknown> | null;
  surveyCompleted: boolean;
  surveyCompletedAt: Date | undefined;
  createdBy: string;
}

export function CandidateForm({
  onSuccess,
  currentUserId,
  mode = "add",
  candidate,
}: CandidateFormProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<CandidateFormData>({
    candidateName: candidate?.candidateName || "",
    candidateEmail: candidate?.candidateEmail || "",
    candidateMobile: candidate?.candidateMobile || "",
    surveySchema: candidate?.surveySchema || null,
    surveyCompleted: candidate?.surveyCompleted || false,
    surveyCompletedAt: candidate?.surveyCompletedAt || undefined,
    createdBy: currentUserId || "",
  });

  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { createQueryString } = useCreateQueryString();

  // Update form data when candidate prop changes (for edit mode)
  useEffect(() => {
    if (candidate && mode === "edit") {
      setFormData({
        candidateName: candidate.candidateName || "",
        candidateEmail: candidate.candidateEmail || "",
        candidateMobile: candidate.candidateMobile || "",
        surveySchema: candidate.surveySchema || null,
        surveyCompleted: candidate.surveyCompleted || false,
        surveyCompletedAt: candidate.surveyCompletedAt || undefined,
        createdBy: currentUserId || "",
      });
    }
  }, [candidate, mode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!formData.candidateName.trim()) {
      toast.error("Candidate name is required");
      return;
    }
    if (!formData.candidateEmail.trim()) {
      toast.error("Candidate email is required");
      return;
    }
    if (!formData.candidateMobile.trim()) {
      toast.error("Candidate mobile is required");
      return;
    }

    if (!currentUserId) {
      toast.error("User not authenticated");
      return;
    }

    setIsLoading(true);

    try {
      if (mode === "edit" && candidate) {
        // For updates, send all form data plus updatedBy
        await candidateApi.updateCandidate(candidate.id, {
          ...formData,
          updatedBy: currentUserId,
        });
        toast.success("Candidate updated successfully!");
        router.push(
          pathname +
            "?" +
            createQueryString("refresh", JSON.stringify(new Date().getTime()))
        );
      } else {
        // For creation, send form data plus createdBy
        await candidateApi.createCandidate({
          ...formData,
          createdBy: currentUserId,
        });
        toast.success("Candidate created successfully!");
        router.push(
          pathname +
            "?" +
            createQueryString("refresh", JSON.stringify(new Date().getTime()))
        );
      }

      setOpen(false);
      setFormData({
        candidateName: "",
        candidateEmail: "",
        candidateMobile: "",
        surveySchema: null,
        surveyCompleted: false,
        surveyCompletedAt: undefined,
        createdBy: currentUserId || "",
      });
      onSuccess?.();
    } catch (error) {
      toast.error(`${error}`);
      console.error(
        `Error ${mode === "edit" ? "updating" : "creating"} candidate:`,
        error
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (
    field: keyof CreateCandidateInput,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <Dialog modal={mode === "edit"} open={open} onOpenChange={setOpen}>
      {/* <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Candidate
        </Button>
      </DialogTrigger> */}
      <DialogTrigger asChild>
        {mode === "add" ? (
          <Button size="sm" className="bg-pa-noble-black text-pa-sterling-mist">
            <Plus className="h-4 w-4 mr-2" />
            Add Candidate
          </Button>
        ) : (
          <div
            role="button"
            className="hover:bg-accent hover:text-accent-foreground text-xs data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/20 data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:*:[svg]:!text-destructive [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit Candidate
          </div>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] font-sans">
        <DialogHeader>
          <DialogTitle className="font-bold text-2xl">
            {mode === "edit" ? "Edit Candidate" : "Add New Candidate"}
          </DialogTitle>
          {/* <DialogDescription>
            {mode === "edit"
              ? "Update candidate information below."
              : "Create a new candidate record. Fill in the required information below."}
          </DialogDescription> */}
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="candidateName">Candidate Name *</Label>
            <Input
              className="h-12 placeholder:opacity-50"
              id="candidateName"
              value={formData.candidateName}
              onChange={(e) =>
                handleInputChange("candidateName", e.target.value)
              }
              placeholder="Jane Doe"
              required
            />
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="candidateEmail">Email *</Label>
              <Input
                className="h-12 placeholder:opacity-50"
                id="candidateEmail"
                value={formData.candidateEmail}
                onChange={(e) =>
                  handleInputChange("candidateEmail", e.target.value)
                }
                placeholder="jane@example.com"
                type="email"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="candidateMobile">Mobile *</Label>
              <Input
                className="h-12 placeholder:opacity-50"
                id="candidateMobile"
                value={formData.candidateMobile}
                onChange={(e) =>
                  handleInputChange("candidateMobile", e.target.value)
                }
                placeholder="+1234567890"
                type="tel"
                required
              />
            </div>
          </div>

          {/* <div className="space-y-2">
            <Label htmlFor="surveySchema">Survey Schema (Optional)</Label>
            <Textarea
              id="surveySchema"
              value={
                formData.surveySchema
                  ? JSON.stringify(formData.surveySchema, null, 2)
                  : ""
              }
              onChange={(e) => {
                try {
                  const parsed = e.target.value
                    ? JSON.parse(e.target.value)
                    : null;
                  setFormData((prev) => ({ ...prev, surveySchema: parsed }));
                } catch (error) {
                  // Invalid JSON, don't update
                }
              }}
              placeholder='{"questions": [{"id": 1, "question": "How satisfied are you?", "type": "radio", "options": ["Very Satisfied", "Satisfied", "Neutral", "Dissatisfied"]}]}'
              rows={4}
            />
            <p className="text-xs text-gray-500">
              Enter JSON format for survey schema. Leave empty if not needed.
            </p>
          </div> */}

          {/* <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-xs text-blue-700">
              <strong>Note:</strong> Survey completion status will be
              automatically tracked when candidates complete their surveys.
            </p>
          </div> */}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {mode === "edit" ? "Updating..." : "Creating..."}
                </>
              ) : mode === "edit" ? (
                "Update Candidate"
              ) : (
                "Create Candidate"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
