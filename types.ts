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