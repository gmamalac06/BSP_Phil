import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, UserCog, Building, CheckCircle, XCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { TableSkeleton } from "@/components/skeletons/table-skeleton";
import { supabase } from "@/lib/supabase";
import { safeToLocaleDateString } from "@/lib/safe-date";

interface User {
    id: string;
    email: string;
    username: string;
    role: string;
    is_approved: boolean;
    school_id?: string;
    unit_id?: string;
    created_at: string;
}

export default function StaffMembers() {
    const [searchQuery, setSearchQuery] = useState("");

    const { data: staffMembers = [], isLoading } = useQuery({
        queryKey: ["users", "staff"],
        queryFn: async (): Promise<User[]> => {
            const { data, error } = await supabase
                .from("users")
                .select("*")
                .eq("role", "staff")
                .order("username");
            if (error) throw new Error(error.message);
            return data || [];
        },
    });

    const filteredStaff = useMemo(() => {
        if (!searchQuery) return staffMembers;
        const query = searchQuery.toLowerCase();
        return staffMembers.filter(
            (staff) =>
                staff.username.toLowerCase().includes(query) ||
                staff.email.toLowerCase().includes(query)
        );
    }, [staffMembers, searchQuery]);

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
                        <UserCog className="h-10 w-10 text-primary" />
                        Staff Members
                    </h1>
                    <p className="text-muted-foreground">
                        View and manage all staff member accounts
                    </p>
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

            {isLoading ? (
                <TableSkeleton rows={6} columns={4} />
            ) : filteredStaff.length === 0 ? (
                <div className="flex items-center justify-center h-64">
                    <div className="text-center text-muted-foreground">
                        <UserCog className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>{searchQuery ? "No staff members found matching your search." : "No staff members registered yet."}</p>
                    </div>
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {filteredStaff.map((staff) => (
                        <Card key={staff.id} className="hover:shadow-lg transition-shadow">
                            <CardHeader className="pb-3">
                                <div className="flex items-start justify-between">
                                    <CardTitle className="text-lg font-semibold">{staff.username}</CardTitle>
                                    {staff.is_approved ? (
                                        <Badge variant="default" className="bg-green-500">
                                            <CheckCircle className="h-3 w-3 mr-1" />
                                            Approved
                                        </Badge>
                                    ) : (
                                        <Badge variant="secondary" className="bg-yellow-500 text-white">
                                            <XCircle className="h-3 w-3 mr-1" />
                                            Pending
                                        </Badge>
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <div className="text-sm text-muted-foreground">
                                    <span className="font-medium">Email:</span> {staff.email}
                                </div>
                                {staff.school_id && (
                                    <div className="text-sm text-muted-foreground flex items-center gap-1">
                                        <Building className="h-3 w-3" />
                                        <span>School ID: {staff.school_id}</span>
                                    </div>
                                )}
                                <div className="text-xs text-muted-foreground">
                                    Registered: {safeToLocaleDateString(staff.created_at)}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            <div className="text-sm text-muted-foreground">
                Showing {filteredStaff.length} of {staffMembers.length} staff members
            </div>
        </div>
    );
}
