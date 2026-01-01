
import React, { useState } from 'react';
import { Lock, Menu, X, BookOpen, MessageCircle, Search, Phone } from 'lucide-react';
import { ModalType } from './types';

interface HeaderProps {
  onOpenModal: (type: ModalType) => void;
  isModal?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onOpenModal, isModal = false }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogoClick = () => {
    if (isModal) {
      onOpenModal('NONE');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNav = (type: ModalType) => {
    setMobileMenuOpen(false);
    onOpenModal(type);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-oct-100 shadow-sm transition-all duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer group" onClick={handleLogoClick}>
          <div className="w-10 h-10 bg-oct-900 text-white rounded-sm flex items-center justify-center shadow-lg group-hover:bg-oct-700 transition-colors">
            <BookOpen size={24} strokeWidth={1.5} />
          </div>
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold text-oct-900 tracking-tight leading-none group-hover:text-oct-700 transition-colors">
              OCT
            </h1>
            <span className="text-[10px] font-medium text-oct-600 tracking-widest uppercase">高平区立おくざしき図書館</span>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-oct-800">
          <button 
            onClick={() => onOpenModal('ALL_BOOKS')}
            className="flex items-center gap-2 bg-oct-900 text-white px-5 py-2.5 rounded-full hover:bg-oct-800 transition-all shadow-md group"
          >
            <Search size={16} className="group-hover:scale-110 transition-transform" />
            <span>蔵書を検索する</span>
          </button>
          <button onClick={handleLogoClick} className="hover:text-oct-500 transition-colors">ホーム</button>
          <button onClick={() => onOpenModal('ACCESS')} className="hover:text-oct-500 transition-colors">アクセス</button>
          <button onClick={() => onOpenModal('LIBRARIAN')} className="hover:text-oct-500 transition-colors">司書紹介</button>
          <button 
            onClick={() => onOpenModal('ADMIN')}
            className="flex items-center gap-1 bg-oct-50 text-oct-800 px-4 py-2 rounded-full hover:bg-oct-100 transition-all border border-oct-200"
          >
            <Lock size={14} /> <span className="text-xs">管理者</span>
          </button>
        </nav>

        <button className="md:hidden p-2 text-oct-800" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>
      
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-oct-100 absolute w-full left-0 animate-fade-in shadow-xl">
          <div className="flex flex-col p-6 gap-6 text-center font-medium">
             <button onClick={() => handleNav('ALL_BOOKS')} className="py-2 flex justify-center items-center gap-2 text-oct-900 font-bold"><Search size={18} /> 蔵書検索</button>
             <button onClick={handleLogoClick} className="py-2">ホーム</button>
             <button onClick={() => handleNav('ACCESS')} className="py-2">アクセス</button>
             <button onClick={() => handleNav('LIBRARIAN')} className="py-2">司書紹介</button>
             <button onClick={() => handleNav('ADMIN')} className="py-2 flex justify-center items-center gap-2"><Lock size={14} /> 管理者</button>
          </div>
        </div>
      )}
    </header>
  );
};

export const Footer: React.FC<{onOpenSurvey?: () => void}> = ({ onOpenSurvey }) => {
  return (
    <footer className="bg-oct-950 text-white py-16 border-t-4 border-oct-600">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-12">
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-white text-oct-900 rounded-sm flex items-center justify-center">
              <BookOpen size={20} />
            </div>
            <h2 className="text-xl font-bold">OCT Library</h2>
          </div>
          <p className="text-oct-200 text-sm">高平区立おくざしき図書館。</p>
        </div>
        <div>
           <h3 className="font-bold text-lg mb-6 border-b border-oct-800 pb-2">開館時間</h3>
           <ul className="space-y-3 text-oct-200 text-sm">
             <li className="flex gap-8"><span>平日</span><span className="font-bold text-white">9:30 - 20:00</span></li>
             <li className="flex gap-8"><span>土日祝</span><span className="font-bold text-white">9:30 - 18:00</span></li>
           </ul>
        </div>
        <div>
          <h3 className="font-bold text-lg mb-6 border-b border-oct-800 pb-2">お問い合わせ</h3>
          <div className="flex flex-col items-start gap-4">
            <a href="tel:07085417143" className="flex items-center gap-3 text-2xl font-bold text-white hover:text-oct-300 transition-colors">
              <Phone size={24} /> 070-8541-7143
            </a>
            {onOpenSurvey && (
              <button onClick={onOpenSurvey} className="flex items-center gap-2 bg-oct-800 px-4 py-2 rounded-lg text-sm font-bold hover:bg-oct-700 transition-colors"><MessageCircle size={16} /> アンケート協力</button>
            )}
          </div>
        </div>
      </div>
      <div className="mt-12 text-center text-xs text-oct-500">
        &copy; {new Date().getFullYear()} Takahira Ward Okuzashiki Library.
      </div>
    </footer>
  );
};
