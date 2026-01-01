
import React, { useState } from 'react';
import { Book, NewsItem, Notice, ClosedDate, MonthlyFeature, SurveyQuestion, Reservation, Librarian, SurveyResponse } from './types';
import { Layout, Bell, BookOpen, UserCheck, Calendar as CalendarIcon, Edit2, Users, MessageSquare } from 'lucide-react';
import { AdminBooksTab } from './AdminBooksTab';
import { AdminNewsTab } from './AdminNewsTab';
import { AdminNoticesTab } from './AdminNoticesTab';
import { AdminReservationsTab } from './AdminReservationsTab';
import { AdminFeatureTab } from './AdminFeatureTab';
import { AdminDatesTab } from './AdminDatesTab';
import { AdminLibrariansTab } from './AdminLibrariansTab';
import { AdminSurveysTab } from './AdminSurveysTab';

interface AdminPanelProps {
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

type Tab = 'news' | 'notices' | 'books' | 'dates' | 'reservations' | 'feature' | 'librarians' | 'surveys';

export const AdminPanel: React.FC<AdminPanelProps> = ({
  books, news, notices, closedDates, feature, reservations, survey, librarians, surveyResponses
}) => {
  const [activeTab, setActiveTab] = useState<Tab>('news');

  return (
    <div className="space-y-8 pb-20 font-serif max-w-7xl mx-auto px-4 bg-[#fcfcfc] min-h-screen">
       <div className="flex flex-wrap justify-center gap-2 border-b border-oct-200 pb-4 sticky top-0 bg-white/95 backdrop-blur-sm z-20 pt-4">
        {[
          { id: 'news', label: 'だより管理', icon: <Layout size={16}/> },
          { id: 'notices', label: 'お知らせ作成', icon: <Bell size={16}/> },
          { id: 'books', label: '蔵書・AI一括登録', icon: <BookOpen size={16}/> },
          { id: 'reservations', label: '予約確認', icon: <UserCheck size={16}/> },
          { id: 'dates', label: 'カレンダー', icon: <CalendarIcon size={16}/> },
          { id: 'feature', label: '特集記事', icon: <Edit2 size={16}/> },
          { id: 'librarians', label: '司書管理', icon: <Users size={16}/> },
          { id: 'surveys', label: 'アンケート結果', icon: <MessageSquare size={16}/> },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as Tab)}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold transition-all border ${
              activeTab === tab.id ? 'bg-oct-900 text-white border-oct-900 shadow-lg scale-105' : 'bg-white text-oct-600 border-oct-100 hover:bg-oct-50'
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-[2rem] shadow-xl border border-oct-100 p-8 min-h-[700px]">
        {activeTab === 'books' && <AdminBooksTab books={books} />}
        {activeTab === 'news' && <AdminNewsTab news={news} books={books} />}
        {activeTab === 'notices' && <AdminNoticesTab notices={notices} books={books} />}
        {activeTab === 'reservations' && <AdminReservationsTab reservations={reservations} />}
        {activeTab === 'dates' && <AdminDatesTab closedDates={closedDates} />}
        {activeTab === 'feature' && <AdminFeatureTab feature={feature} />}
        {activeTab === 'librarians' && <AdminLibrariansTab librarians={librarians} />}
        {activeTab === 'surveys' && <AdminSurveysTab responses={surveyResponses} />}
      </div>
    </div>
  );
};
