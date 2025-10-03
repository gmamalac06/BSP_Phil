import { ScoutCard } from "../scout-card";

export default function ScoutCardExample() {
  const mockScout = {
    id: "1",
    uid: "BSP-2024-001234",
    name: "Juan Dela Cruz",
    unit: "Eagle Patrol",
    school: "Manila Science High School",
    status: "active" as const,
    membershipYears: 3,
  };

  return (
    <div className="p-8 bg-background">
      <div className="max-w-sm">
        <ScoutCard
          scout={mockScout}
          onView={(id) => console.log("View scout:", id)}
          onEdit={(id) => console.log("Edit scout:", id)}
        />
      </div>
    </div>
  );
}
