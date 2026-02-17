import { StatusButtons } from "@/sections/WorkOrderDetail/components/StatusButtons";
import { InfoSection } from "@/sections/WorkOrderDetail/components/InfoSection";
import { ProcedureSection } from "@/sections/WorkOrderDetail/components/ProcedureSection";

export const DetailContent = () => {
  return (
    <div className="relative box-border caret-transparent flex flex-col grow scroll-smooth overflow-auto scroll-pt-4">
      <div className="box-border caret-transparent shrink-0 pb-6">
        <div className="box-border caret-transparent flex shrink-0 justify-start max-w-[816px] mr-4 mt-3">
          <div className="box-border caret-transparent basis-[0%] grow ml-6 my-3">
            <div className="box-border caret-transparent shrink-0 pb-2">
              <strong className="font-semibold box-border caret-transparent shrink-0">
                Status
              </strong>
            </div>
            <div className="items-center box-border caret-transparent gap-x-1 flex shrink-0 flex-wrap-reverse gap-y-1">
              <StatusButtons />
              <div className="items-center box-border caret-transparent flex shrink-0 ml-auto">
                <div className="items-center box-border caret-transparent flex shrink-0 justify-start">
                  <button
                    title="Share Externally"
                    type="button"
                    className="relative text-blue-500 font-bold items-center bg-transparent caret-transparent gap-x-1 flex shrink-0 h-10 justify-center tracking-[-0.2px] leading-[14px] gap-y-1 text-center text-nowrap px-2 rounded-bl rounded-br rounded-tl rounded-tr hover:text-blue-400 hover:border-blue-400"
                  >
                    <img
                      src="https://c.animaapp.com/mkof8zon8iICvl/assets/icon-45.svg"
                      alt="Icon"
                      className="box-border caret-transparent shrink-0 h-5 text-nowrap w-5"
                    />
                    <span className="box-border caret-transparent flex shrink-0 text-nowrap">
                      Share Externally
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="box-border caret-transparent flex shrink-0 justify-start max-w-[816px] mr-4 mt-8">
          <InfoSection
            variant="dueDate"
            title="Due Date"
            dueDate="06/02/2026, 20:00"
            isOverdue={true}
            scheduledDate="06/02/2026, 20:00"
            timezone="Europe/Belgrade, Org. Time Zone"
            feedInfo="This Work Order will show in your feed starting 01/03/2026, 08:00."
          />
          <div className="box-border caret-transparent basis-[0%] grow ml-6">
            <div className="box-border caret-transparent shrink-0 break-words py-2">
              <h2 className="font-semibold box-border caret-transparent shrink-0 tracking-[-0.2px] break-words">
                Priority
              </h2>
            </div>
            <div className="box-border caret-transparent shrink-0 mb-2">
              <div className="text-[11.9994px] font-semibold items-center box-border caret-transparent gap-x-1 inline-flex shrink-0 tracking-[-0.2px] leading-[17.9991px] gap-y-1 border border-zinc-200 px-1.5 py-0.5 rounded-bl rounded-br rounded-tl rounded-tr border-solid">
                <span className="items-center box-border caret-transparent flex shrink-0 justify-start">
                  <img
                    src="https://c.animaapp.com/mkof8zon8iICvl/assets/icon-34.svg"
                    alt="Icon"
                    className="text-teal-500 box-border caret-transparent shrink-0 h-4 w-4"
                  />
                </span>
                Low
              </div>
            </div>
          </div>
          <div className="box-border caret-transparent basis-[0%] grow ml-6">
            <div className="box-border caret-transparent shrink-0 break-words py-2">
              <h2 className="font-semibold box-border caret-transparent shrink-0 tracking-[-0.2px] break-words">
                Work Order ID
              </h2>
            </div>
            <div className="box-border caret-transparent shrink-0 mb-2">
              #411
            </div>
          </div>
        </div>
        <div className="border-b-zinc-200 border-l-neutral-800 border-r-neutral-800 border-t-neutral-800 box-border caret-transparent shrink-0 mt-3 border-b"></div>
        <div className="box-border caret-transparent flex shrink-0 justify-start max-w-[816px] mr-4 mt-3">
          <InfoSection
            variant="assignedTo"
            title="Assigned To"
            assignedUsers={[
              {
                name: "Pedro Modesto",
                imageUrl:
                  "https://app.getmaintainx.com/img/static/user_placeholders/RandomPicture24.png",
                profileUrl: "https://app.getmaintainx.com/users/profile/849627",
                subtitle: "",
              },
            ]}
            assignedTeams={[
              {
                name: "Site Maintenance",
                iconUrl:
                  "https://c.animaapp.com/mkof8zon8iICvl/assets/icon-46.svg",
                teamUrl: "https://app.getmaintainx.com/teams/116087",
                subtitle: "",
              },
            ]}
          />
        </div>
        <div className="border-b-zinc-200 border-l-neutral-800 border-r-neutral-800 border-t-neutral-800 box-border caret-transparent shrink-0 mt-3 border-b"></div>
        <div className="box-border caret-transparent flex shrink-0 justify-start max-w-[816px] mr-4 mt-3">
          <InfoSection
            variant="description"
            title="Description"
            description="SSF weekly maintenance"
          />
        </div>
        <div className="border-b-zinc-200 border-l-neutral-800 border-r-neutral-800 border-t-neutral-800 box-border caret-transparent shrink-0 mt-3 border-b"></div>
        <div className="box-border caret-transparent flex shrink-0 justify-start max-w-[816px] mr-4 mt-3">
          <InfoSection
            variant="asset"
            title="Asset"
            assetName="0-GENERAL PURPOSE"
            assetImageUrl="https://app.getmaintainx.com/img/fbfb6507-4423-4d18-bf98-55359a5e8f7b_processed_image10.png?w=64&h=64&rmode=crop"
            assetUrl="https://app.getmaintainx.com/assets/7913759"
            assetStatus="Online"
            assetStatusColor="bg-teal-500"
          />
          <div className="box-border caret-transparent basis-[0%] grow ml-6 my-3">
            <div className="box-border caret-transparent shrink-0 break-words py-2">
              <h2 className="font-semibold box-border caret-transparent shrink-0 tracking-[-0.2px] break-words">
                Manufacturer
              </h2>
            </div>
            <div className="items-center box-border caret-transparent flex shrink-0 py-2">
              <div className="box-border caret-transparent flex flex-col grow shrink-0 w-0">
                <div className="box-border caret-transparent shrink-0">
                  <div className="box-border caret-transparent shrink-0">
                    SSF
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="box-border caret-transparent flex shrink-0 justify-start max-w-[816px] mr-4 mt-3">
          <InfoSection
            variant="location"
            title="Location"
            locationUrl="https://app.getmaintainx.com/locations/2698783"
            locationIconUrl="https://c.animaapp.com/mkof8zon8iICvl/assets/icon-49.svg"
            locationName="Slovakia"
          />
          <div className="box-border caret-transparent basis-[0%] grow ml-6 my-3">
            <InfoSection variant="estimatedTime" title="Estimated Time" />
            <div className="box-border caret-transparent shrink-0 my-2">
              <p className="box-border caret-transparent shrink-0 tracking-[-0.2px]">
                1h
              </p>
            </div>
          </div>
          <div className="box-border caret-transparent basis-[0%] grow ml-6 my-3">
            <InfoSection variant="workType" title="Work Type" />
            <div className="box-border caret-transparent shrink-0 my-2">
              <span className="box-border caret-transparent shrink-0">
                Preventive
              </span>
            </div>
          </div>
        </div>
        <div className="border-b-zinc-200 border-l-neutral-800 border-r-neutral-800 border-t-neutral-800 box-border caret-transparent shrink-0 mt-3 border-b"></div>
        <div className="box-border caret-transparent flex shrink-0 justify-start max-w-[816px] mr-4 mt-3">
          <InfoSection
            variant="categories"
            title="Categories"
            categories={[
              {
                name: "Preventive/Inspection",
                iconUrl:
                  "https://c.animaapp.com/mkof8zon8iICvl/assets/image-1.svg",
              },
            ]}
          />
        </div>
        <div className="border-b-zinc-200 border-l-neutral-800 border-r-neutral-800 border-t-neutral-800 box-border caret-transparent shrink-0 mt-3 border-b"></div>
        <InfoSection
          variant="scheduleConditions"
          title="Schedule conditions"
          scheduleDescription="This Work Order will repeat based on time."
          scheduleIconUrl="https://c.animaapp.com/mkof8zon8iICvl/assets/icon-50.svg"
          scheduleRepeatText="Repeats every week on Friday after completion of this Work Order."
          parentWorkOrderName="Weekly Maintenance Service"
          parentWorkOrderUrl="https://app.getmaintainx.com/workorders/85623594"
          parentWorkOrderDueDate="30/01/2026"
        />
        <div className="border-b-zinc-200 border-l-neutral-800 border-r-neutral-800 border-t-neutral-800 box-border caret-transparent shrink-0 mt-3 border-b"></div>
        <InfoSection
          variant="timeCostTracking"
          title="Time & Cost Tracking "
          partsAddUrl="https://app.getmaintainx.com/workorders/84658821/edit/parts"
          timeOverviewUrl="https://app.getmaintainx.com/workorders/84658821/timeoverview"
          timeTracked="Add"
        />
        <div className="border-b-zinc-200 border-l-neutral-800 border-r-neutral-800 border-t-neutral-800 box-border caret-transparent shrink-0 mt-3 border-b"></div>
        <div className="box-border caret-transparent flex shrink-0 justify-start max-w-[816px] mr-4 mt-3">
          <InfoSection
            variant="metadata"
            title=""
            createdByName="MaintainX"
            createdByUrl="https://app.getmaintainx.com/users/profile/1337"
            createdDate="30/01/2026, 20:09"
            lastUpdatedDate="17/02/2026, 09:56"
          />
        </div>
        <ProcedureSection />
        <div className="box-border caret-transparent shrink-0 mt-5">
          <div className="relative box-border caret-transparent flex basis-[0%] flex-col grow w-full">
            <div className="border-b-zinc-200 border-l-neutral-800 border-r-neutral-800 border-t-neutral-800 box-border caret-transparent shrink-0 mt-3 mx-6 border-b"></div>
            <div className="items-center box-border caret-transparent flex shrink-0 justify-between leading-8 pt-6 pb-2 px-6">
              <div className="box-border caret-transparent grow">
                <div className="items-center box-border caret-transparent flex shrink-0 min-h-[40.8px]">
                  <div className="box-border caret-transparent grow shrink-0 break-words w-0">
                    <h1 className="text-[20.0004px] font-medium box-border caret-transparent grow tracking-[-0.2px] break-words">
                      Comments
                    </h1>
                  </div>
                </div>
              </div>
            </div>
            <form className="box-border caret-transparent shrink-0 px-2">
              <div className="box-border caret-transparent shrink-0 mx-4 py-2">
                <div className="relative box-border caret-transparent shrink-0">
                  <div className="box-border caret-transparent basis-[0%] grow">
                    <div
                      role="textbox"
                      className="relative bg-white box-border caret-transparent shrink-0 leading-5 max-h-[478px] min-h-[78px] break-words overflow-x-hidden overflow-y-auto resize-y w-full border border-zinc-200 mt-2 p-2 rounded-bl rounded-br rounded-tl rounded-tr border-solid"
                    >
                      <p className="box-border caret-transparent shrink-0 tracking-[-0.2px] leading-[20.0004px]">
                        <span className="box-border caret-transparent shrink-0">
                          <span className="box-border caret-transparent shrink-0">
                            <span className="absolute box-border caret-transparent block shrink-0 max-w-full opacity-[0.333] pointer-events-none translate-y-[40.0%] w-full top-0">
                              Write a comment…
                            </span>
                            <span className="box-border caret-transparent shrink-0">
                              ﻿
                              <br className="box-border caret-transparent shrink-0" />
                            </span>
                          </span>
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
                <div className="box-border caret-transparent flex shrink-0 justify-end mt-2">
                  <button
                    type="button"
                    className="relative text-blue-500 font-bold items-center bg-transparent caret-transparent gap-x-1 flex shrink-0 h-8 justify-center tracking-[-0.2px] leading-[14px] gap-y-1 text-center text-nowrap px-2 rounded-bl rounded-br rounded-tl rounded-tr hover:text-blue-400 hover:border-blue-400"
                  >
                    <span className="box-border caret-transparent flex shrink-0 text-nowrap">
                      <img
                        src="https://c.animaapp.com/mkof8zon8iICvl/assets/icon-54.svg"
                        alt="Icon"
                        className="box-border caret-transparent shrink-0 h-5 text-nowrap w-5"
                      />
                    </span>
                  </button>
                  <input
                    type="file"
                    className="text-neutral-600 items-baseline bg-transparent box-border caret-transparent hidden shrink-0 text-ellipsis text-nowrap p-0"
                  />
                  <div className="box-border caret-transparent shrink-0 mr-2"></div>
                  <div className="box-border caret-transparent shrink-0 min-w-[50%] md:min-w-[auto]">
                    <button
                      type="submit"
                      className="relative text-slate-400 font-bold items-center bg-transparent caret-transparent gap-x-1 flex shrink-0 h-8 justify-center tracking-[-0.2px] leading-[14px] gap-y-1 text-center text-nowrap border border-zinc-200 px-3 rounded-bl rounded-br rounded-tl rounded-tr border-solid"
                    >
                      <span className="box-border caret-transparent flex shrink-0 text-nowrap">
                        Send
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </form>
            <div className="relative box-border caret-transparent overflow-x-hidden overflow-y-auto pr-2 pt-2 pb-12 md:pb-0">
              <ul className="box-border caret-transparent shrink-0 list-none pl-0">
                <li className="box-border caret-transparent shrink-0">
                  <div className="relative box-border caret-transparent shrink-0 px-4 py-1">
                    <div className="box-border caret-transparent flex shrink-0">
                      <div className="box-border caret-transparent shrink-0 text-center w-14">
                        <a
                          href="https://app.getmaintainx.com/users/profile/849627"
                          className="font-semibold box-border caret-transparent break-words hover:text-blue-500 hover:border-blue-500"
                        >
                          <div className="items-center bg-white bg-[url('https://app.getmaintainx.com/img/static/user_placeholders/RandomPicture24.png')] bg-cover box-border caret-transparent flex shrink-0 h-9 justify-center break-words w-9 bg-center rounded-[50%]"></div>
                        </a>
                      </div>
                      <div className="box-border caret-transparent grow shrink-0 break-words w-0">
                        <div className="box-border caret-transparent flex shrink-0 break-words mb-1">
                          <a
                            href="https://app.getmaintainx.com/users/profile/849627"
                            className="font-semibold box-border caret-transparent block break-words hover:text-blue-500 hover:border-blue-500"
                          >
                            Pedro Modesto
                          </a>
                          <div className="text-gray-600 box-border caret-transparent shrink-0 break-words ml-2">
                            12:20
                          </div>
                        </div>
                        <div className="text-gray-600 box-border caret-transparent shrink-0 leading-[21px] break-words">
                          logged time 3h 00m 00s (Inspection).
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
                <li className="box-border caret-transparent shrink-0 mt-2">
                  <div className="relative box-border caret-transparent shrink-0 px-4 py-1">
                    <div className="box-border caret-transparent flex shrink-0">
                      <div className="box-border caret-transparent shrink-0 text-center w-14">
                        <a
                          href="https://app.getmaintainx.com/users/profile/849627"
                          className="font-semibold box-border caret-transparent break-words hover:text-blue-500 hover:border-blue-500"
                        >
                          <div className="items-center bg-white bg-[url('https://app.getmaintainx.com/img/static/user_placeholders/RandomPicture24.png')] bg-cover box-border caret-transparent flex shrink-0 h-9 justify-center break-words w-9 bg-center rounded-[50%]"></div>
                        </a>
                      </div>
                      <div className="box-border caret-transparent grow shrink-0 break-words w-0">
                        <div className="box-border caret-transparent flex shrink-0 break-words mb-1">
                          <a
                            href="https://app.getmaintainx.com/users/profile/849627"
                            className="font-semibold box-border caret-transparent block break-words hover:text-blue-500 hover:border-blue-500"
                          >
                            Pedro Modesto
                          </a>
                          <div className="text-gray-600 box-border caret-transparent shrink-0 break-words ml-2">
                            12:20
                          </div>
                        </div>
                        <div className="text-gray-600 box-border caret-transparent shrink-0 leading-[21px] break-words">
                          signed the procedure.
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
                <li className="box-border caret-transparent shrink-0 mt-2">
                  <div className="relative box-border caret-transparent shrink-0 px-4 py-1">
                    <div className="box-border caret-transparent flex shrink-0">
                      <div className="box-border caret-transparent shrink-0 text-center w-14">
                        <a
                          href="https://app.getmaintainx.com/users/profile/849627"
                          className="font-semibold box-border caret-transparent break-words hover:text-blue-500 hover:border-blue-500"
                        >
                          <div className="items-center bg-white bg-[url('https://app.getmaintainx.com/img/static/user_placeholders/RandomPicture24.png')] bg-cover box-border caret-transparent flex shrink-0 h-9 justify-center break-words w-9 bg-center rounded-[50%]"></div>
                        </a>
                      </div>
                      <div className="box-border caret-transparent grow shrink-0 break-words w-0">
                        <div className="box-border caret-transparent flex shrink-0 break-words mb-1">
                          <a
                            href="https://app.getmaintainx.com/users/profile/849627"
                            className="font-semibold box-border caret-transparent block break-words hover:text-blue-500 hover:border-blue-500"
                          >
                            Pedro Modesto
                          </a>
                          <div className="text-gray-600 box-border caret-transparent shrink-0 break-words ml-2">
                            19/01/2026, 10:18
                          </div>
                        </div>
                        <div className="text-gray-600 box-border caret-transparent shrink-0 leading-[21px] break-words">
                          started progress on the work order.
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
                <li className="box-border caret-transparent shrink-0 mt-2">
                  <div className="relative box-border caret-transparent shrink-0 px-4 py-1">
                    <div className="box-border caret-transparent flex shrink-0">
                      <div className="box-border caret-transparent shrink-0 text-center w-14">
                        <a
                          href="https://app.getmaintainx.com/users/profile/870649"
                          className="font-semibold box-border caret-transparent break-words hover:text-blue-500 hover:border-blue-500"
                        >
                          <div className="items-center bg-white bg-[url('https://app.getmaintainx.com/img/static/user_placeholders/RandomPicture4.png')] bg-cover box-border caret-transparent flex shrink-0 h-9 justify-center break-words w-9 bg-center rounded-[50%]"></div>
                        </a>
                      </div>
                      <div className="box-border caret-transparent grow shrink-0 break-words w-0">
                        <div className="box-border caret-transparent flex shrink-0 break-words mb-1">
                          <a
                            href="https://app.getmaintainx.com/users/profile/870649"
                            className="font-semibold box-border caret-transparent block break-words hover:text-blue-500 hover:border-blue-500"
                          >
                            Jason Degg
                          </a>
                          <div className="text-gray-600 box-border caret-transparent shrink-0 break-words ml-2">
                            16/01/2026, 12:16
                          </div>
                        </div>
                        <div className="text-gray-600 box-border caret-transparent shrink-0 leading-[21px] break-words">
                          created work order
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
