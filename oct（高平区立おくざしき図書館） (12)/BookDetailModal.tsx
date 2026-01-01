
import React, { useState } from 'react';
import { Book, Review } from './types';
import { BookOpen, User, Tag, Heart, CheckCircle, ShieldCheck } from 'lucide-react';
import { db } from './firebase';
import { collection, addDoc, updateDoc, doc, arrayUnion } from 'firebase/firestore';

interface BookDetailModalProps {
  book: Book;
  isReserved: boolean;
  isBookmarked: boolean;
  onToggleBookmark: () => void;
}

export const BookDetailModal: React.FC<BookDetailModalProps> = ({ 
  book, 
  isReserved, 
  isBookmarked, 
  onToggleBookmark 
}) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [reservationData, setReservationData] = useState({ name: '', pass: '' });
  const [reviewData, setReviewData] = useState({ user: '', comment: '', rating: 5 });
  const [isReserving, setIsReserving] = useState(false);

  const handleReserveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reservationData.name || !reservationData.pass) return;

    try {
      await addDoc(collection(db, 'reservations'), {
        bookId: book.id,
        bookTitle: book.title,
        userName: reservationData.name,
        passphrase: reservationData.pass,
        timestamp: new Date().toLocaleString('ja-JP'),
        status: 'PENDING'
      });
      setShowConfirm(true);
      setReservationData({ name: '', pass: '' });
      setIsReserving(false);
      setTimeout(() => setShowConfirm(false), 3000);
    } catch (err) {
      alert('予約に失敗しました。');
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewData.comment || !reviewData.user) return;

    const newReview: Review = {
      id: Date.now().toString(),
      user: reviewData.user,
      comment: reviewData.comment,
      rating: reviewData.rating,
      timestamp: new Date().toLocaleString('ja-JP')
    };

    try {
      await updateDoc(doc(db, 'books', book.id), {
        reviews: arrayUnion(newReview)
      });
      setReviewData({ user: '', comment: '', rating: 5 });
    } catch (err) {
      alert('口コミの投稿に失敗しました。');
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-20">
      <div className="bg-white rounded-[3rem] shadow-xl border border-oct-100 animate-fade-in relative p-12 overflow-hidden">
        {showConfirm && (
          <div className="absolute top-6 left-1/2 -translate-x-1/2 z-50 animate-slide-up bg-oct-900 text-white px-8 py-3 rounded-full flex items-center gap-3 shadow-2xl">
            <CheckCircle size={18} className="text-oct-300" />
            <span className="text-sm font-bold">予約を受け付けました</span>
          </div>
        )}
        
        <BookOpen className="absolute -right-10 -bottom-10 text-oct-50 w-96 h-96 opacity-50" />

        <div className="relative z-10 max-w-3xl mx-auto text-center space-y-8">
           <div className="flex justify-center gap-3">
              <div className="inline-flex items-center gap-2 bg-oct-50 px-4 py-2 rounded-full">
                <Tag size={14} className="text-oct-500" />
                <span className="text-sm font-bold text-oct-800">{book.category}</span>
              </div>
              <div className="inline-flex items-center gap-2 bg-amber-50 px-4 py-2 rounded-full border border-amber-100">
                <svg className="w-4 h-4 text-amber-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                   <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                   <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                </svg>
                <span className="text-sm font-bold text-amber-800">{book.location || '本館'}</span>
              </div>
           </div>
           
           <h2 className="text-4xl md:text-5xl font-bold text-oct-950 leading-tight">{book.title}</h2>
           
           <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 text-oct-500">
             <div className="flex items-center gap-2">
               <User size={18} /> <span className="text-lg">{book.author} 著</span>
             </div>
             {book.publisher && (
               <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-oct-300 rounded-full"></span>
                  <span>{book.publisher}</span>
               </div>
             )}
           </div>

           <div className="py-8">
             <div className="bg-oct-50/50 p-8 rounded-3xl border border-oct-100 text-left">
               <p className="text-gray-700 leading-loose font-medium text-lg">
                 {book.description}
               </p>
             </div>
           </div>

           <div className="flex flex-col md:flex-row gap-4 justify-center max-w-xl mx-auto">
            {!isReserving ? (
              <button 
                onClick={() => setIsReserving(true)}
                disabled={isReserved}
                className={`flex-1 py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-3 shadow-lg ${isReserved ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-oct-900 text-white hover:bg-oct-800 active:scale-95'}`}
              >
                <BookOpen size={20} /> {isReserved ? '現在貸出中です' : 'この本を予約する'}
              </button>
            ) : (
              <form onSubmit={handleReserveSubmit} className="w-full p-6 bg-oct-50 rounded-3xl border border-oct-200 animate-slide-up space-y-4 text-left">
                <div className="flex items-center gap-2 mb-2 text-oct-900 justify-center">
                  <ShieldCheck size={18} /> <span className="text-xs font-bold">予約フォーム</span>
                </div>
                <input 
                  required 
                  placeholder="お名前" 
                  className="w-full p-3 text-sm border rounded-xl outline-none" 
                  value={reservationData.name} 
                  onChange={e => setReservationData({...reservationData, name: e.target.value})}
                />
                <input 
                  required 
                  type="password" 
                  placeholder="合言葉 (受け取り時に確認します)" 
                  className="w-full p-3 text-sm border rounded-xl outline-none" 
                  value={reservationData.pass} 
                  onChange={e => setReservationData({...reservationData, pass: e.target.value})}
                />
                <div className="flex gap-2">
                  <button type="submit" className="flex-1 bg-oct-900 text-white py-3 rounded-xl font-bold text-xs">予約を確定する</button>
                  <button type="button" onClick={() => setIsReserving(false)} className="px-4 border rounded-xl text-xs text-gray-500 bg-white">キャンセル</button>
                </div>
              </form>
            )}
            {!isReserving && (
              <button 
                onClick={onToggleBookmark}
                className={`px-6 py-4 rounded-2xl transition-all border flex items-center justify-center gap-2 ${isBookmarked ? 'bg-red-50 text-red-500 border-red-100' : 'bg-white border-oct-200 text-oct-300 hover:bg-oct-50'}`}
              >
                <Heart size={20} fill={isBookmarked ? "currentColor" : "none"} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
