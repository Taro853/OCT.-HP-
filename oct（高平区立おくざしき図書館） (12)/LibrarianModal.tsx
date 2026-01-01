
import React from 'react';
import { Librarian } from './types';
import { Quote } from 'lucide-react';

interface LibrarianModalProps {
  librarians: Librarian[];
}

export const LibrarianModal: React.FC<LibrarianModalProps> = ({ librarians }) => {
  return (
    <div className="max-w-4xl mx-auto py-20 animate-fade-in">
      <div className="text-center mb-20">
        <span className="text-[10px] font-bold text-oct-500 tracking-[0.5em] block mb-4 uppercase">Library Staff</span>
        <h2 className="text-5xl font-bold mb-6 text-oct-950">司書紹介</h2>
        <p className="text-gray-500 max-w-xl mx-auto leading-relaxed">
          OCT（おくざしき図書館）を支えるスタッフです。<br/>
          本の選定からイベントの企画まで、皆様の豊かな読書体験をサポートします。
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-12">
        {librarians.map((l, index) => (
          <div key={l.name} className="bg-white p-12 rounded-[3rem] shadow-xl border border-oct-100 group hover:-translate-y-2 transition-transform duration-500">
            <div className="relative mb-10">
              <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-white shadow-2xl relative z-10">
                <img src={l.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={l.name} />
              </div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-oct-50 rounded-full blur-2xl group-hover:bg-oct-100 transition-colors"></div>
            </div>
            
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-2 text-oct-900">{l.name}</h3>
              <p className="text-xs text-oct-400 font-bold mb-8 tracking-widest uppercase">{l.role}</p>
              
              <div className="relative pt-8 border-t border-oct-50">
                <Quote className="text-oct-100 absolute top-4 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-180" size={40} />
                <p className="text-gray-500 italic leading-loose relative z-10">「{l.message}」</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-20 bg-oct-900 text-white p-12 rounded-[3rem] text-center">
        <h4 className="text-xl font-bold mb-4">お気軽にお声がけください</h4>
        <p className="text-oct-300 text-sm leading-loose">
          探している本のタイトルが思い出せない時や、<br/>
          今の気分にぴったりの本を知りたい時など、レファレンス・カウンターにていつでもお待ちしております。
        </p>
      </div>
    </div>
  );
};
