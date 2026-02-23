import { useSiteStore } from "@/store/useSiteStore";

export const SidebarLogo = () => {
    const { activeSiteName } = useSiteStore();
    return (
        <div className="flex items-center justify-center py-8 border-b w-full overflow-hidden">
            <img
                src="/logo.svg"
                alt={activeSiteName || "CWS - Slovakia"}
                className="h-auto object-contain scale-[1.5] translate-x-14"
            />
        </div>
    );
};
