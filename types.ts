export enum ExpenseCategory {
  VENUE = 'Local & Cerimônia',
  CATERING = 'Buffet & Bebidas',
  ATTIRE = 'Trajes & Beleza',
  DECOR = 'Decoração & Flores',
  PHOTO_VIDEO = 'Foto & Vídeo',
  MUSIC = 'Música & Iluminação',
  INVITES = 'Convites & Papelaria',
  GIFTS = 'Lembrancinhas',
  OTHER = 'Outros'
}

export enum ExpenseStatus {
  PENDING = 'Pendente',
  DEPOSIT_PAID = 'Sinal Pago',
  PAID = 'Pago Totalmente'
}

export interface Expense {
  id: string;
  name: string;
  category: ExpenseCategory;
  estimatedCost: number;
  paidAmount: number;
  depositRequired: number; // New field for down payment/deposit
  dueDate?: string; // New field for specific payment date (YYYY-MM-DD)
  status: ExpenseStatus;
  notes?: string;
}

export enum GuestSide {
  BRIDE = 'Noiva',
  GROOM = 'Noivo'
}

export interface Guest {
  id: string;
  name: string;
  side: GuestSide;
  confirmed: boolean;
  assignedTableId?: string; // ID da mesa
  assignedSeatIndex?: number; // Índice da cadeira (0 a N)
}

export enum TableShape {
  ROUND = 'Redonda',
  SQUARE = 'Quadrada',
  RECTANGLE = 'Retangular'
}

export interface Table {
  id: string;
  name: string;
  capacity: number;
  shape: TableShape;
}

export type InvitationTheme = 'classic' | 'modern' | 'romantic' | 'rustic';

export interface InvitationData {
  groomName: string;
  brideName: string;
  date: string;
  time: string;
  venue: string;
  address: string;
  message: string;
  theme: InvitationTheme;
}

export interface SavingsPlan {
  currentSavings: number;
  monthlyContribution: number; // How much user can save per month
  targetDate: string; // YYYY-MM-DD
  mode: 'calculate_date' | 'calculate_amount'; // Calculate end date based on contribution OR calculate contribution based on date
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  isError?: boolean;
}

// Novos tipos para Lista de Presentes Virtual
export interface GiftItem {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  category?: string;
  totalShares?: number; // Se > 1, é um item de cotas
  soldShares?: number;  // Quantas cotas já foram "compradas" (simulação)
}

// Novos tipos para o Site dos Noivos
export type WebsiteSectionType = 'hero' | 'text' | 'countdown' | 'gallery' | 'rsvp' | 'location' | 'gifts';

export interface WebsiteSection {
  id: string;
  type: WebsiteSectionType;
  content: {
    title?: string;
    subtitle?: string;
    body?: string;
    imageUrl?: string;
    images?: string[]; // Para galeria
    date?: string;
    buttonText?: string;
    bgColor?: string; // white, slate-50, rose-50, etc.
    alignment?: 'left' | 'center' | 'right';
    bankInfo?: string; // Para presentes/pix
    storeLink?: string;
    showGiftGrid?: boolean; // Se deve mostrar a grade de produtos virtuais
  };
}

export interface WebsiteData {
  title: string;
  globalSettings: {
    primaryColor: string; // hex or tailwind class base
    fontFamily: 'serif' | 'sans' | 'mono' | 'cursive';
  };
  sections: WebsiteSection[];
}