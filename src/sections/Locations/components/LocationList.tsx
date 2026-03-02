import { useMemo } from "react";
import { MapPin, Building2 } from "lucide-react";
import { T, inner } from "@/lib/tokens";

type LocationRow = {
  id: string;
  name: string;
  address: string;
  parentLocationId: string | null;
  subLocationsCount: number;
};

type LocationListProps = {
  locations: LocationRow[];
  selectedLocationId: string | null;
  onSelectLocation: (id: string) => void;
};

type FlatNode = LocationRow & { depth: number };

export const LocationList = ({ locations, selectedLocationId, onSelectLocation }: LocationListProps) => {
  const flatTree = useMemo<FlatNode[]>(() => {
    const result: FlatNode[] = [];
    const build = (parentId: string | null, depth: number) => {
      const children = locations.filter(l =>
        parentId === null ? !l.parentLocationId : l.parentLocationId === parentId
      );
      for (const child of children) {
        result.push({ ...child, depth });
        build(child.id, depth + 1);
      }
    };
    build(null, 0);
    // search may break tree — fall back to flat
    if (result.length === 0 && locations.length > 0)
      return locations.map(l => ({ ...l, depth: 0 }));
    return result;
  }, [locations]);

  return (
    <div style={{
      ...inner({}),
      display: "flex", flexDirection: "column",
      width: "38%", minWidth: 240, maxWidth: 420,
      flexShrink: 0, overflow: "hidden", borderRadius: 16,
    }}>
      {/* column header */}
      <div style={{
        padding: "10px 16px",
        borderBottom: `1px solid ${T.border}`,
        fontSize: 10, fontWeight: 700, color: T.dim,
        textTransform: "uppercase", letterSpacing: "0.07em",
        flexShrink: 0,
      }}>
        {locations.length} location{locations.length !== 1 ? "s" : ""}
      </div>

      {/* scrollable list */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        {flatTree.length === 0 ? (
          <div style={{ padding: "40px 16px", textAlign: "center", color: T.dim, fontSize: 13 }}>
            No locations found
          </div>
        ) : flatTree.map(loc => {
          const isSelected = selectedLocationId === loc.id;
          const Icon = loc.depth === 0 ? Building2 : MapPin;
          const iconColor = isSelected ? T.blue : T.muted;
          return (
            <div
              key={loc.id}
              onClick={() => onSelectLocation(loc.id)}
              style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: `10px 16px 10px ${16 + loc.depth * 20}px`,
                borderBottom: `1px solid ${T.border}`,
                borderLeft: `3px solid ${isSelected ? T.blue : "transparent"}`,
                background: isSelected ? T.blueGlow : "transparent",
                cursor: "pointer", transition: "all 0.15s",
              }}
              onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = T.surface; }}
              onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = "transparent"; }}
            >
              {/* depth tree connector */}
              {loc.depth > 0 && (
                <span style={{ fontSize: 11, color: T.dim, marginLeft: -4, flexShrink: 0 }}>└</span>
              )}
              {/* icon box */}
              <div style={{
                width: 32, height: 32, borderRadius: 9, flexShrink: 0,
                background: isSelected ? T.blue + "20" : T.violet + "14",
                border: `1px solid ${isSelected ? T.blue + "44" : T.violet + "28"}`,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <Icon size={14} color={iconColor === T.muted ? T.violet : T.blue} />
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontSize: 13, fontWeight: isSelected ? 600 : 500,
                  color: isSelected ? T.blue : T.text,
                  overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                }}>
                  {loc.name}
                </div>
                <div style={{
                  fontSize: 11, color: T.dim, fontWeight: 300, marginTop: 1,
                  overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                }}>
                  {loc.address || (loc.subLocationsCount > 0
                    ? `${loc.subLocationsCount} sub-location${loc.subLocationsCount !== 1 ? "s" : ""}`
                    : "No address")}
                </div>
              </div>

              {isSelected && (
                <span style={{ fontSize: 13, color: T.blue, flexShrink: 0 }}>›</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
