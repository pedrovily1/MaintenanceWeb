import { useState } from "react";
import { VendorList } from "./components/VendorList";
import { VendorDetail } from "./components/VendorDetail";
import { VendorModal } from "./components/VendorModal";
import { useVendorStore } from "@/store/useVendorStore";
import { useUserStore } from "@/store/useUserStore";

export const Vendors = () => {
  const { activeVendors, selectedVendorId, selectVendor, createVendor, updateVendor, getVendorById } = useVendorStore();
  const { activeUserId } = useUserStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVendor, setEditingVendor] = useState<string | null>(null);

  const handleSave = (data: any) => {
    if (editingVendor) {
      updateVendor(editingVendor, data, activeUserId || 'admin-001');
    } else {
      const newVendor = createVendor(data, activeUserId || 'admin-001');
      selectVendor(newVendor.id);
    }
    setIsModalOpen(false);
    setEditingVendor(null);
  };

  const handleEdit = () => {
    if (selectedVendorId) {
      setEditingVendor(selectedVendorId);
      setIsModalOpen(true);
    }
  };

  const handleNewVendor = () => {
    setEditingVendor(null);
    setIsModalOpen(true);
  };

  return (
    <div className="relative bg-white box-border caret-transparent flex basis-[0%] flex-col grow overflow-auto">
      {/* Header */}
      <div className="bg-white box-border caret-transparent shrink-0 px-4 py-5">
        <div className="items-center box-border caret-transparent gap-x-4 flex basis-[0%] grow gap-y-4">
          <div className="items-center box-border caret-transparent gap-x-4 flex shrink-0 gap-y-4">
            <h2 className="text-[31.9998px] font-bold box-border caret-transparent shrink-0 tracking-[-0.2px] leading-[39.9997px]">
              Vendors
            </h2>
            <div className="box-border caret-transparent shrink-0 pt-2">
              <button
                type="button"
                className="items-start bg-transparent caret-transparent gap-x-1 flex shrink-0 justify-between gap-y-1 text-center p-2 rounded-bl rounded-br rounded-tl rounded-tr"
              >
                <div className="items-center box-border caret-transparent flex h-full text-ellipsis text-nowrap overflow-hidden">
                  <img
                    src="https://c.animaapp.com/mkof8zon8iICvl/assets/icon-20.svg"
                    alt="Icon"
                    className="text-slate-500 box-border caret-transparent shrink-0 h-5 text-nowrap w-5 mr-1.5"
                  />
                  <div className="box-border caret-transparent text-ellipsis text-nowrap overflow-hidden">
                    <p className="box-border caret-transparent shrink-0 tracking-[-0.2px] leading-[20.0004px] text-nowrap">
                      Panel View
                    </p>
                  </div>
                </div>
                <div className="box-border caret-transparent shrink-0">
                  <img
                    src="https://c.animaapp.com/mkof8zon8iICvl/assets/icon-21.svg"
                    alt="Icon"
                    className="box-border caret-transparent shrink-0 h-[7px] w-3 -scale-100"
                  />
                </div>
              </button>
            </div>
          </div>
          <div className="items-center box-border caret-transparent gap-x-4 flex basis-[0%] grow justify-end gap-y-4">
            <div className="box-border caret-transparent flex basis-[0%] grow max-w-[400px]">
              <form className="box-border caret-transparent basis-[0%] grow">
                <input
                  type="search"
                  placeholder="Search Vendors"
                  className="bg-gray-50 bg-[url(data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20width=%2711%27%20height=%2712%27%3E%3Cg%20fill=%27none%27%20fill-rule=%27evenodd%27%20stroke=%27%23868686%27%20stroke-width=%271.25%27%20transform=%27translate%281%201.5)] bg-no-repeat box-border caret-transparent shrink-0 leading-5 min-h-10 -outline-offset-2 w-full border border-gray-50 bg-[position:10px_50%] pl-[30px] pr-2 py-2 rounded-bl rounded-br rounded-tl rounded-tr border-solid"
                />
              </form>
            </div>
            <button
              type="button"
              onClick={handleNewVendor}
              className="relative text-white font-bold items-center bg-blue-500 caret-transparent gap-x-1 flex shrink-0 h-10 justify-center tracking-[-0.2px] leading-[14px] gap-y-1 text-center text-nowrap border border-blue-500 px-4 rounded-bl rounded-br rounded-tl rounded-tr border-solid hover:bg-blue-400 hover:border-blue-400"
            >
              <span className="box-border caret-transparent flex shrink-0 text-nowrap">
                New Vendor
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="box-border caret-transparent shrink-0 px-4 py-3">
        <div className="items-center box-border caret-transparent flex shrink-0">
          <div className="box-border caret-transparent flex basis-[0%] grow gap-x-2">
            <button
              type="button"
              className="items-center bg-white caret-transparent flex h-8 justify-center tracking-[-0.2px] leading-[20.0004px] text-center border border-zinc-200 px-2 rounded-bl rounded-br rounded-tl rounded-tr border-solid hover:border-neutral-300"
            >
              <div className="items-center box-border caret-transparent flex shrink-0 justify-center px-1">
                <img
                  src="https://c.animaapp.com/mkof8zon8iICvl/assets/icon-24.svg"
                  alt="Icon"
                  className="text-blue-500 text-[8px] box-border caret-transparent shrink-0 h-4 leading-[11.4288px] w-4"
                />
              </div>
              <div className="box-border caret-transparent text-ellipsis text-nowrap overflow-hidden px-1">
                Asset
              </div>
            </button>
            <button
              type="button"
              className="items-center bg-white caret-transparent flex h-8 justify-center tracking-[-0.2px] leading-[20.0004px] text-center border border-zinc-200 px-2 rounded-bl rounded-br rounded-tl rounded-tr border-solid hover:border-neutral-300"
            >
              <div className="items-center box-border caret-transparent flex shrink-0 justify-center px-1">
                <img
                  src="https://c.animaapp.com/mkof8zon8iICvl/assets/icon-24.svg"
                  alt="Icon"
                  className="text-blue-500 text-[8px] box-border caret-transparent shrink-0 h-4 leading-[11.4288px] w-4"
                />
              </div>
              <div className="box-border caret-transparent text-ellipsis text-nowrap overflow-hidden px-1">
                Location
              </div>
            </button>
            <button
              type="button"
              className="items-center bg-white caret-transparent flex h-8 justify-center tracking-[-0.2px] leading-[20.0004px] text-center border border-zinc-200 px-2 rounded-bl rounded-br rounded-tl rounded-tr border-solid hover:border-neutral-300"
            >
              <div className="items-center box-border caret-transparent flex shrink-0 justify-center px-1">
                <img
                  src="https://c.animaapp.com/mkof8zon8iICvl/assets/icon-24.svg"
                  alt="Icon"
                  className="text-blue-500 text-[8px] box-border caret-transparent shrink-0 h-4 leading-[11.4288px] w-4"
                />
              </div>
              <div className="box-border caret-transparent text-ellipsis text-nowrap overflow-hidden px-1">
                Part
              </div>
            </button>
            <button
              type="button"
              className="items-center bg-white caret-transparent flex h-8 justify-center tracking-[-0.2px] leading-[20.0004px] text-center border border-zinc-200 px-2 rounded-bl rounded-br rounded-tl rounded-tr border-solid hover:border-neutral-300"
            >
              <div className="items-center box-border caret-transparent flex shrink-0 justify-center px-1">
                <img
                  src="https://c.animaapp.com/mkof8zon8iICvl/assets/icon-24.svg"
                  alt="Icon"
                  className="text-blue-500 text-[8px] box-border caret-transparent shrink-0 h-4 leading-[11.4288px] w-4"
                />
              </div>
              <div className="box-border caret-transparent text-ellipsis text-nowrap overflow-hidden px-1">
                Vendor Types
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative box-border caret-transparent flex basis-[0%] grow mx-4">
        <VendorList
          vendors={activeVendors}
          selectedVendorId={selectedVendorId}
          onSelectVendor={selectVendor}
        />
        <VendorDetail vendorId={selectedVendorId} onEdit={handleEdit} />
      </div>

      {/* Modal */}
      <VendorModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingVendor(null);
        }}
        onSave={handleSave}
        vendor={editingVendor ? getVendorById(editingVendor) : null}
      />
    </div>
  );
};
