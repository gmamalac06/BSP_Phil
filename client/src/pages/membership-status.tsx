import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, CreditCard, AlertTriangle, CheckCircle, RefreshCw } from "lucide-react";
import { useScouts, useUpdateScout } from "@/hooks/useScouts";
import { TableSkeleton } from "@/components/skeletons/table-skeleton";
import { useToast } from "@/hooks/use-toast";
import type { Scout } from "@shared/schema";

export default function MembershipStatus() {
    const [searchQuery, setSearchQuery] = useState("");
    const [activeTab, setActiveTab] = useState("expired");

    const { data: allScouts = [], isLoading } = useScouts();
    const updateScout = useUpdateScout();
    const { toast } = useToast();

    // Filter scouts by membership status
    const expiredScouts = useMemo(() => {
        return allScouts.filter(scout => scout.status === "expired");
    }, [allScouts]);

    const renewedScouts = useMemo(() => {
        return allScouts.filter(scout =>
            scout.status === "active" && (scout.membershipYears || 0) > 0
        );
    }, [allScouts]);

    const currentList = activeTab === "expired" ? expiredScouts : renewedScouts;

    const filteredScouts = useMemo(() => {
        if (!searchQuery) return currentList;
        const query = searchQuery.toLowerCase();
        return currentList.filter(scout =>
            scout.name.toLowerCase().includes(query) ||
            scout.uid.toLowerCase().includes(query) ||
            scout.municipality.toLowerCase().includes(query)
        );
    }, [currentList, searchQuery]);

    const handleRenewMembership = async (scout: Scout) => {
        try {
            await updateScout.mutateAsync({
                id: scout.id,
                data: {
                    status: "active",
                    membershipYears: (scout.membershipYears || 0) + 1,
                }
            });
            toast({
                title: "Membership Renewed",
                description: `${scout.name}'s membership has been renewed successfully.`,
            });
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Failed to renew membership",
                variant: "destructive",
            });
        }
    };

    const handleExpireMembership = async (scout: Scout) => {
        try {
            await updateScout.mutateAsync({
                id: scout.id,
                data: { status: "expired" }
            });
            toast({
                title: "Membership Expired",
                description: `${scout.name}'s membership has been marked as expired.`,
            });
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Failed to update membership",
                variant: "destructive",
            });
        }
    };

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
                        <CreditCard className="h-10 w-10 text-primary" />
                        Membership Status
                    </h1>
                    <p className="text-muted-foreground">
                        Track and manage scout membership renewals
                    </p>
                </div>
            </div>

            <div className="flex gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search scouts..."
                        className="pl-9"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid gap-4 md:grid-cols-2">
                <Card className="border-l-4 border-l-yellow-500">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-yellow-500" />
                            Expired Memberships
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold text-yellow-600">{expiredScouts.length}</p>
                        <p className="text-sm text-muted-foreground">Scouts requiring renewal</p>
                    </CardContent>
                </Card>
                <Card className="border-l-4 border-l-green-500">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <CheckCircle className="h-5 w-5 text-green-500" />
                            Renewed Memberships
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold text-green-600">{renewedScouts.length}</p>
                        <p className="text-sm text-muted-foreground">Active renewed scouts</p>
                    </CardContent>
                </Card>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                    <TabsTrigger value="expired" className="gap-2">
                        <AlertTriangle className="h-4 w-4" />
                        Expired ({expiredScouts.length})
                    </TabsTrigger>
                    <TabsTrigger value="renewed" className="gap-2">
                        <CheckCircle className="h-4 w-4" />
                        Renewed ({renewedScouts.length})
                    </TabsTrigger>
                </TabsList>

                <TabsContent value={activeTab} className="mt-4">
                    {isLoading ? (
                        <TableSkeleton rows={6} columns={5} />
                    ) : filteredScouts.length === 0 ? (
                        <div className="flex items-center justify-center h-64">
                            <div className="text-center text-muted-foreground">
                                <CreditCard className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                <p>
                                    {searchQuery
                                        ? "No scouts found matching your search."
                                        : activeTab === "expired"
                                            ? "No expired memberships."
                                            : "No renewed memberships."}
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {filteredScouts.map((scout) => (
                                <Card key={scout.id} className="hover:shadow-lg transition-shadow">
                                    <CardHeader className="pb-3">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <CardTitle className="text-lg font-semibold">{scout.name}</CardTitle>
                                                <p className="text-sm text-muted-foreground">{scout.uid}</p>
                                            </div>
                                            <Badge
                                                variant={scout.status === "expired" ? "destructive" : "default"}
                                                className={scout.status === "active" ? "bg-green-500" : ""}
                                            >
                                                {scout.status}
                                            </Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        <div className="text-sm space-y-1">
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">Municipality:</span>
                                                <span>{scout.municipality}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">Years Active:</span>
                                                <span>{scout.membershipYears || 0} year(s)</span>
                                            </div>
                                            {scout.rank && (
                                                <div className="flex justify-between">
                                                    <span className="text-muted-foreground">Rank:</span>
                                                    <span className="capitalize">{scout.rank}</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="pt-2">
                                            {scout.status === "expired" ? (
                                                <Button
                                                    size="sm"
                                                    className="w-full gap-2"
                                                    onClick={() => handleRenewMembership(scout)}
                                                    disabled={updateScout.isPending}
                                                >
                                                    <RefreshCw className="h-4 w-4" />
                                                    Renew Membership
                                                </Button>
                                            ) : (
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="w-full gap-2"
                                                    onClick={() => handleExpireMembership(scout)}
                                                    disabled={updateScout.isPending}
                                                >
                                                    <AlertTriangle className="h-4 w-4" />
                                                    Mark as Expired
                                                </Button>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </TabsContent>
            </Tabs>

            <div className="text-sm text-muted-foreground">
                Showing {filteredScouts.length} of {currentList.length} scouts
            </div>
        </div>
    );
}
