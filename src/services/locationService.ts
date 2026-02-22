import { supabase } from "@/lib/supabase";
import { Location } from "@/types/location";

export async function fetchLocations(siteId: string): Promise<Location[]> {
  const { data, error } = await supabase
    .from("locations")
    .select("*")
    .eq("site_id", siteId)
    .order("name", { ascending: true });

  if (error) {
    console.error("Error fetching locations:", error);
    return [];
  }
  return data as Location[];
}
