import { useMemo, useState } from "react";
import { useMeterStore } from '@/store/useMeterStore';
import { useAssetStore } from '@/store/useAssetStore';
import { useUserStore } from '@/store/useUserStore';
import { Trash2, Edit2, Check, X } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

type MeterDetailProps = {
  meterId: string | null;
  onEdit?: () => void;
};

export const MeterDetail = ({ meterId, onEdit }: MeterDetailProps) => {
  const { readings: allReadings, getMeterById, getReadingsByMeter, addReading, updateReading, deleteReading } = useMeterStore();
  const { getAssetById } = useAssetStore();
  const { activeUserId } = useUserStore();
  const [activeTimeframe, setActiveTimeframe] = useState<'1H' | '1D' | '1W' | '1M' | '3M' | '6M' | '1Y'>('1W');
  const [recordMode, setRecordMode] = useState(false);
  const [recordValue, setRecordValue] = useState<string>("");
  const [error, setError] = useState<string>("");

  const [editingReadingId, setEditingReadingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>("");
  const [editDate, setEditDate] = useState<string>("");
  const [deletingReadingId, setDeletingReadingId] = useState<string | null>(null);

  const meter = meterId ? getMeterById(meterId) : undefined;
  const asset = meter?.assetId ? getAssetById(meter.assetId) : undefined;
  const readings = useMemo(() => meter?.id ? getReadingsByMeter(meter.id) : [], [meter?.id, getReadingsByMeter, allReadings]);

  const filteredReadings = useMemo(() => {
    if (!readings.length) return [];
    
    const now = Date.now();
    let startTime: number;

    switch (activeTimeframe) {
      case '1H': startTime = now - (60 * 60 * 1000); break;
      case '1D': startTime = now - (24 * 60 * 60 * 1000); break;
      case '1W': startTime = now - (7 * 24 * 60 * 60 * 1000); break;
      case '1M': startTime = now - (30 * 24 * 60 * 60 * 1000); break;
      case '3M': startTime = now - (90 * 24 * 60 * 60 * 1000); break;
      case '6M': startTime = now - (180 * 24 * 60 * 60 * 1000); break;
      case '1Y': startTime = now - (365 * 24 * 60 * 60 * 1000); break;
      default: startTime = 0;
    }

    return readings
      .filter(r => new Date(r.recordedAt || r.createdAt).getTime() >= startTime)
      .sort((a, b) => new Date(a.recordedAt || a.createdAt).getTime() - new Date(b.recordedAt || b.createdAt).getTime());
  }, [readings, activeTimeframe]);

  const chartData = useMemo(() => {
    return filteredReadings.map(r => {
      const date = new Date(r.recordedAt || r.createdAt);
      let name: string;
      
      switch (activeTimeframe) {
        case '1H':
        case '1D':
          name = date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', hour12: false });
          break;
        case '1W':
        case '1M':
          name = date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
          break;
        default:
          name = date.toLocaleDateString(undefined, { month: 'short', year: '2-digit' });
      }

      return {
        name,
        value: r.value,
        fullDate: date.toLocaleString(),
        timestamp: date.getTime()
      };
    });
  }, [filteredReadings, activeTimeframe]);

  if (!meterId) {
    return (
      <div className="box-border caret-transparent flex basis-[375px] flex-col grow shrink-0 min-w-[200px] pt-2 px-2">
        <div className="bg-white shadow-[rgba(242,242,242,0.6)_0px_0px_12px_2px] box-border caret-transparent flex grow w-full border border-zinc-200 overflow-hidden rounded-bl rounded-br rounded-tl rounded-tr border-solid">
          <div className="flex items-center justify-center w-full h-full text-gray-500">
            Select a meter to view details
          </div>
        </div>
      </div>
    );
  }

  if (!meter) {
    return (
      <div className="box-border caret-transparent flex basis-[375px] flex-col grow shrink-0 min-w-[200px] pt-2 px-2">
        <div className="bg-white shadow-[rgba(242,242,242,0.6)_0px_0px_12px_2px] box-border caret-transparent flex grow w-full border border-zinc-200 overflow-hidden rounded-bl rounded-br rounded-tl rounded-tr border-solid">
          <div className="flex items-center justify-center w-full h-full text-red-500">
            Meter not found
          </div>
        </div>
      </div>
    );
  }

  const startEditReading = (r: any) => {
    setEditingReadingId(r.id);
    setEditValue(r.value.toString());
    const date = new Date(r.recordedAt || r.createdAt);
    // Format to YYYY-MM-DDTHH:mm for datetime-local input
    const offset = date.getTimezoneOffset() * 60000;
    const localISOTime = (new Date(date.getTime() - offset)).toISOString().slice(0, 16);
    setEditDate(localISOTime);
  };

  const handleUpdateReading = () => {
    if (!editingReadingId) return;
    const v = parseFloat(editValue);
    if (isNaN(v)) return;
    
    const newRecordedAt = new Date(editDate).toISOString();
    updateReading(editingReadingId, { value: v, recordedAt: newRecordedAt });
    setEditingReadingId(null);
  };

  return (
    <div className="box-border caret-transparent flex basis-[375px] flex-col grow shrink-0 min-w-[200px] pt-2 px-2">
      <div className="bg-white shadow-[rgba(242,242,242,0.6)_0px_0px_12px_2px] box-border caret-transparent flex grow w-full border border-zinc-200 overflow-hidden rounded-bl rounded-br rounded-tl rounded-tr border-solid">
        <div className="box-border caret-transparent flex basis-[0%] flex-col grow h-full overflow-x-hidden overflow-y-auto w-full">
          {/* Header */}
          <div className="box-border caret-transparent shrink-0 px-4 py-4">
            <div className="items-center box-border caret-transparent gap-x-2 flex shrink-0 flex-wrap justify-between gap-y-2 mb-4">
              <div className="items-center box-border caret-transparent gap-x-2 flex gap-y-2">
                <h3 className="text-xl font-semibold box-border caret-transparent tracking-[-0.2px] leading-7">
                  {meter?.name}
                </h3>
                <button
                  title="Copy Link"
                  type="button"
                  className="relative text-blue-500 font-bold items-center aspect-square bg-transparent caret-transparent gap-x-1 flex h-8 justify-center tracking-[-0.2px] leading-[14px] gap-y-1 text-center text-nowrap overflow-hidden px-2 rounded-[50%] hover:text-blue-400"
                  onClick={() => {
                    try {
                      navigator.clipboard?.writeText(window.location.href.replace(/#.*/, '#meters'));
                    } catch {}
                  }}
                >
                  <span className="box-border caret-transparent flex text-nowrap">
                    <img
                      src="https://c.animaapp.com/mkof8zon8iICvl/assets/icon-35.svg"
                      alt="Icon"
                      className="box-border caret-transparent h-5 text-nowrap w-5"
                    />
                  </span>
                </button>
              </div>
              <div className="items-center box-border caret-transparent gap-x-2 flex shrink-0 flex-wrap gap-y-2 ml-auto">
                <button
                  type="button"
                  onClick={() => { setRecordMode(true); setError(''); setRecordValue(''); }}
                  className="relative font-bold items-center bg-transparent caret-transparent gap-x-1 flex shrink-0 h-8 justify-center tracking-[-0.2px] leading-[14px] break-words gap-y-1 text-center text-nowrap border border-blue-500 px-3 rounded text-blue-500 hover:text-blue-400 hover:border-blue-400"
                >
                  <span className="box-border caret-transparent flex shrink-0 break-words text-nowrap">
                    Record Reading
                  </span>
                </button>
                <button
                  type="button"
                  onClick={onEdit}
                  className="relative font-bold items-center bg-transparent caret-transparent gap-x-1 flex shrink-0 h-8 justify-center tracking-[-0.2px] leading-[14px] break-words gap-y-1 text-center text-nowrap border border-blue-500 px-3 rounded text-blue-500 hover:text-blue-400 hover:border-blue-400"
                >
                  <span className="box-border caret-transparent flex shrink-0 break-words text-nowrap">
                    Edit
                  </span>
                </button>
                <button
                  type="button"
                  className="relative text-blue-500 font-bold items-center aspect-square bg-transparent caret-transparent gap-x-1 flex shrink-0 h-8 justify-center tracking-[-0.2px] leading-[14px] gap-y-1 text-center text-nowrap overflow-hidden px-2 rounded hover:text-blue-400"
                >
                  <span className="text-slate-500 box-border caret-transparent flex shrink-0 text-nowrap hover:text-gray-600">
                    <img
                      src="https://c.animaapp.com/mkof8zon8iICvl/assets/icon-40.svg"
                      alt="Icon"
                      className="box-border caret-transparent shrink-0 h-5 text-nowrap w-5"
                    />
                  </span>
                </button>
              </div>
            </div>

            {/* Asset and Location */}
            <div className="items-center box-border caret-transparent gap-x-2 flex shrink-0 text-sm text-gray-600 mb-4">
              <div className="flex items-center gap-1">
                <img
                  src="https://c.animaapp.com/mkof8zon8iICvl/assets/icon-7.svg"
                  alt="Icon"
                  className="text-slate-500 box-border caret-transparent shrink-0 h-4 w-4"
                />
                {asset ? (
                  <a href="#assets" className="text-blue-500 hover:text-blue-400" onClick={() => setTimeout(() => window.dispatchEvent(new CustomEvent('select-asset', { detail: { id: asset.id } })), 0)}>{asset?.name}</a>
                ) : (
                  <span>Global</span>
                )}
              </div>
              <span>-</span>
              <div className="flex items-center gap-1">
                <img
                  src="https://c.animaapp.com/mkof8zon8iICvl/assets/icon-2.svg"
                  alt="Icon"
                  className="text-slate-500 box-border caret-transparent shrink-0 h-4 w-4"
                />
                <a href="#locations" className="text-blue-500 hover:text-blue-400">{meter.locationName || '—'}</a>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="relative box-border caret-transparent flex flex-col grow scroll-smooth overflow-auto scroll-pt-4 px-6">
            {/* Readings Section */}
            <div className="box-border caret-transparent shrink-0 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Readings</h2>
                {recordMode && (
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      step="any"
                      autoFocus
                      value={recordValue}
                      onChange={(e) => setRecordValue(e.target.value)}
                      placeholder={`Enter ${meter.unit || ''}`.trim()}
                      className="border border-zinc-200 rounded px-2 py-1 text-sm w-40"
                    />
                    <button
                      type="button"
                      className="px-3 py-1 rounded bg-blue-600 text-white text-sm"
                      onClick={() => {
                        const v = parseFloat(recordValue);
                        if (isNaN(v)) { setError('Enter a valid number'); return; }
                        addReading({ meterId: meter.id, value: v, unit: meter.unit, recordedByUserId: activeUserId || undefined, source: 'manual', recordedAt: new Date().toISOString() });
                        setRecordMode(false);
                        setRecordValue('');
                      }}
                    >
                      Save
                    </button>
                    <button type="button" className="px-3 py-1 rounded border border-zinc-200 text-sm" onClick={() => { setRecordMode(false); setError(''); }}>Cancel</button>
                    {error && <div className="text-xs text-red-500 ml-2">{error}</div>}
                  </div>
                )}
                <div className="flex items-center gap-1">
                  {(['1H', '1D', '1W', '1M', '3M', '6M', '1Y'] as const).map((timeframe) => (
                    <button
                      key={timeframe}
                      type="button"
                      onClick={() => setActiveTimeframe(timeframe)}
                      className={`px-3 py-1 text-sm rounded ${
                        activeTimeframe === timeframe
                          ? 'bg-blue-500 text-white'
                          : 'bg-transparent text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {timeframe}
                    </button>
                  ))}
                </div>
              </div>

              {/* Chart Section */}
              <div className="h-64 bg-white rounded border border-zinc-200 mb-4 p-4">
                {chartData.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-gray-500 text-sm">
                    No data for the selected timeframe
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis 
                        dataKey="name" 
                        fontSize={10} 
                        tickMargin={10}
                      />
                      <YAxis fontSize={10} />
                      <Tooltip 
                        contentStyle={{ fontSize: '12px', borderRadius: '8px' }}
                        labelStyle={{ fontWeight: 'bold' }}
                        labelFormatter={(label, payload) => payload?.[0]?.payload?.fullDate || label}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="value" 
                        stroke="#3b82f6" 
                        strokeWidth={2} 
                        dot={{ r: 3 }} 
                        activeDot={{ r: 5 }} 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>

              {/* Summary */}
              <div className="min-h-[80px] bg-white rounded flex items-center justify-center border border-zinc-200 mb-4 relative">
                {readings.length === 0 ? (
                  <div className="text-gray-500 text-sm">No readings yet</div>
                ) : (
                  <div className="text-center p-4">
                    <div className="text-2xl font-semibold">{meter.lastReading}{meter.unit ? ` ${meter.unit}` : ''}</div>
                    <div className="text-xs text-gray-500 mt-1">Last reading {meter.lastReadingAt ? new Date(meter.lastReadingAt).toLocaleString() : ''}</div>
                    <div className="text-xs text-gray-500 mt-1">Total readings: {readings.length}</div>
                  </div>
                )}
              </div>

              {/* History List */}
              <div className="bg-white border border-zinc-200 rounded">
                <div className="px-3 py-2 border-b border-zinc-200 text-sm font-medium">History</div>
                {readings.length === 0 ? (
                  <div className="px-3 py-3 text-sm text-gray-500">No readings to display</div>
                ) : (
                  <ul className="divide-y divide-zinc-200 max-h-80 overflow-auto">
                    {readings.slice(0, 50).map(r => (
                      <li key={r.id} className="px-3 py-2 text-sm group">
                        {editingReadingId === r.id ? (
                          <div className="space-y-2 py-1">
                            <div className="flex items-center gap-2">
                              <input 
                                type="number" 
                                value={editValue} 
                                onChange={(e) => setEditValue(e.target.value)}
                                className="border border-zinc-200 rounded px-2 py-1 text-sm w-24"
                              />
                              <span className="text-gray-500">{meter.unit}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <input 
                                type="datetime-local" 
                                value={editDate} 
                                onChange={(e) => setEditDate(e.target.value)}
                                className="border border-zinc-200 rounded px-2 py-1 text-sm flex-grow"
                              />
                            </div>
                            <div className="flex justify-end gap-2">
                              <button onClick={() => setEditingReadingId(null)} className="p-1 text-gray-500 hover:text-gray-700">
                                <X size={16} />
                              </button>
                              <button onClick={handleUpdateReading} className="p-1 text-blue-600 hover:text-blue-700">
                                <Check size={16} />
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between">
                            <div className="flex-grow">
                              <div className="flex items-center justify-between">
                                <div className="font-medium">{r.value}{meter.unit ? ` ${meter.unit}` : (r.unit ? ` ${r.unit}` : '')}</div>
                                {r.workOrderId && (
                                  <div className="text-[10px] text-blue-500 font-medium">WO: {r.workOrderId.slice(0, 8)}...</div>
                                )}
                              </div>
                              <div className="text-xs text-gray-500">{new Date(r.recordedAt || r.createdAt).toLocaleString()} • {r.source || '—'}</div>
                            </div>
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                              <button 
                                onClick={() => startEditReading(r)}
                                className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded"
                                title="Edit reading"
                              >
                                <Edit2 size={14} />
                              </button>
                              {deletingReadingId === r.id ? (
                                <div className="flex items-center bg-red-50 rounded border border-red-100">
                                  <button 
                                    onClick={() => { deleteReading(r.id); setDeletingReadingId(null); }}
                                    className="px-2 py-1 text-[10px] text-red-600 font-bold hover:bg-red-100"
                                  >
                                    Confirm
                                  </button>
                                  <button 
                                    onClick={() => setDeletingReadingId(null)}
                                    className="px-2 py-1 text-[10px] text-gray-500 hover:bg-gray-100 border-l border-red-100"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              ) : (
                                <button 
                                  onClick={() => setDeletingReadingId(r.id)}
                                  className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded"
                                  title="Delete reading"
                                >
                                  <Trash2 size={14} />
                                </button>
                              )}
                            </div>
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* See All Readings Button (placeholder action) */}
              <div className="flex justify-center">
                <button
                  type="button"
                  className="text-blue-500 font-medium items-center bg-transparent caret-transparent gap-x-1 flex shrink-0 h-10 justify-center tracking-[-0.2px] leading-[14px] gap-y-1 text-center text-nowrap border border-blue-500 px-4 rounded-bl rounded-br rounded-tl rounded-tr border-solid hover:text-blue-400 hover:border-blue-400"
                  onClick={() => { /* future: open readings view */ }}
                >
                  <span className="box-border caret-transparent flex shrink-0 text-nowrap">
                    See All Readings
                  </span>
                </button>
              </div>
            </div>

            <div className="border-b border-zinc-200 my-4"></div>

            {/* Description */}
            <div className="box-border caret-transparent shrink-0 mb-6">
              <h2 className="text-lg font-semibold mb-3">Description</h2>
              <div className="box-border caret-transparent leading-[21px]">
                <span>{meter.description || '—'}</span>
              </div>
            </div>

            <div className="border-b border-zinc-200 my-4"></div>

            {/* Meter Details */}
            <div className="box-border caret-transparent shrink-0 mb-6">
              <h2 className="text-lg font-semibold mb-4">Meter Details</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <p className="text-gray-600 text-sm">Measurement Unit</p>
                  <p className="font-semibold">{meter.unit || '—'}</p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-gray-600 text-sm">Last Reading</p>
                  <p className="font-semibold">{typeof meter.lastReading === 'number' ? `${meter.lastReading}${meter.unit ? ` ${meter.unit}` : ''}` : '—'}</p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-gray-600 text-sm">Last Reading On</p>
                  <p className="font-semibold">{meter.lastReadingAt ? new Date(meter.lastReadingAt).toLocaleString() : '—'}</p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-gray-600 text-sm">Status</p>
                  <p className="font-semibold">{meter.active ? 'Active' : 'Inactive'}</p>
                </div>
              </div>
            </div>

            <div className="border-b border-zinc-200 my-4"></div>

            {/* Upcoming Reading Work Orders: dynamic empty state (no fake data) */}
            <div className="box-border caret-transparent shrink-0 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Upcoming Reading Work Orders</h2>
              </div>
              <div className="text-gray-500 text-sm">No upcoming work orders with meter readings configured</div>
            </div>

            <div className="border-b border-zinc-200 my-4"></div>

            {/* Metadata */}
            <div className="text-sm text-gray-600 space-y-2 mb-6">
              <div>Created on {new Date(meter.createdAt).toLocaleString()}</div>
              <div>Last updated on {new Date(meter.updatedAt).toLocaleString()}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
