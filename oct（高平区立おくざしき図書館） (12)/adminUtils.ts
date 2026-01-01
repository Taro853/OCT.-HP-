
import { db } from './firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc, setDoc } from 'firebase/firestore';

export interface Template {
  label: string;
  html: string;
  isInline?: boolean;
}

export const RICH_TEXT_TEMPLATES: Template[] = [
  { label: '大見出し', html: '<h2>大見出しを入力</h2>', isInline: false },
  { label: '中見出し', html: '<h3>中見出しを入力</h3>', isInline: false },
  { label: '注釈', html: '<span class="rt-note">注釈テキストを入力</span>', isInline: false },
  { label: '引用', html: '<blockquote>引用文をここに入力します。</blockquote>', isInline: false },
  { label: '太字', html: '<b>強調したいテキスト</b>', isInline: true },
  { label: '赤字', html: '<span class="rt-text-red">重要な赤文字テキスト</span>', isInline: true },
  { label: '青字', html: '<span class="rt-text-blue">強調したい青文字テキスト</span>', isInline: true },
  { label: '黄マーカー', html: '<span class="rt-marker-yellow">ハイライトしたいテキスト</span>', isInline: true },
  { label: '桃マーカー', html: '<span class="rt-marker-pink">ハイライトしたいテキスト</span>', isInline: true },
  { label: '情報BOX', html: '<div class="rt-box-info"><p>こちらに周知したい情報を入力してください。</p></div>', isInline: false },
  { label: '重要BOX', html: '<div class="rt-box-important"><p>こちらに重要な警告を入力してください。</p></div>', isInline: false },
  { label: '区切り線', html: '<hr />', isInline: false },
];

export const RICH_TEXT_TOOLS = [
  { label: '見出し', tagStart: '<h2>', tagEnd: '</h2>', bg: 'bg-oct-900', color: 'text-white' },
  { label: '強調', tagStart: '<b>', tagEnd: '</b>', bg: 'bg-oct-100', color: 'text-oct-900' },
  { label: '赤字', tagStart: '<span class="rt-text-red">', tagEnd: '</span>', bg: 'bg-red-50', color: 'text-red-600' },
  { label: '注釈', tagStart: '<span class="rt-note">', tagEnd: '</span>', bg: 'bg-gray-50', color: 'text-gray-500' },
  { label: 'マーカー', tagStart: '<span class="rt-marker-yellow">', tagEnd: '</span>', bg: 'bg-yellow-50', color: 'text-yellow-700' },
];

/**
 * Inserts HTML tags around current value and updates Firestore
 */
// Added insertTag function to handle Firestore updates when wrapping content in tags
export const insertTag = async (
  currentValue: string,
  field: string,
  collectionName: string,
  docId: string,
  tagStart: string,
  tagEnd: string,
  isObject: boolean = false,
  originalObj: any = {}
) => {
  if (!db) return;
  const newValue = tagStart + currentValue + tagEnd;
  const data = isObject ? { ...originalObj, [field]: newValue } : { [field]: newValue };
  await setDoc(doc(db, collectionName, docId), data);
};

export const createItem = async (collectionName: string, data: any) => {
  if (!db) return;
  const docRef = await addDoc(collection(db, collectionName), data);
  return docRef.id;
};

export const updateItem = async (collectionName: string, id: string, data: any) => {
  if (!db) return;
  await updateDoc(doc(db, collectionName, id), data);
};

export const removeItem = async (collectionName: string, id: string) => {
  if (!db) return;
  if (confirm('本当に削除しますか？')) {
    await deleteDoc(doc(db, collectionName, id));
  }
};

export const fileToBase64 = (file: File | Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

/**
 * Enhanced compression for high-quality reading experience.
 * Target: 1200px width with 0.85 quality to keep text sharp.
 */
export const compressImage = async (file: File, maxWidth = 1200, quality = 0.85): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    img.src = objectUrl;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;
      
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }
      
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) { reject(new Error('Canvas Error')); return; }
      
      // High quality scaling
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, width, height);
      
      canvas.toBlob((blob) => {
        URL.revokeObjectURL(objectUrl);
        if (blob) resolve(blob); else reject(new Error('Compression Error'));
      }, 'image/jpeg', quality);
    };
    img.onerror = (err) => reject(err);
  });
};
