import { UnitCard } from "../unit-card";

export default function UnitCardExample() {
  const mockUnit = {
    id: "1",
    name: "Eagle Patrol",
    leader: "Scout Master Rodriguez",
    memberCount: 24,
    school: "Manila Science High School",
    status: "active" as const,
  };

  return (
    <div className="p-8 bg-background">
      <div className="max-w-sm">
        <UnitCard
          unit={mockUnit}
          onEdit={(id) => console.log("Edit unit:", id)}
          onViewMembers={(id) => console.log("View members:", id)}
        />
      </div>
    </div>
  );
}
