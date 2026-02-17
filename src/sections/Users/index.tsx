import { useState } from "react";

export const Users = () => {
  const [activeTab, setActiveTab] = useState<'users' | 'teams'>('users');

  const users = [
    {
      id: "829988",
      name: "Dean Wilken",
      role: "Full User",
      teams: ["Site Maintenance", "Slovakia SSF"],
      lastVisit: "05/12/2025",
      avatarUrl: "https://app.getmaintainx.com/img/static/user_placeholders/RandomPicture9.png",
      hasJoined: true
    },
    {
      id: "806243",
      name: "Demitrious Davidson",
      role: "Requester Only",
      teams: ["[MX Permissions - CWS Admins]"],
      lastVisit: "Didn't join yet",
      avatarUrl: "https://app.getmaintainx.com/img/static/user_placeholders/RandomPicture5.png",
      hasJoined: false
    },
    {
      id: "870649",
      name: "Jason Degg",
      role: "Administrator",
      teams: ["Slovakia SSF"],
      lastVisit: "Today",
      avatarUrl: "https://app.getmaintainx.com/img/static/user_placeholders/RandomPicture4.png",
      hasJoined: true
    },
    {
      id: "1178194",
      name: "Matt Vita",
      role: "Administrator",
      teams: [],
      lastVisit: "17/12/2025",
      avatarUrl: "https://app.getmaintainx.com/img/c554ba0a-a4cd-4b02-874e-86a3d5d6dd8c_3757796550588235882.jpeg?w=256&h=256&rmode=crop",
      hasJoined: true
    },
    {
      id: "849627",
      name: "Pedro Modesto",
      role: "Administrator",
      teams: ["Slovakia SSF"],
      lastVisit: "Today",
      avatarUrl: "https://app.getmaintainx.com/img/static/user_placeholders/RandomPicture24.png",
      hasJoined: true
    },
    {
      id: "1178849",
      name: "Wesley Rivenburgh",
      role: "Full User",
      teams: [],
      lastVisit: "Didn't join yet",
      avatarUrl: "https://app.getmaintainx.com/img/8f078e92-1bb4-41b1-96c2-671372dfceeb_Scan_202511112.png?w=256&h=256&rmode=crop",
      hasJoined: false
    }
  ];

  return (
    <div className="relative bg-white box-border caret-transparent flex basis-[0%] flex-col grow overflow-auto">
      {/* Header */}
      <div className="bg-white box-border caret-transparent shrink-0 px-4 py-5">
        <div className="items-center box-border caret-transparent gap-x-4 flex basis-[0%] grow gap-y-4">
          <div className="items-center box-border caret-transparent gap-x-4 flex shrink-0 gap-y-4">
            <h2 className="text-[31.9998px] font-bold box-border caret-transparent shrink-0 tracking-[-0.2px] leading-[39.9997px]">
              Teams / Users
            </h2>
          </div>
          <div className="items-center box-border caret-transparent gap-x-4 flex basis-[0%] grow justify-end gap-y-4">
            <div className="box-border caret-transparent flex basis-[0%] grow max-w-[400px]">
              <form className="box-border caret-transparent basis-[0%] grow">
                <input
                  type="search"
                  placeholder="Search Users"
                  className="bg-gray-50 bg-[url(data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20width=%2711%27%20height=%2712%27%3E%3Cg%20fill=%27none%27%20fill-rule=%27evenodd%27%20stroke=%27%23868686%27%20stroke-width=%271.25%27%20transform=%27translate%281%201.5)] bg-no-repeat box-border caret-transparent shrink-0 leading-5 min-h-10 -outline-offset-2 w-full border border-gray-50 bg-[position:10px_50%] pl-[30px] pr-2 py-2 rounded-bl rounded-br rounded-tl rounded-tr border-solid"
                />
              </form>
            </div>
            <button
              type="button"
              className="relative text-white font-bold items-center bg-blue-500 caret-transparent gap-x-1 flex shrink-0 h-10 justify-center tracking-[-0.2px] leading-[14px] gap-y-1 text-center text-nowrap border border-blue-500 px-4 rounded-bl rounded-br rounded-tl rounded-tr border-solid hover:bg-blue-400 hover:border-blue-400"
            >
              <span className="box-border caret-transparent flex shrink-0 text-nowrap">
                Invite Users
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b-zinc-200 border-l-neutral-800 border-r-neutral-800 border-t-neutral-800 box-border caret-transparent flex shrink-0 border-b px-4">
        <button
          type="button"
          onClick={() => setActiveTab('users')}
          className={`${
            activeTab === 'users'
              ? 'text-blue-500 font-semibold border-b-blue-500'
              : 'text-gray-600 border-b-transparent'
          } bg-transparent border-l-neutral-500/30 border-r-neutral-500/30 border-t-neutral-500/30 caret-transparent block text-center -mb-px px-4 py-2.5 border-t-0 border-x-0 border-b-2 hover:bg-gray-50`}
        >
          Users
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('teams')}
          className={`${
            activeTab === 'teams'
              ? 'text-blue-500 font-semibold border-b-blue-500'
              : 'text-gray-600 border-b-transparent'
          } bg-transparent border-l-neutral-500/30 border-r-neutral-500/30 border-t-neutral-500/30 caret-transparent block text-center -mb-px px-4 py-2.5 border-t-0 border-x-0 border-b-2 hover:bg-gray-50`}
        >
          Teams
        </button>
      </div>

      {/* Content */}
      <div className="relative box-border caret-transparent flex basis-[0%] grow overflow-auto">
        {activeTab === 'users' ? (
          <div className="bg-white shadow-[rgba(242,242,242,0.6)_0px_0px_12px_2px] box-border caret-transparent flex flex-col grow border border-zinc-200 m-4 rounded-bl rounded-br rounded-tl rounded-tr border-solid overflow-hidden">
            {/* Table */}
            <div className="relative box-border caret-transparent flex flex-col grow overflow-auto">
              <table className="w-full">
                <thead className="bg-white sticky top-0 z-10 border-b border-zinc-200">
                  <tr>
                    <th className="text-left text-sm font-medium text-gray-600 px-4 py-3">
                      <button type="button" className="flex items-center gap-1 hover:text-gray-800">
                        Full Name
                      </button>
                    </th>
                    <th className="text-left text-sm font-medium text-gray-600 px-4 py-3">
                      <button type="button" className="flex items-center gap-1 hover:text-gray-800">
                        Role
                      </button>
                    </th>
                    <th className="text-left text-sm font-medium text-gray-600 px-4 py-3">
                      <button type="button" className="flex items-center gap-1 hover:text-gray-800">
                        Teams
                      </button>
                    </th>
                    <th className="text-left text-sm font-medium text-gray-600 px-4 py-3">
                      <button type="button" className="flex items-center gap-1 hover:text-gray-800">
                        Last Visit
                      </button>
                    </th>
                    <th className="w-12"></th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b border-zinc-200 hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <a
                          href={`/users/profile/${user.id}`}
                          className="flex items-center gap-3 text-blue-500 hover:text-blue-400"
                        >
                          <div
                            className={`items-center bg-white bg-cover box-border caret-transparent flex shrink-0 h-9 justify-center w-9 bg-center rounded-full ${
                              !user.hasJoined ? 'opacity-50' : ''
                            }`}
                            style={{ backgroundImage: `url('${user.avatarUrl}')` }}
                          ></div>
                          <span className="font-normal text-gray-800">{user.name}</span>
                        </a>
                      </td>
                      <td className="px-4 py-3 text-gray-800">{user.role}</td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {user.teams.map((team, idx) => (
                            <span
                              key={idx}
                              className={`text-white text-xs px-2 py-1 rounded ${
                                team.includes('[MX Permissions')
                                  ? 'bg-teal-500'
                                  : 'bg-pink-500'
                              }`}
                            >
                              {team}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {user.hasJoined ? (
                          <span className="text-gray-800" title={user.lastVisit}>
                            {user.lastVisit}
                          </span>
                        ) : (
                          <div className="flex flex-col gap-1">
                            <span className="text-gray-600 text-sm">{user.lastVisit}</span>
                            <button
                              type="button"
                              className="text-blue-500 text-sm font-medium hover:text-blue-400 text-left"
                            >
                              Resend Invite
                            </button>
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          type="button"
                          className="text-slate-500 hover:text-gray-800"
                        >
                          <img
                            src="https://c.animaapp.com/mkof8zon8iICvl/assets/icon-40.svg"
                            alt="Menu"
                            className="h-5 w-5"
                          />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="border-t border-zinc-200 px-4 py-3 flex items-center justify-between bg-white">
              <div className="text-sm text-gray-600">
                1 – 6 of 6
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
        ) : (
          <div className="flex items-center justify-center w-full h-full text-gray-500">
            <div className="text-center">
              <p className="text-lg font-medium mb-2">Teams View</p>
              <p className="text-sm">Teams content will appear here</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
