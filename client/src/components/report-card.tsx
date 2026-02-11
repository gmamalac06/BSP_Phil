import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Printer } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ReportCardProps {
  report: {
    id: string;
    title: string;
    description: string;
    category: "enrollment" | "membership" | "activities" | "financial";
    recordCount: number;
    created_at?: string;
  };
  onGenerate?: (id: string) => void;
  onDownload?: (id: string) => void;
  onPrint?: (id: string) => void;
}

const categoryColors = {
  enrollment: "bg-chart-1 text-white",
  membership: "bg-chart-2 text-white",
  activities: "bg-chart-3 text-white",
  financial: "bg-chart-4 text-white",
};

export function ReportCard({ report, onGenerate, onDownload, onPrint }: ReportCardProps) {
  return (
    <Card className="hover-elevate" data-testid={`card-report-${report.id}`}>
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <CardTitle className="text-lg mb-2">{report.title}</CardTitle>
            <Badge className={categoryColors[report.category]}>
              {report.category.charAt(0).toUpperCase() + report.category.slice(1)}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">{report.description}</p>
        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Records:</span>
            <span className="font-medium">{report.recordCount}</span>
          </div>
          {report.created_at && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Created:</span>
              <span className="font-medium">
                {new Date(report.created_at).toLocaleDateString()}
              </span>
            </div>
          )}
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            className="flex-1"
            onClick={() => onGenerate?.(report.id)}
            data-testid={`button-generate-${report.id}`}
          >
            Generate
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onDownload?.(report.id)}
            data-testid={`button-download-${report.id}`}
          >
            <Download className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onPrint?.(report.id)}
            data-testid={`button-print-${report.id}`}
          >
            <Printer className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
