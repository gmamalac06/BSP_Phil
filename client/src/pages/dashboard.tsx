import { StatCard } from "@/components/stat-card";
import { AnnouncementCard } from "@/components/announcement-card";
import { ActivityCard } from "@/components/activity-card";
import { Users, UserPlus, Calendar, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Dashboard() {
  // TODO: Remove mock data
  const stats = [
    { title: "Total Scouts", value: "1,248", icon: Users, trend: { value: "12%", isPositive: true } },
    { title: "New Registrations", value: "84", icon: UserPlus, trend: { value: "8%", isPositive: true } },
    { title: "Upcoming Activities", value: "12", icon: Calendar, trend: { value: "3", isPositive: true } },
    { title: "Membership Growth", value: "15%", icon: TrendingUp, trend: { value: "2%", isPositive: true } },
  ];

  const announcements = [
    {
      id: "1",
      title: "Annual Scout Jamboree 2024",
      content: "The annual jamboree will be held on December 15-17, 2024 at Camp Aguinaldo.",
      type: "event" as const,
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      author: "Admin Team",
      smsNotified: true,
    },
    {
      id: "2",
      title: "New Membership Policy",
      content: "Updated membership requirements and guidelines are now in effect.",
      type: "policy" as const,
      date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      author: "BSP Council",
      smsNotified: false,
    },
  ];

  const upcomingActivities = [
    {
      id: "1",
      title: "Community Service Day",
      description: "Join us for a day of community service at the local park.",
      date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      location: "Rizal Park, Manila",
      attendees: 45,
      capacity: 60,
      status: "upcoming" as const,
    },
    {
      id: "2",
      title: "Scout Skills Training",
      description: "Learn essential scouting skills including knot-tying and first aid.",
      date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      location: "Scout HQ, Quezon City",
      attendees: 28,
      capacity: 40,
      status: "upcoming" as const,
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's an overview of your scouting activities.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Announcements</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {announcements.map((announcement) => (
                <AnnouncementCard
                  key={announcement.id}
                  announcement={announcement}
                  onView={(id) => console.log("View announcement:", id)}
                />
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Activities</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {upcomingActivities.map((activity) => (
                <ActivityCard
                  key={activity.id}
                  activity={activity}
                  onMarkAttendance={(id) => console.log("Mark attendance:", id)}
                  onViewDetails={(id) => console.log("View details:", id)}
                />
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
