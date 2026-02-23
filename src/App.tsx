import { useEffect, useState, useCallback, useRef } from "react";
import { Sidebar } from "@/sections/Sidebar";
import { MainContent } from "@/sections/MainContent";
import { Login } from "@/sections/Login";
import { SetPasswordScreen } from "@/sections/SetPasswordScreen";
import { NoSiteScreen } from "@/sections/NoSiteScreen";
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
  const [isSettingPassword, setIsSettingPassword] = useState(false);
  const [hasNoSite, setHasNoSite] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

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
  const { setActiveSiteId, setActiveUserId, setIsBootstrapping, setUserSites } = useSiteStore();

  const resolveSiteAndLoadData = useCallback(async (userId: string) => {
    console.log("[App] resolveSiteAndLoadData called for user:", userId);
    setIsBootstrapping(true);
    setCurrentUserId(userId);
    setHasNoSite(false);
    try {
      setActiveUserId(userId);

      const { data, error } = await supabase
          .from("user_sites")
          .select(`
            site_id,
            sites (
              name
            )
          `)
          .eq("user_id", userId);

      console.log("[App] user_sites query result:", { data, error });

      if (error) {
        console.error("[App] Error resolving site:", error);
        return;
      }

      if (data && data.length > 0) {
        setUserSites(data as any);
        const primarySite = data[0];
        const siteName = (primarySite.sites as any)?.name || "Unknown Site";
        console.log("[App] Resolved primary site:", primarySite.site_id, siteName);
        setActiveSiteId(primarySite.site_id, siteName);
        setHasNoSite(false);

        console.log("[App] Loading all store data for site:", primarySite.site_id);
        await Promise.all([
          loadWorkOrders(primarySite.site_id),
          loadLocations(primarySite.site_id),
          loadAssets(primarySite.site_id),
          loadParts(primarySite.site_id),
          loadCategories(primarySite.site_id),
          loadUsers(primarySite.site_id),
          loadProcedures(primarySite.site_id),
          loadVendors(primarySite.site_id),
          loadMeters(primarySite.site_id),
        ]);
        console.log("[App] All store data loaded successfully");
      } else {
        console.warn("[App] No site found for user:", userId);
        setActiveSiteId(null);
        setUserSites([]);
        setHasNoSite(true);
      }
    } catch (err) {
      console.error("[App] Failed to resolve site and load data:", err);
    } finally {
      setIsBootstrapping(false);
      console.log("[App] Bootstrap finished, isBootstrapping set to false");
    }
  }, [setActiveSiteId, setActiveUserId, setIsBootstrapping, setUserSites, loadWorkOrders, loadLocations, loadAssets, loadParts, loadCategories, loadUsers, loadProcedures, loadVendors, loadMeters]);

  // Keep a stable ref to the latest resolveSiteAndLoadData
  const resolveSiteAndLoadDataRef = useRef(resolveSiteAndLoadData);
  resolveSiteAndLoadDataRef.current = resolveSiteAndLoadData;

  // Stable auth subscription — no deps, never tears down and re-subscribes
  useEffect(() => {
    console.log("[App] Setting up auth subscription (once)");

    const { data: subscription } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          console.log("[App] Auth event:", event, "| session:", !!session, "| hasBootstrapped:", hasBootstrapped.current);

          if (event === "TOKEN_REFRESHED") {
            console.log("[App] Token refreshed — skipping");
            return;
          }

          // Handle recovery — show set password screen (step 2 directly, already has session)
          if (event === "PASSWORD_RECOVERY") {
            console.log("[App] PASSWORD_RECOVERY event — showing set password screen");
            window.history.replaceState(null, "", window.location.pathname);
            setIsSettingPassword(true);
            setIsAuthed(true);
            setAuthChecked(true);
            return;
          }

          // Normal auth flow — SIGNED_IN from login or OTP verify, INITIAL_SESSION on reload
          setIsAuthed(!!session);
          setAuthChecked(true);

          if (!session?.user) {
            console.log("[App] No session — resetting state");
            hasBootstrapped.current = false;
            setActiveSiteId(null);
            setActiveUserId(null);
            setIsBootstrapping(false);
            setHasNoSite(false);
            setCurrentUserId(null);
            return;
          }

          if (event === "INITIAL_SESSION" || event === "SIGNED_IN") {
            if (!hasBootstrapped.current) {
              console.log("[App] Bootstrapping for user:", session.user.id);
              hasBootstrapped.current = true;
              // Defer — don't block the auth callback
              setTimeout(() => {
                resolveSiteAndLoadDataRef.current(session.user.id);
              }, 0);
            } else {
              console.log("[App] Already bootstrapped — skipping");
            }
          }
        }
    );

    return () => {
      console.log("[App] Tearing down auth subscription");
      subscription.subscription.unsubscribe();
    };
  }, []);

  // Hash-based routing
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;

      // Ignore Supabase auth callback hashes entirely
      if (
          hash.includes("access_token") ||
          hash.includes("type=recovery") ||
          hash.includes("type=invite") ||
          hash.includes("error=") ||
          hash.includes("error_code=")
      ) {
        console.log("[App] Ignoring auth-related URL hash");
        return;
      }

      const view = hash.replace("#", "") as View;
      const validViews: View[] = [
        "workorders", "reporting", "assets", "categories", "parts",
        "procedures", "meters", "locations", "users", "vendors", "settings",
      ];
      setCurrentView(validViews.includes(view) ? view : "workorders");
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

  console.log("[App] Render — authChecked:", authChecked, "| isAuthed:", isAuthed, "| isSettingPassword:", isSettingPassword, "| hasNoSite:", hasNoSite, "| currentView:", currentView);

  if (!authChecked) {
    return null;
  }

  if (isSettingPassword) {
    return <SetPasswordScreen onComplete={() => {
      setIsSettingPassword(false);
      // After password is set, bootstrap the app
      const bootstrapAfterPasswordSet = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user && !hasBootstrapped.current) {
          hasBootstrapped.current = true;
          setTimeout(() => {
            resolveSiteAndLoadDataRef.current(session.user.id);
          }, 0);
        }
      };
      void bootstrapAfterPasswordSet();
    }} />;
  }

  if (!isAuthed) {
    return <Login onSetPassword={() => setIsSettingPassword(true)} />;
  }

  // User is authed but has no site assigned — show request screen
  if (hasNoSite && currentUserId) {
    return <NoSiteScreen userId={currentUserId} />;
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