
import React, { useState, useRef, useEffect } from 'react';
import { NewsItem, Book, UploadStatus } from './types';
import { 
  Plus, Trash2, Edit2, X, Book as BookIcon, Search, ChevronRight, Code, Eye, Save, Image as ImageIcon, FileText, Upload, Loader2, Settings, Terminal, Copy, Check, ExternalLink, Link2, AlertCircle, Database
} from 'lucide-react';
import { createItem, updateItem, removeItem, RICH_TEXT_TEMPLATES, Template, compressImage, fileToBase64 } from './adminUtils';
import { db } from './firebase';

interface AdminNewsTabProps {
  news: NewsItem[];
  books?: Book[];
}

export const AdminNewsTab: React.FC<AdminNewsTabProps> = ({ news, books = [] }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempTitle, setTempTitle] = useState('');
  const [tempDate, setTempDate] = useState('');
  const [tempContent, setTempContent] = useState('');
  
  const [tempPdfUrl, setTempPdfUrl] = useState('');
  const [tempPreviewUrl, setTempPreviewUrl] = useState('');
  const [tempFileName, setTempFileName] = useState('');
  
  const [editorMode, setEditorMode] = useState<'visual' | 'code'>('visual');
  const [uploadMode, setUploadMode] = useState<'db' | 'url'>('db');
  
  const [processStatus, setProcessStatus] = useState<UploadStatus>('IDLE');
  
  const visualEditorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);

  const startEditing = (item: NewsItem) => {
    setEditingId(item.id);
    setTempTitle(item.title);
    setTempDate(item.date);
    setTempContent(item.content);
    setTempPdfUrl(item.pdfUrl || '');
    setTempPreviewUrl(item.previewImageUrl || '');
    setTempFileName(item.fileName || '');
    setEditorMode('visual');
    if (item.pdfUrl?.startsWith('http') || item.previewImageUrl?.startsWith('http')) {
        setUploadMode('url');
    } else {
        setUploadMode('db');
    }
  };

  const closeEditor = () => {
    setEditingId(null);
    setProcessStatus('IDLE');
  };

  const handleSave = async () => {
    if (!editingId) return;
    let contentToSave = tempContent;
    if (editorMode === 'visual' && visualEditorRef.current) {
      contentToSave = visualEditorRef.current.innerHTML;
    }
    await updateItem('news', editingId, {
      title: tempTitle,
      date: tempDate,
      content: contentToSave,
      pdfUrl: tempPdfUrl,
      previewImageUrl: tempPreviewUrl,
      fileName: tempFileName
    });
    closeEditor();
  };

  const handleFileToDB = async (e: React.ChangeEvent<HTMLInputElement>, type: 'pdf' | 'image') => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = '';

    setProcessStatus('OPTIMIZING');
    try {
      let processedFile: File | Blob = file;

      if (type === 'image' && file.type.startsWith('image/')) {
        // High quality (1200px / 0.85) to ensure text readability in viewer
        processedFile = await compressImage(file, 1200, 0.85);
      } else if (type === 'pdf') {
        if (file.size > 800 * 1024) {
          alert('PDFが大きすぎます(800KB以下)。Googleドライブの共有リンクを使用してください。');
          setProcessStatus('IDLE');
          return;
        }
      }

      setProcessStatus('FINALIZING');
      const base64 = await fileToBase64(processedFile);
      
      if (type === 'pdf') {
        setTempPdfUrl(base64);
        setTempFileName(file.name);
      } else {
        setTempPreviewUrl(base64);
      }
      setProcessStatus('IDLE');
    } catch (err) {
      console.error(err);
      alert('ファイルの変換に失敗しました。');
      setProcessStatus('IDLE');
    }
  };

  const insertTemplate = (template: Template) => {
    if (editorMode === 'visual' && visualEditorRef.current) {
      visualEditorRef.current.focus();
      document.execCommand('insertHTML', false, template.html + (template.isInline ? '' : '<p><br></p>'));
      setTempContent(visualEditorRef.current.innerHTML);
    }
  };

  const handleVisualInput = () => {
    if (visualEditorRef.current) {
      setTempContent(visualEditorRef.current.innerHTML);
    }
  };

  const handleCreateNew = async () => {
    const today = new Date().toISOString().split('T')[0];
    const newId = await createItem('news', { 
      date: today, 
      title: '新規図書館だより', 
      content: '<p>本文...</p>',
      pdfUrl: '',
      previewImageUrl: '',
      fileName: ''
    });
    setEditingId(newId);
  };

  return (
    <div className="space-y-8 animate-fade-in relative">
      {processStatus !== 'IDLE' && (
        <div className="fixed bottom-4 right-4 z-[100] bg-oct-950 text-white p-6 rounded-2xl shadow-2xl flex items-center gap-4 border border-white/10 animate-slide-up">
           <Loader2 className="animate-spin text-oct-400" size={24} />
           <div className="text-xs font-bold">
              {processStatus === 'OPTIMIZING' ? '高画質プレビューを作成中...' : '変換完了。まもなく終わります...'}
           </div>
        </div>
      )}

      <div className="flex justify-between items-center px-4">
        <div>
          <h3 className="font-bold text-2xl text-oct-950">図書館だより管理</h3>
          <p className="text-sm text-gray-400">A4プレビューの作成とGoogleドライブ連携</p>
        </div>
        <button onClick={handleCreateNew} className="bg-oct-900 text-white px-8 py-4 rounded-2xl text-sm font-bold shadow-xl flex items-center gap-2">
          <Plus size={18}/> 新しく作成
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 p-4">
        {news.map(item => (
          <div key={item.id} onClick={() => startEditing(item)} className="group bg-white border border-oct-100 p-8 rounded-[3rem] shadow-sm hover:shadow-2xl transition-all cursor-pointer flex flex-col min-h-[220px]">
            <div className="flex justify-between items-start mb-6">
              <span className="text-[10px] text-oct-500 font-bold bg-oct-50 px-4 py-1.5 rounded-full">{item.date}</span>
              <button onClick={(e) => { e.stopPropagation(); removeItem('news', item.id); }} className="text-red-200 hover:text-red-500 transition-colors p-2"><Trash2 size={18} /></button>
            </div>
            <h4 className="text-xl font-bold text-oct-950 font-serif flex-1 leading-tight">{item.title}</h4>
            <div className="flex items-center gap-2 text-oct-500 text-xs font-bold uppercase mt-4">
              <Edit2 size={14} /> 編集
            </div>
          </div>
        ))}
      </div>

      {editingId && (
        <div className="fixed inset-0 z-50 bg-oct-950/80 backdrop-blur-md flex items-center justify-center p-2 lg:p-6" onClick={(e) => { if (e.target === e.currentTarget) closeEditor() }}>
           <div className="bg-oct-50 w-full h-full max-w-[95vw] rounded-[2rem] shadow-2xl flex flex-col md:flex-row overflow-hidden animate-scale-up">
              
              {/* Left Sidebar: Assets Control */}
              <div className="hidden md:flex w-80 bg-white border-r border-oct-100 flex-col shrink-0 overflow-y-auto">
                 <div className="p-6 border-b flex justify-between items-center bg-oct-50/30">
                    <h4 className="font-bold text-oct-900 text-sm">公開設定</h4>
                    <div className="flex bg-white p-1 rounded-lg border">
                       <button onClick={() => setUploadMode('db')} title="高画質プレビュー (DB保存)" className={`px-2 py-1 text-[9px] font-bold rounded flex items-center gap-1 ${uploadMode === 'db' ? 'bg-oct-900 text-white shadow' : 'text-oct-400'}`}>
                          <Database size={10}/> Preview
                       </button>
                       <button onClick={() => setUploadMode('url')} title="外部URL (Googleドライブ等)" className={`px-2 py-1 text-[9px] font-bold rounded flex items-center gap-1 ${uploadMode === 'url' ? 'bg-oct-900 text-white shadow' : 'text-oct-400'}`}>
                          <Link2 size={10}/> Link
                       </button>
                    </div>
                 </div>
                 
                 <div className="p-6 space-y-8">
                    {uploadMode === 'db' && (
                      <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100 space-y-2">
                        <div className="flex gap-2 text-blue-700">
                          <ImageIcon size={16} className="shrink-0" />
                          <p className="text-[10px] font-bold leading-relaxed">閲覧用A4画像の設定</p>
                        </div>
                        <p className="text-[9px] text-blue-600 leading-relaxed">
                          PDFをダウンロードしない人のための「高画質プレビュー」を作成します。できるだけ鮮明な画像をアップしてください。
                        </p>
                      </div>
                    )}

                    <div>
                       <label className="block text-[10px] font-bold text-oct-400 mb-2 uppercase tracking-widest">A4 Preview Image</label>
                       {uploadMode === 'db' ? (
                         <div className="space-y-3">
                            <div className="aspect-a4 bg-oct-50 rounded-xl border-2 border-dashed border-oct-100 flex items-center justify-center overflow-hidden">
                               {tempPreviewUrl ? <img src={tempPreviewUrl} className="w-full h-full object-contain" /> : <div className="text-center"><ImageIcon className="text-oct-200 mx-auto" size={32}/><p className="text-[9px] text-oct-300 font-bold mt-2">A4縦長を推奨</p></div>}
                            </div>
                            <button onClick={() => fileInputRef.current?.click()} className="w-full py-2 bg-oct-100 text-oct-700 rounded-lg text-xs font-bold hover:bg-oct-200 flex items-center justify-center gap-2">
                               <Plus size={14}/> 画像をアップロード
                            </button>
                            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={e => handleFileToDB(e, 'image')} />
                         </div>
                       ) : (
                         <input 
                          value={tempPreviewUrl} 
                          onChange={e => setTempPreviewUrl(e.target.value)}
                          placeholder="閲覧用画像URL (https://...)"
                          className="w-full p-3 rounded-xl bg-oct-50 border border-oct-100 text-xs outline-none"
                         />
                       )}
                    </div>

                    <div>
                       <label className="block text-[10px] font-bold text-oct-400 mb-2 uppercase tracking-widest">PDF Link (Google Drive)</label>
                       <div className="space-y-3">
                          <div className="bg-oct-50 p-4 rounded-xl border border-oct-100 flex items-center gap-3">
                             <FileText className={tempPdfUrl ? "text-red-500" : "text-oct-200"} size={20}/>
                             <div className="flex-1 min-w-0">
                                <p className="text-[10px] font-bold truncate">{tempFileName || '未設定'}</p>
                                {tempPdfUrl && <p className="text-[8px] text-green-600 font-bold uppercase">{tempPdfUrl.startsWith('data') ? 'Ready in DB' : 'Linked'}</p>}
                             </div>
                          </div>
                          <input 
                            value={tempPdfUrl} 
                            onChange={e => setTempPdfUrl(e.target.value)}
                            placeholder="共有リンクをここに貼り付け"
                            className="w-full p-3 rounded-xl bg-white border border-oct-200 text-xs outline-none focus:border-oct-900"
                          />
                       </div>
                       <input 
                          value={tempFileName}
                          onChange={e => setTempFileName(e.target.value)}
                          placeholder="表示ファイル名 (例: 2024年6月号)"
                          className="w-full mt-2 p-3 rounded-xl bg-white border border-oct-50 text-[10px] outline-none"
                       />
                    </div>

                    <div>
                       <label className="block text-[10px] font-bold text-oct-400 mb-2 uppercase tracking-widest">Publication Date</label>
                       <input type="date" value={tempDate} onChange={e => setTempDate(e.target.value)} className="w-full p-3 rounded-xl bg-oct-50 border border-oct-100 text-xs" />
                    </div>
                 </div>

                 <div className="mt-auto p-6 border-t bg-oct-50/30 space-y-3">
                    <button onClick={handleSave} className="w-full py-4 bg-oct-900 text-white rounded-xl font-bold shadow-lg hover:bg-oct-800 transition-all flex items-center justify-center gap-2">
                      <Save size={18} /> 記事を保存
                    </button>
                    <button onClick={closeEditor} className="w-full py-3 bg-white text-gray-400 rounded-xl text-xs font-bold" >閉じる</button>
                 </div>
              </div>

              {/* Editor */}
              <div className="flex-1 flex flex-col bg-white overflow-hidden">
                 <div className="p-3 border-b bg-oct-50/50 flex items-center justify-between px-6">
                    <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
                       {RICH_TEXT_TEMPLATES.map(t => (
                         <button key={t.label} onClick={() => insertTemplate(t)} className="px-3 py-1.5 hover:bg-white rounded-lg text-[10px] font-bold text-oct-700 border border-transparent hover:border-oct-200 transition-all">{t.label}</button>
                       ))}
                    </div>
                    <div className="flex bg-oct-200/50 p-1 rounded-lg">
                      <button onClick={() => setEditorMode('visual')} className={`px-3 py-1.5 rounded-md text-[10px] font-bold ${editorMode === 'visual' ? 'bg-white text-oct-900' : 'text-oct-500'}`}>視覚</button>
                      <button onClick={() => setEditorMode('code')} className={`px-3 py-1.5 rounded-md text-[10px] font-bold ${editorMode === 'code' ? 'bg-white text-oct-900' : 'text-oct-500'}`}>HTML</button>
                    </div>
                 </div>

                 <div className="flex-1 overflow-y-auto p-4 md:p-12 bg-gray-50/30">
                    <div className="max-w-3xl mx-auto min-h-full bg-white p-12 shadow-sm rounded-sm">
                       <input value={tempTitle} onChange={e => setTempTitle(e.target.value)} className="w-full text-4xl font-bold mb-8 outline-none border-none font-serif placeholder-oct-100 bg-transparent" placeholder="だよりのタイトル..." />
                       {editorMode === 'visual' ? (
                         <div 
                           ref={visualEditorRef} 
                           contentEditable 
                           className="rich-text outline-none min-h-[500px]" 
                           onInput={handleVisualInput}
                         />
                       ) : (
                         <textarea value={tempContent} onChange={e => setTempContent(e.target.value)} className="w-full h-[600px] font-mono text-sm p-6 bg-oct-50 rounded-xl outline-none" />
                       )}
                    </div>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};
