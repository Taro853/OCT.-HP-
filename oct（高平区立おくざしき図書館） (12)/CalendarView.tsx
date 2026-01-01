
import React from 'react';
import { ClosedDate } from './types';

interface CalendarViewProps {
  closedDates: ClosedDate[];
}

export const CalendarView: React.FC<CalendarViewProps> = ({ closedDates }) => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  const days = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const isClosed = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return closedDates.find(d => d.date === dateStr);
  };

  const dayNames = ['日', '月', '火', '水', '木', '金', '土'];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-oct-100 overflow-hidden">
      <div className="bg-oct-900 text-white p-3 text-center font-bold">
        {year}年 {month + 1}月
      </div>
      <div className="grid grid-cols-7 text-center p-2">
        {dayNames.map((name, i) => (
          <div key={name} className={`text-[10px] font-bold py-1 ${i === 0 ? 'text-red-500' : i === 6 ? 'text-blue-500' : 'text-gray-400'}`}>
            {name}
          </div>
        ))}
        {days.map((day, i) => {
          if (day === null) return <div key={`empty-${i}`} className="p-2"></div>;
          const closed = isClosed(day);
          return (
            <div 
              key={day} 
              className={`relative p-2 text-sm transition-colors rounded-lg flex items-center justify-center aspect-square
                ${closed ? 'bg-red-50 text-red-600 font-bold' : 'text-oct-800 hover:bg-oct-50'}
                ${day === today.getDate() ? 'ring-1 ring-oct-300' : ''}
              `}
              title={closed?.reason}
            >
              {day}
              {closed && (
                <div className="absolute bottom-1 w-1 h-1 bg-red-400 rounded-full"></div>
              )}
            </div>
          );
        })}
      </div>
      <div className="p-3 border-t border-oct-50 text-[10px] flex gap-4 justify-center">
        <div className="flex items-center gap-1"><div className="w-2 h-2 bg-red-100 rounded-full"></div> 休館日</div>
        <div className="flex items-center gap-1"><div className="w-2 h-2 ring-1 ring-oct-300 rounded-full"></div> 本日</div>
      </div>
    </div>
  );
};
