
import React, { useState, useRef } from 'react';
import { Librarian, UploadStatus } from './types';
import { Plus, Trash2, Edit2, X, Upload, Loader2, Save, User, Quote, Image as ImageIcon, Link2 } from 'lucide-react';
import { createItem, updateItem, removeItem, compressImage } from './adminUtils';
import { storage } from './firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

interface AdminLibrariansTabProps {
  librarians: Librarian[];
}

export const AdminLibrariansTab: React.FC<AdminLibrariansTabProps> = ({ librarians }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempName, setTempName] = useState('');
  const [tempRole, setTempRole] = useState('');
  const [tempMessage, setTempMessage] = useState('');
  const [tempImageUrl, setTempImageUrl] = useState('');
  const [uploadMode, setUploadMode] = useState<'upload' | 'url'>('url');
  
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>('IDLE');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const startEditing = (l: Librarian) => {
    setEditingId(l.id);
    setTempName(l.name);
    setTempRole(l.role);
    setTempMessage(l.message);
    setTempImageUrl(l.imageUrl);
    setUploadMode(storage ? 'upload' : 'url');
  };

  const closeEditor = () => {
    setEditingId(null);
    setUploadStatus('IDLE');
  };

  const handleSave = async () => {
    if (!editingId) return;
    await updateItem('librarians', editingId, {
      name: tempName,
      role: tempRole,
      message: tempMessage,
      imageUrl: tempImageUrl,
    });
    closeEditor();
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !storage) return;
    e.target.value = '';

    setUploadStatus('UPLOADING');
    try {
      const storageRef = ref(storage, `librarians/${Date.now()}_${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on('state_changed', null, () => setUploadStatus('ERROR'), async () => {
        const url = await getDownloadURL(uploadTask.snapshot.ref);
        setTempImageUrl(url);
        setUploadStatus('IDLE');
      });
    } catch { setUploadStatus('ERROR'); }
  };

  const handleCreateNew = async () => {
    const newId = await createItem('librarians', { 
      name: '新規スタッフ', role: '担当', message: 'こんにちは', imageUrl: '' 
    });
    setEditingId(newId);
  };

  return (
    <div className="space-y-8 animate-fade-in relative">
      <div className="flex justify-between items-center px-4">
        <div>
          <h3 className="font-bold text-2xl text-oct-950">司書紹介管理</h3>
          <p className="text-sm text-gray-400">プロフィールの編集</p>
        </div>
        <button onClick={handleCreateNew} className="bg-oct-900 text-white px-8 py-4 rounded-2xl text-sm font-bold shadow-xl flex items-center gap-2">
          <Plus size={18}/> 追加
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 p-4">
        {librarians.map(l => (
          <div key={l.id} onClick={() => startEditing(l)} className="group bg-white p-8 rounded-[3rem] shadow-sm hover:shadow-2xl transition-all cursor-pointer flex flex-col items-center border border-oct-100 relative">
            <button onClick={(e) => { e.stopPropagation(); removeItem('librarians', l.id); }} className="absolute top-4 right-4 text-red-200 hover:text-red-500 p-2"><Trash2 size={18} /></button>
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-oct-50 shadow-md mb-4">
              {l.imageUrl ? <img src={l.imageUrl} alt={l.name} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-oct-50 flex items-center justify-center text-oct-200"><User size={40}/></div>}
            </div>
            <h4 className="text-lg font-bold text-oct-900">{l.name}</h4>
            <p className="text-xs text-oct-400 font-bold uppercase mb-4">{l.role}</p>
          </div>
        ))}
      </div>

      {editingId && (
        <div className="fixed inset-0 z-50 bg-oct-950/80 backdrop-blur-md flex items-center justify-center p-4">
           <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl p-12 animate-slide-up relative">
              <button onClick={closeEditor} className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-900"><X size={24}/></button>
              
              <div className="space-y-6">
                 <div className="flex flex-col items-center gap-4">
                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-oct-100 bg-oct-50">
                       {tempImageUrl ? <img src={tempImageUrl} className="w-full h-full object-cover" alt="Preview" /> : <div className="w-full h-full flex items-center justify-center text-oct-200"><User size={48}/></div>}
                    </div>
                    <div className="flex bg-oct-50 p-1 rounded-full">
                       <button onClick={() => setUploadMode('url')} className={`px-4 py-1 text-xs font-bold rounded-full transition-all ${uploadMode === 'url' ? 'bg-white shadow text-oct-900' : 'text-oct-400'}`}>URL指定</button>
                       {storage && <button onClick={() => setUploadMode('upload')} className={`px-4 py-1 text-xs font-bold rounded-full transition-all ${uploadMode === 'upload' ? 'bg-white shadow text-oct-900' : 'text-oct-400'}`}>アップロード</button>}
                    </div>
                 </div>

                 {uploadMode === 'url' ? (
                   <input 
                    value={tempImageUrl} 
                    onChange={e => setTempImageUrl(e.target.value)}
                    placeholder="画像URL (https://...)"
                    className="w-full p-4 bg-oct-50 border border-oct-100 rounded-2xl outline-none focus:ring-2 ring-oct-100"
                   />
                 ) : (
                   <div className="text-center">
                     <button onClick={() => fileInputRef.current?.click()} className="px-6 py-3 border-2 border-dashed border-oct-100 rounded-xl text-oct-400">画像を選択</button>
                     <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileUpload} />
                   </div>
                 )}

                 <div className="grid grid-cols-2 gap-4">
                    <input value={tempName} onChange={e => setTempName(e.target.value)} placeholder="名前" className="p-4 border rounded-2xl outline-none" />
                    <input value={tempRole} onChange={e => setTempRole(e.target.value)} placeholder="役職" className="p-4 border rounded-2xl outline-none" />
                 </div>
                 
                 <textarea value={tempMessage} onChange={e => setTempMessage(e.target.value)} className="w-full h-32 p-4 border rounded-2xl outline-none resize-none" placeholder="メッセージ" />

                 <button onClick={handleSave} className="w-full py-4 bg-oct-900 text-white rounded-2xl font-bold shadow-lg">
                    プロフィールを保存
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};
