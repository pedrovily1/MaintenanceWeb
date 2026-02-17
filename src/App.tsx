import { Sidebar } from "@/sections/Sidebar";
import { MainContent } from "@/sections/MainContent";
import { Reporting } from "@/sections/Reporting";
import { Requests } from "@/sections/Requests";
import { Assets } from "@/sections/Assets";
import { Messages } from "@/sections/Messages";
import { Categories } from "@/sections/Categories";
import { useState, useEffect } from "react";
import { Parts } from "@/sections/Parts";
import { Procedures } from "@/sections/Procedures";
import { Meters } from "@/sections/Meters";
import { Locations } from "@/sections/Locations";
import { Users } from "@/sections/Users";
import { Vendors } from "@/sections/Vendors";
import { Settings } from "@/sections/Settings";

export const App = () => {
  const [currentView, setCurrentView] = useState<'workorders' | 'reporting' | 'requests' | 'assets' | 'messages' | 'categories' | 'parts' | 'procedures' | 'meters' | 'locations' | 'users' | 'vendors' | 'settings'>('workorders');

  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#reporting') {
        setCurrentView('reporting');
      } else if (window.location.hash === '#requests') {
        setCurrentView('requests');
      } else if (window.location.hash === '#assets') {
        setCurrentView('assets');
      } else if (window.location.hash === '#messages') {
        setCurrentView('messages');
      } else if (window.location.hash === '#categories') {
        setCurrentView('categories');
      } else if (window.location.hash === '#parts') {
        setCurrentView('parts');
      } else if (window.location.hash === '#procedures') {
        setCurrentView('procedures');
      } else if (window.location.hash === '#meters') {
        setCurrentView('meters');
      } else if (window.location.hash === '#locations') {
        setCurrentView('locations');
      } else if (window.location.hash === '#users') {
        setCurrentView('users');
      } else if (window.location.hash === '#vendors') {
        setCurrentView('vendors');
      } else if (window.location.hash === '#settings') {
        setCurrentView('settings');
      } else {
        setCurrentView('workorders');
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return (
    <body className="text-neutral-800 text-sm not-italic normal-nums font-normal accent-auto box-border caret-transparent block shrink-0 h-full tracking-[normal] leading-[16.8px] list-outside list-disc pointer-events-auto text-start indent-[0px] normal-case visible w-full border-separate font-system_ui">
      <div className="box-border caret-transparent shrink-0 h-full">
        <div className="box-border caret-transparent shrink-0"></div>
        <div className="bg-white box-border caret-transparent flex flex-col shrink-0 h-full">
        <div className="box-border caret-transparent flex basis-[0%] grow">
          <Sidebar currentView={currentView} />
          {currentView === 'reporting' ? (
            <Reporting />
          ) : currentView === 'requests' ? (
            <Requests />
          ) : currentView === 'assets' ? (
            <Assets />
          ) : currentView === 'messages' ? (
            <Messages />
          ) : currentView === 'categories' ? (
            <Categories />
          ) : currentView === 'parts' ? (
            <Parts />
          ) : currentView === 'procedures' ? (
            <Procedures />
          ) : currentView === 'meters' ? (
            <Meters />
          ) : currentView === 'locations' ? (
            <Locations />
          ) : currentView === 'users' ? (
            <Users />
          ) : currentView === 'vendors' ? (
            <Vendors />
          ) : currentView === 'settings' ? (
            <Settings />
          ) : (
            <MainContent />
          )}
        </div>
        </div>
        <div className="box-border caret-transparent shrink-0"></div>
      </div>
      <div className="box-border caret-transparent shrink-0"></div>
      <div className="box-border caret-transparent shrink-0">
        <div className="box-border caret-transparent shrink-0">
          <div className="fixed items-center box-border caret-transparent gap-x-3 flex flex-col shrink-0 gap-y-3 z-[9999] left-2/4 top-0"></div>
        </div>
      </div>
      <iframe
        title="No content"
        role="presentation"
        src="cid://frame-DB9F8AD841EB32118541EAF47ABFA3F1@mhtml.blink"
        className="absolute box-border caret-transparent shrink-0 h-0 top-[-9999px] w-0"
      ></iframe>
      <div className="box-border caret-transparent shrink-0">
        <iframe className="box-border caret-transparent hidden shrink-0 border-zinc-100"></iframe>
      </div>
      <div className="box-border caret-transparent shrink-0">
        <div className="box-border caret-transparent shrink-0"></div>
        <div className="box-border caret-transparent shrink-0"></div>
      </div>
      <div className="fixed box-border caret-transparent shrink-0 h-0 w-0 z-[2147483001] font-system_ui"></div>
      <div className="box-border caret-transparent shrink-0">
        <div className="fixed caret-transparent z-[2147483647] left-0 top-0">
          <div className="fixed bg-indigo-600/90 caret-transparent hidden pointer-events-none w-80 z-[999999] left-[599.398px] top-64">
            <div className="text-white text-base caret-transparent leading-10 pointer-events-auto text-center">
              [cssPicker] click me and inspect iframe
            </div>
          </div>
          <div className="fixed bg-indigo-600/90 caret-transparent hidden pointer-events-none w-80 z-[999999] left-0 top-0">
            <div className="text-white text-base caret-transparent leading-10 pointer-events-auto text-center">
              [cssPicker] click and exit iframe
            </div>
          </div>
          <div className="fixed caret-transparent h-[861px] pointer-events-none w-[1512px] z-[99999]">
            <div className="absolute caret-transparent h-[604px] w-[516.602px] border border-red-600 rounded-bl rounded-br rounded-tl rounded-tr border-solid left-[599.398px] top-64"></div>
          </div>
        </div>
      </div>
    </body>
  );
};
