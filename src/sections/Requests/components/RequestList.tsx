type Request = {
  id: string;
  title: string;
  locationName: string;
  requestNumber: string;
  priority: string;
  status: string;
};

type RequestListProps = {
  requests: Request[];
  selectedRequestId: string | null;
  onSelectRequest: (id: string) => void;
};

export const RequestList = ({ requests, selectedRequestId, onSelectRequest }: RequestListProps) => {
  return (
    <div className="bg-white shadow-[rgba(242,242,242,0.6)_0px_0px_12px_2px] box-border caret-transparent flex flex-col shrink-0 max-w-[500px] min-w-[300px] w-2/5 border border-zinc-200 mr-4 rounded-tl rounded-tr border-solid">
      <div className="relative box-border caret-transparent basis-[0%] grow overflow-x-hidden overflow-y-auto pb-8 rounded-bl rounded-br rounded-tl rounded-tr">
        <div className="text-blue-500 text-sm font-semibold box-border caret-transparent shrink-0 px-4 py-3 border-b border-zinc-200">
          <span className="text-neutral-800 box-border caret-transparent shrink-0 pr-1">
            Done or Rejected ({requests.length})
          </span>
        </div>
        
        {requests.length === 0 ? (
          <div className="text-center text-gray-500 py-8 px-4">
            <p className="text-sm">No requests found</p>
          </div>
        ) : (
          <div>
            {requests.map((request) => (
              <div
                key={request.id}
                onClick={() => onSelectRequest(request.id)}
                className={`relative items-center border-b border-zinc-200 box-border caret-transparent flex shrink-0 min-h-[98px] cursor-pointer hover:bg-gray-50 ${
                  selectedRequestId === request.id ? "bg-slate-50" : ""
                }`}
              >
                <div className="relative box-border caret-transparent shrink-0 ml-4 mr-3">
                  <div className="text-[16.0006px] font-semibold items-center bg-sky-100 box-border caret-transparent flex shrink-0 h-12 justify-center tracking-[-0.2px] w-12 border border-blue-300 overflow-hidden rounded-lg border-solid">
                    <span className="text-blue-500 box-border caret-transparent flex shrink-0">
                      <img
                        src="https://c.animaapp.com/mkof8zon8iICvl/assets/icon-2.svg"
                        alt="Icon"
                        className="box-border caret-transparent shrink-0 h-[18px] w-[18px]"
                      />
                    </span>
                  </div>
                </div>
                
                <div className="box-border caret-transparent flex basis-[0%] flex-col grow justify-center py-3">
                  <div className="box-border caret-transparent flex basis-[0%] grow overflow-hidden mr-2">
                    <div
                      title={request.title}
                      className="font-medium box-border caret-transparent text-ellipsis text-nowrap overflow-hidden"
                    >
                      {request.title}
                    </div>
                  </div>
                  
                  <div className="text-gray-600 text-xs box-border caret-transparent basis-[0%] grow text-ellipsis text-nowrap w-full overflow-hidden my-1">
                    Location: {request.locationName}
                  </div>
                  
                  <div className="items-center box-border caret-transparent flex shrink-0 justify-between my-1">
                    <div className="text-gray-600 text-xs box-border caret-transparent shrink-0">
                      Requested by Jason Degg
                    </div>
                  </div>
                  
                  <div className="items-center box-border caret-transparent flex shrink-0 justify-between gap-2">
                    <div className="text-xs bg-gray-100 px-2 py-1 rounded">
                      {request.status}
                    </div>
                    <div className="text-gray-600 text-xs box-border caret-transparent shrink-0">
                      {request.requestNumber}
                    </div>
                    <div className="text-xs font-semibold items-center box-border caret-transparent gap-x-1 flex shrink-0 border border-zinc-200 px-1.5 py-0.5 rounded">
                      <span className="items-center box-border caret-transparent flex shrink-0 justify-start">
                        <img
                          src="https://c.animaapp.com/mkof8zon8iICvl/assets/icon-34.svg"
                          alt="Icon"
                          className="text-teal-500 box-border caret-transparent shrink-0 h-4 w-4"
                        />
                      </span>
                      {request.priority}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
