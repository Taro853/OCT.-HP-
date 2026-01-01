
import React, { useState, useEffect } from 'react';
import { Book, ModalState, NewsItem, Notice, ClosedDate, MonthlyFeature, SurveyQuestion, Reservation, Librarian, SurveyResponse } from './types';
import { INITIAL_BOOKS, INITIAL_NEWS, INITIAL_NOTICES, INITIAL_CLOSED_DATES, INITIAL_FEATURE, INITIAL_LIBRARIANS, INITIAL_SURVEY } from './constants';
import { db } from './firebase';
import { collection, onSnapshot, doc, query, orderBy } from 'firebase/firestore';

// Components
import { Modal } from './Modal';
import { Header, Footer } from './Layout';
import { CalendarView } from './CalendarView';

// Modals
import { AdminModal } from './AdminModal';
import { FeatureModal } from './FeatureModal';
import { NewsDetailModal } from './NewsDetailModal';
import { AccessModal } from './AccessModal';
import { BookDetailModal } from './BookDetailModal';
import { LibrarianModal } from './LibrarianModal';
import { SurveyModal } from './SurveyModal';
import { NoticeDetailModal } from './NoticeDetailModal';
import { AllBooksModal } from './AllBooksModal';
import { AllNoticesModal } from './AllNoticesModal';
import { AllNewsModal } from './AllNewsModal';

import { FileText, ArrowRight, Calendar as CalendarIcon, BookOpen, Bell, Search, Info, Newspaper, ChevronRight, Sparkles } from 'lucide-react';

const App: React.FC = () => {
  const [books, setBooks] = useState<Book[]>(INITIAL_BOOKS);
  const [news, setNews] = useState<NewsItem[]>(INITIAL_NEWS);
  const [notices, setNotices] = useState<Notice[]>(INITIAL_NOTICES);
  const [closedDates, setClosedDates] = useState<ClosedDate[]>(INITIAL_CLOSED_DATES);
  const [currentFeature, setCurrentFeature] = useState<MonthlyFeature>(INITIAL_FEATURE);
  const [librarians, setLibrarians] = useState<Librarian[]>(INITIAL_LIBRARIANS);
  const [survey, setSurvey] = useState<SurveyQuestion[]>(INITIAL_SURVEY);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [surveyResponses, setSurveyResponses] = useState<SurveyResponse[]>([]);
  
  const [modalState, setModalState] = useState<ModalState>({ type: 'NONE' });
  const [wantToReadIds, setWantToReadIds] = useState<string[]>(() => JSON.parse(localStorage.getItem('oct_bookmark') || '[]'));
  
  // Quick Search State
  const [quickSearchInput, setQuickSearchInput] = useState('');

  useEffect(() => {
    if (!db) return;

    const unsubBooks = onSnapshot(collection(db, 'books'), (snap) => {
      if (!snap.empty) setBooks(snap.docs.map(d => ({ ...d.data(), id: d.id } as Book)));
    });

    const unsubNews = onSnapshot(query(collection(db, 'news'), orderBy('date', 'desc')), (snap) => {
      if (!snap.empty) setNews(snap.docs.map(d => ({ ...d.data(), id: d.id } as NewsItem)));
    });

    const unsubNotices = onSnapshot(query(collection(db, 'notices'), orderBy('date', 'desc')), (snap) => {
      if (!snap.empty) setNotices(snap.docs.map(d => ({ ...d.data(), id: d.id } as Notice)));
    });

    const unsubDates = onSnapshot(collection(db, 'closed_dates'), (snap) => {
      if (!snap.empty) setClosedDates(snap.docs.map(d => ({ ...d.data(), id: d.id } as ClosedDate)));
    });

    const unsubFeature = onSnapshot(doc(db, 'features', 'current_feature'), (docSnap) => {
      if (docSnap.exists()) setCurrentFeature(docSnap.data() as MonthlyFeature);
    });

    const unsubLibrarians = onSnapshot(collection(db, 'librarians'), (snap) => {
      if (!snap.empty) setLibrarians(snap.docs.map(d => ({ ...d.data(), id: d.id } as Librarian)));
    });

    const unsubReservations = onSnapshot(query(collection(db, 'reservations'), orderBy('timestamp', 'desc')), (snap) => {
      setReservations(snap.docs.map(d => ({ ...d.data(), id: d.id } as Reservation)));
    });

    const unsubSurveyResponses = onSnapshot(query(collection(db, 'survey_responses'), orderBy('timestamp', 'desc')), (snap) => {
       setSurveyResponses(snap.docs.map(d => ({ ...d.data(), id: d.id } as SurveyResponse)));
    });

    return () => {
      unsubBooks(); unsubNews(); unsubNotices(); unsubDates(); unsubFeature(); unsubLibrarians(); unsubReservations(); unsubSurveyResponses();
    };
  }, []);

  useEffect(() => localStorage.setItem('oct_bookmark', JSON.stringify(wantToReadIds)), [wantToReadIds]);

  const openModal = (type: ModalState['type'], data?: any) => setModalState({ type, data });
  const closeModal = () => setModalState({ type: 'NONE' });

  const toggleWantToRead = (id: string) => setWantToReadIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const isBookReserved = (bookId: string) => reservations.some(r => r.bookId === bookId && r.status !== 'COMPLETED');

  // Handle Quick Search Enter Key
  const handleQuickSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && quickSearchInput.trim()) {
      openModal('ALL_BOOKS', { searchTerm: quickSearchInput });
      setQuickSearchInput(''); // Optional: clear after search
    }
  };

  return (
    <div className="min-h-screen bg-[#fdfdfd] text-oct-950 font-serif">
      <Header onOpenModal={openModal} />

      {/* Hero Section */}
      <section className="relative h-[85vh] flex items-center justify-center overflow-hidden bg-oct-950">
        <div className="absolute inset-0 z-0">
          <img src={currentFeature.imageUrl} alt="Feature" className="w-full h-full object-cover opacity-30 animate-ken-burns" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-oct-950/20 to-oct-950" />
        </div>
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center text-white">
          <div className="mb-6 animate-slide-up flex items-center justify-center gap-3">
             <span className="h-[1px] w-8 bg-oct-400"></span>
             <span className="text-sm font-bold tracking-[0.5em] text-oct-300 uppercase">Special Exhibition</span>
             <span className="h-[1px] w-8 bg-oct-400"></span>
          </div>
          <h2 className="text-6xl md:text-8xl font-bold mb-8 serif animate-slide-up leading-tight max-w-[90vw] md:max-w-4xl mx-auto break-words">
            {currentFeature.title}
          </h2>
          <p className="text-xl md:text-3xl font-light italic mb-12 animate-slide-up text-oct-100">{currentFeature.subtitle}</p>
          <div className="flex flex-col md:flex-row justify-center items-center gap-6 animate-slide-up">
            <button 
              onClick={() => openModal('FEATURE')} 
              className="bg-white/5 backdrop-blur-xl border border-white/30 text-white px-10 py-5 rounded-full font-bold hover:bg-white/20 transition-all shadow-lg hover:shadow-xl hover:scale-105"
            >
              特集記事を読む
            </button>
          </div>
        </div>
      </section>

      {/* Quick Search Bar Below Hero */}
      <div className="max-w-4xl mx-auto px-6 -mt-10 relative z-20">
         <div 
          className="bg-white p-4 pl-6 rounded-[2rem] shadow-2xl border border-oct-100 flex items-center gap-6 hover:border-oct-400 transition-all group focus-within:ring-4 focus-within:ring-oct-50 focus-within:border-oct-400"
         >
            <div className="w-12 h-12 bg-oct-900 text-white rounded-2xl flex items-center justify-center shrink-0 shadow-lg group-hover:scale-110 transition-transform">
               <Search size={24} />
            </div>
            <div className="flex-1">
               <p className="text-[10px] font-bold text-oct-400 tracking-widest mb-1 uppercase">Instant Search</p>
               <input 
                 className="w-full text-lg font-bold text-oct-900 placeholder-gray-300 outline-none bg-transparent"
                 placeholder="何をお探しですか？ Enterで検索..."
                 value={quickSearchInput}
                 onChange={(e) => setQuickSearchInput(e.target.value)}
                 onKeyDown={handleQuickSearchKeyDown}
               />
            </div>
         </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-24 grid grid-cols-1 lg:grid-cols-12 gap-16">
        <div className="lg:col-span-8 space-y-28">
          
          {/* Notices */}
          <section>
            <div className="flex items-center justify-between mb-10 border-b-2 border-oct-50 pb-6">
              <h2 className="text-4xl font-bold serif flex items-center gap-4"><Bell className="text-oct-500" /> お知らせ</h2>
              <button onClick={() => openModal('ALL_NOTICES')} className="text-sm font-bold text-oct-500 hover:underline">すべて見る</button>
            </div>
            <div className="space-y-6">
              {notices.slice(0, 3).map(item => (
                <div key={item.id} onClick={() => openModal('NOTICE_DETAIL', item)} className="group flex justify-between items-center p-8 bg-white border border-oct-50 rounded-[2rem] shadow-sm hover:shadow-xl hover:translate-x-1 cursor-pointer transition-all">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-2">
                      <span className="text-[10px] font-bold text-oct-300 tracking-widest">{item.date}</span>
                      <span className={`text-[9px] px-3 py-1 rounded-full font-bold ${item.category === 'IMPORTANT' ? 'bg-red-50 text-red-600' : 'bg-oct-50 text-oct-600'}`}>{item.category}</span>
                    </div>
                    <h3 className="font-bold text-xl text-oct-950 group-hover:text-oct-600 transition-colors leading-relaxed">{item.title}</h3>
                  </div>
                  <ArrowRight size={24} className="text-oct-100 group-hover:text-oct-900 group-hover:translate-x-2 transition-all" />
                </div>
              ))}
            </div>
          </section>

          {/* Newsletters - Library Letters */}
          <section>
            <div className="flex items-center justify-between mb-10 border-b-2 border-oct-50 pb-6">
              <h2 className="text-4xl font-bold serif flex items-center gap-4"><Newspaper className="text-oct-600" /> 図書館だより</h2>
              <button onClick={() => openModal('ALL_NEWS')} className="text-sm font-bold text-oct-500 hover:underline">バックナンバー</button>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              {news.slice(0, 2).map(item => (
                <div key={item.id} onClick={() => openModal('NEWS_DETAIL', item)} className="group bg-white border border-oct-100 rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all cursor-pointer">
                  <div className="aspect-[3/4] md:aspect-video relative overflow-hidden bg-oct-50">
                    <img src={item.previewImageUrl || 'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?q=80&w=1200'} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[5s]" alt="Newsletter" />
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
                    <div className="absolute bottom-6 left-6 right-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all">
                       <button className="w-full bg-white/90 backdrop-blur-md text-oct-950 py-3 rounded-xl font-bold shadow-lg">中身を読む</button>
                    </div>
                  </div>
                  <div className="p-8">
                    <span className="text-[10px] text-oct-300 font-bold mb-3 block tracking-widest">{item.date}</span>
                    {/* Added break-words to handle long titles gracefully */}
                    <h3 className="font-bold text-2xl mb-2 text-oct-950 leading-tight break-words">{item.title}</h3>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Recommended Books */}
          <section>
            <div className="flex items-center justify-between mb-10 border-b-2 border-oct-50 pb-6">
              <h2 className="text-4xl font-bold serif flex items-center gap-4"><BookOpen className="text-oct-500" /> 今月のおすすめ</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {books.filter(b => b.isRecommended).map(book => (
                <div key={book.id} onClick={() => openModal('BOOK_DETAIL', book)} className="group cursor-pointer bg-white p-8 rounded-[2rem] border border-oct-100 shadow-sm hover:shadow-xl hover:border-oct-300 transition-all flex flex-col h-full">
                  <div className="flex justify-between items-start mb-6">
                    <span className="text-[10px] font-bold text-oct-500 bg-oct-50 px-3 py-1.5 rounded-lg">{book.category}</span>
                    {isBookReserved(book.id) && (
                      <span className="text-[10px] font-bold text-red-500 border border-red-100 px-3 py-1.5 rounded-lg bg-red-50/50">現在貸出中</span>
                    )}
                  </div>
                  <h4 className="font-bold text-2xl mb-2 group-hover:text-oct-700 transition-colors flex-grow leading-tight">{book.title}</h4>
                  <p className="text-gray-500 mb-6 font-medium">{book.author}</p>
                  <div className="flex justify-end pt-4 border-t border-oct-50">
                    <span className="text-xs text-oct-400 font-bold flex items-center gap-1 group-hover:text-oct-900 transition-colors">詳しく見る <ChevronRight size={16} /></span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <aside className="lg:col-span-4 space-y-12">
          <section>
            <h3 className="text-xl font-bold serif mb-6 flex items-center gap-2"><CalendarIcon size={20} className="text-oct-500" /> 休館日カレンダー</h3>
            <CalendarView closedDates={closedDates} />
          </section>
          
          <div className="bg-oct-950 text-white p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
            <div className="absolute -right-10 -bottom-10 text-white opacity-5 rotate-12 transition-transform group-hover:rotate-0">
               <Info size={240} />
            </div>
            <div className="relative z-10">
              <h3 className="font-bold mb-6 flex items-center gap-2 text-oct-300 uppercase tracking-widest text-xs">Library Hours</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-white/10 pb-4">
                   <span className="text-oct-400 font-medium">平日</span>
                   <span className="text-2xl font-bold">9:30 - 20:00</span>
                </div>
                <div className="flex justify-between items-center border-b border-white/10 pb-4">
                   <span className="text-oct-400 font-medium">土日祝</span>
                   <span className="text-2xl font-bold">9:30 - 18:00</span>
                </div>
              </div>
              <button onClick={() => openModal('ACCESS')} className="w-full mt-10 bg-white text-oct-950 py-4 rounded-2xl font-bold hover:bg-oct-100 transition-colors shadow-lg active:scale-95">アクセス・地図</button>
            </div>
          </div>
        </aside>
      </main>

      <Footer onOpenSurvey={() => openModal('SURVEY')} />

      <Modal isOpen={modalState.type !== 'NONE'} onClose={closeModal} onNavigate={openModal}>
        {modalState.type === 'ADMIN' && (
          <AdminModal 
            books={books}
            news={news}
            notices={notices}
            closedDates={closedDates}
            feature={currentFeature}
            librarians={librarians}
            survey={survey}
            reservations={reservations}
            surveyResponses={surveyResponses}
          />
        )}
        {modalState.type === 'FEATURE' && <FeatureModal feature={currentFeature} allBooks={books} onBookClick={(b) => openModal('BOOK_DETAIL', b)} />}
        {modalState.type === 'NEWS_DETAIL' && <NewsDetailModal news={modalState.data} />}
        {modalState.type === 'NOTICE_DETAIL' && <NoticeDetailModal notice={modalState.data} />}
        {modalState.type === 'ACCESS' && <AccessModal />}
        {modalState.type === 'BOOK_DETAIL' && (
          <BookDetailModal 
            book={modalState.data} 
            isReserved={isBookReserved(modalState.data?.id)}
            isBookmarked={wantToReadIds.includes(modalState.data?.id)}
            onToggleBookmark={() => toggleWantToRead(modalState.data.id)}
          />
        )}
        {modalState.type === 'LIBRARIAN' && <LibrarianModal librarians={librarians} />}
        {modalState.type === 'SURVEY' && <SurveyModal questions={survey} onSubmit={closeModal} />}
        {modalState.type === 'ALL_BOOKS' && <AllBooksModal books={books} onBookClick={(b) => openModal('BOOK_DETAIL', b)} initialSearchTerm={modalState.data?.searchTerm} />}
        {modalState.type === 'ALL_NOTICES' && <AllNoticesModal notices={notices} onNoticeClick={(n) => openModal('NOTICE_DETAIL', n)} />}
        {modalState.type === 'ALL_NEWS' && <AllNewsModal news={news} onNewsClick={(n) => openModal('NEWS_DETAIL', n)} />}
      </Modal>
    </div>
  );
};

export default App;
