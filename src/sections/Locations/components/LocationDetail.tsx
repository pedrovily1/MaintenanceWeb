import { useState } from "react";
import { MapPin, Building2, Cpu, ClipboardList, Pencil, Trash2, Plus } from "lucide-react";
import { T, inner } from "@/lib/tokens";
import { useLocationStore, getDescendantLocationIds } from "@/store/useLocationStore";
import { useAssetStore } from "@/store/useAssetStore";
import { useWorkOrderStore } from "@/store/useWorkOrderStore";
import { LocationEditorModal } from "./LocationEditorModal";

const SectionLabel = ({ children }: { children: string }) => (
  <div style={{
    fontSize: 10, fontWeight: 700, color: T.dim,
    textTransform: "uppercase", letterSpacing: "0.07em",
    marginBottom: 8,
  }}>
    {children}
  </div>
);

const HR = () => <div style={{ height: 1, background: T.border, margin: "16px 0" }} />;

const statusColor = (status: string) =>
  status === "Done" || status === "Completed" ? T.green :
  status === "In Progress" || status === "Ongoing" ? T.blue :
  status === "On Hold" ? T.amber : T.muted;

type LocationDetailProps = { locationId: string | null };

export const LocationDetail = ({ locationId }: LocationDetailProps) => {
  const { getLocationById, getChildLocations, deleteLocation, updateLocation } = useLocationStore();
  const { assets } = useAssetStore();
  const { workOrders } = useWorkOrderStore();
  const [showEdit, setShowEdit] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  /* ── empty state ── */
  if (!locationId) {
    return (
      <div style={{
        flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
        color: T.dim, fontSize: 13,
        background: T.raised, border: `1px solid ${T.border}`,
        borderRadius: 16,
      }}>
        Select a location to view details
      </div>
    );
  }

  const location = getLocationById(locationId);
  if (!location) {
    return (
      <div style={{
        flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
        color: T.red, fontSize: 13,
        background: T.raised, border: `1px solid ${T.border}`,
        borderRadius: 16,
      }}>
        Location not found
      </div>
    );
  }

  const childLocations   = getChildLocations(locationId);
  const locationAssets   = assets.filter(a => a.locationId === locationId);
  const locationWorkOrders = workOrders.filter(wo => wo.locationId === locationId);

  const handleDelete = () => {
    setDeleteError(null);
    if (locationAssets.length > 0) {
      setDeleteError(`Cannot delete: ${locationAssets.length} asset(s) assigned here. Reassign first.`);
      return;
    }
    if (locationWorkOrders.length > 0) {
      setDeleteError(`Cannot delete: ${locationWorkOrders.length} work order(s) reference this location.`);
      return;
    }
    const result = deleteLocation(locationId);
    if (!result.ok) setDeleteError(result.reason || "Cannot delete this location.");
  };

  const handleCreateSubLocation = () => {
    window.dispatchEvent(new CustomEvent("create-sub-location", {
      detail: { parentLocationId: location.id },
    }));
  };

  return (
    <div style={{
      flex: 1, minWidth: 0, display: "flex", flexDirection: "column",
      background: T.raised, border: `1px solid ${T.border}`,
      borderRadius: 16, overflow: "hidden",
    }}>
      {/* ── Header ── */}
      <div style={{
        padding: "16px 20px",
        borderBottom: `1px solid ${T.border}`,
        flexShrink: 0,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          {/* location image or icon */}
          {location.imageUrl ? (
            <img
              src={location.imageUrl}
              alt={location.name}
              style={{ width: 48, height: 48, borderRadius: 12, objectFit: "cover", flexShrink: 0, border: `1px solid ${T.border}` }}
            />
          ) : (
            <div style={{
              width: 48, height: 48, borderRadius: 12, flexShrink: 0,
              background: T.violet + "18", border: `1px solid ${T.violet}28`,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <Building2 size={22} color={T.violet} />
            </div>
          )}

          <div style={{ flex: 1, minWidth: 0 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: T.text, margin: 0, letterSpacing: "-0.02em" }}>
              {location.name}
            </h3>
            {location.address && (
              <div style={{ fontSize: 11.5, color: T.dim, fontWeight: 300, marginTop: 2, display: "flex", alignItems: "center", gap: 4 }}>
                <MapPin size={11} color={T.dim} />
                {location.address}
              </div>
            )}
          </div>

          <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
            <button
              onClick={() => setShowEdit(true)}
              style={{
                background: T.blueGlow, color: T.blue,
                border: `1px solid ${T.blue}33`,
                borderRadius: 8, padding: "6px 12px",
                fontSize: 12, fontWeight: 600,
                cursor: "pointer", fontFamily: "inherit",
                display: "flex", alignItems: "center", gap: 5,
              }}
            >
              <Pencil size={12} />
              Edit
            </button>
            <button
              onClick={handleDelete}
              title="Delete location"
              style={{
                background: "transparent", color: T.dim,
                border: `1px solid ${T.border}`,
                borderRadius: 8, padding: "6px 9px",
                fontSize: 12, cursor: "pointer", fontFamily: "inherit",
                display: "flex", alignItems: "center",
              }}
              onMouseEnter={e => { e.currentTarget.style.color = T.red; e.currentTarget.style.borderColor = T.red + "44"; }}
              onMouseLeave={e => { e.currentTarget.style.color = T.dim; e.currentTarget.style.borderColor = T.border; }}
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>

        {/* delete error */}
        {deleteError && (
          <div style={{
            marginTop: 10, padding: "8px 12px",
            background: T.red + "18", border: `1px solid ${T.red}33`,
            borderRadius: 8, fontSize: 12, color: T.red,
          }}>
            {deleteError}
          </div>
        )}
      </div>

      {/* ── Scrollable content ── */}
      <div style={{ flex: 1, overflowY: "auto", padding: "18px 20px" }}>

        {/* Description */}
        {location.description && (
          <>
            <SectionLabel>Description</SectionLabel>
            <p style={{ fontSize: 13, color: T.muted, fontWeight: 300, margin: 0, lineHeight: 1.6 }}>
              {location.description}
            </p>
            <HR />
          </>
        )}

        {/* Sub-Locations */}
        <SectionLabel>Sub-Locations ({childLocations.length})</SectionLabel>
        {childLocations.length === 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <span style={{ fontSize: 12, color: T.dim, fontStyle: "italic" }}>No sub-locations yet</span>
            <button
              onClick={handleCreateSubLocation}
              style={{
                background: "transparent", color: T.blue,
                border: "none", padding: 0,
                fontSize: 12, fontWeight: 600, cursor: "pointer",
                fontFamily: "inherit", textAlign: "left",
                display: "flex", alignItems: "center", gap: 4,
              }}
            >
              <Plus size={12} /> Add sub-location
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            {childLocations.map(child => (
              <div key={child.id} style={{
                ...inner({ padding: "8px 12px" }),
                display: "flex", alignItems: "center", gap: 8,
              }}>
                <MapPin size={13} color={T.violet} style={{ flexShrink: 0 }} />
                <span style={{ fontSize: 12.5, fontWeight: 500, color: T.text }}>{child.name}</span>
              </div>
            ))}
          </div>
        )}

        <HR />

        {/* Assets */}
        <SectionLabel>Assets ({locationAssets.length})</SectionLabel>
        {locationAssets.length === 0 ? (
          <span style={{ fontSize: 12, color: T.dim, fontStyle: "italic" }}>No assets at this location</span>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            {locationAssets.map(asset => (
              <div key={asset.id} style={{
                ...inner({ padding: "8px 12px" }),
                display: "flex", alignItems: "center", gap: 8,
              }}>
                <Cpu size={13} color={T.green} style={{ flexShrink: 0 }} />
                <span style={{ fontSize: 12.5, fontWeight: 500, color: T.text, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {asset.name}
                </span>
              </div>
            ))}
          </div>
        )}

        <HR />

        {/* Work Orders */}
        <SectionLabel>Work Orders ({locationWorkOrders.length})</SectionLabel>
        {locationWorkOrders.length === 0 ? (
          <span style={{ fontSize: 12, color: T.dim, fontStyle: "italic" }}>No work orders at this location</span>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            {locationWorkOrders.slice(0, 5).map(wo => (
              <div key={wo.id} style={{
                ...inner({ padding: "8px 12px" }),
                display: "flex", alignItems: "center", gap: 8,
              }}>
                <ClipboardList size={13} color={T.blue} style={{ flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12.5, fontWeight: 500, color: T.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {wo.title}
                  </div>
                  <div style={{ fontSize: 10.5, color: T.dim, marginTop: 1 }}>{wo.workOrderNumber}</div>
                </div>
                <span style={{
                  fontSize: 10.5, fontWeight: 600,
                  color: statusColor(wo.status),
                  background: statusColor(wo.status) + "18",
                  border: `1px solid ${statusColor(wo.status)}28`,
                  borderRadius: 99, padding: "2px 7px",
                  whiteSpace: "nowrap", flexShrink: 0,
                }}>
                  {wo.status}
                </span>
              </div>
            ))}
            {locationWorkOrders.length > 5 && (
              <div style={{ fontSize: 11.5, color: T.dim, fontStyle: "italic", padding: "4px 0" }}>
                +{locationWorkOrders.length - 5} more
              </div>
            )}
          </div>
        )}

        <HR />

        {/* Metadata */}
        <div style={{ fontSize: 10.5, color: T.dim, fontStyle: "italic", lineHeight: 1.8 }}>
          <div>Created {new Date(location.createdAt).toLocaleString()}</div>
          <div>Updated {new Date(location.updatedAt).toLocaleString()}</div>
        </div>
      </div>

      {/* Edit modal */}
      {showEdit && (
        <LocationEditorModal
          initial={location}
          onClose={() => setShowEdit(false)}
          onSubmit={data => {
            updateLocation(locationId, data);
            setShowEdit(false);
          }}
        />
      )}
    </div>
  );
};
