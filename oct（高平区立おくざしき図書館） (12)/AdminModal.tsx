
import React, { useState } from 'react';
import { Lock } from 'lucide-react';
import { AdminPanel } from './AdminPanel';
import { Book, NewsItem, Notice, ClosedDate, MonthlyFeature, SurveyQuestion, Reservation, Librarian, SurveyResponse } from './types';

interface AdminModalProps {
  books: Book[];
  news: NewsItem[];
  notices: Notice[];
  closedDates: ClosedDate[];
  feature: MonthlyFeature;
  librarians: Librarian[];
  survey: SurveyQuestion[];
  reservations: Reservation[];
  surveyResponses: SurveyResponse[];
}

export const AdminModal: React.FC<AdminModalProps> = (props) => {
  const [adminPassword, setAdminPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPassword === '221') {
      setIsAuthenticated(true);
      setAdminPassword('');
    } else {
      alert('パスワードが違います');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] animate-fade-in">
        <div className="w-full max-w-sm bg-white p-10 rounded-3xl shadow-2xl border border-oct-100 text-center">
          <Lock size={40} className="mx-auto text-oct-900 mb-6" />
          <h2 className="text-2xl font-bold mb-8 uppercase tracking-widest">Admin Login</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              className="w-full p-4 text-center text-3xl tracking-[0.8em] border rounded-2xl outline-none focus:ring-2 ring-oct-100 font-sans"
              placeholder="****"
              autoFocus
            />
            <button className="w-full bg-oct-900 text-white py-4 rounded-2xl font-bold hover:bg-oct-800 transition-all shadow-lg">
              認証する
            </button>
          </form>
          <p className="mt-6 text-[10px] text-gray-400 uppercase tracking-tighter">Enter management password to access CMS</p>
        </div>
      </div>
    );
  }

  return <AdminPanel {...props} />;
};
