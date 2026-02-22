import { supabase } from "@/lib/supabase";
import { Part } from "@/types/part";

export async function fetchParts(siteId: string): Promise<Part[]> {
  const { data, error } = await supabase
    .from("parts")
    .select("*")
    .eq("site_id", siteId)
    .order("name", { ascending: true });

  if (error) {
    console.error("Error fetching parts:", error);
    return [];
  }
  return data as Part[];
}
