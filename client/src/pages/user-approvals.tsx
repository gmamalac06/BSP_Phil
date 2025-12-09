import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Check, X, ShieldAlert } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { TableSkeleton } from "@/components/skeletons/table-skeleton";
import type { User, School, Unit } from "@shared/schema";

export default function UserApprovals() {
    const { toast } = useToast();
    const queryClient = useQueryClient();

    // Fetch pending users
    const { data: users = [], isLoading: isLoadingUsers } = useQuery<User[]>({
        queryKey: ["users", "pending"],
        queryFn: async () => {
            const res = await fetch("/api/users/pending");
            if (!res.ok) throw new Error("Failed to fetch pending users");
            return res.json();
        },
    });

    // Fetch schools for mapping
    const { data: schools = [] } = useQuery<School[]>({
        queryKey: ["schools"],
        queryFn: async () => {
            const res = await fetch("/api/schools");
            if (!res.ok) throw new Error("Failed to fetch schools");
            return res.json();
        },
    });

    // Fetch units for mapping
    const { data: units = [] } = useQuery<Unit[]>({
        queryKey: ["units"],
        queryFn: async () => {
            const res = await fetch("/api/units");
            if (!res.ok) throw new Error("Failed to fetch units");
            return res.json();
        },
    });

    const getSchoolName = (id?: string | null) => {
        if (!id) return null;
        return schools.find(s => s.id === id)?.name || id;
    };

    const getUnitName = (id?: string | null) => {
        if (!id) return null;
        return units.find(u => u.id === id)?.name || id;
    };

    const approveMutation = useMutation({
        mutationFn: async (userId: string) => {
            const res = await fetch(`/api/users/${userId}/approve`, {
                method: "POST",
            });
            if (!res.ok) throw new Error("Failed to approve user");
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users", "pending"] });
            toast({
                title: "User Approved",
                description: "The user account has been approved and can now access the system.",
            });
        },
        onError: (error: Error) => {
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive",
            });
        },
    });

    const rejectMutation = useMutation({
        mutationFn: async (userId: string) => {
            const res = await fetch(`/api/users/${userId}`, {
                method: "DELETE",
            });
            if (!res.ok) throw new Error("Failed to reject user");
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users", "pending"] });
            toast({
                title: "User Rejected",
                description: "The user registration has been rejected.",
            });
        },
        onError: (error: Error) => {
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive",
            });
        },
    });

    const handleApprove = (userId: string) => {
        approveMutation.mutate(userId);
    };

    const handleReject = (userId: string) => {
        if (confirm("Are you sure you want to reject this user? The account will be deleted.")) {
            rejectMutation.mutate(userId);
        }
    };

    if (isLoadingUsers) {
        return (
            <div className="p-6 space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">User Approvals</h1>
                    <p className="text-muted-foreground">
                        Review and approve pending user registrations.
                    </p>
                </div>
                <TableSkeleton rows={5} columns={5} />
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">User Approvals</h1>
                    <p className="text-muted-foreground">
                        Review and approve pending user registrations.
                    </p>
                </div>
            </div>

            {users.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-12 border rounded-lg bg-muted/10">
                    <ShieldAlert className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium">No Pending Approvals</h3>
                    <p className="text-muted-foreground">All user registrations have been processed.</p>
                </div>
            ) : (
                <div className="border rounded-md">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>User</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Affiliation</TableHead>
                                <TableHead>Registered</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell>
                                        <div className="font-medium">{user.username}</div>
                                        <div className="text-sm text-muted-foreground">{user.email}</div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className="capitalize">
                                            {user.role === "unit_leader" ? "Unit Leader" : user.role}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        {user.role === "staff" && user.schoolId && (
                                            <span className="text-sm">School: {getSchoolName(user.schoolId)}</span>
                                        )}
                                        {user.role === "unit_leader" && user.unitId && (
                                            <span className="text-sm">Unit: {getUnitName(user.unitId)}</span>
                                        )}
                                        {(user.role !== "staff" && user.role !== "unit_leader") && (
                                            <span className="text-sm text-muted-foreground">N/A</span>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {new Date(user.createdAt).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell className="text-right space-x-2">
                                        <Button
                                            size="sm"
                                            variant="destructive"
                                            onClick={() => handleReject(user.id)}
                                            disabled={rejectMutation.isPending || approveMutation.isPending}
                                        >
                                            <X className="h-4 w-4 mr-1" />
                                            Reject
                                        </Button>
                                        <Button
                                            size="sm"
                                            onClick={() => handleApprove(user.id)}
                                            disabled={rejectMutation.isPending || approveMutation.isPending}
                                        >
                                            <Check className="h-4 w-4 mr-1" />
                                            Approve
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}
        </div>
    );
}
