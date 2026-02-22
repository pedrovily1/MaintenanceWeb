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

  return (data || []).map((row: any) => ({
    id: row.id,
    name: row.name,
    icon: row.icon_svg,
    color: row.color,
    description: row.description,
    isActive: row.is_active,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    createdByUserId: row.created_by_user_id,
    updatedByUserId: row.updated_by_user_id,
  }));
}