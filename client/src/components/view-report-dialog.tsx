import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, FileText, Users, Tag } from "lucide-react";
import { format } from "date-fns";

interface ViewReportDialogProps {
    report: {
        id: string;
        title: string;
        description: string;
        category: string;
        recordCount: number;
        created_at?: string;
        generatedBy?: string;
    } | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const categoryColors: Record<string, string> = {
    enrollment: "bg-chart-1 text-white",
    membership: "bg-chart-2 text-white",
    activities: "bg-chart-3 text-white",
    financial: "bg-chart-4 text-white",
};

export function ViewReportDialog({ report, open, onOpenChange }: ViewReportDialogProps) {
    if (!report) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <div className="flex items-center justify-between">
                        <DialogTitle className="text-xl">{report.title}</DialogTitle>
                        <Badge className={categoryColors[report.category] || "bg-secondary"}>
                            {report.category.charAt(0).toUpperCase() + report.category.slice(1)}
                        </Badge>
                    </div>
                    <DialogDescription>
                        Report Details
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <h4 className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
                            <FileText className="h-4 w-4" /> Description
                        </h4>
                        <p className="text-sm bg-muted/50 p-3 rounded-md">{report.description}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <h4 className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
                                <Users className="h-4 w-4" /> Records
                            </h4>
                            <p className="text-sm font-semibold">{report.recordCount}</p>
                        </div>

                        <div className="space-y-1">
                            <h4 className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
                                <Calendar className="h-4 w-4" /> Created
                            </h4>
                            <p className="text-sm font-semibold">
                                {report.created_at ? format(new Date(report.created_at), "PPP p") : "N/A"}
                            </p>
                        </div>

                        <div className="space-y-1">
                            <h4 className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
                                <Tag className="h-4 w-4" /> Category
                            </h4>
                            <p className="text-sm font-semibold capitalize">{report.category}</p>
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button onClick={() => onOpenChange(false)}>Close</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
