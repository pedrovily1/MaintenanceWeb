import { useState, useEffect } from "react";
import { useUserStore } from "@/store/useUserStore";
import { useSiteStore } from "@/store/useSiteStore";
import { UserInviteModal } from "./components/UserInviteModal";
import { supabase } from "@/lib/supabase";

const ROLE_LABELS: Record<string, string> = {
  Administrator: 'Administrator',
  Technician: 'Technician',
  Viewer: 'Viewer',
  Manager: 'Manager',
  Admin: 'Admin',
};

const formatLastVisit = (isoString: string) => {
  if (!isoString) return 'Never';
  const date = new Date(isoString);
  const now = new Date();
  const d1 = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const d2 = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const diffInDays = Math.floor((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24));
  if (diffInDays === 0) return 'Today';
  if (diffInDays === 1) return 'Yesterday';
  return date.toLocaleDateString();
};

type PendingInvite = {
  id: string;
  email: string;
  full_name: string;
  role: string;
  requested_at: string;
  status: string;
};

type SiteRequest = {
  id: string;
  user_id: string;
  site_id: string;
  requested_role: string;
  status: string;
  requested_at: string;
  user_name: string;
};

export const Users = () => {
  const [activeTab, setActiveTab] = useState<'users' | 'pending' | 'site_requests'>('users');
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [pendingInvites, setPendingInvites] = useState<PendingInvite[]>([]);
  const [pendingLoading, setPendingLoading] = useState(false);
  const [siteRequests, setSiteRequests] = useState<SiteRequest[]>([]);
  const [siteRequestsLoading, setSiteRequestsLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const { allUsers } = useUserStore();
  const { activeSiteId } = useSiteStore();

  const loadPendingInvites = async () => {
    setPendingLoading(true);
    const { data, error } = await supabase
        .from('pending_invites')
        .select('*')
        .eq('status', 'pending')
        .order('requested_at', { ascending: false });
    if (!error) setPendingInvites(data || []);
    setPendingLoading(false);
  };

  const loadSiteRequests = async () => {
    if (!activeSiteId) return;
    setSiteRequestsLoading(true);
    try {
      const { data, error } = await supabase
          .from('site_requests')
          .select('id, user_id, site_id, requested_role, status, requested_at')
          .eq('site_id', activeSiteId)
          .eq('status', 'pending')
          .order('requested_at', { ascending: false });

      if (error) {
        console.error('[Users] Error loading site requests:', error);
        setSiteRequests([]);
        return;
      }

      // Enrich with user names from the users table
      const userIds = (data || []).map((r) => r.user_id);
      let userMap: Record<string, string> = {};

      if (userIds.length > 0) {
        const { data: usersData } = await supabase
            .from('users')
            .select('id, full_name')
            .in('id', userIds);

        if (usersData) {
          userMap = Object.fromEntries(usersData.map((u) => [u.id, u.full_name]));
        }
      }

      const enriched: SiteRequest[] = (data || []).map((r) => ({
        ...r,
        user_name: userMap[r.user_id] || 'Unknown User',
      }));

      setSiteRequests(enriched);
    } catch (err) {
      console.error('[Users] Failed to load site requests:', err);
    } finally {
      setSiteRequestsLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'pending') {
      loadPendingInvites().catch(console.error);
    } else if (activeTab === 'site_requests') {
      loadSiteRequests().catch(console.error);
    }
  }, [activeTab, activeSiteId]);

  const handleApprove = async (invite: PendingInvite) => {
    setActionLoading(invite.id);
    try {
      const { error: fnError } = await supabase.functions.invoke('clever-task', {
        body: {
          email: invite.email,
          full_name: invite.full_name,
          role: invite.role,
        }
      });

      if (fnError) throw fnError;

      await supabase
          .from('pending_invites')
          .update({ status: 'approved', reviewed_at: new Date().toISOString() })
          .eq('id', invite.id);

      setPendingInvites(prev => prev.filter(i => i.id !== invite.id));
      alert(`Invite email sent to ${invite.email}`);
    } catch (err: any) {
      console.error('Error approving invite:', err);
      alert(`Failed to send invite: ${err.message}`);
    }
    setActionLoading(null);
  };

  const handleReject = async (invite: PendingInvite) => {
    setActionLoading(invite.id);
    await supabase
        .from('pending_invites')
        .update({ status: 'rejected', reviewed_at: new Date().toISOString() })
        .eq('id', invite.id);
    setPendingInvites(prev => prev.filter(i => i.id !== invite.id));
    setActionLoading(null);
  };

  const handleApproveSiteRequest = async (request: SiteRequest) => {
    setActionLoading(request.id);
    try {
      // Insert into user_sites to grant access
      const { error: insertError } = await supabase
          .from('user_sites')
          .insert({
            user_id: request.user_id,
            site_id: request.site_id,
            site_role: request.requested_role,
          });

      if (insertError) {
        if (insertError.code === '23505') {
          // Already has access — just update the request status
          console.warn('[Users] User already has site access, updating request status');
        } else {
          throw insertError;
        }
      }

      // Update request status
      const { error: updateError } = await supabase
          .from('site_requests')
          .update({
            status: 'approved',
            reviewed_at: new Date().toISOString(),
            reviewed_by: (await supabase.auth.getUser()).data.user?.id,
          })
          .eq('id', request.id);

      if (updateError) {
        console.error('[Users] Error updating site request:', updateError);
      }

      setSiteRequests(prev => prev.filter(r => r.id !== request.id));
    } catch (err: any) {
      console.error('[Users] Error approving site request:', err);
      alert(`Failed to approve: ${err.message}`);
    }
    setActionLoading(null);
  };

  const handleDenySiteRequest = async (request: SiteRequest) => {
    setActionLoading(request.id);
    try {
      const { error } = await supabase
          .from('site_requests')
          .update({
            status: 'denied',
            reviewed_at: new Date().toISOString(),
            reviewed_by: (await supabase.auth.getUser()).data.user?.id,
          })
          .eq('id', request.id);

      if (error) {
        console.error('[Users] Error denying site request:', error);
      }

      setSiteRequests(prev => prev.filter(r => r.id !== request.id));
    } catch (err: any) {
      console.error('[Users] Error denying site request:', err);
      alert(`Failed to deny: ${err.message}`);
    }
    setActionLoading(null);
  };

  return (
      <div className="relative bg-[var(--panel-2)] box-border caret-transparent flex basis-[0%] flex-col grow overflow-auto">
        {/* Header */}
        <div className="bg-[var(--panel-2)] border-b border-[var(--border)] shadow-[inset_0_-1px_0_rgba(255,255,255,0.03)] box-border caret-transparent shrink-0 px-4 py-4">
          <div className="items-center box-border caret-transparent gap-x-4 flex basis-[0%] grow gap-y-4">
            <div className="items-center box-border caret-transparent gap-x-4 flex shrink-0 gap-y-4">
              <h2 className="text-[31.9998px] font-bold box-border caret-transparent shrink-0 tracking-[-0.2px] leading-[39.9997px]">
                Users
              </h2>
            </div>
            <div className="items-center box-border caret-transparent gap-x-4 flex basis-[0%] grow justify-end gap-y-4">
              <div className="box-border caret-transparent flex basis-[0%] grow max-w-[400px]">
                <form className="box-border caret-transparent basis-[0%] grow">
                  <input
                      type="search"
                      placeholder="Search Users"
                      className="bg-gray-50 box-border caret-transparent shrink-0 leading-5 min-h-10 -outline-offset-2 w-full border border-[var(--border)] pl-[30px] pr-2 py-2 rounded border-solid"
                  />
                </form>
              </div>
              <button
                  type="button"
                  onClick={() => setIsInviteModalOpen(true)}
                  className="relative text-white font-bold items-center bg-accent caret-transparent gap-x-1 flex shrink-0 h-10 justify-center tracking-[-0.2px] leading-[14px] gap-y-1 text-center text-nowrap border border-accent px-4 rounded-md border-solid hover:bg-accent-hover hover:border-accent-hover"
              >
              <span className="box-border caret-transparent flex shrink-0 text-nowrap">
                Create New User
              </span>
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 mt-3">
            <button
                type="button"
                onClick={() => setActiveTab('users')}
                className={`text-sm font-medium pb-2 border-b-2 transition-colors ${activeTab === 'users' ? 'border-accent text-accent' : 'border-transparent text-[var(--muted)] hover:text-[var(--text)]'}`}
            >
              All Users ({allUsers.length})
            </button>
            <button
                type="button"
                onClick={() => setActiveTab('pending')}
                className={`text-sm font-medium pb-2 border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'pending' ? 'border-accent text-accent' : 'border-transparent text-[var(--muted)] hover:text-[var(--text)]'}`}
            >
              Pending Invites
              {pendingInvites.length > 0 && (
                  <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                {pendingInvites.length}
              </span>
              )}
            </button>
            <button
                type="button"
                onClick={() => setActiveTab('site_requests')}
                className={`text-sm font-medium pb-2 border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'site_requests' ? 'border-accent text-accent' : 'border-transparent text-[var(--muted)] hover:text-[var(--text)]'}`}
            >
              Site Requests
              {siteRequests.length > 0 && (
                  <span className="bg-orange-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                {siteRequests.length}
              </span>
              )}
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="relative box-border caret-transparent flex basis-[0%] grow overflow-auto">
          <div className="bg-white shadow-[rgba(242,242,242,0.6)_0px_0px_12px_2px] box-border caret-transparent flex flex-col grow border border-[var(--border)] m-4 rounded border-solid overflow-hidden">

            {activeTab === 'users' ? (
                <>
                  <div className="relative box-border caret-transparent flex flex-col grow overflow-auto">
                    <table className="w-full">
                      <thead className="bg-white sticky top-0 z-10 border-b border-[var(--border)]">
                      <tr>
                        <th className="text-left text-[13px] font-medium text-[var(--muted)] px-4 py-3 opacity-[0.85]">Full Name</th>
                        <th className="text-left text-[13px] font-medium text-[var(--muted)] px-4 py-3 opacity-[0.85]">Role</th>
                        <th className="text-left text-[13px] font-medium text-[var(--muted)] px-4 py-3 opacity-[0.85]">Last Visit</th>
                        <th className="w-12"></th>
                      </tr>
                      </thead>
                      <tbody>
                      {allUsers.map((user) => (
                          <tr key={user.id} className={`border-b border-[var(--border)] hover:bg-[var(--panel-2)] transition-colors ${!user.isActive ? 'opacity-50' : ''} group`}>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-3">
                                <div
                                    className="items-center bg-white bg-cover box-border caret-transparent flex shrink-0 h-9 justify-center w-9 bg-center rounded-full"
                                    style={{ backgroundImage: `url('${(user as any).avatarUrl || 'https://app.getmaintainx.com/img/static/user_placeholders/RandomPicture4.png'}')` }}
                                />
                                <span className="font-normal text-[13px] text-[var(--text)]">{user.fullName}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-[13px] text-[var(--text)] opacity-90">{ROLE_LABELS[user.role] || user.role}</td>
                            <td className="px-4 py-3">
                              <span className="text-[var(--text)] text-[13px] opacity-90">{formatLastVisit(user.lastVisit)}</span>
                            </td>
                            <td className="px-4 py-3">
                              <button type="button" className="text-slate-500 hover:text-gray-800">
                                <img src="https://c.animaapp.com/mkof8zon8iICvl/assets/icon-40.svg" alt="Menu" className="h-5 w-5" />
                              </button>
                            </td>
                          </tr>
                      ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="border-t border-[var(--border)] px-4 py-3 flex items-center justify-between bg-white">
                    <div className="text-sm text-gray-600">
                      {allUsers.length > 0 ? `1 – ${allUsers.length} of ${allUsers.length}` : '0 of 0'}
                    </div>
                  </div>
                </>
            ) : activeTab === 'pending' ? (
                <div className="relative flex flex-col grow overflow-auto">
                  {pendingLoading ? (
                      <div className="flex items-center justify-center p-12 text-[var(--muted)]">Loading…</div>
                  ) : pendingInvites.length === 0 ? (
                      <div className="flex flex-col items-center justify-center p-12 text-[var(--muted)]">
                        <div className="text-4xl mb-3">✓</div>
                        <div className="font-medium">No pending invite requests</div>
                        <div className="text-sm mt-1">New access requests will appear here</div>
                      </div>
                  ) : (
                      <table className="w-full">
                        <thead className="bg-white sticky top-0 z-10 border-b border-[var(--border)]">
                        <tr>
                          <th className="text-left text-[13px] font-medium text-[var(--muted)] px-4 py-3">Name</th>
                          <th className="text-left text-[13px] font-medium text-[var(--muted)] px-4 py-3">Email</th>
                          <th className="text-left text-[13px] font-medium text-[var(--muted)] px-4 py-3">Role</th>
                          <th className="text-left text-[13px] font-medium text-[var(--muted)] px-4 py-3">Requested</th>
                          <th className="text-left text-[13px] font-medium text-[var(--muted)] px-4 py-3">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {pendingInvites.map(invite => (
                            <tr key={invite.id} className="border-b border-[var(--border)] hover:bg-[var(--panel-2)] transition-colors">
                              <td className="px-4 py-3 text-[13px] font-medium">{invite.full_name}</td>
                              <td className="px-4 py-3 text-[13px] text-[var(--muted)]">{invite.email}</td>
                              <td className="px-4 py-3 text-[13px]">
                          <span className="bg-blue-50 text-blue-700 text-[11px] font-semibold px-2 py-0.5 rounded">
                            {invite.role}
                          </span>
                              </td>
                              <td className="px-4 py-3 text-[13px] text-[var(--muted)]">
                                {new Date(invite.requested_at).toLocaleDateString()}
                              </td>
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-2">
                                  <button
                                      type="button"
                                      disabled={actionLoading === invite.id}
                                      onClick={() => handleApprove(invite)}
                                      className="bg-green-600 hover:bg-green-700 text-white text-xs font-bold px-3 py-1.5 rounded transition-colors disabled:opacity-50"
                                  >
                                    {actionLoading === invite.id ? '…' : 'Approve'}
                                  </button>
                                  <button
                                      type="button"
                                      disabled={actionLoading === invite.id}
                                      onClick={() => handleReject(invite)}
                                      className="bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold px-3 py-1.5 rounded border border-red-200 transition-colors disabled:opacity-50"
                                  >
                                    Reject
                                  </button>
                                </div>
                              </td>
                            </tr>
                        ))}
                        </tbody>
                      </table>
                  )}
                </div>
            ) : (
                /* Site Requests tab */
                <div className="relative flex flex-col grow overflow-auto">
                  {siteRequestsLoading ? (
                      <div className="flex items-center justify-center p-12 text-[var(--muted)]">Loading…</div>
                  ) : siteRequests.length === 0 ? (
                      <div className="flex flex-col items-center justify-center p-12 text-[var(--muted)]">
                        <div className="text-4xl mb-3">✓</div>
                        <div className="font-medium">No pending site requests</div>
                        <div className="text-sm mt-1">When new users request access to this site, they'll appear here</div>
                      </div>
                  ) : (
                      <table className="w-full">
                        <thead className="bg-white sticky top-0 z-10 border-b border-[var(--border)]">
                        <tr>
                          <th className="text-left text-[13px] font-medium text-[var(--muted)] px-4 py-3">User</th>
                          <th className="text-left text-[13px] font-medium text-[var(--muted)] px-4 py-3">Requested Role</th>
                          <th className="text-left text-[13px] font-medium text-[var(--muted)] px-4 py-3">Requested</th>
                          <th className="text-left text-[13px] font-medium text-[var(--muted)] px-4 py-3">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {siteRequests.map(request => (
                            <tr key={request.id} className="border-b border-[var(--border)] hover:bg-[var(--panel-2)] transition-colors">
                              <td className="px-4 py-3 text-[13px] font-medium">{request.user_name}</td>
                              <td className="px-4 py-3 text-[13px]">
                                <span className="bg-orange-50 text-orange-700 text-[11px] font-semibold px-2 py-0.5 rounded">
                                  {request.requested_role}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-[13px] text-[var(--muted)]">
                                {new Date(request.requested_at).toLocaleDateString()}
                              </td>
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-2">
                                  <button
                                      type="button"
                                      disabled={actionLoading === request.id}
                                      onClick={() => handleApproveSiteRequest(request)}
                                      className="bg-green-600 hover:bg-green-700 text-white text-xs font-bold px-3 py-1.5 rounded transition-colors disabled:opacity-50"
                                  >
                                    {actionLoading === request.id ? '…' : 'Approve'}
                                  </button>
                                  <button
                                      type="button"
                                      disabled={actionLoading === request.id}
                                      onClick={() => handleDenySiteRequest(request)}
                                      className="bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold px-3 py-1.5 rounded border border-red-200 transition-colors disabled:opacity-50"
                                  >
                                    Deny
                                  </button>
                                </div>
                              </td>
                            </tr>
                        ))}
                        </tbody>
                      </table>
                  )}
                </div>
            )}
          </div>
        </div>

        <UserInviteModal
            isOpen={isInviteModalOpen}
            onClose={() => setIsInviteModalOpen(false)}
        />
      </div>
  );
};