import { useState } from "react";

type MeterDetailProps = {
  meterId: string | null;
};

export const MeterDetail = ({ meterId }: MeterDetailProps) => {
  const [activeTimeframe, setActiveTimeframe] = useState<'1H' | '1D' | '1W' | '1M' | '3M' | '6M' | '1Y' | 'Custom'>('1W');

  if (!meterId) {
    return (
      <div className="box-border caret-transparent flex basis-[375px] flex-col grow shrink-0 min-w-[200px] pt-2 px-2">
        <div className="bg-white shadow-[rgba(242,242,242,0.6)_0px_0px_12px_2px] box-border caret-transparent flex grow w-full border border-zinc-200 overflow-hidden rounded-bl rounded-br rounded-tl rounded-tr border-solid">
          <div className="flex items-center justify-center w-full h-full text-gray-500">
            Select a meter to view details
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="box-border caret-transparent flex basis-[375px] flex-col grow shrink-0 min-w-[200px] pt-2 px-2">
      <div className="bg-white shadow-[rgba(242,242,242,0.6)_0px_0px_12px_2px] box-border caret-transparent flex grow w-full border border-zinc-200 overflow-hidden rounded-bl rounded-br rounded-tl rounded-tr border-solid">
        <div className="box-border caret-transparent flex basis-[0%] flex-col grow h-full overflow-x-hidden overflow-y-auto w-full">
          {/* Header */}
          <div className="box-border caret-transparent shrink-0 px-4 py-4">
            <div className="items-center box-border caret-transparent gap-x-2 flex shrink-0 flex-wrap justify-between gap-y-2 mb-4">
              <div className="items-center box-border caret-transparent gap-x-2 flex gap-y-2">
                <h3 className="text-xl font-semibold box-border caret-transparent tracking-[-0.2px] leading-7">
                  Generator Hours
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
                    Record Reading
                  </span>
                </button>
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

            {/* Asset and Location */}
            <div className="items-center box-border caret-transparent gap-x-2 flex shrink-0 text-sm text-gray-600 mb-4">
              <div className="flex items-center gap-1">
                <img
                  src="https://c.animaapp.com/mkof8zon8iICvl/assets/icon-7.svg"
                  alt="Icon"
                  className="text-slate-500 box-border caret-transparent shrink-0 h-4 w-4"
                />
                <a href="#" className="text-blue-500 hover:text-blue-400">Generator</a>
              </div>
              <span>-</span>
              <div className="flex items-center gap-1">
                <img
                  src="https://c.animaapp.com/mkof8zon8iICvl/assets/icon-2.svg"
                  alt="Icon"
                  className="text-slate-500 box-border caret-transparent shrink-0 h-4 w-4"
                />
                <a href="#" className="text-blue-500 hover:text-blue-400">SSF - Slovakia</a>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="relative box-border caret-transparent flex flex-col grow scroll-smooth overflow-auto scroll-pt-4 px-6">
            {/* Readings Section */}
            <div className="box-border caret-transparent shrink-0 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Readings</h2>
                <div className="flex items-center gap-1">
                  {(['1H', '1D', '1W', '1M', '3M', '6M', '1Y', 'Custom'] as const).map((timeframe) => (
                    <button
                      key={timeframe}
                      type="button"
                      onClick={() => setActiveTimeframe(timeframe)}
                      className={`px-3 py-1 text-sm rounded ${
                        activeTimeframe === timeframe
                          ? 'bg-blue-500 text-white'
                          : 'bg-transparent text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {timeframe}
                    </button>
                  ))}
                </div>
              </div>

              {/* Chart Placeholder */}
              <div className="h-[400px] bg-white rounded flex items-center justify-center border border-zinc-200 mb-4 relative">
                <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between py-10 px-4 text-xs text-gray-600">
                  <div>69.2</div>
                  <div>69.175</div>
                  <div>69.15</div>
                  <div>69.125</div>
                  <div>69.1</div>
                  <div>69.075</div>
                </div>
                <div className="absolute left-20 right-4 top-10 bottom-10">
                  <svg width="100%" height="100%" viewBox="0 0 400 300" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M 0 250 L 100 250 L 150 250 L 250 250 L 300 250 L 350 50 L 400 250"
                      fill="url(#lineGradient)"
                      stroke="none"
                    />
                    <path
                      d="M 0 250 L 100 250 L 150 250 L 250 250 L 300 250 L 350 50 L 400 250"
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="2"
                    />
                    <circle cx="0" cy="250" r="4" fill="#3b82f6" />
                    <circle cx="100" cy="250" r="4" fill="#3b82f6" />
                    <circle cx="150" cy="250" r="4" fill="#3b82f6" />
                    <circle cx="250" cy="250" r="4" fill="#3b82f6" />
                    <circle cx="300" cy="250" r="4" fill="#3b82f6" />
                    <circle cx="350" cy="50" r="4" fill="#3b82f6" />
                    <circle cx="400" cy="250" r="4" fill="#3b82f6" />
                  </svg>
                </div>
                <div className="absolute left-20 right-4 bottom-4 flex justify-between text-xs text-gray-600">
                  <div>16 Jan</div>
                  <div>18 Jan</div>
                  <div>20 Jan</div>
                </div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                  <div className="text-4xl font-bold text-gray-800">HOURS</div>
                </div>
              </div>

              {/* See All Readings Button */}
              <div className="flex justify-center">
                <button
                  type="button"
                  className="text-blue-500 font-medium items-center bg-transparent caret-transparent gap-x-1 flex shrink-0 h-10 justify-center tracking-[-0.2px] leading-[14px] gap-y-1 text-center text-nowrap border border-blue-500 px-4 rounded-bl rounded-br rounded-tl rounded-tr border-solid hover:text-blue-400 hover:border-blue-400"
                >
                  <span className="box-border caret-transparent flex shrink-0 text-nowrap">
                    See All Readings
                  </span>
                  <img
                    src="https://c.animaapp.com/mkof8zon8iICvl/assets/icon-51.svg"
                    alt="Icon"
                    className="box-border caret-transparent shrink-0 h-[5px] rotate-90 w-2"
                  />
                </button>
              </div>
            </div>

            <div className="border-b border-zinc-200 my-4"></div>

            {/* Description */}
            <div className="box-border caret-transparent shrink-0 mb-6">
              <h2 className="text-lg font-semibold mb-3">Description</h2>
              <div className="box-border caret-transparent leading-[21px]">
                <span>Hours meter for Generator in Slovakia</span>
              </div>
            </div>

            <div className="border-b border-zinc-200 my-4"></div>

            {/* Meter Details */}
            <div className="box-border caret-transparent shrink-0 mb-6">
              <h2 className="text-lg font-semibold mb-4">Meter Details</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <p className="text-gray-600 text-sm">Measurement Unit</p>
                  <p className="font-semibold">Hours</p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-gray-600 text-sm">Last Reading</p>
                  <p className="font-semibold">69.1 Hours</p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-gray-600 text-sm">Last Reading On</p>
                  <p className="font-semibold">21/01/2026, 09:26</p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-gray-600 text-sm">Reading Frequency</p>
                  <p className="font-semibold">-</p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-gray-600 text-sm">Next Reading</p>
                  <p className="font-semibold">-</p>
                </div>
              </div>
            </div>

            <div className="border-b border-zinc-200 my-4"></div>

            {/* Automations */}
            <div className="box-border caret-transparent shrink-0 mb-6">
              <h2 className="text-lg font-semibold mb-3">Automations (0)</h2>
              <div className="text-center py-4">
                <a href="#" className="text-blue-500 text-sm font-medium hover:text-blue-400">
                  Create Automation
                </a>
              </div>
            </div>

            <div className="border-b border-zinc-200 my-4"></div>

            {/* Upcoming Reading Work Orders */}
            <div className="box-border caret-transparent shrink-0 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Upcoming Reading Work Orders (3)</h2>
                <a href="#" className="text-blue-500 text-sm font-medium hover:text-blue-400 flex items-center gap-1">
                  See all
                  <img
                    src="https://c.animaapp.com/mkof8zon8iICvl/assets/icon-51.svg"
                    alt="Icon"
                    className="box-border caret-transparent shrink-0 h-[5px] rotate-90 w-2"
                  />
                </a>
              </div>

              {/* Work Order Cards */}
              <div className="space-y-0">
                <div className="relative items-center border-b border-zinc-200 box-border caret-transparent flex shrink-0 min-h-[80px] cursor-pointer hover:bg-gray-50 py-3">
                  <div className="relative box-border caret-transparent shrink-0 mr-3 rounded-lg">
                    <div className="text-[16.0006px] font-semibold items-center box-border caret-transparent flex shrink-0 h-12 justify-center tracking-[-0.2px] w-12 border border-zinc-200 overflow-hidden rounded-lg border-solid">
                      <figure className="bg-[url('https://app.getmaintainx.com/img/fbfb6507-4423-4d18-bf98-55359a5e8f7b_processed_image10.png?w=96&h=96&rmode=crop')] bg-cover box-border caret-transparent shrink-0 h-12 w-12 bg-center"></figure>
                    </div>
                  </div>

                  <div className="box-border caret-transparent flex basis-[0%] flex-col grow justify-center">
                    <div className="items-center box-border caret-transparent flex shrink-0 my-px">
                      <div className="box-border caret-transparent flex basis-[0%] grow overflow-hidden mr-2">
                        <div className="box-border caret-transparent text-ellipsis text-nowrap overflow-hidden">
                          Weekly Maintenance Service
                        </div>
                      </div>
                      <div className="box-border caret-transparent shrink-0">
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
                            <div className="items-center bg-white bg-[url('https://app.getmaintainx.com/img/static/user_placeholders/RandomPicture24.png')] bg-cover box-border caret-transparent flex shrink-0 h-4 justify-center w-4 bg-center rounded-[50%]"></div>
                          </div>
                        </span>
                      </div>
                    </div>
                    <div className="items-center box-border caret-transparent flex shrink-0 justify-between my-1">
                      <div className="text-gray-600 text-[12.6px] box-border caret-transparent">
                        #404
                      </div>
                    </div>
                    <div className="items-center box-border caret-transparent flex shrink-0 justify-between my-px">
                      <div className="text-gray-600 text-[12.6px] box-border caret-transparent">
                        Due Date: 23/01/2026, 20:00
                      </div>
                    </div>
                  </div>
                </div>

                <div className="relative items-center border-b border-zinc-200 box-border caret-transparent flex shrink-0 min-h-[80px] cursor-pointer hover:bg-gray-50 py-3">
                  <div className="relative box-border caret-transparent shrink-0 mr-3 rounded-lg">
                    <div className="text-[16.0006px] font-semibold items-center box-border caret-transparent flex shrink-0 h-12 justify-center tracking-[-0.2px] w-12 border border-zinc-200 overflow-hidden rounded-lg border-solid">
                      <figure className="bg-[url('https://app.getmaintainx.com/img/63288309-1ff2-4ec8-a512-80805e4bee93_processed_image22.png?w=96&h=96&rmode=crop')] bg-cover box-border caret-transparent shrink-0 h-12 w-12 bg-center"></figure>
                    </div>
                  </div>

                  <div className="box-border caret-transparent flex basis-[0%] flex-col grow justify-center">
                    <div className="items-center box-border caret-transparent flex shrink-0 my-px">
                      <div className="box-border caret-transparent flex basis-[0%] grow overflow-hidden mr-2">
                        <div className="box-border caret-transparent text-ellipsis text-nowrap overflow-hidden">
                          Backup power function checks
                        </div>
                      </div>
                      <div className="box-border caret-transparent shrink-0">
                        <span className="items-center box-border caret-transparent flex shrink-0">
                          <div className="box-border caret-transparent shrink-0 h-4 -ml-0.5">
                            <div className="items-center bg-white bg-[url('https://app.getmaintainx.com/img/static/user_placeholders/RandomPicture24.png')] bg-cover box-border caret-transparent flex shrink-0 h-4 justify-center w-4 bg-center rounded-[50%]"></div>
                          </div>
                        </span>
                      </div>
                    </div>
                    <div className="items-center box-border caret-transparent flex shrink-0 justify-between my-1">
                      <div className="text-gray-600 text-[12.6px] box-border caret-transparent">
                        #408
                      </div>
                    </div>
                    <div className="items-center box-border caret-transparent flex shrink-0 justify-between my-px">
                      <div className="text-gray-600 text-[12.6px] box-border caret-transparent">
                        Due Date: 03/02/2026, 21:00
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* See All Button */}
              <div className="flex justify-center mb-6">
                <button
                  type="button"
                  className="text-blue-500 font-medium items-center bg-transparent caret-transparent gap-x-1 flex shrink-0 h-10 justify-center tracking-[-0.2px] leading-[14px] gap-y-1 text-center text-nowrap border border-blue-500 px-4 rounded-bl rounded-br rounded-tl rounded-tr border-solid hover:text-blue-400 hover:border-blue-400"
                >
                  <span className="box-border caret-transparent flex shrink-0 text-nowrap">
                    See All Readings
                  </span>
                </button>
              </div>
            </div>

            <div className="border-b border-zinc-200 my-4"></div>

            {/* Metadata */}
            <div className="text-sm text-gray-600 space-y-2 mb-6">
              <div className="flex items-center gap-2">
                Created By 
                <div className="items-center bg-white bg-[url('https://app.getmaintainx.com/img/static/user_placeholders/RandomPicture24.png')] bg-cover box-border caret-transparent flex shrink-0 h-4 justify-center w-4 bg-center rounded-[50%]"></div>
                <a href="#" className="text-blue-500 hover:underline">Pedro Modesto</a>
                <span>on 27/01/2025, 16:27</span>
              </div>
              <div>Last updated on 31/03/2025, 19:04</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
