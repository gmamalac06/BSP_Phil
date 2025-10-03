import { StatCard } from "../stat-card";
import { Users } from "lucide-react";

export default function StatCardExample() {
  return (
    <div className="p-8 bg-background">
      <StatCard
        title="Total Scouts"
        value="1,248"
        icon={Users}
        trend={{ value: "12%", isPositive: true }}
      />
    </div>
  );
}
