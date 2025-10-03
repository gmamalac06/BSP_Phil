import { ActivityCard } from "@/components/activity-card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Activities() {
  // TODO: Remove mock data
  const activities = [
    {
      id: "1",
      title: "Community Service Day",
      description: "Join us for a day of community service at the local park. We'll be cleaning up and planting trees.",
      date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      location: "Rizal Park, Manila",
      attendees: 45,
      capacity: 60,
      status: "upcoming" as const,
      userAttended: false,
    },
    {
      id: "2",
      title: "Scout Skills Training",
      description: "Learn essential scouting skills including knot-tying, first aid, and outdoor survival techniques.",
      date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      location: "Scout HQ, Quezon City",
      attendees: 28,
      capacity: 40,
      status: "upcoming" as const,
      userAttended: false,
    },
    {
      id: "3",
      title: "Team Building Camp",
      description: "A weekend camping trip focused on teamwork and leadership development.",
      date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      location: "Camp Aguinaldo",
      attendees: 52,
      capacity: 50,
      status: "completed" as const,
      userAttended: true,
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold mb-2">Activities & Events</h1>
          <p className="text-muted-foreground">
            Manage scout activities and track attendance
          </p>
        </div>
        <Button data-testid="button-create-activity">
          <Plus className="h-4 w-4 mr-2" />
          Create Activity
        </Button>
      </div>

      <Tabs defaultValue="upcoming">
        <TabsList>
          <TabsTrigger value="upcoming" data-testid="tab-upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="ongoing" data-testid="tab-ongoing">Ongoing</TabsTrigger>
          <TabsTrigger value="completed" data-testid="tab-completed">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {activities
              .filter((a) => a.status === "upcoming")
              .map((activity) => (
                <ActivityCard
                  key={activity.id}
                  activity={activity}
                  onMarkAttendance={(id) => console.log("Mark attendance:", id)}
                  onViewDetails={(id) => console.log("View details:", id)}
                />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="ongoing" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* No ongoing activities */}
          </div>
        </TabsContent>

        <TabsContent value="completed" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {activities
              .filter((a) => a.status === "completed")
              .map((activity) => (
                <ActivityCard
                  key={activity.id}
                  activity={activity}
                  onMarkAttendance={(id) => console.log("Mark attendance:", id)}
                  onViewDetails={(id) => console.log("View details:", id)}
                />
              ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
