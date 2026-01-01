import React from 'react';
import { Book } from './types';
import { BookOpen, ChevronRight } from 'lucide-react';

interface FeatureModalProps {
  feature: {
    title: string;
    subtitle: string;
    imageUrl: string;
    content: string;
    books: string[];
  };
  allBooks: Book[];
  onBookClick: (book: Book) => void;
}

export const FeatureModal: React.FC<FeatureModalProps> = ({ feature, allBooks, onBookClick }) => {
  const relatedBooks = allBooks.filter((b) => feature.books.includes(b.id));

  return (
    <div className="max-w-4xl mx-auto py-12 animate-fade-in">
      <header className="text-center mb-16">
        <span className="text-[10px] font-bold text-oct-500 tracking-[0.5em] block mb-4 uppercase">Monthly Special Feature</span>
        <h2 className="text-5xl md:text-7xl font-bold mb-6 text-oct-950 leading-tight">{feature.title}</h2>
        <p className="text-2xl text-oct-600 italic font-light">{feature.subtitle}</p>
      </header>
      
      <div className="mb-16 rounded-3xl overflow-hidden shadow-2xl group">
        <img src={feature.imageUrl} alt={feature.title} className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-[10s]" />
      </div>

      <article 
        className="rich-text prose prose-xl mx-auto leading-loose px-6 mb-20" 
        dangerouslySetInnerHTML={{ __html: feature.content }} 
      />
      
      {relatedBooks.length > 0 && (
        <div className="mt-20 p-8 md:p-12 bg-oct-50 rounded-3xl border border-oct-100 shadow-inner">
          <h3 className="text-2xl font-bold mb-10 text-center flex items-center justify-center gap-3">
            <BookOpen className="text-oct-500" /> 特集に関連する図書
          </h3>
          <div className="grid gap-4">
            {relatedBooks.map((book) => (
              <div 
                key={book.id} 
                onClick={() => onBookClick(book)} 
                className="flex items-center justify-between bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-all cursor-pointer border border-white hover:border-oct-200 group"
              >
                <div className="flex items-center gap-6">
                   <div className="w-10 h-10 bg-oct-100 text-oct-500 rounded-full flex items-center justify-center">
                      <BookOpen size={20} />
                   </div>
                   <div>
                     <p className="font-bold text-xl text-oct-900 group-hover:text-oct-700 transition-colors">{book.title}</p>
                     <p className="text-sm text-gray-500">{book.author}</p>
                   </div>
                </div>
                <ChevronRight className="text-oct-200 group-hover:text-oct-500" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};