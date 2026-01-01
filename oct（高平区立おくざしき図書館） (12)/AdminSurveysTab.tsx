
import React from 'react';
import { SurveyResponse } from './types';
import { MessageSquare, Clock } from 'lucide-react';

interface AdminSurveysTabProps {
  responses: SurveyResponse[];
}

export const AdminSurveysTab: React.FC<AdminSurveysTabProps> = ({ responses }) => {
  return (
    <div className="space-y-8 animate-fade-in">
       <div className="flex items-center gap-3">
         <div className="bg-oct-100 text-oct-600 p-3 rounded-xl">
           <MessageSquare size={24} />
         </div>
         <div>
           <h3 className="font-bold text-xl text-oct-950">アンケート回答一覧</h3>
           <p className="text-sm text-gray-400">利用者からのフィードバックを確認できます</p>
         </div>
       </div>

       <div className="grid gap-6">
        {responses.map(res => (
          <div key={res.id} className="bg-white border border-oct-100 rounded-[2rem] p-8 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2 mb-6 text-xs font-bold text-oct-400 uppercase tracking-widest border-b border-oct-50 pb-4">
              <Clock size={14} />
              <time>{res.timestamp}</time>
            </div>
            
            <div className="space-y-6">
              {res.answers.map((ans, idx) => (
                <div key={idx} className="bg-oct-50/50 p-6 rounded-2xl">
                  <p className="text-xs font-bold text-oct-500 mb-2">{ans.questionText}</p>
                  <p className="text-oct-900 font-medium leading-relaxed whitespace-pre-wrap">{ans.answer}</p>
                </div>
              ))}
            </div>
          </div>
        ))}

        {responses.length === 0 && (
          <div className="text-center py-20 bg-oct-50 rounded-[2rem] border-2 border-dashed border-oct-100">
            <MessageSquare size={40} className="mx-auto text-oct-200 mb-4" />
            <p className="text-gray-400 font-bold">まだ回答はありません</p>
          </div>
        )}
       </div>
    </div>
  );
};
