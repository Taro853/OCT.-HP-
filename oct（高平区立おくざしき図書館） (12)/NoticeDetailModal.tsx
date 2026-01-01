
import React from 'react';
import { Notice } from './types';
import { Bell, Calendar } from 'lucide-react';

interface NoticeDetailModalProps {
  notice: Notice;
}

export const NoticeDetailModal: React.FC<NoticeDetailModalProps> = ({ notice }) => {
  return (
    <div className="max-w-4xl mx-auto bg-white p-8 md:p-16 rounded-3xl shadow-xl border border-oct-100 animate-fade-in">
      <header className="mb-10 border-b border-oct-100 pb-8">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-2 text-xs font-bold text-oct-400 tracking-widest uppercase">
            <Calendar size={14} />
            <time>{notice.date}</time>
          </div>
          <span className={`px-3 py-1 rounded text-[10px] font-bold tracking-widest ${notice.category === 'IMPORTANT' ? 'bg-red-100 text-red-600' : notice.category === 'EVENT' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
             {notice.category === 'IMPORTANT' ? '重要なお知らせ' : notice.category === 'EVENT' ? 'イベント情報' : 'インフォメーション'}
          </span>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-oct-950 leading-tight">{notice.title}</h2>
      </header>
      
      <div className="rich-text leading-loose" dangerouslySetInnerHTML={{ __html: notice.content }} />
      
      <div className="mt-12 pt-8 border-t border-oct-50 flex justify-center">
        <div className="w-12 h-1 bg-oct-100 rounded-full"></div>
      </div>
    </div>
  );
};
