import { StatCard } from "@/components/stat-card";
import { AnnouncementCard } from "@/components/announcement-card";
import { ActivityCard } from "@/components/activity-card";
import { Users, UserPlus, Calendar, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useStats } from "@/hooks/useStats";
import { useAnnouncements } from "@/hooks/useAnnouncements";
import { useActivities } from "@/hooks/useActivities";

export default function Dashboard() {
  const { data: statsData, isLoading: statsLoading } = useStats();
  const { data: announcementsData = [], isLoading: announcementsLoading } = useAnnouncements();
  const { data: activitiesData = [], isLoading: activitiesLoading } = useActivities("upcoming");

  const stats = statsData ? [
    {
      title: "Total Scouts",
      value: statsData.totalScouts.toString(),
      icon: Users,
    },
    {
      title: "Active Scouts",
      value: statsData.activeScouts.toString(),
      icon: UserPlus,
    },
    {
      title: "Upcoming Activities",
      value: statsData.upcomingActivities.toString(),
      icon: Calendar,
    },
    {
      title: "Pending Scouts",
      value: statsData.pendingScouts.toString(),
      icon: TrendingUp,
    },
  ] : [];

  const announcements = announcementsData.slice(0, 2).map(ann => ({
    ...ann,
    date: new Date(ann.createdAt),
  }));

  const upcomingActivities = activitiesData.slice(0, 2).map(act => ({
    ...act,
    date: new Date(act.date),
    attendees: 0,
  }));

  if (statsLoading || announcementsLoading || activitiesLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-32 bg-gray-200 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

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
              {announcements.length > 0 ? (
                announcements.map((announcement) => (
                  <AnnouncementCard
                    key={announcement.id}
                    announcement={announcement}
                    onView={(id) => console.log("View announcement:", id)}
                  />
                ))
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  No announcements yet
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Activities</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {upcomingActivities.length > 0 ? (
                upcomingActivities.map((activity) => (
                  <ActivityCard
                    key={activity.id}
                    activity={activity}
                    onMarkAttendance={(id) => console.log("Mark attendance:", id)}
                    onViewDetails={(id) => console.log("View details:", id)}
                  />
                ))
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  No upcoming activities
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
