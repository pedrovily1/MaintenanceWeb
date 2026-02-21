import { useEffect, useState } from "react";
import { Sidebar } from "@/sections/Sidebar";
import { MainContent } from "@/sections/MainContent";
import { Login } from "@/sections/Login";
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
import { supabase } from "@/lib/supabase";


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
  const [isAuthed, setIsAuthed] = useState(false);

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange(
        (_event, session) => {
          setIsAuthed(!!session);
        }
    );

    supabase.auth.getSession().then(({ data }) => {
      setIsAuthed(!!data.session);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  /*useEffect(() => {
     Sync auth state if localStorage changes (e.g. from other tabs or our own Login/Logout)
    const checkAuth = () => {
      setIsAuthed(localStorage.getItem("omp-auth") === "true");
    };
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);
*/

  useEffect(() => {
    if (isAuthed) {
      ensureActiveRecurringInstances();
    }
  }, [ensureActiveRecurringInstances, isAuthed]);

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

  if (!isAuthed) {
    return <Login />;
  }

  return (
      <div className="flex h-screen w-full overflow-hidden bg-[var(--bg)] text-[var(--text)]">
        <Sidebar currentView={currentView} />

        <main className="flex min-w-0 flex-1 overflow-hidden bg-[var(--panel-2)] bg-radial-gradient">
          {renderView()}
        </main>
      </div>
  );
};