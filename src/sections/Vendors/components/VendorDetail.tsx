type VendorDetailProps = {
  vendorId: string | null;
};

export const VendorDetail = ({ vendorId }: VendorDetailProps) => {
  if (!vendorId) {
    return (
      <div className="box-border caret-transparent flex basis-[375px] flex-col grow shrink-0 min-w-[200px] pt-2 px-2">
        <div className="bg-white shadow-[rgba(242,242,242,0.6)_0px_0px_12px_2px] box-border caret-transparent flex grow w-full border border-zinc-200 overflow-hidden rounded-bl rounded-br rounded-tl rounded-tr border-solid">
          <div className="flex items-center justify-center w-full h-full text-gray-500">
            Select a vendor to view details
          </div>
        </div>
      </div>
    );
  }

  const contacts = [
    {
      id: "1",
      name: "Tomas Kundis",
      role: "Manager",
      email: "Tomas.Kundis@a-studio.sk",
      phone: "+1421911725402",
      initials: "TK",
      color: "bg-teal-400"
    }
  ];

  const workOrders = [
    {
      id: "81454334",
      title: "HVAC Control System Troubleshooting & Repair",
      imageUrl: "https://app.getmaintainx.com/img/fc7e56de-3cbc-44cf-9a71-b0d5a5ffef08_processed_image15.png?w=64&h=64&rmode=crop",
      completedBy: "Pedro Modesto",
      workOrderNumber: "#372",
      status: "Done",
      priority: "Low",
      category: "Refrigeration"
    },
    {
      id: "76705125",
      title: "HVAC filter replacement",
      imageUrl: "https://app.getmaintainx.com/img/27efc3b8-3cee-41bb-9d47-6922b790cdfe_F2FF6C63-1478-49E5-8663-DAC6C613A866.HEIC?w=64&h=64&rmode=crop",
      completedBy: "Jason Degg",
      workOrderNumber: "#333",
      status: "Done",
      priority: "Low",
      category: "Annual Service"
    }
  ];

  return (
    <div className="box-border caret-transparent flex basis-[375px] flex-col grow shrink-0 min-w-[200px] pt-2 px-2">
      <div className="bg-white shadow-[rgba(242,242,242,0.6)_0px_0px_12px_2px] box-border caret-transparent flex grow w-full border border-zinc-200 overflow-hidden rounded-bl rounded-br rounded-tl rounded-tr border-solid">
        <div className="box-border caret-transparent flex basis-[0%] flex-col grow h-full overflow-x-hidden overflow-y-auto w-full">
          {/* Header */}
          <div className="box-border caret-transparent shrink-0 px-4 py-4">
            <div className="items-center box-border caret-transparent gap-x-2 flex shrink-0 flex-wrap justify-between gap-y-2 mb-4">
              <div className="items-center box-border caret-transparent gap-x-2 flex gap-y-2">
                <h3 className="text-xl font-medium box-border caret-transparent tracking-[-0.2px]">
                  A-Studio S.R.O & VSE Solutions
                </h3>
                <button
                  title="Copy Link"
                  type="button"
                  className="relative text-blue-500 font-bold items-center aspect-square bg-transparent caret-transparent gap-x-1 flex h-8 justify-center tracking-[-0.2px] leading-[14px] gap-y-1 text-center text-nowrap overflow-hidden px-2 rounded-[50%] hover:text-blue-400"
                >
                  <span className="box-border caret-transparent flex text-nowrap">
                    <img
                      src="https://c.animaapp.com/mkof8zon8iICvl/assets/icon-35.svg"
                      alt="Icon"
                      className="box-border caret-transparent h-5 text-nowrap w-5"
                    />
                  </span>
                </button>
              </div>
              <div className="items-center box-border caret-transparent gap-x-2 flex shrink-0 flex-wrap gap-y-2 ml-auto">
                <button
                  type="button"
                  className="relative font-bold items-center bg-transparent caret-transparent gap-x-1 flex shrink-0 h-8 justify-center tracking-[-0.2px] leading-[14px] break-words gap-y-1 text-center text-nowrap border border-blue-500 px-3 rounded text-blue-500 hover:text-blue-400 hover:border-blue-400"
                >
                  <span className="box-border caret-transparent flex shrink-0 break-words text-nowrap">
                    Edit
                  </span>
                </button>
                <button
                  type="button"
                  className="relative text-blue-500 font-bold items-center aspect-square bg-transparent caret-transparent gap-x-1 flex shrink-0 h-8 justify-center tracking-[-0.2px] leading-[14px] gap-y-1 text-center text-nowrap overflow-hidden px-2 rounded hover:text-blue-400"
                >
                  <span className="text-slate-500 box-border caret-transparent flex shrink-0 text-nowrap hover:text-gray-600">
                    <img
                      src="https://c.animaapp.com/mkof8zon8iICvl/assets/icon-40.svg"
                      alt="Icon"
                      className="box-border caret-transparent shrink-0 h-5 text-nowrap w-5"
                    />
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="relative box-border caret-transparent flex flex-col grow scroll-smooth overflow-auto scroll-pt-4 px-6">
            {/* Description */}
            <div className="box-border caret-transparent shrink-0 mb-6">
              <h2 className="text-base font-semibold mb-3">Description</h2>
              <div className="box-border caret-transparent leading-[21px] break-words">
                A-Studio general provider for building services, VSE Solutions provides HVAC support
              </div>
            </div>

            <div className="border-b border-zinc-200 my-4"></div>

            {/* Contact List */}
            <div className="box-border caret-transparent shrink-0 mb-6">
              <h2 className="text-base font-semibold mb-3">Contact List</h2>
              <div className="border border-zinc-200 rounded-lg overflow-hidden mb-4">
                <table className="w-full">
                  <thead className="bg-white border-b border-zinc-200">
                    <tr>
                      <th className="text-left text-sm font-medium text-gray-600 px-4 py-3">Full Name</th>
                      <th className="text-left text-sm font-medium text-gray-600 px-4 py-3">Role</th>
                      <th className="text-left text-sm font-medium text-gray-600 px-4 py-3" colspan="2">Email</th>
                      <th className="text-left text-sm font-medium text-gray-600 px-4 py-3">Phone Number</th>
                      <th className="w-24"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {contacts.map((contact) => (
                      <tr key={contact.id} className="border-b border-zinc-200 hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className={`${contact.color} text-white text-sm font-semibold items-center flex h-9 justify-center w-9 rounded-full`}>
                              {contact.initials}
                            </div>
                            <span>{contact.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-gray-800">{contact.role}</td>
                        <td className="px-4 py-3" colspan="2">
                          <a href={`mailto:${contact.email}`} className="text-blue-500 hover:text-blue-400">
                            {contact.email}
                          </a>
                        </td>
                        <td className="px-4 py-3">
                          <a href={`tel:${contact.phone}`} className="text-blue-500 hover:text-blue-400">
                            {contact.phone}
                          </a>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              className="text-slate-500 hover:text-gray-800"
                            >
                              <img
                                src="https://c.animaapp.com/mkof8zon8iICvl/assets/icon-39.svg"
                                alt="Edit"
                                className="h-5 w-5"
                              />
                            </button>
                            <button
                              type="button"
                              className="text-slate-500 hover:text-red-600"
                            >
                              <img
                                src="https://c.animaapp.com/mkof8zon8iICvl/assets/icon-40.svg"
                                alt="Delete"
                                className="h-5 w-5"
                              />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <button
                type="button"
                className="text-blue-500 font-medium hover:text-blue-400"
              >
                New Contact
              </button>
            </div>

            <div className="border-b border-zinc-200 my-4"></div>

            {/* Parts */}
            <div className="box-border caret-transparent shrink-0 mb-6">
              <h2 className="text-base font-semibold mb-3">Parts (1)</h2>
              <a
                href="/parts/13650391"
                className="items-center box-border caret-transparent flex shrink-0 p-3 border border-zinc-200 rounded hover:bg-gray-50"
              >
                <div className="box-border caret-transparent shrink-0 mr-3">
                  <div className="font-semibold items-center box-border caret-transparent flex shrink-0 h-8 justify-center w-8 border border-zinc-200 overflow-hidden rounded-lg border-solid">
                    <figure
                      className="bg-cover box-border caret-transparent shrink-0 h-8 w-8 bg-center"
                      style={{ backgroundImage: "url('https://app.getmaintainx.com/img/9f9fdbd5-f2d1-4812-a1dc-3ef3a1a82e64_75198044-FBEF-4161-90A6-76667875E21D.HEIC?w=96&h=96&rmode=crop')" }}
                    ></figure>
                  </div>
                </div>
                <div className="text-sm">Filter, HVAC</div>
              </a>
            </div>

            <div className="border-b border-zinc-200 my-4"></div>

            {/* Assets */}
            <div className="box-border caret-transparent shrink-0 mb-6">
              <h2 className="text-base font-semibold mb-3">Assets (1)</h2>
              <a
                href="/assets/12213858"
                className="items-center box-border caret-transparent flex shrink-0 p-3 border border-zinc-200 rounded hover:bg-gray-50"
              >
                <div className="box-border caret-transparent shrink-0 mr-3">
                  <img
                    src="https://app.getmaintainx.com/img/fc7e56de-3cbc-44cf-9a71-b0d5a5ffef08_processed_image15.png"
                    alt="HVAC"
                    className="h-8 w-8 object-cover rounded-lg"
                  />
                </div>
                <div className="text-sm">HVAC</div>
              </a>
            </div>

            <div className="border-b border-zinc-200 my-4"></div>

            {/* Metadata */}
            <div className="text-sm text-gray-600 space-y-2 mb-6">
              <div className="flex items-center gap-2">
                Created By 
                <div 
                  className="items-center bg-white bg-cover box-border caret-transparent flex shrink-0 h-4 justify-center w-4 bg-center rounded-[50%]"
                  style={{ backgroundImage: "url('https://app.getmaintainx.com/img/static/user_placeholders/RandomPicture4.png')" }}
                ></div>
                <a href="#" className="text-blue-500 hover:underline">Jason Degg</a>
                <span>on 11/11/2025, 11:03</span>
              </div>
            </div>

            <div className="border-b border-zinc-200 my-4"></div>

            {/* Work Order History */}
            <div className="box-border caret-transparent shrink-0 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-medium">Work Order History</h2>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>Dec 3 2025 - Jan 21</span>
                  <button
                    type="button"
                    className="text-slate-500 hover:text-gray-600"
                  >
                    <img
                      src="https://c.animaapp.com/mkof8zon8iICvl/assets/icon-28.svg"
                      alt="Icon"
                      className="h-5 w-5"
                    />
                  </button>
                  <button
                    type="button"
                    className="text-slate-500 hover:text-gray-600"
                  >
                    <img
                      src="https://c.animaapp.com/mkof8zon8iICvl/assets/icon-40.svg"
                      alt="Icon"
                      className="h-5 w-5"
                    />
                  </button>
                </div>
              </div>

              {/* Chart Placeholder */}
              <div className="h-48 bg-gray-50 rounded flex items-center justify-center text-gray-400 mb-6 border border-zinc-200">
                <div className="text-sm">Work Order History Chart</div>
              </div>

              {/* Work Order List */}
              <div className="space-y-0">
                {workOrders.map((workOrder) => (
                  <div
                    key={workOrder.id}
                    className="relative items-center border-b border-zinc-200 box-border caret-transparent flex shrink-0 min-h-[98px] cursor-pointer hover:bg-gray-50 py-3"
                  >
                    <div className="relative box-border caret-transparent shrink-0 mr-3 rounded-lg">
                      <div className="text-[16.0006px] font-semibold items-center box-border caret-transparent flex shrink-0 h-12 justify-center tracking-[-0.2px] w-12 border border-zinc-200 overflow-hidden rounded-lg border-solid">
                        <figure
                          className="bg-cover box-border caret-transparent shrink-0 h-12 w-12 bg-center"
                          style={{ backgroundImage: `url('${workOrder.imageUrl}')` }}
                        ></figure>
                      </div>
                    </div>

                    <div className="box-border caret-transparent flex basis-[0%] flex-col grow justify-center">
                      <div className="items-center box-border caret-transparent flex shrink-0 my-px">
                        <div className="box-border caret-transparent flex basis-[0%] grow overflow-hidden mr-2">
                          <div
                            title={workOrder.title}
                            className="box-border caret-transparent text-ellipsis text-nowrap overflow-hidden"
                          >
                            {workOrder.title}
                          </div>
                        </div>
                        <div className="box-border caret-transparent shrink-0">
                          <span className="text-blue-500 text-xs bg-sky-100 px-2 py-1 rounded">
                            {workOrder.category}
                          </span>
                        </div>
                        <div className="box-border caret-transparent shrink-0 ml-2">
                          <span className="items-center box-border caret-transparent flex shrink-0">
                            <div className="box-border caret-transparent shrink-0 h-4">
                              <div className="items-center box-border caret-transparent flex shrink-0">
                                <img
                                  src="https://c.animaapp.com/mkof8zon8iICvl/assets/icon-31.svg"
                                  alt="Icon"
                                  className="box-border caret-transparent shrink-0 h-4 w-4"
                                />
                              </div>
                            </div>
                            <div className="box-border caret-transparent shrink-0 h-4 -ml-0.5">
                              <div 
                                className="items-center bg-white bg-cover box-border caret-transparent flex shrink-0 h-4 justify-center w-4 bg-center rounded-[50%]"
                                style={{ backgroundImage: "url('https://app.getmaintainx.com/img/static/user_placeholders/RandomPicture24.png')" }}
                              ></div>
                            </div>
                          </span>
                        </div>
                      </div>
                      <div className="items-center box-border caret-transparent flex shrink-0 justify-between my-1">
                        <div className="text-gray-600 text-[12.6px] box-border caret-transparent basis-[0%] grow text-ellipsis text-nowrap w-full overflow-hidden">
                          Completed by {workOrder.completedBy}
                        </div>
                        <div className="text-gray-600 text-[12.6px] box-border caret-transparent shrink-0">
                          {workOrder.workOrderNumber}
                        </div>
                      </div>
                      <div className="items-center box-border caret-transparent flex shrink-0 justify-between my-px">
                        <div className="relative box-border caret-transparent shrink-0">
                          <div className="text-[12.6px] items-center box-border caret-transparent gap-x-1 flex shrink-0 leading-[15.12px]">
                            <div className="items-center box-border caret-transparent flex shrink-0">
                              <div className="text-teal-500 box-border caret-transparent shrink-0 h-3 w-3 mr-1">
                                ✓
                              </div>
                            </div>
                            <span className="text-teal-500 box-border caret-transparent text-ellipsis text-nowrap overflow-hidden">
                              {workOrder.status}
                            </span>
                          </div>
                        </div>
                        <div className="box-border caret-transparent gap-x-1 flex shrink-0 gap-y-1">
                          <div className="text-[11.9994px] font-semibold items-center box-border caret-transparent gap-x-1 flex shrink-0 tracking-[-0.2px] leading-[17.9991px] gap-y-1 border border-zinc-200 px-1.5 py-0.5 rounded-bl rounded-br rounded-tl rounded-tr border-solid">
                            <span className="items-center box-border caret-transparent flex shrink-0 justify-start">
                              <img
                                src="https://c.animaapp.com/mkof8zon8iICvl/assets/icon-34.svg"
                                alt="Icon"
                                className="text-teal-500 box-border caret-transparent shrink-0 h-4 w-4"
                              />
                            </span>
                            {workOrder.priority}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Floating Button */}
          <div className="absolute box-border caret-transparent shrink-0 translate-x-[-50.0%] z-[3] left-2/4 bottom-6">
            <button
              type="button"
              className="relative text-blue-500 font-bold items-center bg-white shadow-[rgba(30,36,41,0.16)_0px_4px_12px_0px] caret-transparent gap-x-1 flex shrink-0 h-10 justify-center tracking-[-0.2px] leading-[14px] gap-y-1 text-center text-nowrap border border-blue-500 px-4 rounded-3xl border-solid hover:text-blue-400 hover:border-blue-400"
            >
              <img
                src="https://c.animaapp.com/mkof8zon8iICvl/assets/icon-55.svg"
                alt="Icon"
                className="box-border caret-transparent shrink-0 h-5 text-nowrap w-5"
              />
              <span className="box-border caret-transparent flex shrink-0 text-nowrap">
                Use in New Work Order
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
