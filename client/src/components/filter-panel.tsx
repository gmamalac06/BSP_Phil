import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter } from "lucide-react";
import { useSchools } from "@/hooks/useSchools";
import { useUnits } from "@/hooks/useUnits";
import { useState, useMemo } from "react";

interface FilterPanelProps {
  onFilter?: (filters: any) => void;
}

export function FilterPanel({ onFilter }: FilterPanelProps) {
  const { data: schools = [] } = useSchools();
  const { data: units = [] } = useUnits();
  const [localFilters, setLocalFilters] = useState<any>({});

  const municipalities = useMemo(() => {
    const unique = new Set(schools.map(s => s.municipality).filter(Boolean));
    return Array.from(unique).sort();
  }, [schools]);

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...localFilters, [key]: value === "all" ? undefined : value };
    setLocalFilters(newFilters);
    // Don't auto-apply, wait for Apply button
  };

  const handleApplyFilters = () => {
    console.log("Filters applied", localFilters);
    onFilter?.(localFilters);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Filters
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="search">Search</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="search"
              placeholder="Search by name or UID..."
              className="pl-9"
              data-testid="input-search"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select>
            <SelectTrigger id="status" data-testid="select-status">
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="gender">Gender</Label>
          <Select>
            <SelectTrigger id="gender" data-testid="select-gender-filter">
              <SelectValue placeholder="All genders" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Genders</SelectItem>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="municipality">Municipality</Label>
          <Select onValueChange={(value) => handleFilterChange("municipality", value)}>
            <SelectTrigger id="municipality" data-testid="select-municipality">
              <SelectValue placeholder="All municipalities" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Municipalities</SelectItem>
              {municipalities.map((municipality) => (
                <SelectItem key={municipality} value={municipality}>
                  {municipality}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="school">School</Label>
          <Select onValueChange={(value) => handleFilterChange("schoolId", value)}>
            <SelectTrigger id="school" data-testid="select-school-filter">
              <SelectValue placeholder="All schools" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Schools</SelectItem>
              {schools.map((school) => (
                <SelectItem key={school.id} value={school.id}>
                  {school.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="unit">Unit</Label>
          <Select onValueChange={(value) => handleFilterChange("unitId", value)}>
            <SelectTrigger id="unit" data-testid="select-unit-filter">
              <SelectValue placeholder="All units" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Units</SelectItem>
              {units.map((unit) => (
                <SelectItem key={unit.id} value={unit.id}>
                  {unit.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button className="w-full" onClick={handleApplyFilters} data-testid="button-apply-filters">
          Apply Filters
        </Button>
      </CardContent>
    </Card>
  );
}
