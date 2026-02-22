import { useEffect, useState, useCallback } from "react";
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
import { useLocationStore } from "@/store/useLocationStore";
import { useAssetStore } from "@/store/useAssetStore";
import { usePartStore } from "@/store/usePartStore";
import { useCategoryStore } from "@/store/useCategoryStore";
import { useUserStore } from "@/store/useUserStore";
import { useSiteStore } from "@/store/useSiteStore";
import { useProcedureStore } from "@/store/useProcedureStore";
import { useVendorStore } from "@/store/useVendorStore";
import { useMeterStore } from "@/store/useMeterStore";
import { supabase } from "@/lib/supabase";
import { useBootstrapSession } from "@/hooks/useBootstrapSession";

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
  const [isAuthed, setIsAuthed] = useState(false);
  useBootstrapSession();

  const { loadWorkOrders } = useWorkOrderStore();
  const { loadLocations } = useLocationStore();
  const { loadAssets } = useAssetStore();
  const { loadParts } = usePartStore();
  const { loadCategories } = useCategoryStore();
  const { loadUsers } = useUserStore();
  const { loadProcedures } = useProcedureStore();
  const { loadVendors } = useVendorStore();
  const { loadMeters } = useMeterStore();
  const { setActiveSiteId, setActiveUserId, setIsBootstrapping } = useSiteStore();

  const resolveSiteAndLoadData = useCallback(async (userId: string) => {
    setIsBootstrapping(true);
    try {
      console.log("Resolving site for user:", userId);
      setActiveUserId(userId);

      const { data, error } = await supabase
          .from("user_sites")
          .select("site_id")
          .eq("user_id", userId)
          .limit(1)
          .maybeSingle();

      console.log('[user_sites] query result:', { data, error });

      if (error) {
        console.error("Error resolving site:", error);
        return;
      }

      if (data?.site_id) {
        console.log("Resolved site ID:", data.site_id);
        setActiveSiteId(data.site_id);
        console.log('[App] Bootstrap complete:', { activeUserId: userId, activeSiteId: data.site_id });

        loadWorkOrders(data.site_id);
        loadLocations(data.site_id);
        loadAssets(data.site_id);
        loadParts(data.site_id);
        loadCategories(data.site_id);
        loadUsers(data.site_id);
        loadProcedures(data.site_id);
        loadVendors(data.site_id);
        loadMeters(data.site_id);
      } else {
        console.warn("No site found for user:", userId);
        setActiveSiteId(null);
      }
    } catch (err) {
      console.error("Failed to resolve site and load data:", err);
    } finally {
      setIsBootstrapping(false);
    }
  }, [setActiveSiteId, setActiveUserId, setIsBootstrapping, loadWorkOrders, loadLocations, loadAssets, loadParts, loadCategories, loadUsers, loadProcedures, loadVendors, loadMeters]);

  useEffect(() => {
    const { data: subscription } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          if (event === 'TOKEN_REFRESHED') return;
          setIsAuthed(!!session);
          if (session?.user) {
            await resolveSiteAndLoadData(session.user.id);
          } else {
            setActiveSiteId(null);
            setActiveUserId(null);
            setIsBootstrapping(false);
          }
        }
    );

    supabase.auth.getSession().then(async ({ data }) => {
      const session = data.session;
      setIsAuthed(!!session);
      if (session?.user) {
        await resolveSiteAndLoadData(session.user.id);
      } else {
        setIsBootstrapping(false);
      }
    });

    return () => {
      subscription.subscription.unsubscribe();
    };
  }, [resolveSiteAndLoadData]);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "") as View;
      const validViews: View[] = [
        "workorders", "reporting", "assets", "categories", "parts",
        "procedures", "meters", "locations", "users", "vendors", "settings",
      ];
      setCurrentView(validViews.includes(hash) ? hash : "workorders");
    };

    handleHashChange();
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const renderView = () => {
    switch (currentView) {
      case "reporting": return <Reporting />;
      case "assets": return <Assets />;
      case "categories": return <Categories />;
      case "parts": return <Parts />;
      case "procedures": return <Procedures />;
      case "meters": return <Meters />;
      case "locations": return <Locations />;
      case "users": return <Users />;
      case "vendors": return <Vendors />;
      case "settings": return <Settings />;
      case "workorders":
      default: return <MainContent />;
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
