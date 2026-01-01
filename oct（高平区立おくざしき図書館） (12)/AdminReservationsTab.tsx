import React from 'react';
import { Reservation } from './types';
import { Check, X, Trash2 } from 'lucide-react';
import { updateItem, removeItem } from './adminUtils';

interface AdminReservationsTabProps {
  reservations: Reservation[];
}

export const AdminReservationsTab: React.FC<AdminReservationsTabProps> = ({ reservations }) => {
  return (
    <div className="space-y-8 animate-fade-in">
       <h3 className="font-bold text-xl flex items-center gap-2">利用者予約管理</h3>
       <div className="overflow-x-auto rounded-[2rem] border border-oct-100 shadow-sm bg-white">
        <table className="w-full text-sm text-left border-collapse">
          <thead>
            <tr className="bg-oct-50/50 text-oct-500 uppercase text-[10px] font-bold tracking-widest">
              <th className="p-8">予約日時</th>
              <th className="p-8">書籍名</th>
              <th className="p-8">お名前</th>
              <th className="p-8">受取合言葉</th>
              <th className="p-8">状態</th>
              <th className="p-8 text-center">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-oct-50">
            {reservations.map(r => (
              <tr key={r.id} className="hover:bg-oct-50/20 transition-colors">
                <td className="p-8 text-[10px] text-gray-400">{r.timestamp}</td>
                <td className="p-8 font-bold text-oct-900">{r.bookTitle}</td>
                <td className="p-8">{r.userName}</td>
                <td className="p-8"><span className="bg-oct-50 px-3 py-1 rounded font-mono text-oct-700 tracking-widest">{r.passphrase}</span></td>
                <td className="p-8">
                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold shadow-sm ${r.status === 'READY' ? 'bg-green-100 text-green-700' : r.status === 'PENDING' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-500'}`}>
                    {r.status === 'READY' ? '準備完了' : r.status === 'PENDING' ? '準備中' : '受取済'}
                  </span>
                </td>
                <td className="p-8 flex justify-center gap-3">
                  {r.status === 'PENDING' && (
                    <button onClick={() => updateItem('reservations', r.id, {status: 'READY'})} className="p-3 bg-green-50 text-green-600 rounded-2xl hover:bg-green-100 transition-colors"><Check size={20}/></button>
                  )}
                  <button onClick={() => updateItem('reservations', r.id, {status: 'COMPLETED'})} className="p-3 bg-oct-50 text-oct-600 rounded-2xl hover:bg-oct-100 transition-colors"><X size={20}/></button>
                  <button onClick={() => removeItem('reservations', r.id)} className="p-3 bg-red-50 text-red-400 rounded-2xl hover:bg-red-100 transition-colors"><Trash2 size={20}/></button>
                </td>
              </tr>
            ))}
            {reservations.length === 0 && <tr><td colSpan={6} className="p-24 text-center text-gray-300 italic text-lg">現在予約履歴はありません</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
};