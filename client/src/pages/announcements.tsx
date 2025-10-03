import { AnnouncementCard } from "@/components/announcement-card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Announcements() {
  // TODO: Remove mock data
  const announcements = [
    {
      id: "1",
      title: "Annual Scout Jamboree 2024",
      content: "The annual jamboree will be held on December 15-17, 2024 at Camp Aguinaldo. All scouts are encouraged to participate in this year's event featuring camping, outdoor activities, and leadership workshops.",
      type: "event" as const,
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      author: "Admin Team",
      smsNotified: true,
    },
    {
      id: "2",
      title: "New Membership Policy",
      content: "Updated membership requirements and guidelines are now in effect. Please review the new policies in the member portal. These changes ensure better organization and management of our scout community.",
      type: "policy" as const,
      date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      author: "BSP Council",
      smsNotified: false,
    },
    {
      id: "3",
      title: "Uniform Guidelines Updated",
      content: "The official scout uniform guidelines have been updated. Please ensure all scouts comply with the new standards by the end of the month.",
      type: "policy" as const,
      date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      author: "BSP Council",
      smsNotified: true,
    },
    {
      id: "4",
      title: "Leadership Training Workshop",
      content: "Join us for an intensive leadership development workshop designed for senior scouts and patrol leaders. Registration is now open!",
      type: "announcement" as const,
      date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      author: "Training Department",
      smsNotified: false,
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold mb-2">Announcements</h1>
          <p className="text-muted-foreground">
            View and manage announcements and policies
          </p>
        </div>
        <Button data-testid="button-create-announcement">
          <Plus className="h-4 w-4 mr-2" />
          New Announcement
        </Button>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all" data-testid="tab-all-announcements">All</TabsTrigger>
          <TabsTrigger value="announcement" data-testid="tab-announcements">Announcements</TabsTrigger>
          <TabsTrigger value="policy" data-testid="tab-policies">Policies</TabsTrigger>
          <TabsTrigger value="event" data-testid="tab-events">Events</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <div className="grid gap-4 md:grid-cols-2">
            {announcements.map((announcement) => (
              <AnnouncementCard
                key={announcement.id}
                announcement={announcement}
                onView={(id) => console.log("View announcement:", id)}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="announcement" className="mt-6">
          <div className="grid gap-4 md:grid-cols-2">
            {announcements
              .filter((a) => a.type === "announcement")
              .map((announcement) => (
                <AnnouncementCard
                  key={announcement.id}
                  announcement={announcement}
                  onView={(id) => console.log("View announcement:", id)}
                />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="policy" className="mt-6">
          <div className="grid gap-4 md:grid-cols-2">
            {announcements
              .filter((a) => a.type === "policy")
              .map((announcement) => (
                <AnnouncementCard
                  key={announcement.id}
                  announcement={announcement}
                  onView={(id) => console.log("View announcement:", id)}
                />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="event" className="mt-6">
          <div className="grid gap-4 md:grid-cols-2">
            {announcements
              .filter((a) => a.type === "event")
              .map((announcement) => (
                <AnnouncementCard
                  key={announcement.id}
                  announcement={announcement}
                  onView={(id) => console.log("View announcement:", id)}
                />
              ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
