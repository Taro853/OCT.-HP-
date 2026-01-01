
import React from 'react';
import { Notice } from './types';
import { Bell, ArrowRight, Info, Calendar } from 'lucide-react';

interface AllNoticesModalProps {
  notices: Notice[];
  onNoticeClick: (notice: Notice) => void;
}

export const AllNoticesModal: React.FC<AllNoticesModalProps> = ({ notices, onNoticeClick }) => {
  return (
    <div className="max-w-4xl mx-auto py-12 animate-fade-in">
      <div className="text-center mb-12">
        <span className="text-[10px] font-bold text-oct-500 tracking-[0.5em] block mb-4 uppercase">Information</span>
        <h2 className="text-4xl font-bold text-oct-950 mb-6">お知らせ一覧</h2>
        <p className="text-gray-500">図書館からのお知らせやイベント情報をご確認いただけます。</p>
      </div>

      <div className="space-y-4">
        {notices.map(item => (
            <div key={item.id} onClick={() => onNoticeClick(item)} className="group flex justify-between items-center p-6 md:p-8 bg-white border border-oct-100 rounded-[2rem] shadow-sm hover:shadow-xl hover:translate-x-1 cursor-pointer transition-all">
                <div className="flex-1">
                <div className="flex items-center gap-4 mb-2">
                    <span className="text-[10px] font-bold text-oct-300 tracking-widest flex items-center gap-1"><Calendar size={10}/> {item.date}</span>
                    <span className={`text-[9px] px-3 py-1 rounded-full font-bold ${item.category === 'IMPORTANT' ? 'bg-red-50 text-red-600' : 'bg-oct-50 text-oct-600'}`}>{item.category}</span>
                </div>
                <h3 className="font-bold text-lg md:text-xl text-oct-950 group-hover:text-oct-600 transition-colors leading-relaxed">{item.title}</h3>
                </div>
                <div className="w-10 h-10 rounded-full bg-oct-50 flex items-center justify-center text-oct-300 group-hover:bg-oct-900 group-hover:text-white transition-all ml-4 shrink-0">
                    <ArrowRight size={18} />
                </div>
            </div>
        ))}

        {notices.length === 0 && (
            <div className="text-center py-20 bg-white rounded-[2rem] border border-oct-100">
                <Info className="mx-auto text-oct-200 mb-4" size={40} />
                <p className="text-gray-400">現在お知らせはありません</p>
            </div>
        )}
      </div>
    </div>
  );
};
