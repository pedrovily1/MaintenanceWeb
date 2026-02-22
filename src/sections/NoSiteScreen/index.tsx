import React, { useEffect, useState } from "react";
import { Building2, Clock, CheckCircle, XCircle, Send } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface NoSiteScreenProps {
    userId: string;
}

interface Site {
    id: string;
    name: string;
    address: string | null;
}

interface SiteRequest {
    id: string;
    site_id: string;
    status: string;
    requested_at: string;
    site_name?: string;
}

export const NoSiteScreen: React.FC<NoSiteScreenProps> = ({ userId }) => {
    const [sites, setSites] = useState<Site[]>([]);
    const [existingRequests, setExistingRequests] = useState<SiteRequest[]>([]);
    const [selectedSiteId, setSelectedSiteId] = useState<string>("");
    const [selectedRole, setSelectedRole] = useState<string>("Technician");
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                // Load available sites
                const { data: sitesData, error: sitesError } = await supabase
                    .from("sites")
                    .select("id, name, address")
                    .order("name");

                if (sitesError) {
                    console.error("[NoSite] Error loading sites:", sitesError);
                } else {
                    setSites(sitesData || []);
                }

                // Load existing requests for this user
                const { data: requestsData, error: requestsError } = await supabase
                    .from("site_requests")
                    .select("id, site_id, status, requested_at")
                    .eq("user_id", userId);

                if (requestsError) {
                    console.error("[NoSite] Error loading requests:", requestsError);
                } else {
                    // Enrich with site names
                    const enriched = (requestsData || []).map((r) => ({
                        ...r,
                        site_name: sitesData?.find((s) => s.id === r.site_id)?.name || "Unknown",
                    }));
                    setExistingRequests(enriched);
                }
            } catch (err) {
                console.error("[NoSite] Failed to load data:", err);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [userId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!selectedSiteId) {
            setError("Please select a site");
            return;
        }

        // Check if already requested
        const alreadyRequested = existingRequests.some(
            (r) => r.site_id === selectedSiteId && r.status === "pending"
        );
        if (alreadyRequested) {
            setError("You already have a pending request for this site");
            return;
        }

        setSubmitting(true);

        try {
            const { error: insertError } = await supabase
                .from("site_requests")
                .insert({
                    user_id: userId,
                    site_id: selectedSiteId,
                    requested_role: selectedRole,
                });

            if (insertError) {
                if (insertError.code === "23505") {
                    setError("You already have a request for this site");
                } else {
                    throw insertError;
                }
            } else {
                setSuccess(true);
                // Refresh requests
                const siteName = sites.find((s) => s.id === selectedSiteId)?.name || "Unknown";
                setExistingRequests((prev) => [
                    ...prev,
                    {
                        id: crypto.randomUUID(),
                        site_id: selectedSiteId,
                        status: "pending",
                        requested_at: new Date().toISOString(),
                        site_name: siteName,
                    },
                ]);
                setSelectedSiteId("");
            }
        } catch (err: any) {
            console.error("[NoSite] Error submitting request:", err);
            setError(err.message || "Failed to submit request");
        } finally {
            setSubmitting(false);
        }
    };

    const handleSignOut = async () => {
        await supabase.auth.signOut();
    };

    const pendingRequests = existingRequests.filter((r) => r.status === "pending");
    const approvedRequests = existingRequests.filter((r) => r.status === "approved");
    const deniedRequests = existingRequests.filter((r) => r.status === "denied");

    // Sites that don't already have a pending request
    const availableSites = sites.filter(
        (s) => !existingRequests.some((r) => r.site_id === s.id && r.status === "pending")
    );

    return (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-[#0B0F14] overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-[#111826] to-[#0B0F14] z-0" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[120px] z-0 pointer-events-none" />

            <div className="relative z-10 mb-8 flex flex-col items-center">
                <div className="relative translate-x-16">
                    <div className="absolute inset-0 bg-blue-400/20 blur-xl rounded-full" />
                    <img src="/logo.svg" alt="OMP Logo" className="h-20 w-90 relative z-5" />
                </div>
            </div>

            <div className="relative z-10 w-full max-w-[440px] bg-[#111826] border border-white/10 rounded-lg shadow-2xl p-8 mx-4">
                <div className="flex items-center gap-3 mb-2">
                    <Building2 className="h-6 w-6 text-[#2F6BFF]" />
                    <h2 className="text-xl font-semibold text-white">Request Site Access</h2>
                </div>
                <p className="text-sm text-[#9AA4B2] mb-6">
                    Your account is set up. Select a site to request access — an admin will review your request.
                </p>

                {loading ? (
                    <div className="text-center py-8 text-[#9AA4B2]">Loading sites...</div>
                ) : (
                    <>
                        {/* Existing requests */}
                        {existingRequests.length > 0 && (
                            <div className="mb-6 space-y-2">
                                <h3 className="text-xs text-[#9AA4B2] uppercase font-semibold mb-2">Your Requests</h3>
                                {pendingRequests.map((r) => (
                                    <div key={r.id} className="flex items-center gap-3 bg-yellow-500/5 border border-yellow-500/20 rounded px-3 py-2">
                                        <Clock className="h-4 w-4 text-yellow-400 shrink-0" />
                                        <span className="text-sm text-[#E6EAF2] flex-1">{r.site_name}</span>
                                        <span className="text-xs text-yellow-400 font-medium">Pending</span>
                                    </div>
                                ))}
                                {approvedRequests.map((r) => (
                                    <div key={r.id} className="flex items-center gap-3 bg-green-500/5 border border-green-500/20 rounded px-3 py-2">
                                        <CheckCircle className="h-4 w-4 text-green-400 shrink-0" />
                                        <span className="text-sm text-[#E6EAF2] flex-1">{r.site_name}</span>
                                        <span className="text-xs text-green-400 font-medium">Approved</span>
                                    </div>
                                ))}
                                {deniedRequests.map((r) => (
                                    <div key={r.id} className="flex items-center gap-3 bg-red-500/5 border border-red-500/20 rounded px-3 py-2">
                                        <XCircle className="h-4 w-4 text-red-400 shrink-0" />
                                        <span className="text-sm text-[#E6EAF2] flex-1">{r.site_name}</span>
                                        <span className="text-xs text-red-400 font-medium">Denied</span>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Request form */}
                        {availableSites.length > 0 ? (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                {error && (
                                    <div className="text-red-500 text-sm bg-red-500/10 border border-red-500/20 px-3 py-2 rounded">
                                        {error}
                                    </div>
                                )}

                                {success && (
                                    <div className="text-green-400 text-sm bg-green-500/10 border border-green-500/20 px-3 py-2 rounded">
                                        Request submitted! An administrator will review it shortly.
                                    </div>
                                )}

                                <div>
                                    <label className="text-xs text-[#9AA4B2] uppercase font-semibold block mb-1">Site</label>
                                    <select
                                        value={selectedSiteId}
                                        onChange={(e) => setSelectedSiteId(e.target.value)}
                                        className="w-full bg-[#0B0F14] border border-white/10 rounded px-3 py-3 text-[#E6EAF2] focus:outline-none focus:border-[#2F6BFF] transition-colors"
                                        required
                                    >
                                        <option value="">Select a site...</option>
                                        {availableSites.map((site) => (
                                            <option key={site.id} value={site.id}>
                                                {site.name}{site.address ? ` — ${site.address}` : ""}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="text-xs text-[#9AA4B2] uppercase font-semibold block mb-1">Role</label>
                                    <select
                                        value={selectedRole}
                                        onChange={(e) => setSelectedRole(e.target.value)}
                                        className="w-full bg-[#0B0F14] border border-white/10 rounded px-3 py-3 text-[#E6EAF2] focus:outline-none focus:border-[#2F6BFF] transition-colors"
                                    >
                                        <option value="Technician">Technician</option>
                                        <option value="Viewer">Viewer</option>
                                        <option value="Administrator">Administrator</option>
                                    </select>
                                </div>

                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full bg-[#2F6BFF] hover:bg-[#4d82ff] text-white font-bold py-3 rounded transition-all shadow-lg shadow-blue-500/20 active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-2"
                                >
                                    <Send className="h-4 w-4" />
                                    {submitting ? "Submitting..." : "Request Access"}
                                </button>
                            </form>
                        ) : (
                            <div className="text-center py-4">
                                {pendingRequests.length > 0 ? (
                                    <p className="text-sm text-[#9AA4B2]">
                                        Your request is pending. You'll get access once an admin approves it. Refresh the page to check.
                                    </p>
                                ) : (
                                    <p className="text-sm text-[#9AA4B2]">
                                        No sites available to request. Contact your administrator.
                                    </p>
                                )}
                            </div>
                        )}
                    </>
                )}

                <div className="mt-6 pt-6 border-t border-white/5 text-center">
                    <button
                        type="button"
                        onClick={handleSignOut}
                        className="text-sm text-[#9AA4B2] hover:text-[#E6EAF2] transition-colors"
                    >
                        Sign out
                    </button>
                </div>
            </div>

            <p className="relative z-10 mt-12 text-[10px] text-[#9AA4B2]/50">
                &copy; {new Date().getFullYear()} OMP. All rights reserved.
            </p>
        </div>
    );
};