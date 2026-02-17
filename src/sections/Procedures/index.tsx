import { useState } from "react";
import { ProcedureList } from "./components/ProcedureList";
import { ProcedureDetail } from "./components/ProcedureDetail";

export const Procedures = () => {
  const [selectedProcedureId, setSelectedProcedureId] = useState<string | null>("2819790");

  const procedures = [
    {
      id: "2819790",
      name: "Annual Fire Extinguisher Inspection",
      fieldCount: "10 fields",
      category: "Preventive/Inspection",
      isMyTemplate: true
    },
    {
      id: "3881820",
      name: "Coolant Heater Warranty Replacement Documentation",
      fieldCount: "14 fields",
      category: "",
      isMyTemplate: true
    },
    {
      id: "2698397",
      name: "Door Delay Troubleshooting",
      fieldCount: "6 fields",
      category: "Preventive/Inspection",
      isMyTemplate: true
    },
    {
      id: "3600943",
      name: "Floodlights Replacement Procedure",
      fieldCount: "12 fields",
      category: "",
      isMyTemplate: true
    },
    {
      id: "3931127",
      name: "Generator complete check",
      fieldCount: "31 fields",
      category: "Preventive/Inspection",
      isMyTemplate: true
    },
    {
      id: "3424411",
      name: "HVAC Air Filter/ Leak Check service",
      fieldCount: "8 fields",
      category: "",
      isMyTemplate: true
    },
    {
      id: "4086432",
      name: "Light Change Procedure",
      fieldCount: "13 fields",
      category: "",
      isMyTemplate: true
    },
    {
      id: "3237316",
      name: "Manhole Grass Cutting",
      fieldCount: "47 fields",
      category: "",
      isMyTemplate: true
    },
    {
      id: "2496940",
      name: "Manhole Maintenance/Cleaning",
      fieldCount: "12 fields",
      category: "",
      isMyTemplate: true
    },
    {
      id: "4033509",
      name: "Manhole Monthly Preventative Maintenance - Slovakia SSF",
      fieldCount: "19 fields",
      category: "Preventive/Inspection",
      isMyTemplate: true
    },
    {
      id: "3046856",
      name: "Quarterly Horizontal Sliding Door",
      fieldCount: "12 fields",
      category: "Preventive/Inspection",
      isMyTemplate: true
    },
    {
      id: "3573984",
      name: "Motion Sensor Cleaning Procedure",
      fieldCount: "8 fields",
      category: "",
      isMyTemplate: true
    },
    {
      id: "3204822",
      name: "Quarterly HVAC Air Filter Cleaning",
      fieldCount: "9 fields",
      category: "",
      isMyTemplate: true
    },
    {
      id: "3046596",
      name: "Quarterly Overhead Sliding Door inspection",
      fieldCount: "14 fields",
      category: "Preventive/Inspection",
      isMyTemplate: true
    },
    {
      id: "3248236",
      name: "Quarterly Split unit AC Air Filter Cleaning",
      fieldCount: "6 fields",
      category: "Preventive/Inspection",
      isMyTemplate: true
    },
    {
      id: "4030773",
      name: "Weekly maintenance work order Template",
      fieldCount: "28 fields",
      category: "Standard Operating Procedure",
      isMyTemplate: true
    },
    {
      id: "2267298",
      name: "CCTV Pictures Form",
      fieldCount: "6 fields",
      category: "",
      isGlobal: true,
      isMyTemplate: false
    },
    {
      id: "2267299",
      name: "Constant Warning Alarms",
      fieldCount: "25 fields",
      category: "",
      isGlobal: true,
      isMyTemplate: false
    },
    {
      id: "2267300",
      name: "Database Backups",
      fieldCount: "15 fields",
      category: "",
      isGlobal: true,
      isFeatured: true,
      isMyTemplate: false
    },
    {
      id: "2267301",
      name: "DNA information",
      fieldCount: "4 fields",
      category: "",
      isGlobal: true,
      isMyTemplate: false
    },
    {
      id: "2267302",
      name: "Forklift Inspection - Monthly PM",
      fieldCount: "7 fields",
      category: "Standard Operating Procedure",
      isGlobal: true,
      isFeatured: true,
      isMyTemplate: false
    },
    {
      id: "2267303",
      name: "Full Manhole Sensor System Test - Yearly PM",
      fieldCount: "10 fields",
      category: "",
      isGlobal: true,
      isFeatured: true,
      isMyTemplate: false
    },
    {
      id: "2267304",
      name: "Generator - Weekly PM",
      fieldCount: "6 fields",
      category: "Standard Operating Procedure",
      isGlobal: true,
      isFeatured: true,
      isMyTemplate: false
    },
    {
      id: "2267305",
      name: "Generator Complete Maintenance",
      fieldCount: "30 fields",
      category: "",
      isGlobal: true,
      isMyTemplate: false
    },
    {
      id: "2267306",
      name: "Generator Coolant Flush/Change",
      fieldCount: "32 fields",
      category: "",
      isGlobal: true,
      isFeatured: true,
      isMyTemplate: false
    },
    {
      id: "2267307",
      name: "Generator Fuel/Water Separator Change",
      fieldCount: "32 fields",
      category: "",
      isGlobal: true,
      isMyTemplate: false
    },
    {
      id: "2267308",
      name: "Generator Hour Meter Reading",
      fieldCount: "1 field",
      category: "",
      isGlobal: true,
      isFeatured: true,
      isMyTemplate: false
    },
    {
      id: "2267309",
      name: "Generator Oil/Filter Change",
      fieldCount: "33 fields",
      category: "Preventive/Inspection",
      isGlobal: true,
      isFeatured: true,
      isMyTemplate: false
    },
    {
      id: "2267310",
      name: "Generator Testing",
      fieldCount: "22 fields",
      category: "",
      isGlobal: true,
      isFeatured: true,
      isMyTemplate: false
    },
    {
      id: "2267311",
      name: "HVAC Inspection - Monthly PM",
      fieldCount: "4 fields",
      category: "Preventive/Inspection",
      isGlobal: true,
      isFeatured: true,
      isMyTemplate: false
    },
    {
      id: "2267312",
      name: "Intrusion/Duress Test (Greece HAI)",
      fieldCount: "26 fields",
      category: "Testing",
      isGlobal: true,
      isFeatured: true,
      isMyTemplate: false
    },
    {
      id: "3040528",
      name: "Intrusion/Duress Test (Slovakia SSF)",
      fieldCount: "26 fields",
      category: "Testing",
      isGlobal: true,
      isMyTemplate: false
    },
    {
      id: "2267314",
      name: "Issue Request Form",
      fieldCount: "14 fields",
      category: "",
      isGlobal: true,
      isFeatured: true,
      isMyTemplate: false
    },
    {
      id: "2267315",
      name: "LK-120S Auto Dialer (Adding/Deleting Personnel)",
      fieldCount: "20 fields",
      category: "",
      isGlobal: true,
      isFeatured: true,
      isMyTemplate: false
    },
    {
      id: "2267316",
      name: "MaintainX Training - Administrators (MXAcademy)",
      fieldCount: "19 fields",
      category: "",
      isGlobal: true,
      isFeatured: true,
      isMyTemplate: false
    },
    {
      id: "2267317",
      name: "MaintainX Training - Full Users (MXAcademy)",
      fieldCount: "14 fields",
      category: "",
      isGlobal: true,
      isFeatured: true,
      isMyTemplate: false
    },
    {
      id: "2267318",
      name: "Manhole - Monthly PM",
      fieldCount: "9 fields",
      category: "",
      isGlobal: true,
      isMyTemplate: false
    },
    {
      id: "2267319",
      name: "Manhole/Line Supervision Alarm",
      fieldCount: "17 fields",
      category: "",
      isGlobal: true,
      isFeatured: true,
      isMyTemplate: false
    },
    {
      id: "2267320",
      name: "OO Client removal/replace",
      fieldCount: "6 fields",
      category: "",
      isGlobal: true,
      isFeatured: true,
      isMyTemplate: false
    },
    {
      id: "2267321",
      name: "Operator Generator Maintenance - Daily PM",
      fieldCount: "10 fields",
      category: "",
      isGlobal: true,
      isMyTemplate: false
    },
    {
      id: "2267322",
      name: "Operator Training",
      fieldCount: "17 fields",
      category: "",
      isGlobal: true,
      isFeatured: true,
      isMyTemplate: false
    },
    {
      id: "2267323",
      name: "Phone Support Call Form",
      fieldCount: "12 fields",
      category: "",
      isGlobal: true,
      isFeatured: true,
      isMyTemplate: false
    },
    {
      id: "2267324",
      name: "PMCS Auto Dialer",
      fieldCount: "2 fields",
      category: "",
      isGlobal: true,
      isFeatured: true,
      isMyTemplate: false
    },
    {
      id: "2267325",
      name: "Power Outage Alarm Response",
      fieldCount: "22 fields",
      category: "",
      isGlobal: true,
      isMyTemplate: false
    },
    {
      id: "2267326",
      name: "Pull Access Log",
      fieldCount: "12 fields",
      category: "",
      isGlobal: true,
      isFeatured: true,
      isMyTemplate: false
    },
    {
      id: "2267327",
      name: "Pull Alarm Log",
      fieldCount: "14 fields",
      category: "",
      isGlobal: true,
      isFeatured: true,
      isMyTemplate: false
    },
    {
      id: "2267328",
      name: "RMA of Bosch Camera",
      fieldCount: "8 fields",
      category: "",
      isGlobal: true,
      isFeatured: true,
      isMyTemplate: false
    },
    {
      id: "2267329",
      name: "Server/Client Replacement",
      fieldCount: "19 fields",
      category: "",
      isGlobal: true,
      isFeatured: true,
      isMyTemplate: false
    },
    {
      id: "2267330",
      name: "SOP Maintenance Service Form",
      fieldCount: "38 fields",
      category: "Standard Operating Procedure",
      isGlobal: true,
      isMyTemplate: false
    }
  ];

  return (
    <div className="relative bg-white box-border caret-transparent flex basis-[0%] flex-col grow overflow-auto">
      {/* Header */}
      <div className="bg-white box-border caret-transparent shrink-0 px-4 py-5">
        <div className="items-center box-border caret-transparent gap-x-4 flex basis-[0%] grow gap-y-4">
          <div className="items-center box-border caret-transparent gap-x-4 flex shrink-0 gap-y-4">
            <h2 className="text-[31.9998px] font-bold box-border caret-transparent shrink-0 tracking-[-0.2px] leading-[39.9997px]">
              Procedure Library
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
                  placeholder="Search Procedure Templates"
                  className="bg-gray-50 bg-[url(data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20width=%2711%27%20height=%2712%27%3E%3Cg%20fill=%27none%27%20fill-rule=%27evenodd%27%20stroke=%27%23868686%27%20stroke-width=%271.25%27%20transform=%27translate%281%201.5)] bg-no-repeat box-border caret-transparent shrink-0 leading-5 min-h-10 -outline-offset-2 w-full border border-gray-50 bg-[position:10px_50%] pl-[30px] pr-2 py-2 rounded-bl rounded-br rounded-tl rounded-tr border-solid"
                />
              </form>
            </div>
            <button
              type="button"
              className="relative text-white font-bold items-center bg-blue-500 caret-transparent gap-x-1 flex shrink-0 h-10 justify-center tracking-[-0.2px] leading-[14px] gap-y-1 text-center text-nowrap border border-blue-500 px-4 rounded-bl rounded-br rounded-tl rounded-tr border-solid hover:bg-blue-400 hover:border-blue-400"
            >
              <img
                src="https://c.animaapp.com/mkof8zon8iICvl/assets/icon-22.svg"
                alt="Icon"
                className="box-border caret-transparent shrink-0 h-5 text-nowrap w-5"
              />
              <span className="box-border caret-transparent flex shrink-0 text-nowrap">
                New Procedure Template
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
                Category
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
                Teams in Charge
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
                Global procedure
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative box-border caret-transparent flex basis-[0%] grow mx-4">
        <ProcedureList
          procedures={procedures}
          selectedProcedureId={selectedProcedureId}
          onSelectProcedure={setSelectedProcedureId}
        />
        <ProcedureDetail procedureId={selectedProcedureId} />
      </div>
    </div>
  );
};
