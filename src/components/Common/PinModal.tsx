import React, { useState } from 'react';
import { useUserStore } from '@/store/useUserStore';

interface PinModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PinModal: React.FC<PinModalProps> = ({ isOpen, onClose }) => {
  const { authenticateByPin } = useUserStore();
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const user = authenticateByPin(pin);
    if (user) {
      setPin('');
      setError('');
      onClose();
    } else {
      setError('Invalid PIN. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-200">
        <header className="px-6 py-4 border-b border-[var(--border)] flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-800">Switch User</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </header>
        <form onSubmit={handleSubmit} className="p-6">
          <p className="text-sm text-gray-600 mb-4 text-center">
            Enter your PIN to switch to your profile.
          </p>
          <div className="flex flex-col items-center">
            <input
              type="password"
              autoFocus
              className={`w-32 text-center text-2xl tracking-[0.5em] border ${error ? 'border-red-500' : 'border-[var(--border)]'} rounded p-2 focus:outline-none focus:border-blue-500`}
              value={pin}
              onChange={(e) => {
                setPin(e.target.value.replace(/\D/g, '').slice(0, 6));
                if (error) setError('');
              }}
              placeholder="••••"
            />
            {error && (
              <p className="text-red-500 text-xs mt-3 font-medium">
                {error}
              </p>
            )}
          </div>
          <div className="mt-8 flex flex-col gap-2">
            <button
              type="submit"
              disabled={pin.length < 4}
              className={`w-full py-2.5 text-sm font-bold text-white rounded-md transition-colors ${pin.length < 4 ? 'bg-gray-300 cursor-not-allowed' : 'bg-accent hover:bg-accent-hover'}`}
            >
              Confirm
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-full py-2 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
