
import { Book, ClosedDate, Librarian, MonthlyFeature, NewsItem, Notice, SurveyQuestion } from "./types";

export const INITIAL_BOOKS: Book[] = [
  {
    id: 'b1',
    title: '静かなる奥座敷',
    author: '高平 謙三',
    description: 'この土地が刻んできた歴史と、人々の営みを丹念に追った一冊。当館の名称の由来となった思想がここにあります。',
    coverUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=400',
    category: '歴史',
    isNew: true,
    isRecommended: true,
    location: '本館 1F 郷土資料コーナー'
  },
  {
    id: 'b2',
    title: '都市の余白を歩く',
    author: '佐藤 栞',
    description: '近代建築の隙間に残された、名もなき風景たち。写真とエッセイで綴る現代の散策術。',
    coverUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=400',
    category: 'アート',
    isNew: true,
    isRecommended: true,
    location: '本館 2F 芸術'
  },
  {
    id: 'b3',
    title: '珈琲一杯の読書論',
    author: 'James Miller',
    description: 'なぜ私たちは本を読むとき、コーヒーの香りを求めるのか？科学と感性が交差する至高の読書ガイド。',
    coverUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=400',
    category: 'ライフスタイル',
    isNew: false,
    isRecommended: true,
    location: '本館 2F 一般・雑誌'
  }
];

export const INITIAL_NEWS: NewsItem[] = [
  {
    id: 'n1',
    date: '2024-06-01',
    title: 'OCT図書館通信 第24号',
    content: '<div class="rt-h2-style">特集：夏休みの自由研究を応援します</div><p>今年の夏も学習支援プロジェクトを実施します。調べ学習に役立つレファレンスシートを配布中。</p>',
    fileName: 'oct_news_vol24.pdf',
    pdfUrl: 'https://drive.google.com/',
    previewImageUrl: 'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?q=80&w=1200'
  }
];

export const INITIAL_NOTICES: Notice[] = [
  {
    id: 'nt1',
    date: '2024-05-28',
    title: '【重要】電気設備点検に伴う臨時休館のお知らせ',
    category: 'IMPORTANT',
    content: '<div class="rt-box-info">2024年6月10日（月）は、全館停電を伴う設備点検のため終日休館いたします。</div><p>ご不便をおかけしますが、ご理解とご協力をお願い申し上げます。返却ポストは通常通りご利用いただけます。</p>'
  }
];

export const INITIAL_CLOSED_DATES: ClosedDate[] = [
  { id: 'c1', date: '2024-06-10', reason: '施設点検' },
  { id: 'c2', date: '2024-06-24', reason: '館内整理日' }
];

export const INITIAL_FEATURE: MonthlyFeature = {
  title: '知の森を、深く歩く',
  subtitle: '季節を忘れる、極上の読書時間',
  description: '日常の喧騒から離れ、一冊の本と向き合う。そんな贅沢な時間をOCTで過ごしませんか？',
  content: '<div class="rt-h1-style">「奥座敷」というおもてなし</div><p>私たちの図書館は、ただ本を並べるだけの場所ではありません。</p>',
  imageUrl: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=1600',
  books: ['b1', 'b3']
};

export const INITIAL_LIBRARIANS: Librarian[] = [
  {
    id: 'l1',
    name: '本田 栞',
    role: '館長 / レファレンス担当',
    message: 'あなたの「一生の一冊」を見つけるお手伝いをします。お気軽にお声がけください。',
    imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400'
  }
];

export const INITIAL_SURVEY: SurveyQuestion[] = [
  { id: 'q1', text: '当館の学習スペースの快適さはいかがですか？', type: 'rating' }
];
