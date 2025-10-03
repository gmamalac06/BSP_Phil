import { FilterPanel } from "../filter-panel";

export default function FilterPanelExample() {
  return (
    <div className="p-8 bg-background">
      <div className="max-w-sm">
        <FilterPanel onFilter={(filters) => console.log("Filters:", filters)} />
      </div>
    </div>
  );
}
