import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye, FileDown } from "lucide-react";
import { ScoutWithRelations } from "@/hooks/useScouts";
import { exportToCSV, generateFilename } from "@/lib/export";
import { useState } from "react";
import { ScoutIDCard } from "@/components/scout-id-card";
import { ViewScoutDialog } from "@/components/view-scout-dialog";

interface SchoolMasterlistModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    scouts: ScoutWithRelations[];
    schoolName: string;
}

export function SchoolMasterlistModal({ open, onOpenChange, scouts, schoolName }: SchoolMasterlistModalProps) {
    const [selectedScoutForId, setSelectedScoutForId] = useState<ScoutWithRelations | null>(null);
    const [viewScout, setViewScout] = useState<ScoutWithRelations | null>(null);

    const handleExport = () => {
        const columns = [
            { key: "uid", label: "Scout ID" },
            { key: "name", label: "Name" },
            { key: "gender", label: "Gender" },
            { key: "rank", label: "Rank" },
            { key: "status", label: "Status" },
        ];
        exportToCSV(scouts, columns, generateFilename(`${schoolName}_Masterlist`));
    };

    return (
        <>
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Masterlist - {schoolName}</DialogTitle>
                        <DialogDescription>
                            Total Scouts: {scouts.length}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="flex justify-end mb-4">
                        <Button variant="outline" size="sm" onClick={handleExport}>
                            <FileDown className="h-4 w-4 mr-2" />
                            Export CSV
                        </Button>
                    </div>

                    <div className="border rounded-md">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Scout ID</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Gender</TableHead>
                                    <TableHead>Rank</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {scouts.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                                            No scouts found for this school.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    scouts.map((scout) => (
                                        <TableRow key={scout.id}>
                                            <TableCell className="font-mono">{scout.uid}</TableCell>
                                            <TableCell>{scout.name}</TableCell>
                                            <TableCell>{scout.gender}</TableCell>
                                            <TableCell className="capitalize">{scout.rank || "-"}</TableCell>
                                            <TableCell>
                                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${scout.status === 'active' ? 'bg-green-100 text-green-800' :
                                                    scout.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                        'bg-red-100 text-red-800'
                                                    }`}>
                                                    {scout.status}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => setSelectedScoutForId(scout)}
                                                        title="View ID Card"
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </DialogContent>
            </Dialog>

            {/* ID Card Modal */}
            {selectedScoutForId && (
                <Dialog open={!!selectedScoutForId} onOpenChange={(open) => !open && setSelectedScoutForId(null)}>
                    <DialogContent className="max-w-md">
                        <DialogHeader>
                            <DialogTitle>Scout ID Card</DialogTitle>
                        </DialogHeader>
                        <div className="flex justify-center py-4">
                            <ScoutIDCard scout={selectedScoutForId} />
                        </div>
                    </DialogContent>
                </Dialog>
            )}
        </>
    );
}
