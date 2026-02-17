export const UserProfile = () => {
  const isActive = window.location.hash === '#settings';
  
  return (
    <div className="box-border caret-transparent shrink-0 w-full">
      <a
        href="/settings/general"
        onClick={(e) => {
          e.preventDefault();
          window.location.hash = 'settings';
        }}
        className={`items-center caret-transparent flex fill-gray-600 shrink-0 stroke-gray-600 text-center w-full mt-2 rounded-bl rounded-br rounded-tl rounded-tr justify-center lg:justify-start ${
          isActive ? 'bg-sky-100 text-blue-500' : 'bg-transparent hover:bg-gray-100'
        }`}
        title="Settings"
      >
        <div className="items-center bg-white bg-[url('https://app.getmaintainx.com/img/static/user_placeholders/RandomPicture24.png')] bg-cover box-border caret-transparent flex fill-gray-600 shrink-0 h-8 justify-center stroke-gray-600 w-8 bg-center rounded-[50%]"></div>
        
        {/* User Info - Hidden on mobile/tablet */}
        <div className="hidden lg:block box-border caret-transparent fill-gray-600 grow leading-[18.9px] stroke-gray-600 overflow-hidden ml-2">
          <div className="items-center box-border caret-transparent flex fill-gray-600 shrink-0 stroke-gray-600">
            <div className="font-medium box-border caret-transparent fill-gray-600 stroke-gray-600 text-left text-ellipsis text-nowrap overflow-hidden">
              Pedro Modesto
            </div>
          </div>
          <div className="text-gray-600 items-center box-border caret-transparent flex fill-gray-600 shrink-0 stroke-gray-600">
            <img
              src="https://c.animaapp.com/mkof8zon8iICvl/assets/icon-18.svg"
              alt="Icon"
              className="text-blue-500 box-border caret-transparent shrink-0 h-3.5 w-3.5 mr-1"
            />
            <div className="box-border caret-transparent fill-gray-600 shrink-0 stroke-gray-600">
              Settings
            </div>
          </div>
        </div>
        
        {/* Chevron - Hidden on mobile/tablet */}
        <img
          src="https://c.animaapp.com/mkof8zon8iICvl/assets/icon-19.svg"
          alt="Icon"
          className="hidden lg:block text-blue-500 box-border caret-transparent shrink-0 h-5 w-5"
        />
      </a>
    </div>
  );
};
