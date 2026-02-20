import { useEffect, useState } from "react";
import { Sidebar } from "@/sections/Sidebar";
import { MainContent } from "@/sections/MainContent";
import { Reporting } from "@/sections/Reporting";
import { Assets } from "@/sections/Assets";
import { Categories } from "@/sections/Categories";
import { Parts } from "@/sections/Parts";
import { Procedures } from "@/sections/Procedures";
import { Meters } from "@/sections/Meters";
import { Locations } from "@/sections/Locations";
import { Users } from "@/sections/Users";
import { Vendors } from "@/sections/Vendors";
import { Settings } from "@/sections/Settings";
import { useWorkOrderStore } from "@/store/useWorkOrderStore";

type View =
    | "workorders"
    | "reporting"
    | "assets"
    | "categories"
    | "parts"
    | "procedures"
    | "meters"
    | "locations"
    | "users"
    | "vendors"
    | "settings";

export const App = () => {
  const [currentView, setCurrentView] = useState<View>("workorders");
  const { ensureActiveRecurringInstances } = useWorkOrderStore();

  useEffect(() => {
    ensureActiveRecurringInstances();
  }, [ensureActiveRecurringInstances]);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "") as View;

      const validViews: View[] = [
        "workorders",
        "reporting",
        "assets",
        "categories",
        "parts",
        "procedures",
        "meters",
        "locations",
        "users",
        "vendors",
        "settings",
      ];

      setCurrentView(validViews.includes(hash) ? hash : "workorders");
    };

    handleHashChange();
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const renderView = () => {
    switch (currentView) {
      case "reporting":
        return <Reporting />;
      case "assets":
        return <Assets />;
      case "categories":
        return <Categories />;
      case "parts":
        return <Parts />;
      case "procedures":
        return <Procedures />;
      case "meters":
        return <Meters />;
      case "locations":
        return <Locations />;
      case "users":
        return <Users />;
      case "vendors":
        return <Vendors />;
      case "settings":
        return <Settings />;
      case "workorders":
      default:
        return <MainContent />;
    }
  };

  return (
      <div className="flex h-screen w-full overflow-hidden bg-[var(--bg)] text-[var(--text)]">
        <Sidebar currentView={currentView} />

        <main className="flex min-w-0 flex-1 overflow-hidden bg-[var(--panel-2)] bg-radial-gradient">
          {renderView()}
        </main>
      </div>
  );
};