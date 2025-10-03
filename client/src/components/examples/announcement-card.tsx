import { AnnouncementCard } from "../announcement-card";

export default function AnnouncementCardExample() {
  const mockAnnouncement = {
    id: "1",
    title: "Annual Scout Jamboree 2024",
    content: "The annual jamboree will be held on December 15-17, 2024 at Camp Aguinaldo. All scouts are encouraged to participate in this year's event.",
    type: "event" as const,
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    author: "Admin Team",
    smsNotified: true,
  };

  return (
    <div className="p-8 bg-background">
      <div className="max-w-2xl">
        <AnnouncementCard
          announcement={mockAnnouncement}
          onView={(id) => console.log("View announcement:", id)}
        />
      </div>
    </div>
  );
}
