import { UnitCard } from "@/components/unit-card";
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function Units() {
  // TODO: Remove mock data
  const units = [
    {
      id: "1",
      name: "Eagle Patrol",
      leader: "Scout Master Rodriguez",
      memberCount: 24,
      school: "Manila Science High School",
      status: "active" as const,
    },
    {
      id: "2",
      name: "Phoenix Patrol",
      leader: "Scout Master Bautista",
      memberCount: 19,
      school: "Quezon City High School",
      status: "active" as const,
    },
    {
      id: "3",
      name: "Falcon Patrol",
      leader: "Scout Master Reyes",
      memberCount: 22,
      school: "Makati High School",
      status: "active" as const,
    },
    {
      id: "4",
      name: "Hawk Patrol",
      leader: "Scout Master Cruz",
      memberCount: 18,
      school: "Pasig High School",
      status: "active" as const,
    },
    {
      id: "5",
      name: "Wolf Patrol",
      leader: "Scout Master Santos",
      memberCount: 15,
      school: "Manila Science High School",
      status: "active" as const,
    },
    {
      id: "6",
      name: "Bear Patrol",
      leader: "Scout Master Garcia",
      memberCount: 20,
      school: "Quezon City High School",
      status: "active" as const,
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold mb-2">Units Management</h1>
          <p className="text-muted-foreground">
            Manage scout units and patrols
          </p>
        </div>
        <Button data-testid="button-add-unit">
          <Plus className="h-4 w-4 mr-2" />
          Add Unit
        </Button>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search units..."
            className="pl-9"
            data-testid="input-search-units"
          />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {units.map((unit) => (
          <UnitCard
            key={unit.id}
            unit={unit}
            onEdit={(id) => console.log("Edit unit:", id)}
            onViewMembers={(id) => console.log("View members:", id)}
          />
        ))}
      </div>
    </div>
  );
}
