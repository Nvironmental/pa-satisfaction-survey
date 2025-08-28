"use client";

import { useState } from "react";
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
import { clientApi } from "@/lib/api";
import { CreateClientInput, Client } from "@/lib/types";
import { toast } from "sonner";
import { Edit, Loader2, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { usePathname, useSearchParams } from "next/navigation";
import { useCreateQueryString } from "@/hooks/queryString";

interface ClientFormProps {
  onSuccess?: () => void;
  client?: Client;
  mode?: "create" | "edit";
  currentUserId?: string;
}

export function ClientForm({
  onSuccess,
  client,
  mode = "create",
  currentUserId,
}: ClientFormProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<CreateClientInput>({
    clientName: client?.clientName || "",
    clientLogo: client?.clientLogo || "",
    representativeName: client?.representativeName || "",
    representativeEmail: client?.representativeEmail || "",
    representativeMobile: client?.representativeMobile || "",
    surveySchema: client?.surveySchema || undefined,
    createdBy: currentUserId || "",
  });

  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { createQueryString } = useCreateQueryString();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!currentUserId) {
      toast.error("User session not found. Please log in again.");
      return;
    }
    if (!formData.clientName.trim()) {
      toast.error("Client name is required");
      return;
    }
    if (!formData.representativeName.trim()) {
      toast.error("Representative name is required");
      return;
    }
    if (!formData.representativeEmail.trim()) {
      toast.error("Representative email is required");
      return;
    }
    if (!formData.representativeMobile.trim()) {
      toast.error("Representative mobile is required");
      return;
    }

    setIsLoading(true);

    try {
      if (mode === "edit" && client) {
        await clientApi.updateClient(client.id, formData as Partial<Client>);
        toast.success("Client updated successfully!");
        router.push(
          pathname +
            "?" +
            createQueryString("refresh", JSON.stringify(new Date().getTime()))
        );
      } else {
        await clientApi.createClient(formData);
        toast.success("Client created successfully!");
        router.push(
          pathname +
            "?" +
            createQueryString("refresh", JSON.stringify(new Date().getTime()))
        );
      }
      setOpen(false);
      setFormData({
        clientName: "",
        clientLogo: "",
        representativeName: "",
        representativeEmail: "",
        representativeMobile: "",
        surveySchema: undefined,
        createdBy: currentUserId || "",
      });
      onSuccess?.();
    } catch (error) {
      const action = mode === "edit" ? "update" : "create";
      toast.error(`Failed to ${action} client. Please try again.`);
      console.error(`Error ${action}ing client:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof CreateClientInput, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <Dialog modal={mode === "edit"} open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {mode === "create" ? (
          <Button size="sm" className="bg-pa-noble-black text-pa-sterling-mist">
            <Plus className="h-4 w-4 mr-2" />
            Add Client
          </Button>
        ) : (
          <div
            role="button"
            className="hover:bg-accent hover:text-accent-foreground text-xs data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/20 data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:*:[svg]:!text-destructive [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit Client
          </div>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] font-sans">
        <DialogHeader>
          <DialogTitle className="font-bold text-2xl">
            {mode === "edit" ? "Edit Client" : "Add New Client"}
          </DialogTitle>
          {/* <DialogDescription>
            {mode === "edit"
              ? "Update the client information below."
              : "Fill in the required information below."}
          </DialogDescription> */}
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="clientName">Client Name *</Label>
              <Input
                className="h-12 placeholder:opacity-50"
                id="clientName"
                value={formData.clientName}
                onChange={(e) =>
                  handleInputChange("clientName", e.target.value)
                }
                placeholder="Acme Inc."
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="clientLogo">Client Logo URL</Label>
              <Input
                className="h-12 placeholder:opacity-50"
                id="clientLogo"
                value={formData.clientLogo || ""}
                onChange={(e) =>
                  handleInputChange("clientLogo", e.target.value)
                }
                placeholder="https://example.com/logo.png"
                type="url"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="representativeName">Representative Name *</Label>
            <Input
              className="h-12 placeholder:opacity-50"
              id="representativeName"
              value={formData.representativeName}
              onChange={(e) =>
                handleInputChange("representativeName", e.target.value)
              }
              placeholder="Jane Doe"
              required
            />
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="representativeEmail">
                Representative Email *
              </Label>
              <Input
                className="h-12 placeholder:opacity-50"
                id="representativeEmail"
                value={formData.representativeEmail}
                onChange={(e) =>
                  handleInputChange("representativeEmail", e.target.value)
                }
                placeholder="jane@example.com"
                type="email"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="representativeMobile">
                Representative Mobile *
              </Label>
              <Input
                className="h-12 placeholder:opacity-50"
                id="representativeMobile"
                value={formData.representativeMobile}
                onChange={(e) =>
                  handleInputChange("representativeMobile", e.target.value)
                }
                placeholder="+1234567890"
                type="tel"
                required
              />
            </div>
          </div>

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
                "Update Client"
              ) : (
                "Create Client"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
