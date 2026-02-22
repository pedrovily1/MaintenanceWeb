import { supabase } from "@/lib/supabase";
import { Asset } from "@/types/asset";

export async function fetchAssets(siteId: string): Promise<Asset[]> {
  const { data, error } = await supabase
    .from("assets")
    .select("*")
    .eq("site_id", siteId)
    .order("name", { ascending: true });

  if (error) {
    console.error("Error fetching assets:", error);
    return [];
  }
  return data as Asset[];
}
