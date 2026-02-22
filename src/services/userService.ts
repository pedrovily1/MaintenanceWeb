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
  return data as User[];
}
