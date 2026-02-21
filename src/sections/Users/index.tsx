import { useState } from "react";
import { useUserStore } from "@/store/useUserStore";
import { UserRole } from "@/types/user";
import { UserInviteModal } from "./components/UserInviteModal";

const ROLE_LABELS: Record<UserRole, string> = {
  Administrator: 'Administrator',
  Technician: 'Technician',
  Viewer: 'Viewer'
};

const formatLastVisit = (isoString: string) => {
  if (!isoString) return 'Never';
  const date = new Date(isoString);
  const now = new Date();
  
  // Reset time for comparison
  const d1 = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const d2 = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const diffInDays = Math.floor((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffInDays === 0) return 'Today';
  if (diffInDays === 1) return 'Yesterday';
  return date.toLocaleDateString();
};

export const Users = () => {
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const { allUsers } = useUserStore();

  return (
    <div className="relative bg-[var(--panel-2)] box-border caret-transparent flex basis-[0%] flex-col grow overflow-auto">
      {/* Header */}
      <div className="bg-[var(--panel-2)] border-b border-[var(--border)] shadow-[inset_0_-1px_0_rgba(255,255,255,0.03)] box-border caret-transparent shrink-0 px-4 py-4">
        <div className="items-center box-border caret-transparent gap-x-4 flex basis-[0%] grow gap-y-4">
          <div className="items-center box-border caret-transparent gap-x-4 flex shrink-0 gap-y-4">
            <h2 className="text-[31.9998px] font-bold box-border caret-transparent shrink-0 tracking-[-0.2px] leading-[39.9997px]">
              Users
            </h2>
          </div>
          <div className="items-center box-border caret-transparent gap-x-4 flex basis-[0%] grow justify-end gap-y-4">
            <div className="box-border caret-transparent flex basis-[0%] grow max-w-[400px]">
              <form className="box-border caret-transparent basis-[0%] grow">
                <input
                  type="search"
                  placeholder="Search Users"
                  className="bg-gray-50 bg-[url(data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20width=%2711%27%20height=%2712%27%3E%3Cg%20fill=%27none%27%20fill-rule=%27evenodd%27%20stroke=%27%23868686%27%20stroke-width=%271.25%27%20transform=%27translate%281%201.5)] bg-no-repeat box-border caret-transparent shrink-0 leading-5 min-h-10 -outline-offset-2 w-full border border-[var(--border)] bg-[position:10px_50%] pl-[30px] pr-2 py-2 rounded-bl rounded-br rounded-tl rounded-tr border-solid"
                />
              </form>
            </div>
            <button
              type="button"
              onClick={() => setIsInviteModalOpen(true)}
              className="relative text-white font-bold items-center bg-teal-500 caret-transparent gap-x-1 flex shrink-0 h-10 justify-center tracking-[-0.2px] leading-[14px] gap-y-1 text-center text-nowrap border border-teal-500 px-4 rounded-bl rounded-br rounded-tl rounded-tr border-solid hover:bg-teal-400 hover:border-teal-400"
            >
              <span className="box-border caret-transparent flex shrink-0 text-nowrap">
                Create New User
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="relative box-border caret-transparent flex basis-[0%] grow overflow-auto">
        <div className="bg-white shadow-[rgba(242,242,242,0.6)_0px_0px_12px_2px] box-border caret-transparent flex flex-col grow border border-[var(--border)] m-4 rounded-bl rounded-br rounded-tl rounded-tr border-solid overflow-hidden">
          {/* Table */}
          <div className="relative box-border caret-transparent flex flex-col grow overflow-auto">
            <table className="w-full">
              <thead className="bg-white sticky top-0 z-10 border-b border-[var(--border)]">
                <tr>
                  <th className="text-left text-[13px] font-medium text-[var(--muted)] px-4 py-3 opacity-[0.85]">
                    <button type="button" className="flex items-center gap-1 hover:text-[var(--text)] transition-colors">
                      Full Name
                    </button>
                  </th>
                  <th className="text-left text-[13px] font-medium text-[var(--muted)] px-4 py-3 opacity-[0.85]">
                    <button type="button" className="flex items-center gap-1 hover:text-[var(--text)] transition-colors">
                      Role
                    </button>
                  </th>
                  <th className="text-left text-[13px] font-medium text-[var(--muted)] px-4 py-3 opacity-[0.85]">
                    <button type="button" className="flex items-center gap-1 hover:text-[var(--text)] transition-colors">
                      Last Visit
                    </button>
                  </th>
                  <th className="w-12"></th>
                </tr>
              </thead>
              <tbody>
                {allUsers.map((user) => (
                  <tr key={user.id} className={`border-b border-[var(--border)] hover:bg-[var(--panel-2)] even:bg-[rgba(255,255,255,0.02)] transition-colors ${!user.isActive ? 'opacity-50' : ''} group`}>
                    <td className="px-4 py-3">
                      <div
                        className="flex items-center gap-3"
                      >
                        <div
                          className="items-center bg-white bg-cover box-border caret-transparent flex shrink-0 h-9 justify-center w-9 bg-center rounded-full transition-opacity group-hover:opacity-100"
                          style={{ backgroundImage: `url('${user.avatarUrl || 'https://app.getmaintainx.com/img/static/user_placeholders/RandomPicture4.png'}')` }}
                        ></div>
                        <span className="font-normal text-[13px] text-[var(--text)]">{user.fullName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[13px] text-[var(--text)] opacity-90">{ROLE_LABELS[user.role] || user.role}</td>
                    <td className="px-4 py-3">
                      <span className="text-[var(--text)] text-[13px] opacity-90">
                        {formatLastVisit(user.lastVisit)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        className="text-slate-500 hover:text-gray-800"
                      >
                        <img
                          src="https://c.animaapp.com/mkof8zon8iICvl/assets/icon-40.svg"
                          alt="Menu"
                          className="h-5 w-5 transition-opacity group-hover:opacity-100"
                        />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="border-t border-[var(--border)] px-4 py-3 flex items-center justify-between bg-white">
            <div className="text-sm text-gray-600">
              {allUsers.length > 0 ? `1 – ${allUsers.length} of ${allUsers.length}` : '0 of 0'}
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled
                className="p-2 rounded hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <img
                  src="https://c.animaapp.com/mkof8zon8iICvl/assets/icon-51.svg"
                  alt="Previous"
                  className="h-3 w-2 rotate-180"
                />
              </button>
              <button
                type="button"
                disabled
                className="p-2 rounded hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <img
                  src="https://c.animaapp.com/mkof8zon8iICvl/assets/icon-51.svg"
                  alt="Next"
                  className="h-3 w-2"
                />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <UserInviteModal 
        isOpen={isInviteModalOpen} 
        onClose={() => setIsInviteModalOpen(false)} 
      />
    </div>
  );
};
