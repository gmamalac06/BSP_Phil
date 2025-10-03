import { SchoolCard } from "@/components/school-card";
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function Schools() {
  // TODO: Remove mock data
  const schools = [
    {
      id: "1",
      name: "Manila Science High School",
      municipality: "Manila",
      scoutCount: 145,
      unitCount: 6,
      principal: "Dr. Maria Santos",
    },
    {
      id: "2",
      name: "Quezon City High School",
      municipality: "Quezon City",
      scoutCount: 132,
      unitCount: 5,
      principal: "Dr. Roberto Cruz",
    },
    {
      id: "3",
      name: "Makati High School",
      municipality: "Makati",
      scoutCount: 98,
      unitCount: 4,
      principal: "Dr. Ana Reyes",
    },
    {
      id: "4",
      name: "Pasig High School",
      municipality: "Pasig",
      scoutCount: 87,
      unitCount: 3,
      principal: "Dr. Jose Garcia",
    },
    {
      id: "5",
      name: "Taguig Science High School",
      municipality: "Taguig",
      scoutCount: 76,
      unitCount: 3,
      principal: "Dr. Linda Bautista",
    },
    {
      id: "6",
      name: "Mandaluyong High School",
      municipality: "Mandaluyong",
      scoutCount: 64,
      unitCount: 2,
      principal: "Dr. Carlos Rodriguez",
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold mb-2">Schools Management</h1>
          <p className="text-muted-foreground">
            Manage participating schools and institutions
          </p>
        </div>
        <Button data-testid="button-add-school">
          <Plus className="h-4 w-4 mr-2" />
          Add School
        </Button>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search schools..."
            className="pl-9"
            data-testid="input-search-schools"
          />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {schools.map((school) => (
          <SchoolCard
            key={school.id}
            school={school}
            onEdit={(id) => console.log("Edit school:", id)}
            onViewScouts={(id) => console.log("View scouts:", id)}
          />
        ))}
      </div>
    </div>
  );
}
