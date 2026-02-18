export type WorkOrderCardProps = {
  id: string;
  title: string;
  workOrderNumber: string;
  assetName: string;
  assetImageUrl?: string;
  status: string;
  priority: string;
  startDate?: string;
  dueDate: string;
  isOverdue?: boolean;
  isRecurring?: boolean;
  assignedUsers?: Array<{ name: string; imageUrl?: string }>;
  assignedTeams?: Array<{ name: string; initials: string; color: string }>;
  onClick?: () => void;
  isActive?: boolean;
};

export const WorkOrderCard = ({
  id,
  title,
  workOrderNumber,
  assetName,
  assetImageUrl,
  status,
  priority,
  startDate,
  dueDate,
  isOverdue,
  isRecurring,
  assignedUsers,
  assignedTeams,
  onClick,
  isActive
}: WorkOrderCardProps) => {
  return (
    <div 
      onClick={onClick}
      className={`relative items-center bg-white border-b border-zinc-200 box-border caret-transparent flex shrink-0 min-h-[98px] hover:bg-gray-50 cursor-pointer pl-3 py-3 ${
        isActive ? "bg-slate-50 border-l-4 border-l-blue-500" : ""
      }`}
    >
      {/* Image */}
      <div className="relative box-border caret-transparent shrink-0 mr-3 rounded-lg z-0">
        <div
          title={assetName}
          className="text-[16px] font-semibold items-center box-border caret-transparent flex shrink-0 h-12 justify-center tracking-[-0.2px] w-12 border border-zinc-200 overflow-hidden rounded-lg border-solid bg-gray-100"
        >
          {assetImageUrl ? (
            <figure 
              className="bg-cover bg-center w-full h-full"
              style={{ backgroundImage: `url('${assetImageUrl}')` }}
            ></figure>
          ) : (
            <span className="text-blue-500">
              <img src="https://c.animaapp.com/mkof8zon8iICvl/assets/icon-7.svg" alt="Asset" className="h-6 w-6" />
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="box-border caret-transparent flex basis-[0%] flex-col grow justify-center min-w-0 z-0">
        
        {/* Top Row: Title & Icons */}
        <div className="items-center box-border caret-transparent flex shrink-0 mb-1">
          {isRecurring && (
            <div className="text-slate-500 box-border caret-transparent shrink-0 mr-1.5">
              <img
                src="https://c.animaapp.com/mkof8zon8iICvl/assets/icon-30.svg"
                alt="Recurring"
                className="box-border caret-transparent shrink-0 h-[18px] w-[18px]"
              />
            </div>
          )}
          <div className="box-border caret-transparent flex basis-[0%] grow overflow-hidden mr-2 min-w-0">
            <div
              title={title}
              className="font-semibold text-base text-neutral-800 box-border caret-transparent text-ellipsis text-nowrap overflow-hidden"
            >
              {title}
            </div>
          </div>
          
          {/* Assigned Avatars */}
          <div className="box-border caret-transparent shrink-0 flex items-center mr-4">
            <div className="flex -space-x-2">
              {assignedUsers?.map((user, index) => (
                <div key={`user-${index}`} className="relative z-10 rounded-full border-2 border-white">
                  <img 
                    src={user.imageUrl} 
                    alt={user.name}
                    className="h-6 w-6 rounded-full object-cover"
                  />
                </div>
              ))}
              {assignedTeams?.map((team, index) => (
                <div key={`team-${index}`} className={`relative z-0 rounded-full border-2 border-white ${team.color} flex items-center justify-center h-6 w-6 text-[10px] text-white font-bold`}>
                  {team.initials}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Middle Row: Asset & ID */}
        <div className="items-center box-border caret-transparent flex shrink-0 justify-between mb-1.5">
          <div className="text-gray-600 text-sm box-border caret-transparent basis-[0%] grow text-ellipsis text-nowrap w-full overflow-hidden">
            {assetName}
          </div>
          <div className="text-gray-500 text-sm box-border caret-transparent shrink-0 mr-4">
            {workOrderNumber}
          </div>
        </div>

        {/* Bottom Row: Status, Priority, Due Date */}
        <div className="items-center box-border caret-transparent flex shrink-0 gap-2">
          {/* Status Badge */}
          <div className="relative box-border caret-transparent shrink-0">
            <div className={`text-xs font-medium items-center flex shrink-0 leading-none px-2 py-1 rounded ${
              status === 'Open' ? 'bg-sky-100 text-blue-600' : 
              status === 'Done' ? 'bg-teal-100 text-teal-600' : 
              status === 'In Progress' ? 'bg-blue-100 text-blue-600' :
              status === 'On Hold' ? 'bg-yellow-100 text-yellow-600' :
              'bg-gray-100 text-gray-600'
            }`}>
              <div className="mr-1.5 flex items-center">
                {status === 'Open' && <img src="https://c.animaapp.com/mkof8zon8iICvl/assets/icon-41.svg" alt="Open" className="h-3 w-3" />}
                {status === 'On Hold' && <img src="https://c.animaapp.com/mkof8zon8iICvl/assets/icon-42.svg" alt="On Hold" className="h-3 w-3" />}
                {status === 'In Progress' && <img src="/src/public/inprogress.svg" alt="In Progress" className="h-3 w-3" />}
                {status === 'Done' && <img src="https://c.animaapp.com/mkof8zon8iICvl/assets/icon-44.svg" alt="Done" className="h-3 w-3" />}
              </div>
              {status}
            </div>
          </div>

          {/* Priority Badge */}
          <div className="text-xs font-medium items-center text-teal-600 border border-zinc-200 bg-white flex shrink-0 leading-none px-2 py-1 rounded">
            <div className="mr-1">
              <img
                src="https://c.animaapp.com/mkof8zon8iICvl/assets/icon-34.svg"
                alt="Priority"
                className={`h-3.5 w-3.5 ${priority === 'Low' ? 'text-teal-500' : 'text-orange-500'}`}
              />
            </div>
            {priority}
          </div>

          {/* Due Date / Overdue */}
          <div className="flex items-center text-xs ml-auto mr-4 text-gray-600">
            {startDate && (
              <span className="flex items-center">
                S: {startDate}
                <span className="mx-1.5">•</span>
              </span>
            )}
            {isOverdue && status !== 'Done' && (
              <span className="text-red-600 font-medium flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 mr-1">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                Overdue
              </span>
            )}
            {isOverdue && status !== 'Done' && <span className="text-gray-400 mx-1.5">•</span>}
            <span className={`${isOverdue && status !== 'Done' ? 'text-red-600' : ''}`}>D: {dueDate}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
