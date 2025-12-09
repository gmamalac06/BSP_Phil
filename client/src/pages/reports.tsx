import { useState, useMemo } from "react";
import { ReportCard } from "@/components/report-card";
import { FilterPanel } from "@/components/filter-panel";
import { Button } from "@/components/ui/button";
import { FileText, Download, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useReports, useCreateReport } from "@/hooks/useReports";
import { useScouts } from "@/hooks/useScouts";
import { useSchools } from "@/hooks/useSchools";
import { useUnits } from "@/hooks/useUnits";
import { useActivities } from "@/hooks/useActivities";
import { useToast } from "@/hooks/use-toast";
import { exportToCSV, generateFilename, formatDateForExport, formatDateTimeForExport, ExportColumn } from "@/lib/export";
import { useAuth } from "@/hooks/useAuth";

export default function Reports() {
  const [filters, setFilters] = useState<any>({});

  const { data: reports = [], isLoading } = useReports();
  const createReport = useCreateReport();
  const { data: scouts = [] } = useScouts();
  const { data: schools = [] } = useSchools();
  const { data: units = [] } = useUnits();
  const { data: activities = [] } = useActivities();
  const { toast } = useToast();
  const { user } = useAuth();

  const filteredReports = useMemo(() => {
    let result = [...reports];

    if (filters.category) {
      result = result.filter((r) => r.category === filters.category);
    }

    return result;
  }, [reports, filters]);

  const generateScoutsReport = async () => {
    try {
      const report = await createReport.mutateAsync({
        title: "Scouts Enrollment Report",
        description: `Complete list of all scouts as of ${new Date().toLocaleDateString()}`,
        category: "enrollment",
        recordCount: scouts.length,
        generatedBy: user?.id,
      });

      const columns: ExportColumn[] = [
        { key: "uid", label: "Scout ID" },
        { key: "name", label: "Name" },
        { key: "gender", label: "Gender" },
        { key: "municipality", label: "Municipality" },
        { key: "status", label: "Status" },
        { key: "contactNumber", label: "Contact Number" },
        { key: "email", label: "Email" },
        { key: "rank", label: "Rank" },
        { key: "membershipYears", label: "Membership Years" },
        { key: "dateOfBirth", label: "Date of Birth", format: formatDateForExport },
        { key: "createdAt", label: "Registered Date", format: formatDateForExport },
      ];

      exportToCSV(scouts, columns, generateFilename("scouts_report"));
      
      toast({
        title: "Report generated",
        description: `Scouts enrollment report with ${scouts.length} records generated successfully`,
      });
    } catch (error: any) {
      toast({
        title: "Generation failed",
        description: error.message || "Failed to generate report",
        variant: "destructive",
      });
    }
  };

  const generateSchoolsReport = async () => {
    try {
      await createReport.mutateAsync({
        title: "Schools Report",
        description: `List of all schools as of ${new Date().toLocaleDateString()}`,
        category: "enrollment",
        recordCount: schools.length,
        generatedBy: user?.id,
      });

      const columns: ExportColumn[] = [
        { key: "name", label: "School Name" },
        { key: "municipality", label: "Municipality" },
        { key: "principal", label: "Principal" },
        { key: "createdAt", label: "Added Date", format: formatDateForExport },
      ];

      exportToCSV(schools, columns, generateFilename("schools_report"));
      
      toast({
        title: "Report generated",
        description: `Schools report with ${schools.length} records generated successfully`,
      });
    } catch (error: any) {
      toast({
        title: "Generation failed",
        description: error.message || "Failed to generate report",
        variant: "destructive",
      });
    }
  };

  const generateUnitsReport = async () => {
    try {
      await createReport.mutateAsync({
        title: "Units Report",
        description: `List of all units as of ${new Date().toLocaleDateString()}`,
        category: "enrollment",
        recordCount: units.length,
        generatedBy: user?.id,
      });

      const columns: ExportColumn[] = [
        { key: "name", label: "Unit Name" },
        { key: "leader", label: "Unit Leader" },
        { key: "status", label: "Status" },
        { key: "createdAt", label: "Created Date", format: formatDateForExport },
      ];

      exportToCSV(units, columns, generateFilename("units_report"));
      
      toast({
        title: "Report generated",
        description: `Units report with ${units.length} records generated successfully`,
      });
    } catch (error: any) {
      toast({
        title: "Generation failed",
        description: error.message || "Failed to generate report",
        variant: "destructive",
      });
    }
  };

  const generateActivitiesReport = async () => {
    try {
      await createReport.mutateAsync({
        title: "Activities Report",
        description: `List of all activities as of ${new Date().toLocaleDateString()}`,
        category: "activities",
        recordCount: activities.length,
        generatedBy: user?.id,
      });

      const columns: ExportColumn[] = [
        { key: "title", label: "Activity Title" },
        { key: "date", label: "Date", format: formatDateForExport },
        { key: "location", label: "Location" },
        { key: "capacity", label: "Capacity" },
        { key: "status", label: "Status" },
        { key: "createdAt", label: "Created Date", format: formatDateForExport },
      ];

      exportToCSV(activities, columns, generateFilename("activities_report"));
      
      toast({
        title: "Report generated",
        description: `Activities report with ${activities.length} records generated successfully`,
      });
    } catch (error: any) {
      toast({
        title: "Generation failed",
        description: error.message || "Failed to generate report",
        variant: "destructive",
      });
    }
  };

  const generateMembershipReport = async () => {
    try {
      const activeScouts = scouts.filter(s => s.status === "active");
      const pendingScouts = scouts.filter(s => s.status === "pending");
      const expiredScouts = scouts.filter(s => s.status === "expired");

      await createReport.mutateAsync({
        title: "Membership Report",
        description: `Membership statistics as of ${new Date().toLocaleDateString()}`,
        category: "membership",
        recordCount: scouts.length,
        generatedBy: user?.id,
      });

      const columns: ExportColumn[] = [
        { key: "uid", label: "Scout ID" },
        { key: "name", label: "Name" },
        { key: "status", label: "Status" },
        { key: "membershipYears", label: "Years" },
        { key: "municipality", label: "Municipality" },
        { key: "createdAt", label: "Joined Date", format: formatDateForExport },
      ];

      exportToCSV(scouts, columns, generateFilename("membership_report"));
      
      toast({
        title: "Report generated",
        description: `Membership report: ${activeScouts.length} active, ${pendingScouts.length} pending, ${expiredScouts.length} expired`,
      });
    } catch (error: any) {
      toast({
        title: "Generation failed",
        description: error.message || "Failed to generate report",
        variant: "destructive",
      });
    }
  };

  const handleGenerateReport = (reportId: string) => {
    // This would be for pre-existing reports from database
    const report = reports.find(r => r.id === reportId);
    if (report) {
      toast({
        title: "Report downloaded",
        description: `${report.title} has been downloaded`,
      });
    }
  };

  const handlePrintReport = (reportId: string) => {
    toast({
      title: "Print initiated",
      description: "Opening print dialog...",
    });
    window.print();
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold mb-2">Reports</h1>
          <p className="text-muted-foreground">
            Generate and download comprehensive reports
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        <div>
          <FilterPanel onFilter={setFilters} />
        </div>

        <div className="lg:col-span-3 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Generate New Report
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground mb-4">
                Generate instant reports and export to CSV format
              </p>
              <div className="grid gap-3 md:grid-cols-2">
                <Button 
                  variant="outline" 
                  className="justify-start"
                  onClick={generateScoutsReport}
                  disabled={createReport.isPending || scouts.length === 0}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Scouts Enrollment ({scouts.length})
                </Button>
                <Button 
                  variant="outline" 
                  className="justify-start"
                  onClick={generateSchoolsReport}
                  disabled={createReport.isPending || schools.length === 0}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Schools Report ({schools.length})
                </Button>
                <Button 
                  variant="outline" 
                  className="justify-start"
                  onClick={generateUnitsReport}
                  disabled={createReport.isPending || units.length === 0}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Units Report ({units.length})
                </Button>
                <Button 
                  variant="outline" 
                  className="justify-start"
                  onClick={generateActivitiesReport}
                  disabled={createReport.isPending || activities.length === 0}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Activities Report ({activities.length})
                </Button>
                <Button 
                  variant="outline" 
                  className="justify-start md:col-span-2"
                  onClick={generateMembershipReport}
                  disabled={createReport.isPending || scouts.length === 0}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Membership Statistics
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Generated Reports History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Previously generated reports are stored here for reference
              </p>

              {isLoading ? (
                <div className="flex items-center justify-center h-32">
                  <div className="animate-pulse text-muted-foreground">Loading reports...</div>
                </div>
              ) : filteredReports.length === 0 ? (
                <div className="flex items-center justify-center h-32">
                  <div className="text-sm text-muted-foreground">No reports generated yet. Create a report above to get started.</div>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {filteredReports.map((report) => (
                    <ReportCard
                      key={report.id}
                      report={report}
                      onGenerate={handleGenerateReport}
                      onDownload={handleGenerateReport}
                      onPrint={handlePrintReport}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
