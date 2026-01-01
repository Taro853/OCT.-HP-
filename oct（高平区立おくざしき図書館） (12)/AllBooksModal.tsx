
import React, { useState } from 'react';
import { Book } from './types';
import { Search, BookOpen, ChevronRight } from 'lucide-react';

interface AllBooksModalProps {
  books: Book[];
  onBookClick: (book: Book) => void;
  initialSearchTerm?: string;
}

export const AllBooksModal: React.FC<AllBooksModalProps> = ({ books, onBookClick, initialSearchTerm = '' }) => {
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);

  const filteredBooks = books.filter(b => 
    b.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    b.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto py-12 animate-fade-in">
      <div className="text-center mb-12">
        <span className="text-[10px] font-bold text-oct-500 tracking-[0.5em] block mb-4 uppercase">Library Collection</span>
        <h2 className="text-4xl font-bold text-oct-950 mb-6">蔵書一覧</h2>
        <p className="text-gray-500">当館の所蔵する書籍を検索・閲覧できます。</p>
      </div>

      <div className="mb-10 relative max-w-xl mx-auto">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-oct-300" size={20} />
        <input 
          type="text" 
          autoFocus={!initialSearchTerm}
          placeholder="タイトル、著者名、カテゴリで検索..." 
          className="w-full pl-12 pr-6 py-4 rounded-full border border-oct-200 outline-none focus:border-oct-500 focus:ring-4 focus:ring-oct-50 transition-all"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="bg-white rounded-[2rem] shadow-sm border border-oct-100 overflow-hidden min-h-[400px]">
        {filteredBooks.length > 0 ? (
          <div className="divide-y divide-oct-50">
            {filteredBooks.map(book => (
              <div 
                key={book.id} 
                onClick={() => onBookClick(book)}
                className="p-6 md:p-8 flex items-center justify-between hover:bg-oct-50 cursor-pointer transition-colors group"
              >
                <div className="flex items-start gap-6">
                  <div className="hidden md:flex flex-col items-center justify-center w-12 h-16 bg-oct-50 text-oct-300 rounded border border-oct-100 shrink-0">
                    <BookOpen size={20} />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                       <span className="text-[10px] font-bold bg-oct-100 text-oct-700 px-2 py-0.5 rounded">{book.category}</span>
                       <span className="text-[10px] font-bold bg-amber-50 text-amber-700 px-2 py-0.5 rounded flex items-center gap-1">
                          <svg className="w-3 h-3 text-amber-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                             <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                             <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                          </svg>
                          {book.location || '本館'}
                       </span>
                       {book.isNew && <span className="text-[10px] font-bold bg-red-100 text-red-600 px-2 py-0.5 rounded">NEW</span>}
                    </div>
                    <h3 className="text-xl font-bold text-oct-900 group-hover:text-oct-600 transition-colors mb-1">{book.title}</h3>
                    <p className="text-sm text-gray-500">{book.author} <span className="text-oct-200 text-xs ml-2">|</span> <span className="text-gray-400 text-xs ml-2">{book.publisher}</span></p>
                  </div>
                </div>
                <ChevronRight className="text-oct-200 group-hover:text-oct-500 transition-colors" />
              </div>
            ))}
          </div>
        ) : (
          <div className="p-20 text-center text-gray-400">
            <BookOpen size={48} className="mx-auto mb-4 opacity-20" />
            <p>検索条件に一致する書籍は見つかりませんでした。</p>
          </div>
        )}
      </div>
    </div>
  );
};
