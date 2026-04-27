import { useState, useMemo } from "react";
import { SchoolMasterlistModal } from "@/components/school-masterlist-modal";
import { FilterPanel } from "@/components/filter-panel";
import { Button } from "@/components/ui/button";
import { Download, Eye } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useScouts } from "@/hooks/useScouts";
import { useSchools } from "@/hooks/useSchools";
import { useUnits } from "@/hooks/useUnits";
import { useActivities } from "@/hooks/useActivities";
import { useToast } from "@/hooks/use-toast";
import { exportToCSV, generateFilename, formatDateForExport, ExportColumn } from "@/lib/export";
import { safeToLocaleDateString } from "@/lib/safe-date";

export default function Reports() {
  const [filters, setFilters] = useState<any>({});
  const [activeTab, setActiveTab] = useState("scouts");
  const [showMasterlist, setShowMasterlist] = useState(false);

  const { data: scouts = [] } = useScouts();
  const { data: schools = [] } = useSchools();
  const { data: units = [] } = useUnits();
  const { data: activities = [] } = useActivities();
  const { toast } = useToast();

  // Filter scouts data
  const filteredScouts = useMemo(() => {
    let result = [...scouts];
    if (filters.municipality) result = result.filter((s) => s.municipality === filters.municipality);
    if (filters.school) result = result.filter((s) => s.schoolId === filters.school);
    if (filters.unitId) result = result.filter((s) => s.unitId === filters.unitId);
    if (filters.status) result = result.filter((s) => s.status === filters.status);
    if (filters.gender) result = result.filter((s) => s.gender === filters.gender);
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (s) => s.name.toLowerCase().includes(q) || s.uid.toLowerCase().includes(q)
      );
    }
    return result;
  }, [scouts, filters]);

  const filteredSchools = useMemo(() => {
    let result = [...schools];
    if (filters.municipality) result = result.filter((s) => s.municipality === filters.municipality);
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter((s) => s.name.toLowerCase().includes(q));
    }
    return result;
  }, [schools, filters]);

  const filteredUnits = useMemo(() => {
    let result = [...units];
    if (filters.school) result = result.filter((u) => u.schoolId === filters.school);
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter((u) => u.name.toLowerCase().includes(q));
    }
    return result;
  }, [units, filters]);

  const filteredActivities = useMemo(() => {
    let result = [...activities];
    if (filters.status) result = result.filter((a) => a.status === filters.status);
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter((a) => a.title.toLowerCase().includes(q));
    }
    return result;
  }, [activities, filters]);

  // Export helpers
  const exportScouts = () => {
    if (filteredScouts.length === 0) {
      toast({ title: "No data to export", description: "Current filters resulted in 0 records.", variant: "destructive" });
      return;
    }
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
    exportToCSV(filteredScouts, columns, generateFilename("scouts_report"));
    toast({ title: "Report exported", description: `Exported ${filteredScouts.length} scouts.` });
  };

  const exportSchools = () => {
    if (filteredSchools.length === 0) {
      toast({ title: "No data to export", description: "Current filters resulted in 0 records.", variant: "destructive" });
      return;
    }
    const columns: ExportColumn[] = [
      { key: "name", label: "School Name" },
      { key: "municipality", label: "Municipality" },
      { key: "principal", label: "Principal" },
      { key: "createdAt", label: "Added Date", format: formatDateForExport },
    ];
    exportToCSV(filteredSchools, columns, generateFilename("schools_report"));
    toast({ title: "Report exported", description: `Exported ${filteredSchools.length} schools.` });
  };

  const exportUnits = () => {
    if (filteredUnits.length === 0) {
      toast({ title: "No data to export", description: "Current filters resulted in 0 records.", variant: "destructive" });
      return;
    }
    const columns: ExportColumn[] = [
      { key: "name", label: "Unit Name" },
      { key: "leader", label: "Unit Leader" },
      { key: "status", label: "Status" },
      { key: "createdAt", label: "Created Date", format: formatDateForExport },
    ];
    exportToCSV(filteredUnits, columns, generateFilename("units_report"));
    toast({ title: "Report exported", description: `Exported ${filteredUnits.length} units.` });
  };

  const exportActivities = () => {
    if (filteredActivities.length === 0) {
      toast({ title: "No data to export", description: "Current filters resulted in 0 records.", variant: "destructive" });
      return;
    }
    const columns: ExportColumn[] = [
      { key: "title", label: "Activity Title" },
      { key: "date", label: "Date", format: formatDateForExport },
      { key: "location", label: "Location" },
      { key: "capacity", label: "Capacity" },
      { key: "status", label: "Status" },
      { key: "createdAt", label: "Created Date", format: formatDateForExport },
    ];
    exportToCSV(filteredActivities, columns, generateFilename("activities_report"));
    toast({ title: "Report exported", description: `Exported ${filteredActivities.length} activities.` });
  };

  const exportMembership = () => {
    if (filteredScouts.length === 0) {
      toast({ title: "No data to export", description: "Current filters resulted in 0 records.", variant: "destructive" });
      return;
    }
    const columns: ExportColumn[] = [
      { key: "uid", label: "Scout ID" },
      { key: "name", label: "Name" },
      { key: "status", label: "Status" },
      { key: "membershipYears", label: "Years" },
      { key: "municipality", label: "Municipality" },
      { key: "createdAt", label: "Joined Date", format: formatDateForExport },
    ];
    exportToCSV(filteredScouts, columns, generateFilename("membership_report"));
    toast({ title: "Report exported", description: `Exported ${filteredScouts.length} membership records.` });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold mb-2">Reports</h1>
          <p className="text-muted-foreground">Browse and export comprehensive reports</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        <div>
          <FilterPanel onFilter={setFilters} />
        </div>

        <div className="lg:col-span-3 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Report Data</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="flex flex-wrap">
                  <TabsTrigger value="scouts">Scouts ({filteredScouts.length})</TabsTrigger>
                  <TabsTrigger value="schools">Schools ({filteredSchools.length})</TabsTrigger>
                  <TabsTrigger value="units">Units ({filteredUnits.length})</TabsTrigger>
                  <TabsTrigger value="activities">Activities ({filteredActivities.length})</TabsTrigger>
                  <TabsTrigger value="membership">Membership ({filteredScouts.length})</TabsTrigger>
                </TabsList>

                {/* Scouts */}
                <TabsContent value="scouts" className="mt-4 space-y-3">
                  <div className="flex justify-end gap-2">
                    {filters.school && (
                      <Button variant="outline" size="sm" onClick={() => setShowMasterlist(true)}>
                        <Eye className="h-4 w-4 mr-2" /> View Masterlist
                      </Button>
                    )}
                    <Button size="sm" onClick={exportScouts} disabled={filteredScouts.length === 0}>
                      <Download className="h-4 w-4 mr-2" /> Export CSV
                    </Button>
                  </div>
                  <div className="border rounded-md overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Scout ID</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Gender</TableHead>
                          <TableHead>Municipality</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Rank</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredScouts.length === 0 ? (
                          <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">No scouts found.</TableCell></TableRow>
                        ) : filteredScouts.map((s) => (
                          <TableRow key={s.id}>
                            <TableCell className="font-mono text-xs">{s.uid}</TableCell>
                            <TableCell className="font-medium">{s.name}</TableCell>
                            <TableCell>{s.gender}</TableCell>
                            <TableCell>{s.municipality}</TableCell>
                            <TableCell><Badge variant="outline" className="capitalize">{s.status}</Badge></TableCell>
                            <TableCell className="capitalize">{s.rank || "-"}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>

                {/* Schools */}
                <TabsContent value="schools" className="mt-4 space-y-3">
                  <div className="flex justify-end">
                    <Button size="sm" onClick={exportSchools} disabled={filteredSchools.length === 0}>
                      <Download className="h-4 w-4 mr-2" /> Export CSV
                    </Button>
                  </div>
                  <div className="border rounded-md overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>School Name</TableHead>
                          <TableHead>Municipality</TableHead>
                          <TableHead>Principal</TableHead>
                          <TableHead>Added</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredSchools.length === 0 ? (
                          <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground py-8">No schools found.</TableCell></TableRow>
                        ) : filteredSchools.map((s) => (
                          <TableRow key={s.id}>
                            <TableCell className="font-medium">{s.name}</TableCell>
                            <TableCell>{s.municipality}</TableCell>
                            <TableCell>{s.principal || "-"}</TableCell>
                            <TableCell>{safeToLocaleDateString((s as any).createdAt)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>

                {/* Units */}
                <TabsContent value="units" className="mt-4 space-y-3">
                  <div className="flex justify-end">
                    <Button size="sm" onClick={exportUnits} disabled={filteredUnits.length === 0}>
                      <Download className="h-4 w-4 mr-2" /> Export CSV
                    </Button>
                  </div>
                  <div className="border rounded-md overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Unit Name</TableHead>
                          <TableHead>Leader</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Created</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredUnits.length === 0 ? (
                          <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground py-8">No units found.</TableCell></TableRow>
                        ) : filteredUnits.map((u) => (
                          <TableRow key={u.id}>
                            <TableCell className="font-medium">{u.name}</TableCell>
                            <TableCell>{u.leader}</TableCell>
                            <TableCell><Badge variant="outline" className="capitalize">{u.status}</Badge></TableCell>
                            <TableCell>{safeToLocaleDateString((u as any).createdAt)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>

                {/* Activities */}
                <TabsContent value="activities" className="mt-4 space-y-3">
                  <div className="flex justify-end">
                    <Button size="sm" onClick={exportActivities} disabled={filteredActivities.length === 0}>
                      <Download className="h-4 w-4 mr-2" /> Export CSV
                    </Button>
                  </div>
                  <div className="border rounded-md overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Title</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Location</TableHead>
                          <TableHead>Capacity</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredActivities.length === 0 ? (
                          <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8">No activities found.</TableCell></TableRow>
                        ) : filteredActivities.map((a) => (
                          <TableRow key={a.id}>
                            <TableCell className="font-medium">{a.title}</TableCell>
                            <TableCell>{safeToLocaleDateString(a.date)}</TableCell>
                            <TableCell>{a.location}</TableCell>
                            <TableCell>{a.capacity}</TableCell>
                            <TableCell><Badge variant="outline" className="capitalize">{a.status}</Badge></TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>

                {/* Membership */}
                <TabsContent value="membership" className="mt-4 space-y-3">
                  <div className="flex justify-end">
                    <Button size="sm" onClick={exportMembership} disabled={filteredScouts.length === 0}>
                      <Download className="h-4 w-4 mr-2" /> Export CSV
                    </Button>
                  </div>
                  <div className="border rounded-md overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Scout ID</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Years</TableHead>
                          <TableHead>Municipality</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredScouts.length === 0 ? (
                          <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8">No records found.</TableCell></TableRow>
                        ) : filteredScouts.map((s) => (
                          <TableRow key={s.id}>
                            <TableCell className="font-mono text-xs">{s.uid}</TableCell>
                            <TableCell className="font-medium">{s.name}</TableCell>
                            <TableCell><Badge variant="outline" className="capitalize">{s.status}</Badge></TableCell>
                            <TableCell>{s.membershipYears || 0}</TableCell>
                            <TableCell>{s.municipality}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>

      {filters.school && (
        <SchoolMasterlistModal
          open={showMasterlist}
          onOpenChange={setShowMasterlist}
          scouts={filteredScouts}
          schoolName={schools.find((s) => s.id === filters.school)?.name || "School"}
        />
      )}
    </div>
  );
}
