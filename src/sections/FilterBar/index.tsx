import { FilterButtons } from "@/sections/FilterBar/components/FilterButtons";
import { MyFiltersButton } from "@/sections/FilterBar/components/MyFiltersButton";

export const FilterBar = () => {
  return (
    <div className="box-border caret-transparent shrink-0 mb-4 mx-2 lg:mx-4">
      <div className="items-center box-border caret-transparent flex shrink-0 flex-wrap lg:flex-nowrap gap-2">
        <div className="box-border caret-transparent flex basis-[0%] grow">
          <FilterButtons />
        </div>
        <MyFiltersButton />
      </div>
    </div>
  );
};
