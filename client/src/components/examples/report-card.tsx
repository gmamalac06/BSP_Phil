import { ReportCard } from "../report-card";

export default function ReportCardExample() {
  const mockReport = {
    id: "1",
    title: "Monthly Enrollment Report",
    description: "Detailed breakdown of new enrollments by month, gender, and municipality",
    category: "enrollment" as const,
    recordCount: 248,
    lastGenerated: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
  };

  return (
    <div className="p-8 bg-background">
      <div className="max-w-md">
        <ReportCard
          report={mockReport}
          onGenerate={(id) => console.log("Generate:", id)}
          onDownload={(id) => console.log("Download:", id)}
          onPrint={(id) => console.log("Print:", id)}
        />
      </div>
    </div>
  );
}
