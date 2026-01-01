
import React from 'react';
import { NewsItem } from './types';
import { Newspaper, ArrowRight, Calendar } from 'lucide-react';

interface AllNewsModalProps {
  news: NewsItem[];
  onNewsClick: (item: NewsItem) => void;
}

export const AllNewsModal: React.FC<AllNewsModalProps> = ({ news, onNewsClick }) => {
  return (
    <div className="max-w-6xl mx-auto py-12 animate-fade-in">
      <div className="text-center mb-12">
        <span className="text-[10px] font-bold text-oct-500 tracking-[0.5em] block mb-4 uppercase">Library Newsletters</span>
        <h2 className="text-4xl font-bold text-oct-950 mb-6">図書館だより バックナンバー</h2>
        <p className="text-gray-500">過去に発行された図書館だよりを閲覧・保存できます。</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {news.map(item => (
            <div key={item.id} onClick={() => onNewsClick(item)} className="group bg-white border border-oct-100 rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all cursor-pointer flex flex-col h-full">
                <div className="aspect-[3/4] relative overflow-hidden bg-oct-50 border-b border-oct-50">
                    <img src={item.previewImageUrl || 'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?q=80&w=1200'} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Newsletter" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                    <div className="absolute bottom-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                        <ArrowRight size={18} className="text-oct-900" />
                    </div>
                </div>
                <div className="p-8 flex flex-col flex-1">
                    <div className="flex items-center gap-2 mb-3">
                        <Calendar size={12} className="text-oct-300" />
                        <span className="text-[10px] text-oct-300 font-bold tracking-widest">{item.date}</span>
                    </div>
                    <h3 className="font-bold text-xl mb-2 text-oct-950 leading-tight group-hover:text-oct-700 transition-colors">{item.title}</h3>
                </div>
            </div>
        ))}
      </div>
      
      {news.length === 0 && (
        <div className="col-span-full text-center py-20 bg-white rounded-[2rem] border border-oct-100">
            <Newspaper className="mx-auto text-oct-200 mb-4" size={40} />
            <p className="text-gray-400">現在公開されている図書館だよりはありません</p>
        </div>
      )}
    </div>
  );
};
