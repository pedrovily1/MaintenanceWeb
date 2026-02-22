import { useState, useEffect, useCallback, useMemo } from 'react';
import { User } from '../types/user';
import { fetchUsers } from '@/services/userService';
import { useSiteStore } from './useSiteStore';

let globalUsers: User[] = [];
const listeners = new Set<() => void>();

const notify = () => {
  listeners.forEach(l => l());
};

export const useUserStore = () => {
  const [users, setUsers] = useState<User[]>(globalUsers);
  const { activeUserId } = useSiteStore();

  useEffect(() => {
    const l = () => {
      setUsers([...globalUsers]);
    };
    listeners.add(l);
    return () => {
      listeners.delete(l);
    };
  }, []);

  const loadUsers = useCallback(async (siteId: string) => {
    if (!siteId) return;
    try {
      const data = await fetchUsers(siteId);
      globalUsers = data;
      notify();
    } catch (error) {
      console.error("Failed to load users:", error);
      globalUsers = [];
      notify();
    }
  }, []);

  const addUser = useCallback((user: Omit<User, 'id' | 'createdAt'>) => {
    // No-op for Phase 1
    return {} as User;
  }, []);

  const updateUser = useCallback((id: string, patch: Partial<User>) => {
    // No-op for Phase 1
  }, []);

  const deleteUser = useCallback((id: string) => {
    // No-op for Phase 1
  }, []);

  const authenticateByPin = useCallback((pin: string) => {
    const user = globalUsers.find(u => u.pin === pin && u.isActive);
    if (user) {
      // Note: In real app, we might want to update active user in SiteStore
      // but for now we just return the user as this might be for local PIN auth
      return user;
    }
    return null;
  }, []);

  const setActiveUser = useCallback((id: string) => {
    // This is now handled by useSiteStore.setActiveUserId in resolveSiteAndLoadData
    console.log("setActiveUser called with:", id, " (handled by SiteStore)");
  }, []);

  const activeUser = useMemo(() => 
    users.find(u => u.id === activeUserId) || users[0] || null
  , [users, activeUserId]);

  const allUsers = users;

  const getUserById = useCallback((id: string) => {
    return globalUsers.find(u => u.id === id);
  }, []);

  return {
    users,
    allUsers,
    activeUser,
    activeUserId,
    loadUsers,
    addUser,
    updateUser,
    deleteUser,
    authenticateByPin,
    setActiveUser,
    getUserById,
  };
};
