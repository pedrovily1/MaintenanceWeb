import { Category } from '@/types/category';

type CategoryListProps = {
  categories: Category[];
  archivedCategories?: Category[];
  selectedCategoryId: string | null;
  onSelectCategory: (id: string) => void;
};

export const CategoryList = ({ categories, archivedCategories = [], selectedCategoryId, onSelectCategory }: CategoryListProps) => {
  return (
    <div className="bg-white shadow-[rgba(242,242,242,0.6)_0px_0px_12px_2px] box-border caret-transparent flex flex-col shrink-0 max-w-[500px] min-w-[300px] w-2/5 border border-[var(--border)] mr-4 rounded-tl rounded-tr border-solid">
      <div className="relative box-border caret-transparent basis-[0%] grow overflow-x-hidden overflow-y-auto pb-8 rounded-bl rounded-br rounded-tl rounded-tr">
        {categories.map((category) => (
          <div
            key={category.id}
            onClick={() => onSelectCategory(category.id)}
            className={`relative items-center border-b border-[var(--border)] box-border caret-transparent flex shrink-0 min-h-[64px] cursor-pointer hover:bg-[var(--panel-2)] even:bg-[rgba(255,255,255,0.02)] border-l-2 transition-colors ${
              selectedCategoryId === category.id ? "bg-[var(--panel-2)] border-l-[var(--accent)]" : "border-l-transparent"
            } group`}
          >
            <div className="relative box-border caret-transparent shrink-0 ml-4 mr-3">
              <div className={`box-border caret-transparent shrink-0 h-8 w-8 transition-opacity ${selectedCategoryId === category.id ? 'opacity-100' : 'group-hover:opacity-100'}`}>
                <img
                  src={category.icon}
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

        {archivedCategories.length > 0 && (
          <>
            <div className="px-4 py-2 text-xs font-medium text-gray-500 uppercase bg-gray-50 border-b border-[var(--border)]">
              Archived
            </div>
            {archivedCategories.map((category) => (
              <div
                key={category.id}
                onClick={() => onSelectCategory(category.id)}
                className={`relative items-center border-b border-[var(--border)] box-border caret-transparent flex shrink-0 min-h-[64px] cursor-pointer hover:bg-gray-50 opacity-60 border-l-2 transition-colors ${
                  selectedCategoryId === category.id ? "bg-slate-50 border-l-[var(--accent)]" : "border-l-transparent"
                }`}
              >
                <div className="relative box-border caret-transparent shrink-0 ml-4 mr-3">
                  <div className="box-border caret-transparent shrink-0 h-8 w-8">
                    <img
                      src={category.icon}
                      alt={category.name}
                      className="box-border caret-transparent shrink-0 h-8 w-8"
                    />
                  </div>
                </div>
                
                <div className="box-border caret-transparent flex basis-[0%] flex-col grow justify-center py-3">
                  <div className="box-border caret-transparent flex basis-[0%] grow overflow-hidden mr-2 items-center gap-2">
                    <div
                      title={category.name}
                      className="box-border caret-transparent text-ellipsis text-nowrap overflow-hidden"
                    >
                      {category.name}
                    </div>
                    <span className="text-xs text-gray-500 bg-gray-200 px-1.5 py-0.5 rounded">Archived</span>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};
