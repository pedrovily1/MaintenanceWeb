import { useState, useEffect, useCallback, useMemo } from 'react';
import { User } from '../types/user';

const USERS_STORAGE_KEY = 'users_v1';
const ACTIVE_USER_STORAGE_KEY = 'active_user_id_v1';

const DEFAULT_ADMIN: User = {
  id: 'admin-001',
  fullName: 'Admin',
  role: 'Administrator',
  pin: '1234',
  teams: [],
  lastVisit: new Date().toISOString(),
  createdAt: new Date().toISOString(),
  isActive: true,
  avatarUrl: 'https://app.getmaintainx.com/img/static/user_placeholders/RandomPicture4.png',
};

let globalUsers: User[] = [];
let globalActiveUserId: string | null = null;
const listeners = new Set<() => void>();

// Hydrate from localStorage once
const savedUsers = localStorage.getItem(USERS_STORAGE_KEY);
if (savedUsers) {
  try {
    const parsed = JSON.parse(savedUsers);
    if (Array.isArray(parsed) && parsed.length > 0) {
      globalUsers = parsed;
    } else {
      globalUsers = [DEFAULT_ADMIN];
    }
  } catch (e) {
    console.error('Failed to parse saved users', e);
    globalUsers = [DEFAULT_ADMIN];
  }
} else {
  globalUsers = [DEFAULT_ADMIN];
}

const savedActiveUserId = localStorage.getItem(ACTIVE_USER_STORAGE_KEY);
if (savedActiveUserId && globalUsers.find(u => u.id === savedActiveUserId)) {
  globalActiveUserId = savedActiveUserId;
} else {
  globalActiveUserId = globalUsers[0]?.id || null;
}

const notify = () => {
  listeners.forEach(l => l());
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(globalUsers));
  if (globalActiveUserId) {
    localStorage.setItem(ACTIVE_USER_STORAGE_KEY, globalActiveUserId);
  } else {
    localStorage.removeItem(ACTIVE_USER_STORAGE_KEY);
  }
};

/**
 * Hook for managing user state.
 * CMMS Style PIN-based user switching and ownership.
 */
export const useUserStore = () => {
  const [users, setUsers] = useState<User[]>(globalUsers);
  const [activeUserId, setActiveUserId] = useState<string | null>(globalActiveUserId);

  useEffect(() => {
    const l = () => {
      setUsers([...globalUsers]);
      setActiveUserId(globalActiveUserId);
    };
    listeners.add(l);
    return () => {
      listeners.delete(l);
    };
  }, []);

  const addUser = useCallback((user: Omit<User, 'id' | 'createdAt'>) => {
    // Unique PIN check (CMMS requirement)
    if (globalUsers.some(u => u.pin === user.pin)) {
      throw new Error('PIN already in use. Each user must have a unique PIN.');
    }
    const newUser: User = {
      ...user,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    globalUsers = [...globalUsers, newUser];
    notify();
    return newUser;
  }, []);

  const updateUser = useCallback((id: string, patch: Partial<User>) => {
    globalUsers = globalUsers.map(u => (u.id === id ? { ...u, ...patch } : u));
    notify();
  }, []);

  const deleteUser = useCallback((id: string) => {
    if (id === 'admin-001') return; // Protect default admin
    globalUsers = globalUsers.filter(u => u.id !== id);
    if (globalActiveUserId === id) {
      globalActiveUserId = 'admin-001';
    }
    notify();
  }, []);

  const authenticateByPin = useCallback((pin: string) => {
    const user = globalUsers.find(u => u.pin === pin && u.isActive);
    if (user) {
      globalActiveUserId = user.id;
      // Update lastVisit on successful PIN match
      globalUsers = globalUsers.map(u => 
        u.id === user.id 
          ? { ...u, lastVisit: new Date().toISOString() } 
          : u
      );
      notify();
      return user;
    }
    return null;
  }, []);

  const setActiveUser = useCallback((id: string) => {
    const user = globalUsers.find(u => u.id === id && u.isActive);
    if (user) {
      globalActiveUserId = id;
      notify();
    }
  }, []);

  const activeUser = useMemo(() => 
    users.find(u => u.id === activeUserId) || users[0] || null
  , [users, activeUserId]);

  const allUsers = users;

  const usersByTeam = useCallback((teamName: string) => {
    return users.filter(u => u.teams.includes(teamName));
  }, [users]);

  const getUserById = useCallback((id: string) => {
    return globalUsers.find(u => u.id === id);
  }, []);

  return {
    users, // for backward compatibility
    allUsers,
    activeUser,
    activeUserId,
    addUser,
    updateUser,
    deleteUser,
    authenticateByPin,
    setActiveUser,
    usersByTeam,
    getUserById,
    // Future Extension Points:
    // - Role-based permissions: Use user.role to gate UI/Actions
    // - Approval workflows: Link tasks to specific technician/admin roles
    // - Multi-site users: Add siteId[] to User model
    // - Backend authentication: Replace local storage with API calls
  };
};
