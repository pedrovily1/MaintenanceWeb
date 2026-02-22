import { supabase } from "@/lib/supabase";
import { WorkOrder } from "@/types/workOrder";

export async function fetchWorkOrders(siteId: string): Promise<WorkOrder[]> {
  const { data, error } = await supabase
    .from("work_orders")
    .select("*")
    .eq("site_id", siteId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching work orders:", error);
    return [];
  }
  return data as WorkOrder[];
}
