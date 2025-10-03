import { ReportCard } from "@/components/report-card";
import { FilterPanel } from "@/components/filter-panel";
import { Button } from "@/components/ui/button";
import { FileText, Download } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Reports() {
  // TODO: Remove mock data
  const reports = [
    {
      id: "1",
      title: "Monthly Enrollment Report",
      description: "Detailed breakdown of new enrollments by month, gender, and municipality",
      category: "enrollment" as const,
      recordCount: 248,
      lastGenerated: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    },
    {
      id: "2",
      title: "Membership Status Report",
      description: "Active, pending, and expired memberships with renewal tracking",
      category: "membership" as const,
      recordCount: 1248,
      lastGenerated: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    },
    {
      id: "3",
      title: "Activity Attendance Report",
      description: "Scout participation and attendance statistics for all activities",
      category: "activities" as const,
      recordCount: 156,
      lastGenerated: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    },
    {
      id: "4",
      title: "School Distribution Report",
      description: "Scout enrollment statistics by school and municipality",
      category: "enrollment" as const,
      recordCount: 42,
      lastGenerated: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    },
    {
      id: "5",
      title: "Gender Demographics Report",
      description: "Gender distribution across all units and schools",
      category: "membership" as const,
      recordCount: 1248,
      lastGenerated: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    },
    {
      id: "6",
      title: "Unit Performance Report",
      description: "Activity participation and achievement statistics by unit",
      category: "activities" as const,
      recordCount: 24,
      lastGenerated: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold mb-2">Reports</h1>
          <p className="text-muted-foreground">
            Generate and download comprehensive reports
          </p>
        </div>
        <Button variant="outline" data-testid="button-download-all">
          <Download className="h-4 w-4 mr-2" />
          Download All
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        <div>
          <FilterPanel onFilter={(filters) => console.log("Filters:", filters)} />
        </div>

        <div className="lg:col-span-3">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Available Reports
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Select filters on the left to customize your reports, then generate and download in your preferred format.
              </p>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            {reports.map((report) => (
              <ReportCard
                key={report.id}
                report={report}
                onGenerate={(id) => console.log("Generate report:", id)}
                onDownload={(id) => console.log("Download report:", id)}
                onPrint={(id) => console.log("Print report:", id)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
