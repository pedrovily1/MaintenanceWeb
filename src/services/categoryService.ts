import { supabase } from "@/lib/supabase";
import { Category } from "@/types/category";

export async function fetchCategories(siteId: string): Promise<Category[]> {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("site_id", siteId)
    .order("name", { ascending: true });

  if (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
  return data as Category[];
}
