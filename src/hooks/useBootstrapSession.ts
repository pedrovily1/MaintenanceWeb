import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useSiteStore } from "@/store/useSiteStore";
import { useWorkOrderStore } from "@/store/useWorkOrderStore";

export const useBootstrapSession = () => {
    const { setActiveUserId, setActiveSiteId } = useSiteStore();
    const { loadWorkOrders } = useWorkOrderStore();

    useEffect(() => {
        const bootstrap = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) return;

            const userId = session.user.id;
            setActiveUserId(userId);

            // get sites for this user
            const { data: sites, error } = await supabase
                .from("user_sites")
                .select("site_id")
                .eq("user_id", userId)
                .limit(1);

            if (error || !sites || sites.length === 0) {
                console.error("No site assigned to user");
                return;
            }

            const siteId = sites[0].site_id;
            setActiveSiteId(siteId);

            // now everything downstream works
            loadWorkOrders(siteId);
        };

        bootstrap();
    }, []);
};