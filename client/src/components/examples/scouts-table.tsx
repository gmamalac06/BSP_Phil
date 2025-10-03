import { ScoutsTable } from "../scouts-table";

export default function ScoutsTableExample() {
  const mockScouts = [
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
  ];

  return (
    <div className="p-8 bg-background">
      <ScoutsTable
        scouts={mockScouts}
        onView={(id) => console.log("View:", id)}
        onEdit={(id) => console.log("Edit:", id)}
        onDownloadId={(id) => console.log("Download ID:", id)}
      />
    </div>
  );
}
