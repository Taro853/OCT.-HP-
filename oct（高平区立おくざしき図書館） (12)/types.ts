

export interface Review {
  id: string;
  user: string;
  comment: string;
  rating: number;
  timestamp: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  coverUrl?: string;
  category: string;
  isNew: boolean;
  isRecommended: boolean;
  publisher?: string;
  publishedDate?: string;
  reviews?: Review[];
  location: string; // 配架場所
}

export interface NewsItem {
  id: string;
  date: string;
  title: string;
  content: string; // 内部的にはHTMLだが、ユーザーには意識させない
  pdfUrl?: string;
  previewImageUrl?: string;
  fileName?: string;
}

export interface Notice {
  id: string;
  date: string;
  title: string;
  category: 'IMPORTANT' | 'EVENT' | 'INFO';
  content: string;
}

export interface ClosedDate {
  id: string;
  date: string;
  reason: string;
}

export interface MonthlyFeature {
  title: string;
  subtitle: string;
  description: string;
  content: string;
  imageUrl: string;
  books: string[];
}

export interface Librarian {
  id: string;
  name: string;
  role: string;
  message: string;
  imageUrl: string;
}

export interface SurveyQuestion {
  id: string;
  text: string;
  type: 'rating' | 'text' | 'choice';
}

export interface SurveyResponse {
  id: string;
  timestamp: string;
  answers: {
    questionId: string;
    questionText: string;
    answer: string;
  }[];
}

export interface Reservation {
  id: string;
  bookId: string;
  bookTitle: string;
  userName: string;
  passphrase: string;
  timestamp: string;
  status: 'PENDING' | 'READY' | 'COMPLETED';
}

export type ModalType = 'NONE' | 'ADMIN' | 'FEATURE' | 'NEWS_DETAIL' | 'NOTICE_DETAIL' | 'ACCESS' | 'BOOK_DETAIL' | 'LIBRARIAN' | 'SURVEY' | 'ALL_BOOKS' | 'ALL_NOTICES' | 'ALL_NEWS';

export interface ModalState {
  type: ModalType;
  data?: any;
}

export type UploadStatus = 'IDLE' | 'OPTIMIZING' | 'UPLOADING' | 'FINALIZING' | 'ERROR';
