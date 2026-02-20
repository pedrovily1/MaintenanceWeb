import { Sidebar } from "@/sections/Sidebar";
import { MainContent } from "@/sections/MainContent";
import { Reporting } from "@/sections/Reporting";
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

import { useWorkOrderStore } from "@/store/useWorkOrderStore";

export const App = () => {
  const [currentView, setCurrentView] = useState<'workorders' | 'reporting' | 'assets' | 'messages' | 'categories' | 'parts' | 'procedures' | 'meters' | 'locations' | 'users' | 'vendors' | 'settings'>('workorders');
  const { ensureActiveRecurringInstances } = useWorkOrderStore();

  useEffect(() => {
    // Ensure active instances for recurring work orders on app load
    ensureActiveRecurringInstances();
  }, [ensureActiveRecurringInstances]);

  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#reporting') {
        setCurrentView('reporting');
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
    <div className="bg-[var(--bg)] text-[var(--text)] text-sm not-italic normal-nums font-normal accent-auto box-border caret-transparent block shrink-0 h-full tracking-[normal] leading-[16.8px] list-outside list-disc pointer-events-auto text-start indent-[0px] normal-case visible w-full border-separate font-system_ui">
      <div className="box-border caret-transparent shrink-0 h-full">
        <div className="box-border caret-transparent shrink-0"></div>
        <div className="bg-[var(--bg)] box-border caret-transparent flex flex-col shrink-0 h-full">
        <div className="box-border caret-transparent flex basis-[0%] grow">
          <Sidebar currentView={currentView} />
          <div className="flex basis-[0%] grow pt-3 overflow-hidden bg-[var(--panel-2)] bg-radial-gradient">
            {currentView === 'reporting' ? (
              <Reporting />
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
        </div>
        <div className="box-border caret-transparent shrink-0"></div>
      </div>
    </div>
  );
};
