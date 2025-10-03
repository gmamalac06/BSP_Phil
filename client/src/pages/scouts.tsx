import { useState } from "react";
import { ScoutsTable } from "@/components/scouts-table";
import { FilterPanel } from "@/components/filter-panel";
import { Button } from "@/components/ui/button";
import { Download, Plus } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Scouts() {
  const [activeTab, setActiveTab] = useState("all");

  // TODO: Remove mock data
  const scouts = [
    {
      id: "1",
      uid: "BSP-2024-001234",
      name: "Juan Dela Cruz",
      unit: "Eagle Patrol",
      school: "Manila Science HS",
      municipality: "Manila",
      gender: "Male",
      status: "active" as const,
      membershipYears: 3,
    },
    {
      id: "2",
      uid: "BSP-2024-001235",
      name: "Maria Santos",
      unit: "Phoenix Patrol",
      school: "Quezon City HS",
      municipality: "Quezon City",
      gender: "Female",
      status: "active" as const,
      membershipYears: 2,
    },
    {
      id: "3",
      uid: "BSP-2024-001236",
      name: "Pedro Garcia",
      unit: "Falcon Patrol",
      school: "Makati HS",
      municipality: "Makati",
      gender: "Male",
      status: "pending" as const,
      membershipYears: 1,
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold mb-2">Scouts Management</h1>
          <p className="text-muted-foreground">
            View and manage all registered scouts
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" data-testid="button-export">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button data-testid="button-add-scout">
            <Plus className="h-4 w-4 mr-2" />
            Add Scout
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        <div>
          <FilterPanel onFilter={(filters) => console.log("Filters:", filters)} />
        </div>

        <div className="lg:col-span-3">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all" data-testid="tab-all">All Scouts</TabsTrigger>
              <TabsTrigger value="active" data-testid="tab-active">Active</TabsTrigger>
              <TabsTrigger value="pending" data-testid="tab-pending">Pending</TabsTrigger>
              <TabsTrigger value="expired" data-testid="tab-expired">Expired</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-6">
              <ScoutsTable
                scouts={scouts}
                onView={(id) => console.log("View:", id)}
                onEdit={(id) => console.log("Edit:", id)}
                onDownloadId={(id) => console.log("Download ID:", id)}
              />
            </TabsContent>

            <TabsContent value="active" className="mt-6">
              <ScoutsTable
                scouts={scouts.filter((s) => s.status === "active")}
                onView={(id) => console.log("View:", id)}
                onEdit={(id) => console.log("Edit:", id)}
                onDownloadId={(id) => console.log("Download ID:", id)}
              />
            </TabsContent>

            <TabsContent value="pending" className="mt-6">
              <ScoutsTable
                scouts={scouts.filter((s) => s.status === "pending")}
                onView={(id) => console.log("View:", id)}
                onEdit={(id) => console.log("Edit:", id)}
                onDownloadId={(id) => console.log("Download ID:", id)}
              />
            </TabsContent>

            <TabsContent value="expired" className="mt-6">
              <ScoutsTable
                scouts={[]}
                onView={(id) => console.log("View:", id)}
                onEdit={(id) => console.log("Edit:", id)}
                onDownloadId={(id) => console.log("Download ID:", id)}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
