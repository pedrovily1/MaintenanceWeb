import { useEffect, useState, useCallback, useRef } from "react";
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
  const [authChecked, setAuthChecked] = useState(false);

  const hasBootstrapped = useRef(false);

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
    console.log("[App] resolveSiteAndLoadData called for user:", userId);
    setIsBootstrapping(true);
    try {
      setActiveUserId(userId);

      const { data, error } = await supabase
          .from("user_sites")
          .select("site_id")
          .eq("user_id", userId)
          .limit(1)
          .maybeSingle();

      console.log("[App] user_sites query result:", { data, error });

      if (error) {
        console.error("[App] Error resolving site:", error);
        return;
      }

      if (data?.site_id) {
        console.log("[App] Resolved site ID:", data.site_id);
        setActiveSiteId(data.site_id);

        console.log("[App] Loading all store data for site:", data.site_id);
        await Promise.all([
          loadWorkOrders(data.site_id),
          loadLocations(data.site_id),
          loadAssets(data.site_id),
          loadParts(data.site_id),
          loadCategories(data.site_id),
          loadUsers(data.site_id),
          loadProcedures(data.site_id),
          loadVendors(data.site_id),
          loadMeters(data.site_id),
        ]);
        console.log("[App] All store data loaded successfully");
      } else {
        console.warn("[App] No site found for user:", userId);
        setActiveSiteId(null);
      }
    } catch (err) {
      console.error("[App] Failed to resolve site and load data:", err);
    } finally {
      setIsBootstrapping(false);
      console.log("[App] Bootstrap finished, isBootstrapping set to false");
    }
  }, [setActiveSiteId, setActiveUserId, setIsBootstrapping, loadWorkOrders, loadLocations, loadAssets, loadParts, loadCategories, loadUsers, loadProcedures, loadVendors, loadMeters]);

  // Keep a stable ref to the latest resolveSiteAndLoadData
  const resolveSiteAndLoadDataRef = useRef(resolveSiteAndLoadData);
  resolveSiteAndLoadDataRef.current = resolveSiteAndLoadData;

  // Stable subscription — no deps, never tears down and re-subscribes
  useEffect(() => {
    console.log("[App] Setting up auth subscription (once)");

    const { data: subscription } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          console.log("[App] Auth event:", event, "| session:", !!session, "| hasBootstrapped:", hasBootstrapped.current);

          if (event === "TOKEN_REFRESHED") {
            console.log("[App] Token refreshed — skipping");
            return;
          }

          setIsAuthed(!!session);
          setAuthChecked(true);

          if (!session?.user) {
            console.log("[App] No session — resetting state");
            hasBootstrapped.current = false;
            setActiveSiteId(null);
            setActiveUserId(null);
            setIsBootstrapping(false);
            return;
          }

          if (event === "INITIAL_SESSION" || event === "SIGNED_IN") {
            if (!hasBootstrapped.current) {
              hasBootstrapped.current = true;
              // Defer — don't block the auth callback
              setTimeout(() => {
                console.log("[App] Deferred bootstrap for user:", session.user.id);
                resolveSiteAndLoadDataRef.current(session.user.id);
              }, 0);
            }
          }
        }
    );

    return () => {
      console.log("[App] Tearing down auth subscription");
      subscription.subscription.unsubscribe();
    };
  }, []); // empty deps — stable subscription

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

  console.log("[App] Render — authChecked:", authChecked, "| isAuthed:", isAuthed, "| currentView:", currentView);

  if (!authChecked) {
    return null;
  }

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