import { ViewSelector } from "@/sections/Header/components/ViewSelector";
import { useFilterStore } from "@/store/useFilterStore";

export const PageHeader = () => {
  const { search, setSearch } = useFilterStore();

  return (
    <div className="items-center box-border caret-transparent gap-x-2 lg:gap-x-4 flex basis-[0%] grow gap-y-4 flex-wrap lg:flex-nowrap">
      <div className="items-center box-border caret-transparent gap-x-2 lg:gap-x-4 flex shrink-0 gap-y-4">
        <h2 className="text-2xl lg:text-[31.9998px] font-bold box-border caret-transparent shrink-0 tracking-[-0.2px] leading-tight lg:leading-[39.9997px]">
          Work Orders
        </h2>
        <div className="hidden md:block box-border caret-transparent shrink-0 pt-2">
          <ViewSelector />
        </div>
      </div>
      <div className="items-center box-border caret-transparent gap-x-2 lg:gap-x-4 flex basis-[0%] grow justify-end gap-y-4 w-full lg:w-auto">
        <div className="hidden md:flex box-border caret-transparent basis-[0%] grow max-w-[400px]">
          <form className="box-border caret-transparent basis-[0%] grow" onSubmit={(e) => e.preventDefault()}>
            <input
              type="search"
              placeholder="Search Work Orders"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-gray-50 bg-[url(data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20width=%2711%27%20height=%2712%27%3E%3Cg%20fill=%27none%27%20fill-rule=%27evenodd%27%20stroke=%27%23868686%27%20stroke-width=%271.25%27%20transform=%27translate%281%201.5)] bg-no-repeat box-border caret-transparent shrink-0 leading-5 min-h-10 -outline-offset-2 w-full border border-gray-50 bg-[position:10px_50%] pl-[30px] pr-2 py-2 rounded-bl rounded-br rounded-tl rounded-tr border-solid"
            />
          </form>
        </div>
        <div className="relative box-border caret-transparent flex shrink-0">
          <button
            type="button"
            className="relative text-white font-bold items-center bg-blue-500 caret-transparent gap-x-1 flex shrink-0 h-10 justify-center tracking-[-0.2px] leading-[14px] gap-y-1 text-center text-nowrap border border-blue-500 px-3 lg:px-4 rounded-md border-solid hover:bg-blue-400 hover:border-blue-400"
            onClick={() => window.dispatchEvent(new CustomEvent('trigger-new-work-order'))}
          >
            <img
              src="https://c.animaapp.com/mkof8zon8iICvl/assets/icon-22.svg"
              alt="Icon"
              className="box-border caret-transparent shrink-0 h-5 text-nowrap w-5"
            />
            <span className="hidden sm:flex box-border caret-transparent shrink-0 text-nowrap">
              New Work Order
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
