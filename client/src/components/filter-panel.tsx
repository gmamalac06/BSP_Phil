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

interface FilterPanelProps {
  onFilter?: (filters: any) => void;
}

export function FilterPanel({ onFilter }: FilterPanelProps) {
  const handleApplyFilters = () => {
    console.log("Filters applied");
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
          <Select>
            <SelectTrigger id="municipality" data-testid="select-municipality">
              <SelectValue placeholder="All municipalities" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Municipalities</SelectItem>
              <SelectItem value="manila">Manila</SelectItem>
              <SelectItem value="quezon-city">Quezon City</SelectItem>
              <SelectItem value="makati">Makati</SelectItem>
              <SelectItem value="pasig">Pasig</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="school">School</Label>
          <Select>
            <SelectTrigger id="school" data-testid="select-school-filter">
              <SelectValue placeholder="All schools" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Schools</SelectItem>
              <SelectItem value="manila-science">Manila Science HS</SelectItem>
              <SelectItem value="qc-high">Quezon City HS</SelectItem>
              <SelectItem value="makati-high">Makati HS</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="unit">Unit</Label>
          <Select>
            <SelectTrigger id="unit" data-testid="select-unit-filter">
              <SelectValue placeholder="All units" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Units</SelectItem>
              <SelectItem value="eagle">Eagle Patrol</SelectItem>
              <SelectItem value="phoenix">Phoenix Patrol</SelectItem>
              <SelectItem value="falcon">Falcon Patrol</SelectItem>
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
