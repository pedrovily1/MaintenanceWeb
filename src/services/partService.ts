import { supabase } from "@/lib/supabase";
import { Part } from "@/types/part";

export async function fetchParts(siteId: string): Promise<Part[]> {
  const { data, error } = await supabase
      .from("parts")
      .select(`*, part_inventory(*, locations(name))`)
      .eq("site_id", siteId)
      .order("name", { ascending: true });

  if (error) {
    console.error("Error fetching parts:", error);
    return [];
  }

  return (data || []).map((row: any) => ({
    id: row.id,
    name: row.name,
    description: row.description || '',
    partType: row.part_type,
    unit: row.unit || '',
    minStock: row.min_stock || 0,
    imageUrl: row.image_url || '',
    barcode: row.barcode || '',
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    compatibleAssetIds: [],
    inventory: (row.part_inventory || []).map((inv: any) => ({
      locationId: inv.location_id,
      locationName: inv.locations?.name || '',
      quantity: inv.quantity,
      minQuantity: inv.min_quantity || 0,
    })),
  }));
}