import { useState, useMemo } from "react";
import { CategoryList } from "./components/CategoryList";
import { CategoryDetail } from "./components/CategoryDetail";
import { CategoryModal } from "./components/CategoryModal";
import { useCategoryStore } from "@/store/useCategoryStore";
import { useWorkOrderStore } from "@/store/useWorkOrderStore";
import { useUserStore } from "@/store/useUserStore";

export const Categories = () => {
  const { 
    activeCategories, 
    archivedCategories, 
    selectedCategoryId, 
    selectCategory, 
    getCategoryById,
    createCategory,
    updateCategory,
    archiveCategory,
    restoreCategory
  } = useCategoryStore();
  const { workOrders } = useWorkOrderStore();
  const { activeUser } = useUserStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ReturnType<typeof getCategoryById> | null>(null);

  const selectedCategory = selectedCategoryId ? getCategoryById(selectedCategoryId) : null;

  const categoryWorkOrders = useMemo(() => {
    if (!selectedCategoryId) return [];
    return workOrders.filter(wo => wo.categoryId === selectedCategoryId);
  }, [workOrders, selectedCategoryId]);

  const handleCreateCategory = () => {
    setEditingCategory(null);
    setIsModalOpen(true);
  };

  const handleEditCategory = () => {
    if (selectedCategory) {
      setEditingCategory(selectedCategory);
      setIsModalOpen(true);
    }
  };

  const handleSaveCategory = (data: { name: string; icon: string; color: string; description?: string }) => {
    const userId = activeUser?.id || 'admin-001';
    if (editingCategory) {
      updateCategory(editingCategory.id, data, userId);
    } else {
      const newCat = createCategory(data, userId);
      selectCategory(newCat.id);
    }
  };

  const handleArchiveCategory = () => {
    if (selectedCategoryId) {
      const userId = activeUser?.id || 'admin-001';
      archiveCategory(selectedCategoryId, userId);
    }
  };

  const handleRestoreCategory = () => {
    if (selectedCategoryId) {
      const userId = activeUser?.id || 'admin-001';
      restoreCategory(selectedCategoryId, userId);
    }
  };


  return (
    <div className="relative bg-[var(--panel-2)] box-border caret-transparent flex basis-[0%] flex-col grow overflow-auto">
      {/* Header */}
      <div className="bg-[var(--panel-2)] border-b border-[var(--border)] shadow-[inset_0_-1px_0_rgba(255,255,255,0.03)] box-border caret-transparent shrink-0 px-4 py-4">
        <div className="items-center box-border caret-transparent gap-x-4 flex basis-[0%] grow gap-y-4">
          <div className="items-center box-border caret-transparent gap-x-4 flex shrink-0 gap-y-4">
            <h2 className="text-[31.9998px] font-bold box-border caret-transparent shrink-0 tracking-[-0.2px] leading-[39.9997px]">
              Categories
            </h2>
          </div>
          <div className="items-center box-border caret-transparent gap-x-4 flex basis-[0%] grow justify-end gap-y-4">
            <div className="box-border caret-transparent flex basis-[0%] grow max-w-[400px]">
              <form className="box-border caret-transparent basis-[0%] grow">
                <input
                  type="search"
                  placeholder="Search Categories"
                  className="bg-gray-50 bg-[url(data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20width=%2711%27%20height=%2712%27%3E%3Cg%20fill=%27none%27%20fill-rule=%27evenodd%27%20stroke=%27%23868686%27%20stroke-width=%271.25%27%20transform=%27translate%281%201.5)] bg-no-repeat box-border caret-transparent shrink-0 leading-5 min-h-10 -outline-offset-2 w-full border border-[var(--border)] bg-[position:10px_50%] pl-[30px] pr-2 py-2 rounded-bl rounded-br rounded-tl rounded-tr border-solid"
                />
              </form>
            </div>
            <button
              type="button"
              onClick={handleCreateCategory}
              className="relative text-white font-bold items-center bg-blue-500 caret-transparent gap-x-1 flex shrink-0 h-10 justify-center tracking-[-0.2px] leading-[14px] gap-y-1 text-center text-nowrap border border-blue-500 px-4 rounded-bl rounded-br rounded-tl rounded-tr border-solid hover:bg-blue-400 hover:border-blue-400"
            >
              <img
                src="https://c.animaapp.com/mkof8zon8iICvl/assets/icon-22.svg"
                alt="Icon"
                className="box-border caret-transparent shrink-0 h-5 text-nowrap w-5"
              />
              <span className="box-border caret-transparent flex shrink-0 text-nowrap">
                New Category
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative box-border caret-transparent flex basis-[0%] grow mx-4">
        <CategoryList
          categories={activeCategories}
          archivedCategories={archivedCategories}
          selectedCategoryId={selectedCategoryId}
          onSelectCategory={selectCategory}
        />
        <CategoryDetail 
          category={selectedCategory || null}
          workOrders={categoryWorkOrders}
          onEdit={handleEditCategory}
          onArchive={handleArchiveCategory}
          onRestore={handleRestoreCategory}
        />
      </div>

      <CategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveCategory}
        category={editingCategory}
      />
    </div>
  );
};
