type Category = {
  id: string;
  name: string;
  iconUrl: string;
  color: string;
};

type CategoryListProps = {
  categories: Category[];
  selectedCategoryId: string | null;
  onSelectCategory: (id: string) => void;
};

export const CategoryList = ({ categories, selectedCategoryId, onSelectCategory }: CategoryListProps) => {
  return (
    <div className="bg-white shadow-[rgba(242,242,242,0.6)_0px_0px_12px_2px] box-border caret-transparent flex flex-col shrink-0 max-w-[500px] min-w-[300px] w-2/5 border border-zinc-200 mr-4 rounded-tl rounded-tr border-solid">
      <div className="relative box-border caret-transparent basis-[0%] grow overflow-x-hidden overflow-y-auto pb-8 rounded-bl rounded-br rounded-tl rounded-tr">
        {categories.map((category) => (
          <div
            key={category.id}
            onClick={() => onSelectCategory(category.id)}
            className={`relative items-center border-b border-zinc-200 box-border caret-transparent flex shrink-0 min-h-[64px] cursor-pointer hover:bg-gray-50 ${
              selectedCategoryId === category.id ? "bg-slate-50 border-l-4 border-l-blue-500" : ""
            }`}
          >
            <div className="relative box-border caret-transparent shrink-0 ml-4 mr-3">
              <div className="box-border caret-transparent shrink-0 h-8 w-8">
                <img
                  src={category.iconUrl}
                  alt={category.name}
                  className="box-border caret-transparent shrink-0 h-8 w-8"
                />
              </div>
            </div>
            
            <div className="box-border caret-transparent flex basis-[0%] flex-col grow justify-center py-3">
              <div className="box-border caret-transparent flex basis-[0%] grow overflow-hidden mr-2">
                <div
                  title={category.name}
                  className="box-border caret-transparent text-ellipsis text-nowrap overflow-hidden"
                >
                  {category.name}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
