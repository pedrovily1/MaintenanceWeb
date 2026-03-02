import { supabase } from "@/lib/supabase";
import { Asset, AssetStatus } from "@/types/asset";

function normalizeStatus(raw: any): AssetStatus {
  const s = (raw ?? "").toString().toLowerCase().trim();
  if (s === "inactive") return "Inactive";
  if (s.includes("service")) return "Out of Service";
  if (s === "active") return "Active";
  return "Active";
}

export function mapRow(row: any): Asset {
  return {
    id: row.id,
    name: row.name,
    description: row.description ?? undefined,
    status: normalizeStatus(row.status),
    criticality: row.criticality ?? undefined,
    assetTag: row.asset_tag ?? undefined,
    locationId: row.location_id ?? undefined,
    locationName: (row.location as { name?: string } | null)?.name ?? undefined,
    parentAssetId: row.parent_asset_id ?? undefined,
    category: row.category ?? undefined,
    manufacturer: row.manufacturer ?? undefined,
    model: row.model ?? undefined,
    serialNumber: row.serial_number ?? undefined,
    installDate: row.install_date ?? undefined,
    warrantyEnd: row.warranty_end ?? undefined,
    imageUrl: row.image_url ?? undefined,
    notes: row.notes ?? undefined,
    attachments: row.attachments ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function fetchAssets(siteId: string): Promise<Asset[]> {
  const { data, error } = await supabase
    .from("assets")
    .select("*, location:locations(name)")
    .eq("site_id", siteId)
    .order("name", { ascending: true });

  if (error) {
    console.error("Error fetching assets:", error);
    return [];
  }
  return (data ?? []).map(mapRow);
}
