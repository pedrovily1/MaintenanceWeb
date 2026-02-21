export type InfoSectionProps = {
  variant: string;
  title: string;
  dueDate?: string;
  isOverdue?: boolean;
  feedInfo?: string;
  scheduledDate?: string;
  timezone?: string;
  assignedUsers?: Array<{
    name: string;
    imageUrl: string;
    profileUrl: string;
    subtitle?: string;
  }>;
  description?: string;
  assetName?: string;
  assetImageUrl?: string;
  assetUrl?: string;
  assetStatus?: string;
  assetStatusColor?: string;
  locationName?: string;
  locationUrl?: string;
  locationIconUrl?: string;
  categories?: Array<{
    name: string;
    iconUrl: string;
  }>;
  scheduleDescription?: string;
  scheduleRepeatText?: string;
  scheduleIconUrl?: string;
  parentWorkOrderName?: string;
  parentWorkOrderUrl?: string;
  parentWorkOrderDueDate?: string;
  partsAddUrl?: string;
  timeOverviewUrl?: string;
  timeTracked?: string;
  createdByName?: string;
  createdByUrl?: string;
  createdDate?: string;
  lastUpdatedDate?: string;
  containerClassName?: string;
};

export const InfoSection = (props: InfoSectionProps) => {
  if (props.variant === "dueDate") {
    return (
      <div
        className={`box-border caret-transparent basis-[0%] grow ml-6 ${props.containerClassName || ""}`}
      >
        <div className="box-border caret-transparent shrink-0 py-2 break-words">
          <h2 className="font-semibold box-border caret-transparent shrink-0 tracking-[-0.2px] break-words">
            {props.title}
          </h2>
        </div>
        <div className="box-border caret-transparent shrink-0 items-center flex flex-wrap mb-2">
          <div className={`box-border caret-transparent shrink-0 ${props.isOverdue ? 'text-red-500' : ''}`}>
            {props.dueDate}
          </div>
          {props.isOverdue && (
            <span className="ml-2 bg-red-50 text-red-500 text-xs font-semibold px-2 py-0.5 rounded border border-red-50">
              Overdue
            </span>
          )}
        </div>
        <div className="box-border caret-transparent shrink-0 mb-2">
          <p className="text-gray-600 box-border caret-transparent shrink-0 tracking-[-0.2px] leading-[20.0004px]">
            Scheduled for{" "}
            <strong className="font-semibold box-border caret-transparent shrink-0">
              {props.scheduledDate}
            </strong>
            <br className="box-border caret-transparent shrink-0" />(
            {props.timezone})
          </p>
        </div>
        {props.feedInfo && (
          <div className="text-gray-600 text-sm mt-2">
            {props.feedInfo}
          </div>
        )}
      </div>
    );
  }

  if (props.variant === "assignedTo") {
    return (
      <div
        className={`box-border caret-transparent basis-[0%] grow ml-6 my-3 ${props.containerClassName || ""}`}
      >
        <div className="box-border caret-transparent shrink-0 py-2 break-words">
          <h2 className="font-semibold box-border caret-transparent shrink-0 tracking-[-0.2px] break-words">
            {props.title}
          </h2>
        </div>
        <ul className="box-border caret-transparent flex flex-wrap pl-0 list-none -mx-2">
          {props.assignedUsers?.map((user, index) => (
            <li key={index} className="box-border caret-transparent block px-2">
              <a
                href={user.profileUrl}
                className="items-center box-border caret-transparent flex shrink-0 break-words py-2"
              >
                <img
                  src={user.imageUrl}
                  className="box-border caret-transparent shrink-0 h-5 object-cover break-words w-5 mr-1 rounded-[50%]"
                />
                <div className="box-border caret-transparent break-words">
                  <div className="box-border caret-transparent flow-root shrink-0 break-words text-ellipsis overflow-hidden">
                    {user.name}
                  </div>
                  <div className="text-gray-600 text-[11.2px] box-border caret-transparent shrink-0 leading-[13.44px] break-words">
                    {user.subtitle}
                  </div>
                </div>
              </a>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  if (props.variant === "description") {
    return (
      <div
        className={`box-border caret-transparent basis-[0%] grow ml-6 my-3 ${props.containerClassName || ""}`}
      >
        <div className="box-border caret-transparent shrink-0 py-2 break-words">
          <h2 className="font-semibold box-border caret-transparent shrink-0 tracking-[-0.2px] break-words">
            {props.title}
          </h2>
        </div>
        <div className="box-border caret-transparent shrink-0 leading-[21px] break-words">
          <span className="box-border caret-transparent shrink-0 break-words">
            {props.description}
          </span>
        </div>
      </div>
    );
  }

  if (props.variant === "asset") {
    return (
      <div
        className={`box-border caret-transparent basis-[0%] grow ml-6 my-3 ${props.containerClassName || ""}`}
      >
        <div className="box-border caret-transparent shrink-0 py-2 break-words">
          <h2 className="font-semibold box-border caret-transparent shrink-0 tracking-[-0.2px] break-words">
            {props.title}
          </h2>
        </div>
        <div className="box-border caret-transparent shrink-0 items-center flex py-2">
          <div className="box-border caret-transparent shrink-0 mr-2">
            <div
              title={props.assetName}
              className="font-semibold items-center box-border caret-transparent flex shrink-0 h-10 justify-center tracking-[-0.2px] w-10 border border-[var(--border)] overflow-hidden rounded-lg border-solid"
            >
              <figure
                className="bg-cover box-border caret-transparent shrink-0 h-10 w-10 bg-center"
                style={{ backgroundImage: props.assetImageUrl ? `url('${props.assetImageUrl}')` : undefined }}
              ></figure>
            </div>
          </div>
          <div className="box-border caret-transparent flex flex-col grow shrink-0 w-0">
            <a
              href={props.assetUrl}
              className="items-start box-border caret-transparent flex flex-col shrink-0 break-words hover:text-teal-500 hover:border-teal-500"
            >
              <div className="box-border caret-transparent shrink-0 break-words w-full text-teal-500">
                {props.assetName}
              </div>
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (props.variant === "location") {
    return (
      <div
        className={`box-border caret-transparent basis-[0%] grow ml-6 my-3 ${props.containerClassName || ""}`}
      >
        <div className="box-border caret-transparent shrink-0 py-2 break-words">
          <h2 className="font-semibold box-border caret-transparent shrink-0 tracking-[-0.2px] break-words">
            {props.title}
          </h2>
        </div>
        <a
          href={props.locationUrl}
          className="items-center box-border caret-transparent flex shrink-0 break-words py-2"
        >
          <div className="box-border caret-transparent shrink-0 break-words mr-2">
            <div className="font-semibold items-center bg-teal-100 box-border caret-transparent flex shrink-0 h-8 justify-center tracking-[-0.2px] break-words w-8 border border-teal-300 overflow-hidden rounded-lg border-solid">
              <span className="text-teal-500 box-border caret-transparent flex shrink-0 break-words">
                <img
                  src={props.locationIconUrl}
                  alt="Icon"
                  className="box-border caret-transparent shrink-0 h-[18px] w-[18px]"
                />
              </span>
            </div>
          </div>
          <div className="box-border caret-transparent flex flex-col grow shrink-0 break-words w-0">
            <div className="box-border caret-transparent shrink-0 break-words">
              {props.locationName}
            </div>
            <div className="text-gray-600 text-[11.2px] box-border caret-transparent shrink-0 leading-[13.44px] break-words"></div>
          </div>
        </a>
      </div>
    );
  }

  if (props.variant === "estimatedTime" || props.variant === "workType") {
    return (
      <div
        className={`box-border caret-transparent shrink-0 py-2 break-words ${props.containerClassName || ""}`}
      >
        <h2 className="font-semibold box-border caret-transparent shrink-0 tracking-[-0.2px] break-words">
          {props.title}
        </h2>
      </div>
    );
  }

  if (props.variant === "categories") {
    return (
      <div
        className={`box-border caret-transparent basis-[0%] grow ml-6 my-3 ${props.containerClassName || ""}`}
      >
        <div className="box-border caret-transparent shrink-0 break-words mb-2 py-2">
          <h2 className="font-semibold box-border caret-transparent shrink-0 tracking-[-0.2px] break-words">
            {props.title}
          </h2>
        </div>
        <ul className="box-border caret-transparent flex flex-wrap pl-0 shrink-0">
          {props.categories?.map((category, index) => (
            <li
              key={index}
              className="box-border caret-transparent block shrink-0 max-w-full break-all mr-2.5 mb-2.5"
            >
              <span className="items-center bg-gray-50 box-border caret-transparent inline-flex shrink-0 justify-center min-h-[25px] min-w-[60px] break-all border border-[var(--border)] px-1 rounded-bl rounded-br rounded-tl rounded-tr border-solid">
                <img
                  src={category.iconUrl}
                  className="box-border caret-transparent shrink-0 h-2.5 object-cover w-2.5 break-all mr-[5px] rounded-[50%]"
                />
                {category.name}
              </span>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  if (props.variant === "scheduleConditions") {
    return (
      <div
        className={`box-border caret-transparent flex shrink-0 justify-start max-w-[816px] mr-4 mt-3 ${props.containerClassName || ""}`}
      >
        <div className="box-border caret-transparent basis-[0%] grow ml-6 my-3">
          <div className="box-border caret-transparent shrink-0 py-2 break-words">
            <h2 className="font-semibold box-border caret-transparent shrink-0 tracking-[-0.2px] break-words">
              {props.title}
            </h2>
          </div>
          <div className="box-border caret-transparent shrink-0 mb-4">
            <p className="box-border caret-transparent shrink-0 tracking-[-0.2px] leading-[20.0004px]">
              {props.scheduleDescription}
            </p>
          </div>
          <div className="box-border caret-transparent shrink-0 my-2">
            <div className="box-border caret-transparent gap-x-2 flex flex-col shrink-0 gap-y-2 mb-4">
              <div className="items-center box-border caret-transparent gap-x-2 flex shrink-0 flex-wrap gap-y-2">
                <img
                  src={props.scheduleIconUrl}
                  alt="Icon"
                  className="box-border caret-transparent shrink-0 h-5 w-5 mr-1"
                />
                {props.scheduleRepeatText}
              </div>
            </div>
          </div>
          <div className="text-gray-600 box-border caret-transparent shrink-0 mb-2">
            Automatically created from{" "}
            <div className="box-border caret-transparent gap-x-1 inline-flex shrink-0 leading-7 gap-y-1">
              <a
                href={props.parentWorkOrderUrl}
                className="text-teal-500 text-[16.0006px] items-center box-border caret-transparent gap-x-2 flex shrink-0 leading-[24.0009px] break-words gap-y-2 underline"
              >
                <p className="text-sm box-border caret-transparent shrink-0 tracking-[-0.2px] leading-[21px] break-words">
                  {props.parentWorkOrderName}
                </p>
              </a>
              <span className="box-border caret-transparent block shrink-0">
                (due {props.parentWorkOrderDueDate})
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (props.variant === "timeCostTracking") {
    return (
      <div
        className={`box-border caret-transparent flex shrink-0 justify-start max-w-[816px] mr-4 mt-3 ${props.containerClassName || ""}`}
      >
        <div className="box-border caret-transparent basis-[0%] grow ml-6 my-3">
          <h2 className="box-border caret-transparent shrink-0 text-[21px] font-medium items-center gap-x-2 flex leading-[31.5px] gap-y-2 py-2">
            {props.title}
          </h2>
          <div className="border-b-zinc-200 border-l-neutral-800 border-r-neutral-800 border-t-neutral-800 box-border caret-transparent shrink-0 mx-4 py-2 border-b">
            <div className="box-border caret-transparent flex shrink-0 py-2">
              <div className="items-center box-border caret-transparent gap-x-1 flex basis-[0%] grow gap-y-1 text-ellipsis text-nowrap overflow-hidden pr-2">
                <h4 className="font-semibold box-border caret-transparent shrink-0 leading-[21px] text-nowrap">
                  Parts{" "}
                </h4>
              </div>
              <div className="box-border caret-transparent shrink-0 text-right pl-2">
                <a
                  href={props.partsAddUrl}
                  className="text-teal-500 font-medium items-center box-border caret-transparent inline-flex shrink-0 break-words hover:text-teal-400 hover:border-teal-400"
                >
                  <span className="box-border caret-transparent block shrink-0 break-words">
                    Add
                  </span>
                  <span className="box-border caret-transparent block shrink-0 break-words ml-1">
                    <img
                      src="https://c.animaapp.com/mkof8zon8iICvl/assets/icon-51.svg"
                      alt="Icon"
                      className="box-border caret-transparent shrink-0 h-[5px] rotate-90 w-2"
                    />
                  </span>
                </a>
              </div>
            </div>
          </div>
          <div className="box-border caret-transparent shrink-0 mx-4 py-2">
            <div className="box-border caret-transparent flex shrink-0 py-2">
              <div className="items-center box-border caret-transparent gap-x-1 flex basis-[0%] grow gap-y-1 text-ellipsis text-nowrap overflow-hidden pr-2">
                <h4 className="font-semibold box-border caret-transparent shrink-0 leading-[21px] text-nowrap">
                  Time
                </h4>
              </div>
              <div className="box-border caret-transparent shrink-0 text-right pl-2">
                <a
                  href={props.timeOverviewUrl}
                  className="text-teal-500 font-medium items-center box-border caret-transparent inline-flex shrink-0 break-words hover:text-teal-400 hover:border-teal-400"
                >
                  <span className="box-border caret-transparent block shrink-0 break-words">
                    {props.timeTracked}
                  </span>
                  <span className="box-border caret-transparent block shrink-0 break-words ml-1">
                    <img
                      src="https://c.animaapp.com/mkof8zon8iICvl/assets/icon-51.svg"
                      alt="Icon"
                      className="box-border caret-transparent shrink-0 h-[5px] rotate-90 w-2"
                    />
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (props.variant === "metadata") {
    return (
      <div
        className={`box-border caret-transparent basis-[0%] grow ml-6 my-3 ${props.containerClassName || ""}`}
      >
        <div className="box-border caret-transparent shrink-0 my-2">
          Created by{" "}
          <a
            title={props.createdByName}
            href={props.createdByUrl}
            className="relative items-center box-border caret-transparent inline-flex shrink-0 break-words top-[3px] hover:text-teal-500 hover:border-teal-500"
          >
            <div className="items-center bg-white bg-[url('https://maintainx-static.s3-us-west-2.amazonaws.com/img/default-org-logo.png')] bg-cover box-border caret-transparent flex shrink-0 h-4 justify-center break-words w-4 bg-center rounded-[50%]"></div>
            <span className="box-border caret-transparent block shrink-0 max-w-[250px] break-words text-ellipsis text-nowrap overflow-hidden ml-1">
              {props.createdByName}
            </span>
          </a>{" "}
          on {props.createdDate}
        </div>
        <div className="box-border caret-transparent shrink-0 mt-6 mb-2">
          Last updated on {props.lastUpdatedDate}
        </div>
      </div>
    );
  }

  return null;
};
