import { ActivityCard } from "../activity-card";

export default function ActivityCardExample() {
  const mockActivity = {
    id: "1",
    title: "Community Service Day",
    description: "Join us for a day of community service at the local park. We'll be cleaning up and planting trees.",
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    location: "Rizal Park, Manila",
    attendees: 45,
    capacity: 60,
    status: "upcoming" as const,
    userAttended: false,
  };

  return (
    <div className="p-8 bg-background">
      <div className="max-w-md">
        <ActivityCard
          activity={mockActivity}
          onMarkAttendance={(id) => console.log("Mark attendance:", id)}
          onViewDetails={(id) => console.log("View details:", id)}
        />
      </div>
    </div>
  );
}
