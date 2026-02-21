import React, { useState } from 'react';
import { useUserStore } from '@/store/useUserStore';
import { UserRole } from '@/types/user';

interface UserInviteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserInviteModal: React.FC<UserInviteModalProps> = ({ isOpen, onClose }) => {
  const { addUser } = useUserStore();
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<UserRole>('Technician');
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !pin || !confirmPin) return;

    if (pin !== confirmPin) {
      setError('PINs do not match.');
      return;
    }

    if (pin.length < 4 || pin.length > 6) {
      setError('PIN must be 4-6 digits.');
      return;
    }

    try {
      addUser({
        fullName,
        role,
        pin,
        lastVisit: '',
        isActive: true, // Users are active by default for PIN-based switching
        avatarUrl: `https://app.getmaintainx.com/img/static/user_placeholders/RandomPicture${Math.floor(Math.random() * 30) + 1}.png`
      });
      
      // Reset and close
      setFullName('');
      setRole('Technician');
      setPin('');
      setConfirmPin('');
      setError('');
      onClose();
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
        <header className="px-6 py-4 border-b border-[var(--border)] flex justify-between items-center">
          <h3 className="text-lg font-semibold">Create New User</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </header>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              required
              className="w-full border border-[var(--border)] rounded p-2 text-sm focus:outline-none focus:border-teal-500"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. John Doe"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <select
              className="w-full border border-[var(--border)] rounded p-2 text-sm focus:outline-none focus:border-teal-500"
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
            >
              <option value="Administrator">Administrator</option>
              <option value="Technician">Technician</option>
              <option value="Viewer">Viewer</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">PIN (4-6 digits)</label>
            <input
              type="password"
              pattern="\d{4,6}"
              required
              className={`w-full border ${error ? 'border-red-500' : 'border-[var(--border)]'} rounded p-2 text-sm focus:outline-none focus:border-teal-500`}
              value={pin}
              onChange={(e) => {
                setPin(e.target.value.replace(/\D/g, '').slice(0, 6));
                if (error) setError('');
              }}
              placeholder="Enter PIN"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm PIN</label>
            <input
              type="password"
              pattern="\d{4,6}"
              required
              className={`w-full border ${error ? 'border-red-500' : 'border-[var(--border)]'} rounded p-2 text-sm focus:outline-none focus:border-teal-500`}
              value={confirmPin}
              onChange={(e) => {
                setConfirmPin(e.target.value.replace(/\D/g, '').slice(0, 6));
                if (error) setError('');
              }}
              placeholder="Confirm PIN"
            />
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
          </div>
          <div className="pt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-bold text-white bg-teal-500 hover:bg-teal-400 rounded"
            >
              Create User
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
