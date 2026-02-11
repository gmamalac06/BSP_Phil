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
import { Search, Filter, RotateCcw } from "lucide-react";
import { useSchools } from "@/hooks/useSchools";
import { useUnits } from "@/hooks/useUnits";
import { useState, useMemo, useEffect } from "react";

interface FilterPanelProps {
  onFilter?: (filters: any) => void;
  initialFilters?: Record<string, string>;
}

export function FilterPanel({ onFilter, initialFilters }: FilterPanelProps) {
  const { data: schools = [] } = useSchools();
  const { data: units = [] } = useUnits();
  const [localFilters, setLocalFilters] = useState<any>(initialFilters || {});

  // Sync initial filters when they change (e.g. from URL params)
  useEffect(() => {
    if (initialFilters && Object.keys(initialFilters).length > 0) {
      setLocalFilters((prev: any) => ({ ...prev, ...initialFilters }));
    }
  }, [initialFilters]);

  const municipalities = useMemo(() => {
    const unique = new Set(schools.map(s => s.municipality).filter(Boolean));
    return Array.from(unique).sort();
  }, [schools]);

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...localFilters, [key]: value === "all" ? undefined : value };
    setLocalFilters(newFilters);
  };

  const handleSearchChange = (value: string) => {
    const newFilters = { ...localFilters, search: value || undefined };
    setLocalFilters(newFilters);
  };

  const handleApplyFilters = () => {
    onFilter?.(localFilters);
  };

  const handleResetFilters = () => {
    setLocalFilters({});
    onFilter?.({});
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
              value={localFilters.search || ""}
              onChange={(e) => handleSearchChange(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select
            value={localFilters.status || "all"}
            onValueChange={(value) => handleFilterChange("status", value)}
          >
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
          <Select
            value={localFilters.gender || "all"}
            onValueChange={(value) => handleFilterChange("gender", value)}
          >
            <SelectTrigger id="gender" data-testid="select-gender-filter">
              <SelectValue placeholder="All genders" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Genders</SelectItem>
              <SelectItem value="Male">Male</SelectItem>
              <SelectItem value="Female">Female</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="municipality">Municipality</Label>
          <Select
            value={localFilters.municipality || "all"}
            onValueChange={(value) => handleFilterChange("municipality", value)}
          >
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
          <Select
            value={localFilters.school || "all"}
            onValueChange={(value) => handleFilterChange("school", value)}
          >
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
          <Select
            value={localFilters.unitId || "all"}
            onValueChange={(value) => handleFilterChange("unitId", value)}
          >
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

        <div className="flex gap-2">
          <Button className="flex-1" onClick={handleApplyFilters} data-testid="button-apply-filters">
            Apply Filters
          </Button>
          <Button variant="outline" size="icon" onClick={handleResetFilters} title="Reset Filters" data-testid="button-reset-filters">
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
