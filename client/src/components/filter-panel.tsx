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
import { Search, Filter, RotateCcw, Check, ChevronsUpDown } from "lucide-react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useSchools } from "@/hooks/useSchools";
import { useUnits } from "@/hooks/useUnits";
import { useState, useMemo, useEffect } from "react";

const YEARS = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i);
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

interface FilterPanelProps {
  onFilter?: (filters: any) => void;
  initialFilters?: Record<string, string>;
}

export function FilterPanel({ onFilter, initialFilters }: FilterPanelProps) {
  const { data: schools = [] } = useSchools();
  const { data: units = [] } = useUnits();
  const [localFilters, setLocalFilters] = useState<any>(initialFilters || {});

  const [municipalitySearchOpen, setMunicipalitySearchOpen] = useState(false);
  const [municipalitySearch, setMunicipalitySearch] = useState("");
  const [schoolSearchOpen, setSchoolSearchOpen] = useState(false);
  const [schoolSearch, setSchoolSearch] = useState("");
  const [unitSearchOpen, setUnitSearchOpen] = useState(false);
  const [unitSearch, setUnitSearch] = useState("");

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

        <div className="space-y-2 flex flex-col">
          <Label htmlFor="municipality">Municipality</Label>
          <Popover open={municipalitySearchOpen} onOpenChange={setMunicipalitySearchOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={municipalitySearchOpen}
                className="w-full justify-between font-normal"
              >
                {localFilters.municipality && localFilters.municipality !== "all"
                  ? localFilters.municipality
                  : "All municipalities"}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0" align="start" style={{ width: "var(--radix-popover-trigger-width)" }}>
              <Command>
                <CommandInput
                  placeholder="Search municipality..."
                  value={municipalitySearch}
                  onValueChange={setMunicipalitySearch}
                />
                <CommandList>
                  <CommandEmpty>No municipality found.</CommandEmpty>
                  <CommandGroup>
                    <CommandItem
                      value="all"
                      onSelect={() => {
                        handleFilterChange("municipality", "all");
                        setMunicipalitySearch("");
                        setMunicipalitySearchOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          (!localFilters.municipality || localFilters.municipality === "all") ? "opacity-100" : "opacity-0"
                        )}
                      />
                      All Municipalities
                    </CommandItem>
                    {municipalities
                      .filter((m) => m.toLowerCase().includes(municipalitySearch.toLowerCase()))
                      .map((municipality) => (
                        <CommandItem
                          key={municipality}
                          value={municipality}
                          onSelect={(currentValue) => {
                            const selected = municipalities.find((m) => m.toLowerCase() === currentValue.toLowerCase());
                            if (selected) {
                              handleFilterChange("municipality", selected);
                              setMunicipalitySearch("");
                            }
                            setMunicipalitySearchOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              localFilters.municipality === municipality ? "opacity-100" : "opacity-0"
                            )}
                          />
                          {municipality}
                        </CommandItem>
                      ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2 flex flex-col">
          <Label htmlFor="school">School</Label>
          <Popover open={schoolSearchOpen} onOpenChange={setSchoolSearchOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={schoolSearchOpen}
                className="w-full justify-between font-normal"
              >
                {localFilters.school && localFilters.school !== "all"
                  ? schools.find((s) => s.id === localFilters.school)?.name || "All schools"
                  : "All schools"}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0" align="start" style={{ width: "var(--radix-popover-trigger-width)" }}>
              <Command>
                <CommandInput
                  placeholder="Search school..."
                  value={schoolSearch}
                  onValueChange={setSchoolSearch}
                />
                <CommandList>
                  <CommandEmpty>No school found.</CommandEmpty>
                  <CommandGroup>
                    <CommandItem
                      value="all"
                      onSelect={() => {
                        handleFilterChange("school", "all");
                        setSchoolSearch("");
                        setSchoolSearchOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          (!localFilters.school || localFilters.school === "all") ? "opacity-100" : "opacity-0"
                        )}
                      />
                      All Schools
                    </CommandItem>
                    {schools
                      .filter((s) => s.name.toLowerCase().includes(schoolSearch.toLowerCase()))
                      .slice(0, 50)
                      .map((school) => (
                        <CommandItem
                          key={school.id}
                          value={school.name}
                          onSelect={(currentValue) => {
                            const selected = schools.find((s) => s.name.toLowerCase() === currentValue.toLowerCase());
                            if (selected) {
                              handleFilterChange("school", selected.id);
                              setSchoolSearch("");
                            }
                            setSchoolSearchOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              localFilters.school === school.id ? "opacity-100" : "opacity-0"
                            )}
                          />
                          {school.name}
                        </CommandItem>
                      ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2 flex flex-col">
          <Label htmlFor="unit">Unit</Label>
          <Popover open={unitSearchOpen} onOpenChange={setUnitSearchOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={unitSearchOpen}
                className="w-full justify-between font-normal"
              >
                {localFilters.unitId && localFilters.unitId !== "all"
                  ? units.find((u) => u.id === localFilters.unitId)?.name || "All units"
                  : "All units"}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0" align="start" style={{ width: "var(--radix-popover-trigger-width)" }}>
              <Command>
                <CommandInput
                  placeholder="Search unit..."
                  value={unitSearch}
                  onValueChange={setUnitSearch}
                />
                <CommandList>
                  <CommandEmpty>No unit found.</CommandEmpty>
                  <CommandGroup>
                    <CommandItem
                      value="all"
                      onSelect={() => {
                        handleFilterChange("unitId", "all");
                        setUnitSearch("");
                        setUnitSearchOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          (!localFilters.unitId || localFilters.unitId === "all") ? "opacity-100" : "opacity-0"
                        )}
                      />
                      All Units
                    </CommandItem>
                    {units
                      .filter((u) => u.name.toLowerCase().includes(unitSearch.toLowerCase()))
                      .slice(0, 50)
                      .map((unit) => (
                        <CommandItem
                          key={unit.id}
                          value={unit.name}
                          onSelect={(currentValue) => {
                            const selected = units.find((u) => u.name.toLowerCase() === currentValue.toLowerCase());
                            if (selected) {
                              handleFilterChange("unitId", selected.id);
                              setUnitSearch("");
                            }
                            setUnitSearchOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              localFilters.unitId === unit.id ? "opacity-100" : "opacity-0"
                            )}
                          />
                          {unit.name}
                        </CommandItem>
                      ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-2">
            <Label htmlFor="year">Year</Label>
            <Select
              value={localFilters.year || "all"}
              onValueChange={(value) => handleFilterChange("year", value)}
            >
              <SelectTrigger id="year">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {YEARS.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="month">Month</Label>
            <Select
              value={localFilters.month || "all"}
              onValueChange={(value) => handleFilterChange("month", value)}
            >
              <SelectTrigger id="month">
                <SelectValue placeholder="Month" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {MONTHS.map((month) => (
                  <SelectItem key={month} value={month}>
                    {month}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
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
