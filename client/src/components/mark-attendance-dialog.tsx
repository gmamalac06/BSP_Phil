import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Users } from "lucide-react";
import { useScouts } from "@/hooks/useScouts";
import { useActivityAttendance, useMarkAttendance } from "@/hooks/useAttendance";
import type { Activity } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

interface MarkAttendanceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  activity: Activity | null;
}

export function MarkAttendanceDialog({
  open,
  onOpenChange,
  activity,
}: MarkAttendanceDialogProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedScouts, setSelectedScouts] = useState<Record<string, boolean>>({});
  
  const { data: scouts = [], isLoading: scoutsLoading } = useScouts();
  const { data: attendance = [], isLoading: attendanceLoading } = useActivityAttendance(activity?.id || "");
  const markAttendance = useMarkAttendance(activity?.id || "");
  const { toast } = useToast();

  // Initialize selected scouts from existing attendance
  useState(() => {
    if (attendance.length > 0 && Object.keys(selectedScouts).length === 0) {
      const attendanceMap: Record<string, boolean> = {};
      attendance.forEach((a) => {
        attendanceMap[a.scoutId] = a.attended || false;
      });
      setSelectedScouts(attendanceMap);
    }
  });

  const filteredScouts = scouts.filter((scout) =>
    scout.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    scout.uid.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleToggle = (scoutId: string) => {
    setSelectedScouts((prev) => ({
      ...prev,
      [scoutId]: !prev[scoutId],
    }));
  };

  const handleSave = async () => {
    try {
      const promises = Object.entries(selectedScouts).map(([scoutId, attended]) =>
        markAttendance.mutateAsync({ scoutId, attended })
      );
      
      await Promise.all(promises);
      
      toast({
        title: "Success",
        description: "Attendance marked successfully",
      });
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to mark attendance",
        variant: "destructive",
      });
    }
  };

  const attendedCount = Object.values(selectedScouts).filter(Boolean).length;

  if (!activity) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Mark Attendance - {activity.title}</DialogTitle>
          <DialogDescription>
            Select scouts who attended this activity
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search scouts..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Stats */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>{attendedCount} / {scouts.length} scouts marked as attended</span>
          </div>

          {/* Scouts List */}
          <ScrollArea className="h-[400px] border rounded-md">
            {scoutsLoading || attendanceLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-pulse text-muted-foreground">Loading scouts...</div>
              </div>
            ) : filteredScouts.length === 0 ? (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                No scouts found
              </div>
            ) : (
              <div className="space-y-2 p-4">
                {filteredScouts.map((scout) => (
                  <div
                    key={scout.id}
                    className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Checkbox
                        checked={selectedScouts[scout.id] || false}
                        onCheckedChange={() => handleToggle(scout.id)}
                      />
                      <div>
                        <div className="font-medium">{scout.name}</div>
                        <div className="text-sm text-muted-foreground">{scout.uid}</div>
                      </div>
                    </div>
                    {scout.unitId && (
                      <div className="text-sm text-muted-foreground">
                        Unit: {scout.unitId}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>

          {/* Actions */}
          <div className="flex justify-between gap-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setSelectedScouts({})}
              >
                Clear All
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  const all: Record<string, boolean> = {};
                  scouts.forEach((s) => all[s.id] = true);
                  setSelectedScouts(all);
                }}
              >
                Select All
              </Button>
              <Button
                onClick={handleSave}
                disabled={markAttendance.isPending}
              >
                {markAttendance.isPending ? "Saving..." : "Save Attendance"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}




