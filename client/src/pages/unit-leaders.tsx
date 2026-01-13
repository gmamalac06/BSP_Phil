import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Users, Building, CheckCircle, XCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { TableSkeleton } from "@/components/skeletons/table-skeleton";

interface User {
    id: string;
    email: string;
    username: string;
    role: string;
    isApproved: boolean;
    schoolId?: string;
    unitId?: string;
    createdAt: string;
}

async function fetchUsersByRole(role: string): Promise<User[]> {
    const response = await fetch(`/api/users?role=${role}`);
    if (!response.ok) {
        throw new Error("Failed to fetch users");
    }
    return response.json();
}

export default function UnitLeaders() {
    const [searchQuery, setSearchQuery] = useState("");

    const { data: unitLeaders = [], isLoading } = useQuery({
        queryKey: ["users", "unit_leader"],
        queryFn: () => fetchUsersByRole("unit_leader"),
    });

    const filteredLeaders = useMemo(() => {
        if (!searchQuery) return unitLeaders;
        const query = searchQuery.toLowerCase();
        return unitLeaders.filter(
            (leader) =>
                leader.username.toLowerCase().includes(query) ||
                leader.email.toLowerCase().includes(query)
        );
    }, [unitLeaders, searchQuery]);

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
                        <Users className="h-10 w-10 text-primary" />
                        Unit Leaders
                    </h1>
                    <p className="text-muted-foreground">
                        View and manage all unit leader accounts
                    </p>
                </div>
            </div>

            <div className="flex gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search unit leaders..."
                        className="pl-9"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {isLoading ? (
                <TableSkeleton rows={6} columns={4} />
            ) : filteredLeaders.length === 0 ? (
                <div className="flex items-center justify-center h-64">
                    <div className="text-center text-muted-foreground">
                        <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>{searchQuery ? "No unit leaders found matching your search." : "No unit leaders registered yet."}</p>
                    </div>
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {filteredLeaders.map((leader) => (
                        <Card key={leader.id} className="hover:shadow-lg transition-shadow">
                            <CardHeader className="pb-3">
                                <div className="flex items-start justify-between">
                                    <CardTitle className="text-lg font-semibold">{leader.username}</CardTitle>
                                    {leader.isApproved ? (
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
                                    <span className="font-medium">Email:</span> {leader.email}
                                </div>
                                {leader.unitId && (
                                    <div className="text-sm text-muted-foreground flex items-center gap-1">
                                        <Building className="h-3 w-3" />
                                        <span>Unit ID: {leader.unitId}</span>
                                    </div>
                                )}
                                <div className="text-xs text-muted-foreground">
                                    Registered: {new Date(leader.createdAt).toLocaleDateString()}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            <div className="text-sm text-muted-foreground">
                Showing {filteredLeaders.length} of {unitLeaders.length} unit leaders
            </div>
        </div>
    );
}
