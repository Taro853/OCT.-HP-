
import React from 'react';
import { MapSVG } from './MapSVG';
import { MapPin, Train, Building2, Clock, Phone } from 'lucide-react';

export const AccessModal: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto py-10 animate-fade-in px-4">
      <div className="text-center mb-16">
        <span className="text-[10px] font-bold text-oct-500 tracking-[0.5em] block mb-4 uppercase">Location & Directions</span>
        <h2 className="text-5xl font-bold text-oct-950">アクセス</h2>
      </div>

      <div className="grid lg:grid-cols-12 gap-12 items-start">
        {/* Map visualization */}
        <div className="lg:col-span-7 bg-white p-4 md:p-8 rounded-3xl shadow-2xl border border-oct-100 aspect-[4/3] md:aspect-auto">
          <MapSVG />
          <div className="mt-6 flex justify-between items-center text-[10px] text-gray-400 font-bold tracking-widest uppercase">
            <span>Takahira Ward Digital Map</span>
            <span>Version 2.5</span>
          </div>
        </div>

        {/* Info detail */}
        <div className="lg:col-span-5 space-y-8">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-oct-100 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-4 text-oct-900">
              <MapPin size={20} className="text-oct-500" />
              <h4 className="text-xs font-bold tracking-widest uppercase">Location</h4>
            </div>
            <p className="text-2xl font-bold text-oct-900 mb-4 leading-snug">
              〒123-4567<br/>
              熊田都高平区高平 1-1-1
            </p>
            <div className="flex items-start gap-2 text-oct-600 bg-oct-50 p-4 rounded-xl border border-oct-100">
              <Building2 size={18} className="shrink-0 mt-1" />
              <p className="text-lg">
                <span className="font-bold text-oct-900">KUR熊田</span> (駅直結ビル)<br/>
                <span className="font-bold text-oct-900">WITRE高平</span> 6階
              </p>
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-sm border border-oct-100 hover:shadow-md transition-shadow">
             <div className="flex items-center gap-3 mb-4 text-oct-900">
              <Phone size={20} className="text-oct-500" />
              <h4 className="text-xs font-bold tracking-widest uppercase">Contact</h4>
            </div>
            <p className="text-3xl font-bold text-oct-950 tracking-wide">070-8541-7143</p>
            <p className="text-xs text-gray-400 mt-2">※ 開館時間内のみ対応可能です</p>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-sm border border-oct-100 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-4 text-oct-900">
              <Train size={20} className="text-oct-500" />
              <h4 className="text-xs font-bold tracking-widest uppercase">Public Transport</h4>
            </div>
            <ul className="space-y-6 text-sm leading-relaxed">
              <li className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-oct-900 text-white flex items-center justify-center shrink-0 font-bold text-xs">JR</div>
                <div>
                  <p className="font-bold text-oct-900 mb-1">JR高平線「高平駅」</p>
                  <p className="text-gray-500 text-xs">改札（南口方面）直結改札より徒歩1分。<br/>KUR熊田のエレベーターで6階へお越しください。</p>
                </div>
              </li>
            </ul>
          </div>

          <div className="bg-oct-950 text-white p-8 rounded-3xl shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <Clock size={20} className="text-oct-400" />
              <h4 className="text-xs font-bold tracking-widest uppercase text-oct-300">Opening Hours</h4>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between border-b border-oct-800 pb-2">
                <span className="text-oct-400">平日</span>
                <span className="font-bold">9:30 - 20:00</span>
              </div>
              <div className="flex justify-between border-b border-oct-800 pb-2">
                <span className="text-oct-400">土日祝</span>
                <span className="font-bold">9:30 - 18:00</span>
              </div>
              <p className="text-[10px] text-oct-500 italic mt-2">※月曜日は整理日のため17時閉館となります</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
