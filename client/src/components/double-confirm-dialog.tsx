import { useState, useEffect } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface DoubleConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  isLoading?: boolean;
}

export function DoubleConfirmDialog({
  open,
  onOpenChange,
  onConfirm,
  title,
  description,
  confirmText = "Delete",
  isLoading = false,
}: DoubleConfirmDialogProps) {
  const [step, setStep] = useState<1 | 2>(1);

  // Reset to step 1 whenever the dialog opens
  useEffect(() => {
    if (open) {
      setStep(1);
    }
  }, [open]);

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setStep(1); // Reset to step 1 when closing
    }
    onOpenChange(newOpen);
  };

  const handleFirstConfirm = () => {
    setStep(2);
  };

  const handleFinalConfirm = () => {
    onConfirm();
    setStep(1); // Reset for next time
    onOpenChange(false); // Close the dialog
  };

  const handleCancel = () => {
    setStep(1);
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className={`h-6 w-6 ${step === 2 ? "text-destructive animate-pulse" : "text-amber-500"}`} />
            <AlertDialogTitle>
              {step === 1 ? title : "Final Confirmation Required"}
            </AlertDialogTitle>
          </div>
          <AlertDialogDescription asChild>
            <div className="space-y-2">
              {step === 1 ? (
                <>
                  <div>{description}</div>
                  <div className="font-medium text-foreground">
                    This action cannot be undone.
                  </div>
                </>
              ) : (
                <>
                  <div className="font-semibold text-destructive text-base">
                    ⚠️ Are you absolutely sure?
                  </div>
                  <div>
                    This is the final warning. The data will be permanently deleted from the database.
                  </div>
                  <div className="font-medium text-foreground">
                    Click "{confirmText}" again to proceed with deletion.
                  </div>
                </>
              )}
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancel} disabled={isLoading}>
            Cancel
          </AlertDialogCancel>
          {step === 1 ? (
            <Button
              onClick={handleFirstConfirm}
              className="bg-amber-500 hover:bg-amber-600 text-white"
            >
              Continue
            </Button>
          ) : (
            <AlertDialogAction
              onClick={handleFinalConfirm}
              disabled={isLoading}
              className="bg-destructive hover:bg-destructive/90"
            >
              {isLoading ? "Deleting..." : confirmText}
            </AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

