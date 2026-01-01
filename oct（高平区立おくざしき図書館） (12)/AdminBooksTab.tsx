
import React, { useState } from 'react';
import { Book } from './types';
import { Plus, Trash2, Sparkles, Bot, Send } from 'lucide-react';
import { createItem, updateItem, removeItem } from './adminUtils';
import { GoogleGenAI, Type } from "@google/genai";

interface AdminBooksTabProps {
  books: Book[];
}

export const AdminBooksTab: React.FC<AdminBooksTabProps> = ({ books }) => {
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiChatInput, setAiChatInput] = useState('');
  const [aiMessage, setAiMessage] = useState('');

  const fetchBookDetailsAI = async (bookId: string, title: string) => {
    if (!title) return alert('タイトルを入力してください');
    setIsAiLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `書籍「${title}」の情報を日本語で取得してください。配架場所(location)は、一般的な図書であれば「書庫」としてください。新刊や人気が予想される場合は「本館 1F 〇〇コーナー」のように設定してください。`,
        config: { 
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              author: { type: Type.STRING },
              publisher: { type: Type.STRING },
              publishedDate: { type: Type.STRING },
              description: { type: Type.STRING },
              category: { type: Type.STRING },
              location: { type: Type.STRING, description: '図書館内での具体的な配架場所。デフォルトは「書庫」' },
            },
            required: ["author", "publisher", "publishedDate", "description", "category", "location"],
          }
        }
      });
      
      const text = response.text;
      if (text) {
        const data = JSON.parse(text.trim());
        await updateItem('books', bookId, data);
      }
    } catch (err) {
      alert('AIによる情報取得に失敗しました');
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleAiBulkRegister = async () => {
    if (!aiChatInput) return;
    setIsAiLoading(true);
    setAiMessage('AI司書が蔵書データを作成中...');
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `司書の要望「${aiChatInput}」に基づき、登録すべき蔵書リストを作成してください。配架場所(location)は原則「書庫」とし、特に指定がある場合のみ変更してください。`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              books: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    author: { type: Type.STRING },
                    publisher: { type: Type.STRING },
                    publishedDate: { type: Type.STRING },
                    description: { type: Type.STRING },
                    category: { type: Type.STRING },
                    location: { type: Type.STRING },
                  },
                  required: ["title", "author", "publisher", "publishedDate", "description", "category", "location"]
                }
              }
            },
            required: ["books"]
          }
        }
      });

      const text = response.text;
      if (text) {
        // Remove markdown code blocks if present just in case
        const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const data = JSON.parse(cleanText);
        const newBooks = data.books || [];
        
        for (const b of newBooks) {
          await createItem('books', { ...b, isNew: true, isRecommended: false, reviews: [], coverUrl: '', location: b.location || '書庫' });
        }
        setAiMessage(`${newBooks.length}件の蔵書を登録しました。`);
        setAiChatInput('');
      }
    } catch (err) {
      console.error(err);
      setAiMessage('エラーが発生しました。時間を置いて再度お試しください。');
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="space-y-12 animate-fade-in">
      {/* AI司書セクション */}
      <div className="bg-oct-50 rounded-[2rem] p-8 border border-oct-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-oct-900 text-white rounded-full flex items-center justify-center shadow-lg">
            <Bot size={24} />
          </div>
          <div>
            <h3 className="font-bold text-lg">AI司書アシスタント</h3>
            <p className="text-[10px] text-gray-400">蔵書の追加を自然な言葉で頼んでください</p>
          </div>
        </div>
        <div className="flex gap-3">
          <input 
            value={aiChatInput}
            onChange={e => setAiChatInput(e.target.value)}
            placeholder="例：書庫に保管する歴史書を5冊追加して"
            className="flex-1 bg-white border border-oct-200 rounded-2xl px-6 py-4 outline-none focus:ring-2 ring-oct-100 shadow-inner"
            onKeyDown={e => e.key === 'Enter' && handleAiBulkRegister()}
          />
          <button 
            onClick={handleAiBulkRegister}
            disabled={isAiLoading || !aiChatInput}
            className="bg-oct-900 text-white px-8 rounded-2xl font-bold shadow-lg hover:bg-oct-800 disabled:opacity-50 flex items-center gap-2"
          >
            {isAiLoading ? <Sparkles className="animate-spin" size={20}/> : <Send size={20}/>}
            一括登録
          </button>
        </div>
        {aiMessage && <p className="mt-4 text-sm font-bold text-oct-600 animate-fade-in">{aiMessage}</p>}
      </div>

      <div className="flex justify-between items-center">
        <h3 className="font-bold text-xl text-oct-950">蔵書データベース</h3>
        <button onClick={() => createItem('books', { title: '新規タイトル', author: '著者名', category: '小説', isNew: true, isRecommended: false, reviews: [], coverUrl: '', location: '書庫' })} className="bg-oct-900 text-white px-6 py-3 rounded-xl text-sm font-bold shadow-md hover:scale-105 transition-transform">
          <Plus size={18} className="inline mr-2"/> 本を手動で追加
        </button>
      </div>

      <div className="grid gap-4">
        {books.map(book => (
          <div key={book.id} className="border-2 border-oct-50 rounded-[2rem] p-8 bg-oct-50/10 hover:border-oct-100 transition-colors">
            <div className="space-y-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-2">
                   <input value={book.title} onChange={e => updateItem('books', book.id, {title: e.target.value})} className="text-2xl font-bold w-full bg-transparent border-b-2 border-oct-200 outline-none focus:border-oct-500 font-serif" placeholder="タイトル" />
                   <div className="flex gap-2">
                     <button 
                      disabled={isAiLoading}
                      onClick={() => fetchBookDetailsAI(book.id, book.title)} 
                      className="flex items-center gap-2 bg-oct-100 text-oct-700 px-3 py-1.5 rounded-full text-[10px] font-bold hover:bg-oct-200 transition-colors disabled:opacity-50"
                     >
                      <Sparkles size={12} className={isAiLoading ? "animate-spin" : ""}/> AIで詳細を取得
                     </button>
                   </div>
                </div>
                <button onClick={() => removeItem('books', book.id)} className="text-red-300 hover:text-red-500"><Trash2 size={24}/></button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="flex flex-col">
                  <label className="text-[10px] text-gray-400 mb-1">著者</label>
                  <input value={book.author} onChange={e => updateItem('books', book.id, {author: e.target.value})} className="text-sm border-b p-1 bg-transparent" placeholder="著者名" />
                </div>
                <div className="flex flex-col">
                  <label className="text-[10px] text-gray-400 mb-1">出版社</label>
                  <input value={book.publisher || ''} onChange={e => updateItem('books', book.id, {publisher: e.target.value})} className="text-sm border-b p-1 bg-transparent" placeholder="出版社" />
                </div>
                <div className="flex flex-col">
                  <label className="text-[10px] text-amber-600 mb-1 font-bold flex items-center gap-1">
                    <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                        <path d="M10 9h4" />
                        <path d="M10 7h4" />
                        <path d="M10 11h4" />
                    </svg>
                    配架場所 (デフォルト: 書庫)
                  </label>
                  <input value={book.location || '書庫'} onChange={e => updateItem('books', book.id, {location: e.target.value})} className="text-sm border-b p-1 bg-amber-50/50 focus:bg-amber-100 outline-none" placeholder="例：書庫 B-12" />
                </div>
              </div>
              <textarea value={book.description} onChange={e => updateItem('books', book.id, {description: e.target.value})} className="w-full h-24 text-xs border p-4 rounded-2xl bg-white outline-none" placeholder="内容紹介" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
