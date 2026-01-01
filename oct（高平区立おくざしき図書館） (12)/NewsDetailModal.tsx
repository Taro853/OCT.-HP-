
import React from 'react';
import { NewsItem } from './types';
import { FileText, Download, Calendar, ExternalLink, ChevronDown, Maximize2 } from 'lucide-react';

interface NewsDetailModalProps {
  news: NewsItem;
}

export const NewsDetailModal: React.FC<NewsDetailModalProps> = ({ news }) => {
  // Check if it's an external link (http/https) vs a data URI or relative path
  const isExternalLink = news.pdfUrl?.startsWith('http');
  // Specifically check for Drive to customize text, though isExternalLink handles the behavior
  const isGoogleDrive = news.pdfUrl?.includes('drive.google.com') || isExternalLink;

  return (
    <div className="max-w-6xl mx-auto animate-fade-in flex flex-col lg:flex-row gap-8 pb-20">
      
      {/* 1. Document Viewer (A4 Side) */}
      <div className="flex-1 lg:max-w-[800px]">
        <div className="sticky top-24 space-y-4">
           <div className="flex items-center justify-between px-4 text-xs font-bold text-oct-400 uppercase tracking-widest">
              <span>Document Viewer</span>
              <div className="flex gap-4">
                {news.pdfUrl && (
                  <a 
                    href={news.pdfUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 hover:text-oct-900 transition-colors"
                  >
                    <Maximize2 size={12}/> 全画面で開く
                  </a>
                )}
              </div>
           </div>

           <div className="document-page rounded-sm lg:rounded-md group">
              <div className="paper-texture"></div>
              {news.previewImageUrl ? (
                <img 
                  src={news.previewImageUrl} 
                  alt="Newsletter Preview" 
                  className="w-full h-full object-contain bg-gray-50"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 text-oct-200">
                   <FileText size={80} strokeWidth={1} />
                   <p className="mt-4 font-bold text-sm">プレビュー画像がありません</p>
                </div>
              )}
           </div>
           
           <div className="flex justify-center text-oct-300 animate-bounce pt-4 lg:hidden">
              <ChevronDown size={32} />
           </div>
        </div>
      </div>

      {/* 2. Content & Info Section */}
      <div className="lg:w-96 flex flex-col gap-8">
        <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-oct-100">
          <div className="flex items-center gap-2 text-[10px] font-bold text-oct-400 tracking-widest mb-4 uppercase">
            <Calendar size={14} />
            <time>{news.date}</time>
          </div>
          <h2 className="text-3xl font-bold text-oct-950 leading-tight mb-8 font-serif">
            {news.title}
          </h2>
          
          <div className="space-y-4">
            {news.pdfUrl && (
              <a 
                href={news.pdfUrl} 
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-3 bg-oct-900 text-white py-4 rounded-2xl text-sm font-bold shadow-lg hover:bg-oct-800 transition-all"
              >
                {isExternalLink ? <ExternalLink size={18}/> : <Download size={18}/>}
                {isGoogleDrive ? 'Googleドライブで閲覧' : 'PDF資料をダウンロード'}
              </a>
            )}
            
            <div className="p-4 bg-oct-50 rounded-2xl border border-oct-100">
               <p className="text-[10px] font-bold text-oct-400 mb-2 uppercase tracking-widest">Filename</p>
               <p className="text-xs font-bold text-oct-900 truncate">{news.fileName || 'newsletter.pdf'}</p>
            </div>
          </div>
        </div>

        {/* Article Summary / Content */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-oct-100">
          <h3 className="text-xs font-bold text-oct-400 mb-6 uppercase tracking-widest flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-oct-400 rounded-full"></span> 記事の概要
          </h3>
          <div className="rich-text text-sm leading-relaxed text-gray-600" dangerouslySetInnerHTML={{ __html: news.content }} />
        </div>

        <div className="text-center">
           <p className="text-[10px] text-gray-400 italic">
            ※閲覧環境により、画像が荒く見える場合があります。その際は{isGoogleDrive ? 'リンク先' : 'PDF'}をご確認ください。
          </p>
        </div>
      </div>
    </div>
  );
};
