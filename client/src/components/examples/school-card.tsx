import { SchoolCard } from "../school-card";

export default function SchoolCardExample() {
  const mockSchool = {
    id: "1",
    name: "Manila Science High School",
    municipality: "Manila",
    scoutCount: 145,
    unitCount: 6,
    principal: "Dr. Maria Santos",
  };

  return (
    <div className="p-8 bg-background">
      <div className="max-w-sm">
        <SchoolCard
          school={mockSchool}
          onEdit={(id) => console.log("Edit school:", id)}
          onViewScouts={(id) => console.log("View scouts:", id)}
        />
      </div>
    </div>
  );
}
