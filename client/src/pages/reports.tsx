import { useState, useMemo } from "react";
import { ReportCard } from "@/components/report-card";
import { FilterPanel } from "@/components/filter-panel";
import { Button } from "@/components/ui/button";
import { FileText, Download, Plus, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useReports, useCreateReport } from "@/hooks/useReports";
import { useScouts, ScoutWithRelations } from "@/hooks/useScouts";
import { useSchools } from "@/hooks/useSchools";
import { useUnits } from "@/hooks/useUnits";
import { useActivities } from "@/hooks/useActivities";
import { useToast } from "@/hooks/use-toast";
import { exportToCSV, generateFilename, formatDateForExport, formatDateTimeForExport, ExportColumn } from "@/lib/export";
import { useAuth } from "@/hooks/useAuth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { reportsService } from "@/lib/supabase-db";

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
  const queryClient = useQueryClient();

  const deleteReport = useMutation({
    mutationFn: (id: string) => reportsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reports"] });
      toast({
        title: "Report deleted",
        description: "Report history entry has been removed",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Delete failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Filter the report history list
  const filteredReportHistory = useMemo(() => {
    let result = [...reports];

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(r => r.title.toLowerCase().includes(searchLower));
    }

    if (filters.category) { // unlikely to be set from filter panel but good to have
      result = result.filter((r) => r.category === filters.category);
    }

    // Also filter history by generate date if needed, but filter panel doesn't support date range yet

    return result;
  }, [reports, filters]);

  // Filter DATA for report generation
  const filteredScoutsData = useMemo(() => {
    let result = [...scouts];

    if (filters.municipality) {
      result = result.filter(s => s.municipality === filters.municipality);
    }
    if (filters.school) {
      result = result.filter(s => s.schoolId === filters.school);
    }
    if (filters.unitId) {
      result = result.filter(s => s.unitId === filters.unitId);
    }
    if (filters.status) {
      result = result.filter(s => s.status === filters.status);
    }
    if (filters.gender) {
      result = result.filter(s => s.gender === filters.gender);
    }

    return result;
  }, [scouts, filters]);

  const filteredSchoolsData = useMemo(() => {
    let result = [...schools];
    if (filters.municipality) {
      result = result.filter(s => s.municipality === filters.municipality);
    }
    return result;
  }, [schools, filters]);

  const filteredUnitsData = useMemo(() => {
    let result = [...units];
    if (filters.school) {
      result = result.filter(u => u.schoolId === filters.school);
    }
    return result;
  }, [units, filters]);


  const generateScoutsReport = async () => {
    try {
      const dataToExport = filteredScoutsData;

      if (dataToExport.length === 0) {
        toast({
          title: "No data to export",
          description: "Current filters resulted in 0 records.",
          variant: "destructive"
        });
        return;
      }

      await createReport.mutateAsync({
        title: `Scouts Report ${filters.school ? '- School Filtered' : ''}`,
        description: `Generated report with ${dataToExport.length} scouts. Filters: ${Object.entries(filters).filter(([k, v]) => v).map(([k, v]) => `${k}=${v}`).join(', ') || 'None'}`,
        category: "enrollment",
        recordCount: dataToExport.length,
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

      exportToCSV(dataToExport, columns, generateFilename("scouts_report"));

      toast({
        title: "Report generated",
        description: `Scouts report with ${dataToExport.length} records generated successfully`,
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
      const dataToExport = filteredSchoolsData;

      if (dataToExport.length === 0) {
        toast({
          title: "No data to export",
          description: "Current filters resulted in 0 records.",
          variant: "destructive"
        });
        return;
      }

      await createReport.mutateAsync({
        title: "Schools Report",
        description: `List of schools. Filters: ${Object.entries(filters).filter(([k, v]) => v && k === 'municipality').map(([k, v]) => `${k}=${v}`).join(', ') || 'None'}`,
        category: "enrollment",
        recordCount: dataToExport.length,
        generatedBy: user?.id,
      });

      const columns: ExportColumn[] = [
        { key: "name", label: "School Name" },
        { key: "municipality", label: "Municipality" },
        { key: "principal", label: "Principal" },
        { key: "createdAt", label: "Added Date", format: formatDateForExport },
      ];

      exportToCSV(dataToExport, columns, generateFilename("schools_report"));

      toast({
        title: "Report generated",
        description: `Schools report with ${dataToExport.length} records generated successfully`,
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
      const dataToExport = filteredUnitsData;

      if (dataToExport.length === 0) {
        toast({
          title: "No data to export",
          description: "Current filters resulted in 0 records.",
          variant: "destructive"
        });
        return;
      }

      await createReport.mutateAsync({
        title: "Units Report",
        description: `List of units. Filters: ${Object.entries(filters).filter(([k, v]) => v).map(([k, v]) => `${k}=${v}`).join(', ') || 'None'}`,
        category: "enrollment",
        recordCount: dataToExport.length,
        generatedBy: user?.id,
      });

      const columns: ExportColumn[] = [
        { key: "name", label: "Unit Name" },
        { key: "leader", label: "Unit Leader" },
        { key: "status", label: "Status" },
        { key: "createdAt", label: "Created Date", format: formatDateForExport },
      ];

      exportToCSV(dataToExport, columns, generateFilename("units_report"));

      toast({
        title: "Report generated",
        description: `Units report with ${dataToExport.length} records generated successfully`,
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
      // Activities don't have many filters in panel except maybe status if we added it, but let's stick to base
      const dataToExport = activities;

      await createReport.mutateAsync({
        title: "Activities Report",
        description: `List of all activities as of ${new Date().toLocaleDateString()}`,
        category: "activities",
        recordCount: dataToExport.length,
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

      exportToCSV(dataToExport, columns, generateFilename("activities_report"));

      toast({
        title: "Report generated",
        description: `Activities report with ${dataToExport.length} records generated successfully`,
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
      const dataToExport = filteredScoutsData;
      const activeScouts = dataToExport.filter(s => s.status === "active");
      const pendingScouts = dataToExport.filter(s => s.status === "pending");
      const expiredScouts = dataToExport.filter(s => s.status === "expired");

      await createReport.mutateAsync({
        title: "Membership Report",
        description: `Membership statistics. Filters: ${Object.entries(filters).filter(([k, v]) => v).map(([k, v]) => `${k}=${v}`).join(', ') || 'None'}`,
        category: "membership",
        recordCount: dataToExport.length,
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

      exportToCSV(dataToExport, columns, generateFilename("membership_report"));

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
    // Re-download is tricky because we don't store the file content, only metadata.
    // Ideally we'd re-generate based on the description/metadata, but for now let's just show a toast
    // explaining this limitation, or re-run the generation if we can infer the type.
    // For simplicity given the scope, we'll inform the user.
    toast({
      title: "Download info",
      description: "This is a historical record. Please generate a new report to get the latest data.",
    });
  };

  const handlePrintReport = (reportId: string) => {
    toast({
      title: "Print initiated",
      description: "Opening print dialog...",
    });
    window.print();
  };

  const handleDeleteReport = (reportId: string) => {
    if (confirm("Are you sure you want to delete this report history?")) {
      deleteReport.mutate(reportId);
    }
  }

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
                Generate instant reports and export to CSV format. Reports will respect the filters selected on the left.
              </p>

              <div className="bg-muted/30 p-4 rounded-md mb-4 text-sm">
                <span className="font-semibold">Active Filters: </span>
                {Object.keys(filters).length === 0 ? "None (All Records)" :
                  Object.entries(filters)
                    .filter(([_, v]) => v) // filter out empty/null values
                    .map(([k, v]) => `${k}: ${v}`)
                    .join(", ")
                }
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <Button
                  variant="outline"
                  className="justify-start"
                  onClick={generateScoutsReport}
                  disabled={createReport.isPending || scouts.length === 0}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Scouts Enrollment ({filteredScoutsData.length})
                </Button>
                <Button
                  variant="outline"
                  className="justify-start"
                  onClick={generateSchoolsReport}
                  disabled={createReport.isPending || schools.length === 0}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Schools Report ({filteredSchoolsData.length})
                </Button>
                <Button
                  variant="outline"
                  className="justify-start"
                  onClick={generateUnitsReport}
                  disabled={createReport.isPending || units.length === 0}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Units Report ({filteredUnitsData.length})
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
                  Membership Statistics ({filteredScoutsData.length})
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
              ) : filteredReportHistory.length === 0 ? (
                <div className="flex items-center justify-center h-32">
                  <div className="text-sm text-muted-foreground">No reports found matching your search.</div>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {filteredReportHistory.map((report) => (
                    <div key={report.id} className="relative group">
                      <ReportCard
                        report={report as any}
                        onGenerate={handleGenerateReport}
                        onDownload={handleGenerateReport}
                        onPrint={handlePrintReport}
                      />
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6"
                        onClick={() => handleDeleteReport(report.id)}
                        title="Delete Report History"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
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
