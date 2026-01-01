

import React, { useState, useRef, useEffect } from 'react';
import { Notice, Book, UploadStatus } from './types';
import { 
  Plus, Trash2, Edit2, X, Bell, Info, Calendar, Book as BookIcon, Search, ChevronRight, Code, Eye, Save, Image as ImageIcon, Settings, LayoutTemplate, Loader2
} from 'lucide-react';
import { createItem, updateItem, removeItem, RICH_TEXT_TEMPLATES, Template, compressImage } from './adminUtils';
import { storage } from './firebase';
import { ref, uploadBytesResumable, getDownloadURL, StorageError } from 'firebase/storage';

interface AdminNoticesTabProps {
  notices: Notice[];
  books?: Book[];
}

export const AdminNoticesTab: React.FC<AdminNoticesTabProps> = ({ notices, books = [] }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempTitle, setTempTitle] = useState('');
  const [tempDate, setTempDate] = useState('');
  const [tempContent, setTempContent] = useState('');
  const [tempCategory, setTempCategory] = useState<'IMPORTANT' | 'EVENT' | 'INFO'>('INFO');

  const [showBookSearch, setShowBookSearch] = useState(false);
  const [bookSearchTerm, setBookSearchTerm] = useState('');
  const [editorMode, setEditorMode] = useState<'visual' | 'code'>('visual');
  
  // Upload State
  const [uploadProgress, setUploadProgress] = useState<{transferred: number, total: number} | null>(null);
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>('IDLE');
  const [uploadError, setUploadError] = useState<string | null>(null);
  
  // Selection Logic
  const [savedRange, setSavedRange] = useState<Range | null>(null);

  const visualEditorRef = useRef<HTMLDivElement>(null);
  const bodyImageInputRef = useRef<HTMLInputElement>(null);

  const startEditing = (item: Notice) => {
    setEditingId(item.id);
    setTempTitle(item.title);
    setTempDate(item.date);
    setTempContent(item.content);
    setTempCategory(item.category);
    setEditorMode('visual');
    setSavedRange(null);
  };

  const closeEditor = () => {
    setEditingId(null);
    setTempTitle('');
    setTempDate('');
    setTempContent('');
    setUploadProgress(null);
    setUploadStatus('IDLE');
    setUploadError(null);
  };

  const handleSave = async () => {
    if (!editingId) return;

    let contentToSave = tempContent;
    if (editorMode === 'visual' && visualEditorRef.current) {
      contentToSave = visualEditorRef.current.innerHTML;
    }

    await updateItem('notices', editingId, {
      title: tempTitle,
      date: tempDate,
      content: contentToSave,
      category: tempCategory
    });
    closeEditor();
  };

  // カーソル位置を保存する
  const saveSelection = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0 && visualEditorRef.current && visualEditorRef.current.contains(sel.anchorNode)) {
      setSavedRange(sel.getRangeAt(0));
    }
  };

  // カーソル位置を復元する
  const restoreSelection = () => {
    const sel = window.getSelection();
    if (visualEditorRef.current) {
        visualEditorRef.current.focus();
        if (sel && savedRange) {
            sel.removeAllRanges();
            sel.addRange(savedRange);
        }
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // 本文への画像挿入（アップロード処理）
  const handleBodyImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    e.target.value = ''; // Reset

    setUploadError(null); // Clear previous errors

    if (!storage) {
      setUploadError('ストレージ機能が有効になっていません');
      setUploadStatus('ERROR');
      return;
    }

    // Initialize progress immediately
    setUploadStatus('OPTIMIZING');
    setUploadProgress({ transferred: 0, total: file.size });

    try {
      let fileToUpload: File | Blob = file;
      if (file.type.startsWith('image/')) {
        try {
          const compressedBlob = await compressImage(file);
          fileToUpload = new File([compressedBlob], file.name.replace(/\.[^/.]+$/, "") + ".jpg", { type: 'image/jpeg' });
        } catch (compErr) {
          console.warn('Compression failed, uploading original', compErr);
        }
      }

      setUploadStatus('UPLOADING');
      const storageRef = ref(storage, `notice_images/${Date.now()}_${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, fileToUpload);

      uploadTask.on('state_changed', 
        (snapshot) => {
          setUploadProgress({
            transferred: snapshot.bytesTransferred,
            total: snapshot.totalBytes
          });
        },
        (error: StorageError) => {
          console.error(error);
          setUploadError(`画像の挿入に失敗しました: ${error.message} (${error.code})`);
          setUploadStatus('ERROR');
          setUploadProgress(null);
        },
        async () => {
          setUploadStatus('FINALIZING');
          const url = await getDownloadURL(uploadTask.snapshot.ref);
          const imgHtml = `<img src="${url}" class="rt-image" alt="挿入画像" />`;
          
          if (editorMode === 'visual' && visualEditorRef.current) {
              restoreSelection();
              document.execCommand('insertHTML', false, imgHtml + '<p><br></p>');
              setTempContent(visualEditorRef.current.innerHTML);
              saveSelection();
          } else {
              setTempContent(prev => prev + imgHtml);
          }
          setUploadProgress(null);
          setUploadStatus('IDLE');
          setUploadError(null);
        }
      );
    } catch (err: any) {
      console.error(err);
      setUploadError(`エラーが発生しました: ${err.message}`);
      setUploadStatus('ERROR');
      setUploadProgress(null);
    }
  };

  const triggerBodyImageUpload = () => {
    saveSelection(); // ファイル選択の前に位置保存
    bodyImageInputRef.current?.click();
  };

  const openBookSearch = () => {
    saveSelection(); // 検索モーダルを開く前に位置保存
    setShowBookSearch(true);
  };

  const insertTemplate = (template: Template) => {
    if (editorMode === 'visual' && visualEditorRef.current) {
      restoreSelection();
      document.execCommand('insertHTML', false, template.html + (template.isInline ? '' : '<p><br></p>'));
      setTempContent(visualEditorRef.current.innerHTML);
      saveSelection();
    } else if (editorMode === 'code') {
      setTempContent(prev => prev + template.html);
    }
  };

  const insertBookCard = (book: Book) => {
    const bookHtml = `
      <div class="embedded-book-card" contenteditable="false">
        <div class="book-icon"><svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg></div>
        <div class="book-info">
          <div class="book-title">${book.title}</div>
          <div class="book-meta"><span>${book.author}</span><span class="book-location">📍 ${book.location || '書庫'}</span></div>
        </div>
      </div><p><br></p>`;
    
    if (editorMode === 'visual' && visualEditorRef.current) {
        restoreSelection(); // 挿入時に位置を復元
        document.execCommand('insertHTML', false, bookHtml);
        setTempContent(visualEditorRef.current.innerHTML);
        saveSelection();
    } else {
        setTempContent(prev => prev + bookHtml);
    }
    setShowBookSearch(false);
  };

  useEffect(() => {
    if (editorMode === 'visual' && visualEditorRef.current) {
      visualEditorRef.current.innerHTML = tempContent;
    }
  }, [editorMode, editingId]);

  const handleVisualInput = () => {
    if (visualEditorRef.current) {
      setTempContent(visualEditorRef.current.innerHTML);
      saveSelection();
    }
  };

  const handleCreateNew = async () => {
    const today = new Date().toISOString().split('T')[0];
    const newId = await createItem('notices', { 
       date: today, 
       title: '新しいお知らせ', 
       category: 'INFO', 
       content: '<p>内容をここに入力...</p>' 
    });
    setEditingId(newId);
    setTempTitle('新しいお知らせ');
    setTempDate(today);
    setTempContent('<p>内容をここに入力...</p>');
    setTempCategory('INFO');
    setEditorMode('visual');
  };

  return (
    <div className="space-y-8 animate-fade-in relative">
      {/* Upload Progress Overlay */}
      {uploadStatus !== 'IDLE' && (
        <div className={`fixed bottom-4 right-4 z-[100] ${uploadStatus === 'ERROR' ? 'bg-red-700' : 'bg-oct-900'} text-white p-4 rounded-xl shadow-2xl animate-slide-up flex items-center gap-4 min-w-[280px]`}>
          {uploadStatus === 'ERROR' ? (
            <X size={24} className="shrink-0" />
          ) : (
            <Loader2 className="animate-spin shrink-0" size={24} />
          )}
          <div className="flex-1">
            <div className="text-xs font-bold mb-1 flex justify-between">
              <span>
                {uploadStatus === 'OPTIMIZING' && '画像を最適化中...'}
                {uploadStatus === 'UPLOADING' && 'アップロード中...'}
                {uploadStatus === 'FINALIZING' && '情報を保存中...'}
                {uploadStatus === 'ERROR' && 'エラーが発生しました'}
              </span>
              {uploadProgress && uploadStatus !== 'ERROR' && <span>{uploadProgress.total > 0 ? Math.round((uploadProgress.transferred / uploadProgress.total) * 100) : 0}%</span>}
            </div>
            {uploadError && <p className="text-[10px] text-red-200 mt-1 break-all">{uploadError}</p>}
            {uploadStatus !== 'ERROR' && (
              <div className="w-full bg-oct-800 rounded-full h-1.5 mb-1">
                <div 
                  className="bg-oct-300 h-1.5 rounded-full transition-all duration-300" 
                  style={{width: `${uploadProgress && uploadProgress.total > 0 ? (uploadProgress.transferred / uploadProgress.total) * 100 : 0}%`}}
                ></div>
              </div>
            )}
            {uploadProgress && uploadStatus !== 'ERROR' && (
              <div className="text-[10px] text-oct-300 text-right">
                {formatBytes(uploadProgress.transferred)} / {formatBytes(uploadProgress.total)}
              </div>
            )}
          </div>
          {uploadStatus === 'ERROR' && ( // Only show clear button on error
            <button onClick={() => { setUploadStatus('IDLE'); setUploadError(null); setUploadProgress(null); }} className="text-white ml-2 p-1 rounded-full hover:bg-white/20">
              <X size={16} />
            </button>
          )}
        </div>
      )}

       <div className="flex justify-between items-center px-4">
        <div>
          <h3 className="font-bold text-2xl text-oct-950">お知らせ管理</h3>
          <p className="text-sm text-gray-400">緊急の告知や館内イベント情報を発信</p>
        </div>
        <button 
          onClick={handleCreateNew} 
          className="bg-oct-600 text-white px-8 py-4 rounded-2xl text-sm font-bold shadow-xl hover:bg-oct-500 transition-all flex items-center gap-2"
        >
          <Plus size={18}/> お知らせを新規作成
        </button>
      </div>

      <div className="grid gap-6 p-4">
        {notices.map(n => (
          <div key={n.id} onClick={() => startEditing(n)} className="group flex items-center justify-between p-8 bg-white border border-oct-100 rounded-[2.5rem] shadow-sm hover:shadow-2xl transition-all cursor-pointer">
            <div className="flex items-center gap-8">
              <div className={`w-14 h-14 rounded-[1.2rem] flex items-center justify-center shadow-sm ${n.category === 'IMPORTANT' ? 'bg-red-50 text-red-500' : 'bg-oct-50 text-oct-500'}`}>
                {n.category === 'IMPORTANT' ? <Bell size={32} /> : n.category === 'EVENT' ? <Calendar size={32} /> : <Info size={32} />}
              </div>
              <div>
                <div className="flex items-center gap-4 mb-2">
                  <span className="text-[10px] text-gray-400 font-bold tracking-widest uppercase">{n.date}</span>
                  <span className={`text-[9px] px-3 py-1 rounded-full font-bold shadow-sm ${n.category === 'IMPORTANT' ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-500'}`}>{n.category}</span>
                </div>
                <h4 className="font-bold text-xl text-oct-950 font-serif leading-tight">{n.title}</h4>
              </div>
            </div>
            <div className="flex items-center gap-6">
               <Edit2 size={18} className="text-oct-200 group-hover:text-oct-900 transition-colors" />
               <button onClick={(e) => { e.stopPropagation(); removeItem('notices', n.id); }} className="text-red-200 hover:text-red-500 p-2 transition-colors"><Trash2 size={22} /></button>
            </div>
          </div>
        ))}
      </div>

      {editingId && (
        <div className="fixed inset-0 z-50 bg-oct-950/80 backdrop-blur-md flex items-center justify-center p-2 lg:p-6" onClick={(e) => { if (e.target === e.currentTarget) closeEditor() }}>
           <div className="bg-oct-50 w-full h-full max-w-[95vw] rounded-[2rem] shadow-2xl flex flex-col md:flex-row overflow-hidden animate-scale-up ring-1 ring-white/10">
              
              {/* Left Sidebar: Settings */}
              <div className="hidden md:flex w-80 bg-white border-r border-oct-100 flex-col shrink-0 z-20 overflow-y-auto">
                 <div className="p-6 border-b border-oct-50">
                    <h4 className="font-bold text-oct-900 flex items-center gap-2 mb-1"><Settings size={16}/> 文書設定</h4>
                    <p className="text-[10px] text-gray-400">日付やカテゴリーの設定</p>
                 </div>
                 
                 <div className="p-6 space-y-8 flex-1">
                    <div>
                       <label className="block text-xs font-bold text-oct-400 mb-2 uppercase tracking-widest">Date</label>
                       <input 
                         type="date"
                         value={tempDate}
                         onChange={e => setTempDate(e.target.value)}
                         className="w-full p-3 rounded-xl bg-oct-50 border border-oct-100 outline-none focus:border-oct-400 font-mono text-sm"
                       />
                    </div>

                    <div>
                       <label className="block text-xs font-bold text-oct-400 mb-2 uppercase tracking-widest">Category</label>
                       <div className="space-y-2">
                         {[
                           { val: 'INFO', label: 'インフォメーション', color: 'bg-gray-100 text-gray-600 border-gray-200' },
                           { val: 'EVENT', label: 'イベント情報', color: 'bg-green-50 text-green-600 border-green-200' },
                           { val: 'IMPORTANT', label: '重要なお知らせ', color: 'bg-red-50 text-red-600 border-red-200' },
                         ].map(opt => (
                           <label key={opt.val} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${tempCategory === opt.val ? opt.color + ' ring-1 ring-offset-1' : 'border-transparent hover:bg-oct-50'}`}>
                             <input type="radio" name="category" value={opt.val} checked={tempCategory === opt.val} onChange={() => setTempCategory(opt.val as any)} className="w-4 h-4" />
                             <span className="text-xs font-bold">{opt.label}</span>
                           </label>
                         ))}
                       </div>
                    </div>
                 </div>

                 {/* Action Buttons */}
                 <div className="p-6 border-t border-oct-100 flex flex-col gap-3">
                    <button onClick={handleSave} className="w-full py-4 bg-oct-900 text-white rounded-xl font-bold shadow-lg hover:bg-oct-800 transition-all flex items-center justify-center gap-2">
                      <Save size={18} /> 保存して閉じる
                    </button>
                    <button onClick={closeEditor} className="w-full py-3 bg-white text-gray-500 border border-oct-200 rounded-xl font-bold hover:bg-gray-50 transition-colors">
                      キャンセル
                    </button>
                 </div>
              </div>

              {/* Main Editor Area */}
              <div className="flex-1 flex flex-col h-full bg-oct-50/50 relative overflow-hidden min-w-0">
                 {/* Floating Toolbar */}
                 <div className="sticky top-0 left-0 right-0 z-10 bg-white/80 backdrop-blur-md border-b border-oct-100 p-2 flex items-center justify-between px-6">
                    <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-1 mask-linear-fade">
                       <span className="text-[10px] font-bold text-oct-300 uppercase tracking-wider mr-2 hidden sm:inline">Tools</span>
                       {RICH_TEXT_TEMPLATES.map(t => (
                         <button key={t.label} onMouseDown={(e) => e.preventDefault()} onClick={() => insertTemplate(t)} className="whitespace-nowrap px-3 py-1.5 hover:bg-oct-100 rounded-lg text-[10px] font-bold text-oct-700 border border-transparent hover:border-oct-200 transition-all">{t.label}</button>
                       ))}
                       <div className="w-[1px] h-6 bg-oct-200 mx-2"></div>
                       
                       {/* Image Upload for Content */}
                       <input type="file" ref={bodyImageInputRef} accept="image/*" className="hidden" onChange={handleBodyImageUpload} />
                       <button onClick={triggerBodyImageUpload} disabled={uploadStatus !== 'IDLE'} className="p-2 hover:bg-oct-100 rounded-lg text-oct-600 flex items-center gap-1" title="画像を挿入">
                          {uploadStatus !== 'IDLE' ? <Loader2 className="animate-spin" size={16}/> : <ImageIcon size={16} />}
                       </button>
                       
                       <button onClick={openBookSearch} className="p-2 hover:bg-oct-100 rounded-lg text-oct-600" title="蔵書引用"><BookIcon size={16} /></button>
                    </div>
                    
                    <div className="flex bg-oct-100 p-1 rounded-lg shrink-0 ml-2">
                      <button onClick={() => setEditorMode('visual')} className={`px-3 py-1.5 rounded-md text-[10px] font-bold flex items-center gap-1 transition-all ${editorMode === 'visual' ? 'bg-white shadow-sm text-oct-900' : 'text-oct-500'}`}><Eye size={12}/> <span className="hidden sm:inline">View</span></button>
                      <button onClick={() => setEditorMode('code')} className={`px-3 py-1.5 rounded-md text-[10px] font-bold flex items-center gap-1 transition-all ${editorMode === 'code' ? 'bg-white shadow-sm text-oct-900' : 'text-oct-500'}`}><Code size={12}/> <span className="hidden sm:inline">HTML</span></button>
                    </div>
                 </div>

                 {/* Content Canvas */}
                 <div className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-12 w-full">
                    <div className="max-w-4xl mx-auto bg-white rounded-[2px] shadow-xl min-h-[900px] p-8 md:p-16 relative animate-slide-up">
                       {/* Title Input */}
                       <input 
                         value={tempTitle} 
                         onChange={e => setTempTitle(e.target.value)} 
                         className="w-full text-3xl md:text-5xl font-bold text-oct-950 mb-12 border-none outline-none placeholder-gray-200 font-serif leading-tight bg-transparent" 
                         placeholder="タイトルを入力" 
                       />
                       
                       {/* Editor Body */}
                       <div className={`min-h-[600px] ${editorMode === 'code' ? 'hidden' : 'block'}`}>
                          <div 
                            ref={visualEditorRef} 
                            contentEditable 
                            suppressContentEditableWarning 
                            onInput={handleVisualInput} 
                            onBlur={saveSelection}
                            onMouseUp={saveSelection}
                            onKeyUp={saveSelection}
                            className="rich-text outline-none cursor-text min-h-[600px] pb-20" 
                            data-placeholder="本文をここに入力..."
                          />
                       </div>

                       {editorMode === 'code' && (
                          <textarea 
                            value={tempContent} 
                            onChange={e => setTempContent(e.target.value)} 
                            className="w-full h-[800px] font-mono text-sm text-gray-600 bg-gray-50 p-6 rounded-xl outline-none resize-none" 
                            spellCheck={false} 
                          />
                       )}
                    </div>
                    
                    {/* Mobile Only Action Buttons */}
                    <div className="md:hidden mt-8 space-y-4 pb-12">
                      <button onClick={handleSave} className="w-full py-4 bg-oct-900 text-white rounded-xl font-bold shadow-lg">保存する</button>
                      <button onClick={closeEditor} className="w-full py-4 bg-white text-gray-500 border border-oct-200 rounded-xl font-bold">閉じる</button>
                    </div>

                    <div className="h-20"></div> {/* Spacer */}
                 </div>
              </div>

              {/* Book Search Modal Overlay */}
              {showBookSearch && (
                <div className="absolute inset-0 z-[70] bg-white/90 backdrop-blur-md flex items-center justify-center p-8">
                   <div className="bg-white w-full max-w-lg rounded-2xl p-8 shadow-2xl border border-oct-200 animate-slide-up">
                      <div className="flex justify-between items-center mb-6"><h4 className="font-bold text-xl text-oct-900 font-serif">蔵書カードを選択</h4><button onClick={() => setShowBookSearch(false)}><X size={24}/></button></div>
                      <input placeholder="検索キーワードを入力..." className="w-full pl-4 pr-4 py-3 border border-oct-200 rounded-xl mb-6 outline-none focus:border-oct-500 transition-all" value={bookSearchTerm} onChange={e => setBookSearchTerm(e.target.value)} />
                      <div className="max-h-[300px] overflow-y-auto space-y-2">
                         {books.filter(b => b.title.includes(bookSearchTerm)).map(b => (
                           <div key={b.id} onClick={() => insertBookCard(b)} className="p-4 bg-oct-50 hover:bg-oct-100 rounded-xl cursor-pointer flex items-center gap-4 transition-all border border-transparent hover:border-oct-200">
                              <BookIcon size={18} className="text-oct-400"/><span className="text-sm font-bold truncate text-oct-900">{b.title}</span>
                           </div>
                         ))}
                      </div>
                   </div>
                </div>
              )}
           </div>
        </div>
      )}
    </div>
  );
};