
import React, { useState } from 'react';
import { MonthlyFeature } from './types';
import { doc, setDoc } from 'firebase/firestore';
import { db } from './firebase';
import { insertTag, RICH_TEXT_TOOLS } from './adminUtils';
import { Edit2, X } from 'lucide-react';

interface AdminFeatureTabProps {
  feature: MonthlyFeature;
}

export const AdminFeatureTab: React.FC<AdminFeatureTabProps> = ({ feature }) => {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="space-y-8 animate-fade-in relative">
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-xl">今月の特集記事</h3>
        <p className="text-sm text-gray-400">プレビューをクリックして編集モードを開始します</p>
      </div>

      {/* Main Preview Area - Acts as the entry point */}
      <div 
        className="group relative border rounded-[3rem] p-12 bg-white min-h-[800px] overflow-y-auto rich-text shadow-xl border-oct-100 cursor-pointer transition-all hover:shadow-2xl hover:border-oct-200"
        onClick={() => setIsEditing(true)}
      >
        <div className="absolute inset-0 bg-oct-900/0 group-hover:bg-oct-900/5 transition-colors duration-500 rounded-[3rem]" />
        
        {/* Floating Edit Button Overlay */}
        <div className="absolute top-8 right-8 z-10 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
           <span className="bg-oct-900 text-white px-6 py-3 rounded-full shadow-lg font-bold flex items-center gap-2">
             <Edit2 size={16} /> 編集する
           </span>
        </div>

        <header className="mb-10 text-center pointer-events-none">
           <span className="text-[10px] font-bold text-oct-300 tracking-[0.5em] block mb-4 uppercase">Content Preview</span>
           <h2 className="text-4xl font-bold mb-4 text-oct-950">{feature.title}</h2>
        </header>
        <div className="pointer-events-none" dangerouslySetInnerHTML={{ __html: feature.content }} />
      </div>

      {/* Editor Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 bg-oct-900/60 backdrop-blur-sm flex items-center justify-center p-2 lg:p-6" onClick={(e) => { if (e.target === e.currentTarget) setIsEditing(false) }}>
           <div className="bg-white w-full max-w-[95vw] lg:max-w-4xl h-[90vh] rounded-[3rem] shadow-2xl flex flex-col overflow-hidden animate-slide-up ring-4 ring-white/20">
              {/* Header */}
              <div className="p-6 border-b border-oct-100 flex justify-between items-center bg-oct-50 shrink-0">
                 <h4 className="font-bold text-oct-900 flex items-center gap-2">
                   <Edit2 size={18} /> 記事エディタ
                 </h4>
                 <button onClick={() => setIsEditing(false)} className="p-2 hover:bg-oct-200 rounded-full transition-colors">
                   <X size={24} className="text-oct-500" />
                 </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 md:p-10 space-y-10">
                 {/* Title Field */}
                 <div className="relative group">
                    <label className="block text-xs font-bold text-oct-400 mb-2 uppercase tracking-widest">Title</label>
                    <input 
                      value={feature.title} 
                      onChange={e => setDoc(doc(db, 'features', 'current_feature'), {...feature, title: e.target.value})}
                      className="w-full text-2xl md:text-3xl font-bold text-oct-950 py-2 bg-transparent outline-none placeholder-oct-200 text-center font-serif"
                      placeholder="記事タイトル"
                    />
                    {/* Outline Animation: Center Spread */}
                    <div className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-oct-900 transition-all duration-500 ease-out group-focus-within:w-full group-focus-within:left-0" />
                    <div className="absolute bottom-0 left-0 w-full h-[1px] bg-oct-100 -z-10" />
                 </div>

                 {/* Content Field */}
                 <div className="space-y-4">
                    <div className="flex flex-wrap gap-2 justify-center sticky top-0 bg-white/90 p-2 z-10 backdrop-blur-sm">
                      {RICH_TEXT_TOOLS.map(tool => (
                        <button key={tool.label} onClick={() => insertTag(feature.content, 'content', 'features', 'current_feature', tool.tagStart, tool.tagEnd, true, feature)} className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border ${tool.bg} ${tool.color} shadow-sm hover:scale-105 transition-transform`}>
                          {tool.label}
                        </button>
                      ))}
                    </div>
                    
                    <div className="relative group min-h-[400px]">
                      <textarea 
                        value={feature.content} 
                        onChange={e => setDoc(doc(db, 'features', 'current_feature'), {...feature, content: e.target.value})}
                        className="w-full h-[500px] p-8 text-base leading-loose font-mono bg-oct-50/20 rounded-2xl outline-none resize-none"
                        placeholder="記事本文..."
                      />
                      {/* Outline Animation: Center Spread Top/Bottom */}
                      <span className="absolute top-0 left-1/2 w-0 h-[2px] bg-oct-900 transition-all duration-500 ease-out group-focus-within:w-full group-focus-within:left-0" />
                      <span className="absolute bottom-0 left-1/2 w-0 h-[2px] bg-oct-900 transition-all duration-500 ease-out group-focus-within:w-full group-focus-within:left-0" />
                    </div>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};
