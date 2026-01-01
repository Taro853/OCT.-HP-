import React, { useState } from 'react';
import { ClosedDate } from './types';
import { Trash2, Plus, Calendar } from 'lucide-react';
import { createItem, removeItem } from './adminUtils';

interface AdminDatesTabProps {
  closedDates: ClosedDate[];
}

export const AdminDatesTab: React.FC<AdminDatesTabProps> = ({ closedDates }) => {
  const [newDate, setNewDate] = useState('');
  const [newReason, setNewReason] = useState('休館日');

  const handleAdd = async () => {
    if (!newDate) return;
    await createItem('closed_dates', { date: newDate, reason: newReason });
    setNewDate('');
  };

  return (
    <div className="space-y-12 animate-fade-in max-w-4xl mx-auto">
      <h3 className="font-bold text-xl flex items-center gap-2"><Calendar className="text-oct-500" /> 休館日設定</h3>
      
      <div className="bg-oct-50 p-8 rounded-[2rem] border border-oct-100 flex flex-col md:flex-row gap-4 items-end shadow-inner">
        <div className="flex-1 w-full">
          <label className="text-xs font-bold text-gray-500 mb-2 block">日付</label>
          <input 
            type="date" 
            value={newDate} 
            onChange={e => setNewDate(e.target.value)}
            className="w-full p-3 rounded-xl border border-oct-200"
          />
        </div>
        <div className="flex-1 w-full">
          <label className="text-xs font-bold text-gray-500 mb-2 block">理由</label>
          <input 
            type="text" 
            value={newReason} 
            onChange={e => setNewReason(e.target.value)}
            className="w-full p-3 rounded-xl border border-oct-200"
            placeholder="例：施設点検"
          />
        </div>
        <button 
          onClick={handleAdd}
          disabled={!newDate}
          className="bg-oct-900 text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:bg-oct-800 disabled:opacity-50 transition-all flex items-center gap-2"
        >
          <Plus size={18} /> 追加
        </button>
      </div>

      <div className="grid gap-4">
        {closedDates.sort((a,b) => a.date.localeCompare(b.date)).map(d => (
          <div key={d.id} className="flex items-center justify-between p-6 bg-white border border-oct-100 rounded-2xl shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center gap-6">
              <span className="font-bold text-lg text-oct-900 font-mono bg-oct-50 px-4 py-2 rounded-lg">{d.date}</span>
              <span className="text-gray-600 font-medium">{d.reason}</span>
            </div>
            <button 
              onClick={() => removeItem('closed_dates', d.id)}
              className="p-3 text-red-400 hover:bg-red-50 rounded-xl transition-colors"
            >
              <Trash2 size={20} />
            </button>
          </div>
        ))}
        {closedDates.length === 0 && (
          <p className="text-center text-gray-400 italic py-10">設定された休館日はありません</p>
        )}
      </div>
    </div>
  );
};