import { useState, useMemo, useEffect } from "react";
import { MapPin, Building2, Plus } from "lucide-react";
import { T, inner, card } from "@/lib/tokens";
import { useLocationStore } from "@/store/useLocationStore";
import { useAssetStore } from "@/store/useAssetStore";
import { LocationList } from "./components/LocationList";
import { LocationDetail } from "./components/LocationDetail";
import { LocationEditorModal } from "./components/LocationEditorModal";

/* ── KPI stat card ──────────────────────────────────────────── */
const KpiCard = ({
  value, label, color, icon,
}: { value: number; label: string; color: string; icon: string }) => (
  <div style={inner({ padding: "13px 16px" })}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
      <div>
        <div style={{
          fontSize: 28, fontWeight: 800, color,
          letterSpacing: "-0.04em", lineHeight: 1,
          fontVariantNumeric: "tabular-nums",
        }}>
          {value}
        </div>
        <div style={{ fontSize: 11, color: T.dim, marginTop: 4 }}>{label}</div>
      </div>
      <span style={{ fontSize: 16, opacity: 0.45 }}>{icon}</span>
    </div>
  </div>
);

/* ═══════════════════════ Main component ════════════════════════ */

export const Locations = () => {
  const [search, setSearch]             = useState("");
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null);
  const [showCreate, setShowCreate]     = useState(false);
  const [createParentId, setCreateParentId] = useState<string | null>(null);

  const { locations, addLocation } = useLocationStore();
  const { assets }                 = useAssetStore();

  /* ── listen for sub-location creation requests ── */
  useEffect(() => {
    const handler = (e: any) => {
      const parentId = e.detail?.parentLocationId;
      if (parentId) { setCreateParentId(parentId); setShowCreate(true); }
    };
    window.addEventListener("create-sub-location", handler as EventListener);
    return () => window.removeEventListener("create-sub-location", handler as EventListener);
  }, []);

  /* ── auto-select first location ── */
  useEffect(() => {
    if (!selectedLocationId && locations.length > 0) {
      const root = locations.find(l => !l.parentLocationId);
      setSelectedLocationId(root?.id ?? locations[0].id);
    }
  }, [locations]);

  /* ── enriched + filtered list ── */
  const enrichedLocations = useMemo(() => {
    return locations.map(loc => ({
      id:               loc.id,
      name:             loc.name,
      description:      loc.description || "",
      address:          loc.address || "",
      parentLocationId: loc.parentLocationId || null,
      subLocationsCount: locations.filter(l => l.parentLocationId === loc.id).length,
      assetsCount:      assets.filter(a => a.locationId === loc.id).length,
      assets:           assets.filter(a => a.locationId === loc.id)
                              .map(a => ({ id: a.id, name: a.name, imageUrl: "" })),
    }));
  }, [locations, assets]);

  const filteredLocations = useMemo(() => {
    if (!search.trim()) return enrichedLocations;
    const term = search.toLowerCase();
    return enrichedLocations.filter(l =>
      l.name.toLowerCase().includes(term) ||
      (l.address || "").toLowerCase().includes(term)
    );
  }, [enrichedLocations, search]);

  /* ── KPI stats ── */
  const rootCount    = locations.filter(l => !l.parentLocationId).length;
  const subCount     = locations.filter(l => !!l.parentLocationId).length;
  const withAssets   = enrichedLocations.filter(l => l.assetsCount > 0).length;

  /* ═══════════════════════ RENDER ════════════════════════════ */
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0 }}>

      {/* ── Page header ── */}
      <div style={{ padding: "20px 24px 0", flexShrink: 0 }}>
        <div style={{
          display: "flex", justifyContent: "space-between",
          alignItems: "flex-start", marginBottom: 16,
        }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: T.text, letterSpacing: "-0.03em", margin: 0 }}>
              Locations
            </h1>
            <p style={{ fontSize: 12.5, color: T.dim, fontWeight: 300, marginTop: 4, marginBottom: 0 }}>
              Manage facility locations and site hierarchy
            </p>
          </div>
          <button
            onClick={() => { setCreateParentId(null); setShowCreate(true); }}
            style={{
              background: "#1a2d4a", color: "#7aacf0",
              border: "1px solid rgba(59,130,246,0.28)",
              borderRadius: 12, padding: "10px 18px",
              fontSize: 13, fontWeight: 600, cursor: "pointer",
              fontFamily: "inherit", display: "flex", alignItems: "center", gap: 6,
            }}
          >
            <Plus size={14} />
            New Location
          </button>
        </div>

        {/* KPI row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 16 }}>
          <KpiCard value={locations.length} label="Total Locations" color={T.violet} icon="⌂" />
          <KpiCard value={rootCount}        label="Root Locations"  color={T.blue}   icon="▣" />
          <KpiCard value={subCount}         label="Sub-Locations"   color={T.muted}  icon="└" />
          <KpiCard value={withAssets}       label="With Assets"     color={T.green}  icon="◎" />
        </div>

        {/* Search bar */}
        <div style={{
          ...card({ borderRadius: 14, overflow: "visible" }),
          padding: "10px 14px", display: "flex", alignItems: "center", gap: 10,
          marginBottom: 0,
        }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 8,
            ...inner({ padding: "7px 13px", borderRadius: 10 }),
            flex: 1, maxWidth: 360,
          }}>
            <span style={{ color: T.dim, fontSize: 14 }}>⌕</span>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search locations…"
              style={{
                background: "none", border: "none", outline: "none",
                color: T.text, fontSize: 12.5, width: "100%", fontFamily: "inherit",
              }}
            />
            {search && (
              <span
                onClick={() => setSearch("")}
                style={{ color: T.dim, cursor: "pointer", fontSize: 13, lineHeight: 1 }}
              >
                ✕
              </span>
            )}
          </div>
          <span style={{ fontSize: 12, color: T.dim, fontWeight: 300 }}>
            {filteredLocations.length} of {locations.length} locations
          </span>
        </div>
      </div>

      {/* ── List + Detail ── */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden", padding: "12px 24px 20px", gap: 12 }}>
        <LocationList
          locations={filteredLocations}
          selectedLocationId={selectedLocationId}
          onSelectLocation={setSelectedLocationId}
        />
        <LocationDetail locationId={selectedLocationId} />
      </div>

      {/* ── Create modal ── */}
      {showCreate && (
        <LocationEditorModal
          initial={createParentId ? { parentLocationId: createParentId } : undefined}
          onClose={() => { setShowCreate(false); setCreateParentId(null); }}
          onSubmit={data => {
            const created = addLocation(data);
            setShowCreate(false);
            setCreateParentId(null);
            setSelectedLocationId(created.id);
          }}
        />
      )}
    </div>
  );
};
