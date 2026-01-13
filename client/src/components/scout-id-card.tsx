import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, RotateCw, Phone, User, Shield } from "lucide-react";
import { useState } from "react";
import type { Scout } from "@shared/schema";
import { generateScoutIDCard } from "@/lib/id-card";

interface ScoutIDCardProps {
    scout: Scout;
    schoolName?: string;
    unitName?: string;
}

// BSP Mission and Vision placeholders - these should be replaced with official text
const BSP_MISSION = "To help young people develop character, citizenship, and physical and mental fitness through challenging programs in a caring, nurturing environment.";
const BSP_VISION = "To train and develop Filipino youth with practical outdoor and citizenship skill necessary for nation building and to promote world brotherhood and peace.";

export function ScoutIDCard({ scout, schoolName, unitName }: ScoutIDCardProps) {
    const [showBack, setShowBack] = useState(false);

    const handleDownloadID = async () => {
        await generateScoutIDCard({
            scout,
            schoolName,
            unitName,
            profilePhotoUrl: scout.profilePhoto || undefined,
        });
    };

    const flipCard = () => {
        setShowBack(!showBack);
    };

    return (
        <Card className="w-full max-w-lg overflow-hidden bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
            <CardContent className="p-0">
                <div className="relative min-h-[220px]" style={{ perspective: "1000px" }}>
                    {/* Card Container with Flip Animation */}
                    <div
                        className={`relative w-full transition-transform duration-500 preserve-3d ${showBack ? "rotate-y-180" : ""
                            }`}
                        style={{
                            transformStyle: "preserve-3d",
                            transform: showBack ? "rotateY(180deg)" : "rotateY(0deg)",
                        }}
                    >
                        {/* Front of Card */}
                        <div
                            className={`${showBack ? "hidden" : "block"}`}
                            style={{ backfaceVisibility: "hidden" }}
                        >
                            {/* Header */}
                            <div className="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800 text-white p-3 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Shield className="h-5 w-5" />
                                    <span className="font-bold text-sm">BOY SCOUTS OF THE PHILIPPINES</span>
                                </div>
                                <Badge variant="secondary" className="text-xs capitalize">
                                    {scout.status}
                                </Badge>
                            </div>

                            {/* Main Content */}
                            <div className="p-4 flex gap-4">
                                {/* Photo */}
                                <div className="flex-shrink-0">
                                    {scout.profilePhoto ? (
                                        <img
                                            src={scout.profilePhoto}
                                            alt={scout.name}
                                            className="w-20 h-20 rounded-lg object-cover border-2 border-blue-300"
                                        />
                                    ) : (
                                        <div className="w-20 h-20 rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center border-2 border-blue-300">
                                            <User className="h-8 w-8 text-gray-400" />
                                        </div>
                                    )}
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0 space-y-1">
                                    <h3 className="font-bold text-lg truncate text-gray-900 dark:text-white">
                                        {scout.name}
                                    </h3>
                                    <p className="text-sm font-mono text-blue-600 dark:text-blue-400">{scout.uid}</p>

                                    <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-gray-600 dark:text-gray-300 mt-2">
                                        {scout.rank && (
                                            <div>
                                                <span className="font-medium">Rank:</span>{" "}
                                                <span className="capitalize">{scout.rank}</span>
                                            </div>
                                        )}
                                        {scout.gender && (
                                            <div>
                                                <span className="font-medium">Gender:</span> {scout.gender}
                                            </div>
                                        )}
                                        {scout.bloodType && (
                                            <div>
                                                <span className="font-medium">Blood:</span> {scout.bloodType}
                                            </div>
                                        )}
                                        {schoolName && (
                                            <div className="col-span-2 truncate">
                                                <span className="font-medium">School:</span> {schoolName}
                                            </div>
                                        )}
                                        {unitName && (
                                            <div>
                                                <span className="font-medium">Unit:</span> {unitName}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="px-4 pb-3 flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
                                <span>Member since {new Date(scout.createdAt).getFullYear()}</span>
                                <span>{scout.membershipYears || 0} year(s)</span>
                            </div>
                        </div>

                        {/* Back of Card */}
                        <div
                            className={`absolute top-0 left-0 w-full ${showBack ? "block" : "hidden"}`}
                            style={{
                                backfaceVisibility: "hidden",
                                transform: "rotateY(180deg)",
                            }}
                        >
                            {/* Header */}
                            <div className="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800 text-white p-3">
                                <span className="font-bold text-sm">SCOUT IDENTIFICATION CARD - BACK</span>
                            </div>

                            {/* Contact Information */}
                            <div className="p-4 space-y-3">
                                {/* Emergency Contact */}
                                <div className="bg-white dark:bg-gray-800 rounded-lg p-3 space-y-2">
                                    <h4 className="font-semibold text-sm flex items-center gap-2 text-gray-900 dark:text-white">
                                        <Phone className="h-4 w-4 text-blue-600" />
                                        Emergency Contact
                                    </h4>
                                    {scout.parentGuardian && (
                                        <p className="text-xs text-gray-600 dark:text-gray-300">
                                            <span className="font-medium">Contact Person:</span> {scout.parentGuardian}
                                        </p>
                                    )}
                                    {scout.emergencyContact && (
                                        <p className="text-xs text-gray-600 dark:text-gray-300">
                                            <span className="font-medium">Contact #:</span> {scout.emergencyContact}
                                        </p>
                                    )}
                                    {scout.contactNumber && (
                                        <p className="text-xs text-gray-600 dark:text-gray-300">
                                            <span className="font-medium">Scout Contact:</span> {scout.contactNumber}
                                        </p>
                                    )}
                                </div>

                                {/* Mission & Vision */}
                                <div className="text-xs space-y-2">
                                    <div>
                                        <span className="font-semibold text-blue-700 dark:text-blue-400">BSP Vision:</span>
                                        <p className="text-gray-600 dark:text-gray-300 italic">{BSP_VISION}</p>
                                    </div>
                                    <div>
                                        <span className="font-semibold text-blue-700 dark:text-blue-400">BSP Mission:</span>
                                        <p className="text-gray-600 dark:text-gray-300 italic">{BSP_MISSION}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="border-t border-blue-200 dark:border-blue-800 p-3 flex gap-2 bg-white/50 dark:bg-gray-900/50">
                    <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 gap-2"
                        onClick={flipCard}
                    >
                        <RotateCw className="h-4 w-4" />
                        {showBack ? "Show Front" : "Show Back"}
                    </Button>
                    <Button
                        size="sm"
                        className="flex-1 gap-2"
                        onClick={handleDownloadID}
                    >
                        <Download className="h-4 w-4" />
                        Download PDF
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
