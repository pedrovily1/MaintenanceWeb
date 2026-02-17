export const SearchBar = () => {
  return (
    <div className="box-border caret-transparent flex basis-[0%] grow max-w-[400px]">
      <form className="box-border caret-transparent basis-[0%] grow">
        <input
          type="search"
          placeholder="Search Work Orders"
          value=""
          className="bg-gray-50 bg-[url(data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20width=%2711%27%20height=%2712%27%3E%3Cg%20fill=%27none%27%20fill-rule=%27evenodd%27%20stroke=%27%23868686%27%20stroke-width=%271.25%27%20transform=%27translate%281%201.5)] bg-no-repeat box-border caret-transparent shrink-0 leading-5 min-h-10 -outline-offset-2 w-full border border-gray-50 bg-[position:10px_50%] pl-[30px] pr-2 py-2 rounded-bl rounded-br rounded-tl rounded-tr border-solid"
        />
      </form>
    </div>
  );
};
