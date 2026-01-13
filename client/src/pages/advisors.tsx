import { useQuery } from "@tanstack/react-query";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { TableSkeleton } from "@/components/skeletons/table-skeleton";
import { Shield, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState, useMemo } from "react";
import type { User, School, Unit } from "@shared/schema";

export default function Staffs() {
    const [searchQuery, setSearchQuery] = useState("");

    // Fetch staff members
    const { data: users = [], isLoading: isLoadingUsers } = useQuery<User[]>({
        queryKey: ["users", "staff"],
        queryFn: async () => {
            const res = await fetch("/api/users?role=staff");
            if (!res.ok) throw new Error("Failed to fetch staff");
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

    // Fetch units for mapping (to find which unit the advisor leads)
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

    const filteredUsers = useMemo(() => {
        if (!searchQuery) return users;
        const query = searchQuery.toLowerCase();
        return users.filter(user =>
            user.username.toLowerCase().includes(query) ||
            user.email.toLowerCase().includes(query)
        );
    }, [users, searchQuery]);

    if (isLoadingUsers) {
        return (
            <div className="p-6 space-y-6">
                <div>
                    <h1 className="text-4xl font-bold mb-2">Staffs</h1>
                    <p className="text-muted-foreground">
                        View registered staff members
                    </p>
                </div>
                <TableSkeleton rows={5} columns={4} />
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-bold mb-2">Staffs</h1>
                    <p className="text-muted-foreground">
                        View registered staff members
                    </p>,
                </div>
            </div>

            <div className="flex gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search staff members..."
                        className="pl-9"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {filteredUsers.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-12 border rounded-lg bg-muted/10 h-96">
                    <Shield className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium">No Staff Members Found</h3>
                    <p className="text-muted-foreground">
                        {searchQuery ? "No staff members match your search." : "No staff members have been registered yet."}
                    </p>
                </div>
            ) : (
                <div className="border rounded-md">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Staff Member</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Affiliation</TableHead>
                                <TableHead>Joined Date</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredUsers.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell>
                                        <div className="font-medium">{user.username}</div>
                                        <div className="text-sm text-muted-foreground">{user.email}</div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="secondary" className="capitalize">
                                            Staff
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="space-y-1">
                                            {user.schoolId && (
                                                <div className="flex items-center text-sm">
                                                    <span className="font-medium mr-2">School:</span>
                                                    {getSchoolName(user.schoolId)}
                                                </div>
                                            )}
                                            {!user.schoolId && <span className="text-muted-foreground">-</span>}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {new Date(user.createdAt).toLocaleDateString()}
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
