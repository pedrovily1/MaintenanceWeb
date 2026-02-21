import { useState } from "react";
import { LogOut } from "lucide-react";
import { useUserStore } from "@/store/useUserStore";
import { supabase } from "@/lib/supabase";

export const UserProfile = () => {
  const { activeUser } = useUserStore();
  const isActive = window.location.hash === '#settings';

  const handleLogout = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await supabase.auth.signOut();
  };

  return (
    <div className="box-border caret-transparent shrink-0 w-full group/profile">
      <div
        className={`relative items-center caret-transparent flex fill-gray-600 shrink-0 stroke-gray-600 text-center w-full mt-2 rounded-bl rounded-br rounded-tl rounded-tr justify-center lg:justify-start ${
          isActive ? 'bg-[var(--panel)] text-[var(--accent)] opacity-100' : 'bg-transparent hover:bg-[var(--panel)] opacity-65 hover:opacity-100'
        }`}
      >
        <div 
          className="items-center bg-[var(--panel)] bg-cover box-border caret-transparent flex fill-gray-600 shrink-0 h-8 justify-center stroke-gray-600 w-8 bg-center rounded-[50%]"
          style={{ backgroundImage: `url('${activeUser?.avatarUrl || 'https://app.getmaintainx.com/img/static/user_placeholders/RandomPicture4.png'}')` }}
        ></div>
        
        {/* User Info - Hidden on mobile/tablet */}
        <div className="hidden lg:block box-border caret-transparent fill-gray-600 grow leading-[18.9px] stroke-gray-600 overflow-hidden ml-2">
          <div className="items-center box-border caret-transparent flex fill-gray-600 shrink-0 stroke-gray-600">
            <div className="font-medium box-border caret-transparent fill-gray-600 stroke-gray-600 text-left text-ellipsis text-nowrap overflow-hidden">
              {activeUser?.fullName || 'Admin'}
            </div>
          </div>
        </div>

        {/* Logout Button (Desktop) */}
        <button
          onClick={handleLogout}
          title="Log Out"
          className="hidden lg:flex absolute right-2 top-1/2 -translate-y-1/2 items-center justify-center p-1.5 rounded-md text-[#9AA4B2] hover:text-red-500 hover:bg-red-500/10 opacity-0 group-hover/profile:opacity-100 transition-all"
        >
          <LogOut className="h-4 w-4" />
        </button>
        
        {/* Chevron - Hidden on mobile/tablet and hidden when profile is hovered */}
        <img
          src="https://c.animaapp.com/mkof8zon8iICvl/assets/icon-19.svg"
          alt="Icon"
          className={`hidden lg:block text-accent box-border caret-transparent shrink-0 h-5 w-5 group-hover/profile:opacity-0 transition-opacity ${isActive ? 'opacity-100' : ''}`}
        />
      </div>
    </div>
  );
};
