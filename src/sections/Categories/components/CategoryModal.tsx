import React, { useState, useEffect } from 'react';
import { Category } from '@/types/category';

const ICON_OPTIONS = [
  { value: "data:image/svg+xml,%3csvg%20width='40'%20height='40'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20fill-rule='evenodd'%20clip-rule='evenodd'%20d='M20%2040c11.046%200%2020-8.954%2020-20S31.046%200%2020%200%200%208.954%200%2020s8.954%2020%2020%2020z'%20fill='%23D9F5F1'/%3e%3cpath%20d='M29.552%2010.121a1.21%201.21%200%2000-1.017-.242%209.689%209.689%200%2001-7.532-1.538%201.21%201.21%200%2000-1.38%200%209.688%209.688%200%2001-7.533%201.538%201.21%201.21%200%2000-1.465%201.187v9.021a10.9%2010.9%200%20004.565%208.876l4.42%203.149a1.21%201.21%200%20001.405%200l4.42-3.149A10.9%2010.9%200%200030%2020.087v-9.021a1.21%201.21%200%2000-.448-.945zm-1.974%209.966a8.476%208.476%200%2001-3.548%206.902l-3.718%202.652-3.717-2.652a8.476%208.476%200%2001-3.548-6.902v-7.629a12.11%2012.11%200%20007.265-1.683%2012.11%2012.11%200%20007.266%201.683v7.63zm-5.4-2.773l-3.258%203.27-1.078-1.09a1.216%201.216%200%2000-1.72%201.72l1.938%201.937a1.211%201.211%200%20001.72%200l4.165-4.13a1.216%201.216%200%2000-1.72-1.72l-.048.013z'%20fill='%233FCBBB'/%3e%3c/svg%3e", label: "Shield" },
  { value: "data:image/svg+xml,%3csvg%20width='40'%20height='40'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20fill-rule='evenodd'%20clip-rule='evenodd'%20d='M20%2040c11.046%200%2020-8.954%2020-20S31.046%200%2020%200%200%208.954%200%2020s8.954%2020%2020%2020z'%20fill='%23FFE4D0'/%3e%3cpath%20d='M29.585%2024.71l-2.42-2.42a1.002%201.002%200%2000-1.42%200l-3.58%203.58a1%201%200%2000-.29.71V29a1%201%200%20001%201h2.42a1.002%201.002%200%2000.71-.29l3.58-3.58a1.002%201.002%200%20000-1.42zM24.875%2028h-1v-1l2.58-2.58%201%201-2.58%202.58zm-6%200h-4a1%201%200%2001-1-1V13a1%201%200%20011-1h5v3a3%203%200%20003%203h3v1a1%201%200%20102%200v-2-.06a1.306%201.306%200%2000-.06-.27v-.09a1.071%201.071%200%2000-.19-.28l-6-6a1.071%201.071%200%2000-.28-.19.323.323%200%2000-.09%200l-.32-.11h-6.06a3%203%200%2000-3%203v14a3%203%200%20003%203h4a1%201%200%20000-2zm3-14.59l2.59%202.59h-1.59a1%201%200%2001-1-1v-1.59zm-5%208.59h6a1%201%200%20000-2h-6a1%201%200%20100%202zm0-4h1a1%201%200%20000-2h-1a1%201%200%20000%202zm2%206h-2a1%201%200%20100%202h2a1%201%200%20000-2z'%20fill='%23FF7439'/%3e%3c/svg%3e", label: "Document" },
  { value: "data:image/svg+xml,%3csvg%20width='40'%20height='40'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20fill-rule='evenodd'%20clip-rule='evenodd'%20d='M20%2040c11.046%200%2020-8.954%2020-20S31.046%200%2020%200%200%208.954%200%2020s8.954%2020%2020%2020z'%20fill='%23FFE5DF'/%3e%3cpath%20d='M19.977%2023.34a.904.904%200%20100%201.807.904.904%200%20000-1.807zm9.644%201.329l-7.276-12.653a2.71%202.71%200%2000-4.735%200l-7.23%2012.653a2.712%202.712%200%20002.313%204.094h14.569a2.711%202.711%200%20002.359-4.094zm-1.564%201.807a.902.902%200%2001-.795.461h-14.57a.903.903%200%2001-.794-.46.904.904%200%20010-.905l7.23-12.653a.904.904%200%20011.609%200l7.275%2012.653a.904.904%200%2001.045.922v-.018zm-8.08-10.366a.904.904%200%2000-.903.904v3.615a.904.904%200%20101.807%200v-3.616a.904.904%200%2000-.904-.903z'%20fill='%23FF7C60'/%3e%3c/svg%3e", label: "Warning" },
  { value: "data:image/svg+xml,%3csvg%20width='40'%20height='40'%20viewBox='0%200%2064%2064'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20fill-rule='evenodd'%20clip-rule='evenodd'%20d='M32%2064a32%2032%200%201%200%200-64%2032%2032%200%200%200%200%2064Z'%20fill='%23FFF5CC'/%3e%3cpath%20d='M45.36%2026.56a1.6%201.6%200%200%200-1.39-.96h-7.32l2.03-7.58A1.6%201.6%200%200%200%2037.14%2016h-11.2a1.6%201.6%200%200%200-1.6%201.18l-4.28%2016a1.6%201.6%200%200%200%201.55%202.02h6.19l-2.9%2010.78a1.6%201.6%200%200%200%202.74%201.49l17.44-19.2a1.6%201.6%200%200%200%20.28-1.71ZM29.7%2040.44l1.71-6.4a1.6%201.6%200%200%200-1.53-2.01h-6.14l3.42-12.83h7.89L33%2026.78a1.6%201.6%200%200%200%201.6%202.02h5.71L29.7%2040.44Z'%20fill='%23FC0'/%3e%3c/svg%3e", label: "Lightning" },
  { value: "data:image/svg+xml,%3csvg%20width='40'%20height='40'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20fill-rule='evenodd'%20clip-rule='evenodd'%20d='M20%2040c11.046%200%2020-8.954%2020-20S31.046%200%2020%200%200%208.954%200%2020s8.954%2020%2020%2020z'%20fill='%23FCEBFF'/%3e%3cpath%20d='M29.667%2023.55l-4.51-4.501c.093-.46.14-.928.139-1.397a7.652%207.652%200%2000-10.887-6.936.998.998%200%2000-.29%201.617l4.341%204.33-1.796%201.797-4.33-4.34a.998.998%200%2000-.88-.27%201%201%200%2000-.738.559%207.653%207.653%200%20006.986%2010.887c.469.001.937-.046%201.397-.14l4.5%204.51a.997.997%200%20001.417%200%20.996.996%200%20000-1.416l-4.89-4.89a.997.997%200%2000-.947-.26%205.865%205.865%200%2001-1.477.2%205.657%205.657%200%2001-5.708-5.648%205.988%205.988%200%2001.08-.998l3.911%203.922a1%201%200%20001.417%200l3.174-3.204a.998.998%200%20000-1.387l-3.882-3.911c.33-.054.664-.081.998-.08a5.658%205.658%200%20015.648%205.658c-.004.499-.07.995-.2%201.477a.998.998%200%2000.26.948l4.89%204.89a1.002%201.002%200%20001.416-1.418h-.04z'%20fill='%23EA7BFF'/%3e%3c/svg%3e", label: "Wrench" },
  { value: "data:image/svg+xml,%3csvg%20width='40'%20height='40'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20fill-rule='evenodd'%20clip-rule='evenodd'%20d='M20%2040c11.046%200%2020-8.954%2020-20S31.046%200%2020%200%200%208.954%200%2020s8.954%2020%2020%2020z'%20fill='%23DDF9FC'/%3e%3cpath%20d='M29.479%2024.407l-2.07-1.19.921-.248a1.036%201.036%200%2010-.538-1.998l-2.918.787-2.804-1.625%202.804-1.625%202.918.787h.27a1.043%201.043%200%2010.268-2.07l-.92-.196%202.069-1.19a1.04%201.04%200%2000-.65-1.93%201.037%201.037%200%2000-.385.129l-2.235%201.304.31-1.149a1.035%201.035%200%2010-1.997-.538l-.848%203.105-2.64%201.583v-3.24l2.143-2.141a1.034%201.034%200%2010-1.47-1.46l-.672.673v-2.39a1.035%201.035%200%2010-2.07%200v2.556l-.838-.838a1.036%201.036%200%2010-1.47%201.459l2.308%202.307v3.105l-2.66-1.573-.848-3.104a1.033%201.033%200%2000-1.913-.266%201.035%201.035%200%2000-.084.804l.331%201.107-2.235-1.283a1.037%201.037%200%2000-1.52%201.17c.072.267.246.493.485.63l2.07%201.17-.87.269a1.044%201.044%200%2000.27%202.07h.268l2.919-.787%202.752%201.552-2.804%201.625-2.918-.787a1.035%201.035%200%2010-.487%201.997l.921.249-2.07%201.19a1.038%201.038%200%20001.036%201.8l2.183-1.283-.31%201.149a1.035%201.035%200%2000.714%201.304c.089.01.18.01.269%200a1.035%201.035%200%20001.034-.766l.85-3.104%202.617-1.584v3.24l-2.142%202.142a1.034%201.034%200%20000%201.459%201.036%201.036%200%2000.735.31%201.035%201.035%200%2000.735-.31l.672-.673v2.39a1.035%201.035%200%20002.07%200v-2.556l.838.839a1.036%201.036%200%20101.47-1.46l-2.308-2.307v-3.105l2.66%201.542.848%203.105a1.035%201.035%200%20001.035.765c.09.01.18.01.269%200a1.038%201.038%200%2000.734-1.272l-.372-1.108%202.215%201.284a1.037%201.037%200%20001.52-1.171%201.04%201.04%200%2000-.486-.63h.021z'%20fill='%2354DFF2'/%3e%3c/svg%3e", label: "Snowflake" },
];

const COLOR_OPTIONS = [
  { value: "bg-teal-50", label: "Teal" },
  { value: "bg-orange-50", label: "Orange" },
  { value: "bg-red-50", label: "Red" },
  { value: "bg-yellow-50", label: "Yellow" },
  { value: "bg-purple-50", label: "Purple" },
  { value: "bg-cyan-50", label: "Cyan" },
  { value: "bg-pink-50", label: "Pink" },
  { value: "bg-blue-50", label: "Blue" },
];

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { name: string; icon: string; color: string; description?: string }) => void;
  category?: Category | null;
}

export const CategoryModal: React.FC<CategoryModalProps> = ({ isOpen, onClose, onSave, category }) => {
  const [name, setName] = useState('');
  const [icon, setIcon] = useState(ICON_OPTIONS[0].value);
  const [color, setColor] = useState(COLOR_OPTIONS[0].value);
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (category) {
      setName(category.name);
      setIcon(category.icon);
      setColor(category.color);
      setDescription(category.description || '');
    } else {
      setName('');
      setIcon(ICON_OPTIONS[0].value);
      setColor(COLOR_OPTIONS[0].value);
      setDescription('');
    }
    setError('');
  }, [category, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Name is required');
      return;
    }
    try {
      onSave({ name: name.trim(), icon, color, description: description.trim() || undefined });
      onClose();
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
        <header className="px-6 py-4 border-b border-zinc-200 flex justify-between items-center">
          <h3 className="text-lg font-semibold">{category ? 'Edit Category' : 'New Category'}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </header>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
            <input
              type="text"
              required
              className="w-full border border-zinc-200 rounded p-2 text-sm focus:outline-none focus:border-blue-500"
              value={name}
              onChange={(e) => { setName(e.target.value); setError(''); }}
              placeholder="e.g. Preventive Maintenance"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Icon</label>
            <div className="flex flex-wrap gap-2">
              {ICON_OPTIONS.map((opt) => (
                <button
                  key={opt.label}
                  type="button"
                  onClick={() => setIcon(opt.value)}
                  className={`p-1 rounded border-2 ${icon === opt.value ? 'border-blue-500' : 'border-transparent'} hover:border-blue-300`}
                >
                  <img src={opt.value} alt={opt.label} className="w-8 h-8" />
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
            <div className="flex flex-wrap gap-2">
              {COLOR_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setColor(opt.value)}
                  className={`w-8 h-8 rounded ${opt.value} border-2 ${color === opt.value ? 'border-blue-500' : 'border-zinc-200'} hover:border-blue-300`}
                  title={opt.label}
                />
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description (optional)</label>
            <textarea
              className="w-full border border-zinc-200 rounded p-2 text-sm focus:outline-none focus:border-blue-500 min-h-[80px]"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of this category..."
            />
          </div>
          {error && <p className="text-red-500 text-xs">{error}</p>}
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
              className="px-4 py-2 text-sm font-bold text-white bg-blue-500 hover:bg-blue-400 rounded"
            >
              {category ? 'Save Changes' : 'Create Category'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
