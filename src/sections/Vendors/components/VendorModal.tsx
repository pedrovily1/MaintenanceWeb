import React, { useState, useEffect } from 'react';
import { Vendor } from '@/types/vendor';

const TRADE_OPTIONS = [
  'Electrical',
  'HVAC',
  'Plumbing',
  'Fire Safety',
  'Carpentry',
  'Painting',
  'Landscaping',
  'Cleaning',
  'Security',
  'IT Support',
  'General Contractor',
  'Other'
];

interface VendorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: {
    name: string;
    trade?: string;
    contactName?: string;
    phone?: string;
    email?: string;
    address?: string;
    notes?: string;
  }) => void;
  vendor?: Vendor | null;
}

export const VendorModal: React.FC<VendorModalProps> = ({ isOpen, onClose, onSave, vendor }) => {
  const [name, setName] = useState('');
  const [trade, setTrade] = useState('');
  const [contactName, setContactName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (vendor) {
      setName(vendor.name);
      setTrade(vendor.trade || '');
      setContactName(vendor.contactName || '');
      setPhone(vendor.phone || '');
      setEmail(vendor.email || '');
      setAddress(vendor.address || '');
      setNotes(vendor.notes || '');
    } else {
      setName('');
      setTrade('');
      setContactName('');
      setPhone('');
      setEmail('');
      setAddress('');
      setNotes('');
    }
    setError('');
  }, [vendor, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Vendor name is required');
      return;
    }
    try {
      onSave({
        name: name.trim(),
        trade: trade.trim() || undefined,
        contactName: contactName.trim() || undefined,
        phone: phone.trim() || undefined,
        email: email.trim() || undefined,
        address: address.trim() || undefined,
        notes: notes.trim() || undefined,
      });
      onClose();
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col">
        <header className="px-6 py-4 border-b border-zinc-200 flex justify-between items-center shrink-0">
          <h3 className="text-lg font-semibold">{vendor ? 'Edit Vendor' : 'New Vendor'}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </header>
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="p-6 space-y-4 overflow-y-auto">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Vendor Name *</label>
              <input
                type="text"
                required
                className="w-full border border-zinc-200 rounded p-2 text-sm focus:outline-none focus:border-blue-500"
                value={name}
                onChange={(e) => { setName(e.target.value); setError(''); }}
                placeholder="e.g. ABC Electrical Services"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Trade</label>
              <select
                className="w-full border border-zinc-200 rounded p-2 text-sm focus:outline-none focus:border-blue-500"
                value={trade}
                onChange={(e) => setTrade(e.target.value)}
              >
                <option value="">Select a trade...</option>
                {TRADE_OPTIONS.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Name</label>
                <input
                  type="text"
                  className="w-full border border-zinc-200 rounded p-2 text-sm focus:outline-none focus:border-blue-500"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="e.g. John Smith"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  className="w-full border border-zinc-200 rounded p-2 text-sm focus:outline-none focus:border-blue-500"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. (555) 123-4567"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                className="w-full border border-zinc-200 rounded p-2 text-sm focus:outline-none focus:border-blue-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. contact@vendor.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <input
                type="text"
                className="w-full border border-zinc-200 rounded p-2 text-sm focus:outline-none focus:border-blue-500"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g. 123 Main St, City, State 12345"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <textarea
                className="w-full border border-zinc-200 rounded p-2 text-sm focus:outline-none focus:border-blue-500 min-h-[80px]"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Additional notes about this vendor..."
              />
            </div>
            {error && <p className="text-red-500 text-xs">{error}</p>}
          </div>
          <div className="px-6 py-4 border-t border-zinc-200 flex justify-end gap-3 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-bold text-white bg-blue-500 hover:bg-blue-400 rounded"
            >
              {vendor ? 'Save Changes' : 'Create Vendor'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
