import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Mail } from "lucide-react";

interface SendEmailConfirmationDialogProps {
  trigger: React.ReactNode;
  title: string;
  description: string;
  onConfirm: () => void;
  isLoading?: boolean;
  clientName?: string;
  disabled?: boolean;
}

export function SendEmailConfirmationDialog({
  trigger,
  title,
  description,
  onConfirm,
  isLoading = false,
  clientName,
  disabled = false,
}: SendEmailConfirmationDialogProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild disabled={disabled}>
        {trigger}
      </AlertDialogTrigger>
      <AlertDialogContent className="font-sans">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-pa-imperial-indigo" />
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isLoading}
            className="bg-pa-imperial-indigo hover:bg-pa-imperial-indigo/80 focus:ring-pa-imperial-indigo"
          >
            {isLoading ? "Sending..." : "Send Email"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
