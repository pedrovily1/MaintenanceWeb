import { supabase } from "@/lib/supabase";
import { User } from "@/types/user";

export async function fetchUsers(siteId: string): Promise<User[]> {
  const { data, error } = await supabase
      .from("users")
      .select("*, user_sites!inner(site_id)")
      .eq("user_sites.site_id", siteId)
      .order("full_name", { ascending: true });

  if (error) {
    console.error("Error fetching users:", error);
    return [];
  }

  return (data || []).map((row: any) => ({
    id: row.id,
    fullName: row.full_name,
    email: row.email,
    role: row.role,
    pin: row.pin,
    isActive: row.is_active,
    imageUrl: row.image_url,
    createdAt: row.created_at,
    lastVisit: row.last_visit || null,
  }));
}