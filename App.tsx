import React, { useState, useEffect } from 'react';
import { Dashboard } from './components/Dashboard';
import { ExpenseForm } from './components/ExpenseForm';
import { AIAdvisor } from './components/AIAdvisor';
import { GuestManager } from './components/GuestManager';
import { SeatingChart } from './components/SeatingChart';
import { InvitationCreator } from './components/InvitationCreator';
import { WebsiteBuilder } from './components/WebsiteBuilder';
import { GiftRegistryManager } from './components/GiftRegistryManager';
import { TaskManager } from './components/TaskManager';
import { VendorMarketplace } from './components/VendorMarketplace';
import { VendorPortal } from './components/VendorPortal';
import { PremiumModal } from './components/PremiumModal';
import { MoodBoard } from './components/MoodBoard';
import { VenueFinder } from './components/VenueFinder';
import { Expense, ExpenseCategory, ExpenseStatus, SavingsPlan, Guest, GuestSide, Table, InvitationData, WebsiteData, GiftItem, Task, Vendor, Inspiration } from './types';
import { Heart, LayoutDashboard, List, Calendar, MessageSquareText, Download, Trash2, Edit2, Plus, Calculator, CheckCircle2, Check, DollarSign, Clock, Users, Armchair, Palette, Globe, Gift, ListTodo, Store, Crown, Briefcase, Sparkles, MapPin, Menu, X, ChevronRight } from 'lucide-react';

const STORAGE_KEY = 'wedding_planner_data';

// Navigation Configuration
const NAV_ITEMS = [
  { id: 'dashboard', label: 'Visão Geral', icon: LayoutDashboard },
  { id: 'planning', label: 'Planos & Metas', icon: Calculator },
  { id: 'advisor', label: 'Consultora IA', icon: MessageSquareText },
  { id: 'tasks', label: 'Tarefas', icon: ListTodo },
  { id: 'expenses', label: 'Despesas', icon: List },
  { id: 'venues', label: 'Localizador', icon: MapPin },
  { id: 'vendors', label: 'Fornecedores', icon: Store },
  { id: 'guests', label: 'Convidados', icon: Users },
  { id: 'seating', label: 'Mesas', icon: Armchair },
  { id: 'invites', label: 'Convites', icon: Palette },
  { id: 'website', label: 'Site', icon: Globe },
  { id: 'registry', label: 'Presentes', icon: Gift },
  { id: 'moodboard', label: 'Inspirações', icon: Sparkles },
] as const;

type TabId = typeof NAV_ITEMS[number]['id'];

const App: React.FC = () => {
  // Global Mode State: Couple (Client) vs Vendor (Business)
  const [userType, setUserType] = useState<'couple' | 'vendor'>('couple');

  // State
  const [activeTab, setActiveTab] = useState<TabId>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [tables, setTables] = useState<Table[]>([]);
  const [giftItems, setGiftItems] = useState<GiftItem[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [inspirations, setInspirations] = useState<Inspiration[]>([]);
  const [invitation, setInvitation] = useState<InvitationData>({
    brideName: 'Maria',
    groomName: 'João',
    date: '20 de Outubro de 2025',
    time: '16:00',
    venue: 'Villa Casamento Real',
    address: 'Rua das Flores, 123 - Campo Belo',
    message: 'Com amor, convidamos você para o início do nosso "para sempre".',
    theme: 'classic'
  });
  const [websiteData, setWebsiteData] = useState<WebsiteData>({
    title: 'Nosso Casamento',
    globalSettings: {
      primaryColor: 'rose',
      fontFamily: 'serif'
    },
    sections: [
      {
        id: 'default-hero',
        type: 'hero',
        content: { title: 'Maria & João', subtitle: 'Vamos dizer sim!', imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=2070', bgColor: 'bg-slate-900', alignment: 'center' }
      }
    ]
  });
  
  // Subscription State (Monetization)
  const [isPremium, setIsPremium] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);

  // Change default mode to 'calculate_amount' as requested
  const [savingsPlan, setSavingsPlan] = useState<SavingsPlan>({
    currentSavings: 0,
    monthlyContribution: 1000,
    targetDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
    mode: 'calculate_amount'
  });
  const [showForm, setShowForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  // Load data on mount
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setExpenses(parsed.expenses || []);
        setGuests(parsed.guests || []);
        setTables(parsed.tables || []);
        if (parsed.tasks) setTasks(parsed.tasks);
        if (parsed.inspirations) setInspirations(parsed.inspirations);
        if (parsed.invitation) {
          setInvitation(parsed.invitation);
        }
        if (parsed.websiteData) {
          setWebsiteData({
              title: parsed.websiteData.title || 'Nosso Casamento',
              globalSettings: parsed.websiteData.globalSettings || { primaryColor: 'rose', fontFamily: 'serif' },
              sections: parsed.websiteData.sections || []
          });
        }
        if (parsed.giftItems) {
            setGiftItems(parsed.giftItems);
        }
        // Preserve saved mode if exists, otherwise default to calculate_amount
        setSavingsPlan(parsed.savingsPlan || {
          currentSavings: 0,
          monthlyContribution: 1000,
          targetDate: new Date().toISOString().split('T')[0],
          mode: 'calculate_amount'
        });
        if (parsed.isPremium) setIsPremium(parsed.isPremium);
      } catch (e) {
        console.error("Failed to parse saved data", e);
      }
    } else {
      // Sample data for first run
      setExpenses([
        { id: '1', name: 'Aluguel do Espaço', category: ExpenseCategory.VENUE, estimatedCost: 5000, paidAmount: 1000, depositRequired: 1000, dueDate: '2025-05-10', status: ExpenseStatus.DEPOSIT_PAID, notes: '' },
        { id: '2', name: 'Cartório', category: ExpenseCategory.OTHER, estimatedCost: 600, paidAmount: 0, depositRequired: 0, dueDate: '2024-11-15', status: ExpenseStatus.PENDING, notes: 'Documentação civil' },
        { id: '3', name: 'Vestido da Noiva', category: ExpenseCategory.ATTIRE, estimatedCost: 3000, paidAmount: 0, depositRequired: 500, status: ExpenseStatus.PENDING, notes: '' },
      ]);
      // Sample Guests
      setGuests([
        { id: '1', name: 'Mãe da Noiva', side: GuestSide.BRIDE, confirmed: true },
        { id: '2', name: 'Pai do Noivo', side: GuestSide.GROOM, confirmed: true },
      ]);
    }
  }, []);

  // Save data on change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ expenses, savingsPlan, guests, tables, invitation, websiteData, giftItems, tasks, inspirations, isPremium }));
  }, [expenses, savingsPlan, guests, tables, invitation, websiteData, giftItems, tasks, inspirations, isPremium]);

  // Handlers
  const handleSaveExpense = (expense: Expense) => {
    if (editingExpense) {
      setExpenses(prev => prev.map(e => e.id === expense.id ? expense : e));
    } else {
      setExpenses(prev => [...prev, expense]);
    }
    setShowForm(false);
    setEditingExpense(null);
  };

  const handleDeleteExpense = (id: string) => {
    setExpenses(prev => prev.filter(e => e.id !== id));
    
    if (editingExpense?.id === id) {
      setShowForm(false);
      setEditingExpense(null);
    }
  };

  const handleEditExpense = (expense: Expense) => {
    setEditingExpense(expense);
    setShowForm(true);
  };

  const handleMarkAsPaid = (id: string) => {
    setExpenses(prev => prev.map(expense => {
      if (expense.id === id) {
        return {
          ...expense,
          status: ExpenseStatus.PAID,
          paidAmount: expense.estimatedCost
        };
      }
      return expense;
    }));
  };

  // Task Handlers
  const handleAddTask = (task: Task) => setTasks(prev => [...prev, task]);
  const handleUpdateTask = (task: Task) => setTasks(prev => prev.map(t => t.id === task.id ? task : t));
  const handleDeleteTask = (id: string) => setTasks(prev => prev.filter(t => t.id !== id));
  
  const handleGenerateDefaultTasks = () => {
      const defaults: Partial<Task>[] = [
          { title: 'Definir Orçamento Total', category: 'Planning', priority: 'high' },
          { title: 'Fazer Lista de Convidados Inicial', category: 'Guests', priority: 'high' },
          { title: 'Reservar Local da Cerimônia e Festa', category: 'Venue', priority: 'high' },
          { title: 'Contratar Assessoria/Cerimonial', category: 'Planning', priority: 'medium' },
          { title: 'Escolher Fotógrafo e Videomaker', category: 'Vendors', priority: 'medium' },
          { title: 'Definir Cardápio do Buffet', category: 'Catering', priority: 'medium' },
          { title: 'Escolher Vestido da Noiva', category: 'Attire', priority: 'medium' },
          { title: 'Enviar Save the Date', category: 'Invites', priority: 'medium' },
          { title: 'Contratar Decoração', category: 'Decor', priority: 'medium' },
          { title: 'Contratar DJ ou Banda', category: 'Music', priority: 'medium' },
          { title: 'Encomendar Convites', category: 'Invites', priority: 'medium' },
          { title: 'Escolher Traje do Noivo', category: 'Attire', priority: 'low' },
          { title: 'Comprar Alianças', category: 'Ceremony', priority: 'medium' },
          { title: 'Definir Lembrancinhas', category: 'Gifts', priority: 'low' },
          { title: 'Agendar Teste de Maquiagem/Cabelo', category: 'Beauty', priority: 'low' },
      ];

      const newTasks: Task[] = defaults.map(d => ({
          id: crypto.randomUUID(),
          title: d.title!,
          category: d.category!,
          priority: d.priority as any,
          completed: false,
          deadline: '' 
      }));

      setTasks(prev => [...prev, ...newTasks]);
      alert(`${newTasks.length} tarefas adicionadas ao seu checklist!`);
  };

  // Gift Registry Handlers
  const handleAddGiftItem = (item: GiftItem) => {
      setGiftItems(prev => [...prev, item]);
  };
  const handleUpdateGiftItem = (item: GiftItem) => {
      setGiftItems(prev => prev.map(i => i.id === item.id ? item : i));
  };
  const handleRemoveGiftItem = (id: string) => {
      setGiftItems(prev => prev.filter(i => i.id !== id));
  };

  // Inspiration Handlers
  const handleAddInspiration = (item: Inspiration) => {
    setInspirations(prev => [item, ...prev]);
  };
  const handleRemoveInspiration = (id: string) => {
    setInspirations(prev => prev.filter(i => i.id !== id));
  };

  // Guest Handlers
  const handleAddGuest = (guest: Guest) => {
    setGuests(prev => [...prev, guest]);
  };

  const handleRemoveGuest = (id: string) => {
    setGuests(prev => prev.filter(g => g.id !== id));
  };

  const handleToggleGuestConfirmation = (id: string) => {
    setGuests(prev => prev.map(g => g.id === id ? { ...g, confirmed: !g.confirmed } : g));
  };

  // Seating Chart Handlers
  const handleAddTable = (table: Table) => {
    setTables(prev => [...prev, table]);
  };

  const handleRemoveTable = (tableId: string) => {
    // Remove table
    setTables(prev => prev.filter(t => t.id !== tableId));
    // Unassign guests at that table
    setGuests(prev => prev.map(g => 
      g.assignedTableId === tableId 
        ? { ...g, assignedTableId: undefined, assignedSeatIndex: undefined } 
        : g
    ));
  };

  const handleAssignGuestToSeat = (guestId: string, tableId: string, seatIndex: number) => {
    setGuests(prev => {
      // First, remove anyone else who might be in that seat (optional, or just overwrite)
      const withoutOldTenant = prev.map(g => {
        if (g.assignedTableId === tableId && g.assignedSeatIndex === seatIndex) {
          return { ...g, assignedTableId: undefined, assignedSeatIndex: undefined };
        }
        return g;
      });

      // Now assign the new guest
      return withoutOldTenant.map(g => {
        if (g.id === guestId) {
          return { ...g, assignedTableId: tableId, assignedSeatIndex: seatIndex };
        }
        return g;
      });
    });
  };

  const handleUnassignGuest = (guestId: string) => {
    setGuests(prev => prev.map(g => 
      g.id === guestId 
        ? { ...g, assignedTableId: undefined, assignedSeatIndex: undefined }
        : g
    ));
  };
  
  // Venue Finder Handler
  const handleAddVenueToBudget = (name: string) => {
    const newExpense: Expense = {
      id: crypto.randomUUID(),
      name: name,
      category: ExpenseCategory.VENUE,
      estimatedCost: 0, // User to fill
      paidAmount: 0,
      depositRequired: 0,
      status: ExpenseStatus.PENDING,
      notes: 'Adicionado via Localizador de Espaços'
    };
    setExpenses(prev => [...prev, newExpense]);
    alert(`${name} adicionado às despesas! Vá para a aba Despesas para definir o valor.`);
  };
  
  // Vendor Handler (B2B Lead Generation Sim)
  const handleContactVendor = (vendor: Vendor) => {
      alert(`Solicitação de orçamento enviada para ${vendor.name}!\n\n(Simulação: O fornecedor receberia seus dados e o app cobraria por este lead.)`);
  };


  const handleExportBackup = () => {
    const data = {
      expenses,
      guests,
      tables,
      tasks,
      invitation,
      websiteData,
      giftItems,
      savingsPlan,
      inspirations,
      isPremium,
      exportDate: new Date().toISOString()
    };
    
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `backup_casamento_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImportBackup = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const result = e.target?.result as string;
        const parsed = JSON.parse(result);
        
        if (parsed.expenses && Array.isArray(parsed.expenses)) {
          setExpenses(parsed.expenses);
        }
        if (parsed.guests && Array.isArray(parsed.guests)) {
          setGuests(parsed.guests);
        }
        if (parsed.tables && Array.isArray(parsed.tables)) {
            setTables(parsed.tables);
        }
        if (parsed.tasks && Array.isArray(parsed.tasks)) {
            setTasks(parsed.tasks);
        }
        if (parsed.inspirations) {
            setInspirations(parsed.inspirations);
        }
        if (parsed.invitation) {
          setInvitation(parsed.invitation);
        }
        if (parsed.websiteData) {
          setWebsiteData(parsed.websiteData);
        }
        if (parsed.giftItems) {
            setGiftItems(parsed.giftItems);
        }
        if (parsed.savingsPlan) {
          setSavingsPlan(parsed.savingsPlan);
        }
        if (parsed.isPremium) {
            setIsPremium(parsed.isPremium);
        }
        alert('Dados restaurados com sucesso!');
      } catch (error) {
        console.error('Error importing file', error);
        alert('Erro ao restaurar arquivo. Verifique se é um backup válido.');
      }
    };
    reader.readAsText(file);
  };

  const exportToCSV = () => {
    const headers = ['Nome', 'Categoria', 'Data Vencimento', 'Status', 'Custo Estimado (R$)', 'Sinal Necessário (R$)', 'Valor Pago (R$)', 'Observações'];
    
    const sortedForExport = [...expenses].sort((a, b) => {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return a.dueDate.localeCompare(b.dueDate);
    });

    const rows = sortedForExport.map(e => {
      const formattedDate = e.dueDate ? new Date(e.dueDate).toLocaleDateString('pt-BR') : '-';
      return [
        `"${e.name.replace(/"/g, '""')}"`, 
        `"${e.category}"`,
        `"${formattedDate}"`, 
        `"${e.status}"`,
        `"${e.estimatedCost.toFixed(2).replace('.', ',')}"`, 
        `"${(e.depositRequired || 0).toFixed(2).replace('.', ',')}"`,
        `"${e.paidAmount.toFixed(2).replace('.', ',')}"`, 
        `"${(e.notes || '').replace(/"/g, '""').replace(/\n/g, ' ')}"` 
      ];
    });

    const csvContent = '\uFEFF' + [headers.join(';'), ...rows.map(r => r.join(';'))].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'orcamento_casamento.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Calculations
  const calculatePlanning = () => {
    const totalCost = expenses.reduce((acc, curr) => acc + curr.estimatedCost, 0);
    const totalPaid = expenses.reduce((acc, curr) => acc + curr.paidAmount, 0);
    const fundsNeeded = Math.max(0, (totalCost - totalPaid) - savingsPlan.currentSavings);

    let resultMessage = '';
    let resultValue = '';

    if (savingsPlan.mode === 'calculate_date') {
      if (savingsPlan.monthlyContribution <= 0) {
        resultMessage = "Defina um valor de aporte mensal maior que zero.";
      } else {
        const months = Math.ceil(fundsNeeded / savingsPlan.monthlyContribution);
        if (months <= 0) {
            resultMessage = "Você já tem o suficiente para pagar tudo!";
        } else {
            const projectedDate = new Date();
            projectedDate.setMonth(projectedDate.getMonth() + months);
            resultValue = `${months} meses`;
            resultMessage = `Data estimada para quitar tudo: ${projectedDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}`;
        }
      }
    } else {
      const target = new Date(savingsPlan.targetDate);
      const today = new Date();
      let diffMonths = (target.getFullYear() - today.getFullYear()) * 12 + (target.getMonth() - today.getMonth());
      if (diffMonths <= 0 && target > today) diffMonths = 1;

      if (diffMonths <= 0) {
        resultMessage = "A data alvo deve ser no futuro.";
      } else {
        const monthlyNeeded = fundsNeeded / diffMonths;
        if (monthlyNeeded <= 0) {
             resultMessage = "Você já tem o suficiente!";
        } else {
            resultValue = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(monthlyNeeded);
            resultMessage = `para quitar tudo até o casamento (${diffMonths} meses restantes).`;
        }
      }
    }
    return { fundsNeeded, resultMessage, resultValue };
  };

  const plannerData = calculatePlanning();
  
  // Calculate totals for Expense Tab
  const totalEstimated = expenses.reduce((acc, curr) => acc + curr.estimatedCost, 0);
  const totalPaid = expenses.reduce((acc, curr) => acc + curr.paidAmount, 0);
  const totalRemaining = totalEstimated - totalPaid;

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  const sortedExpenses = [...expenses].sort((a, b) => {
    if (a.dueDate && b.dueDate) return a.dueDate.localeCompare(b.dueDate);
    if (a.dueDate) return -1;
    if (b.dueDate) return 1;
    return 0;
  });

  // If we are in Vendor Mode, render Vendor Portal
  if (userType === 'vendor') {
      return (
          <div className="relative">
             <div className="absolute top-4 right-4 z-50">
                 <button 
                  onClick={() => setUserType('couple')}
                  className="bg-white/90 backdrop-blur text-rose-600 px-4 py-2 rounded-full font-bold shadow-md hover:bg-white flex items-center gap-2 text-sm border border-rose-100"
                 >
                     <Heart size={16} fill="currentColor" />
                     <span className="hidden sm:inline">Voltar para Área dos Noivos</span>
                 </button>
             </div>
             <VendorPortal />
          </div>
      );
  }

  // COUPLE MODE (Standard App)
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-sans">
      
      {/* Monetization Modal */}
      <PremiumModal 
        isOpen={showPremiumModal} 
        onClose={() => setShowPremiumModal(false)} 
        onUpgrade={() => {
            setIsPremium(true);
            setShowPremiumModal(false);
            alert("Parabéns! Você agora é Premium e desbloqueou todas as funcionalidades.");
        }} 
      />

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-white flex flex-col md:hidden animate-in slide-in-from-right duration-200">
           <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-white shadow-sm">
              <div className="flex items-center gap-2 text-rose-600">
                  <Heart className="fill-current" size={24} />
                  <h1 className="text-lg font-bold tracking-tight text-slate-900">Menu</h1>
              </div>
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-50"
              >
                  <X size={28} />
              </button>
           </div>
           
           <div className="flex-1 overflow-y-auto p-4 bg-slate-50/50">
               <div className="grid grid-cols-1 gap-2">
                   {NAV_ITEMS.map((item) => (
                       <button
                          key={item.id}
                          onClick={() => {
                              setActiveTab(item.id);
                              setIsMobileMenuOpen(false);
                          }}
                          className={`flex items-center justify-between p-4 rounded-xl transition-all ${
                              activeTab === item.id 
                                ? 'bg-rose-600 text-white shadow-md' 
                                : 'bg-white text-slate-600 border border-slate-200 hover:bg-rose-50 hover:text-rose-600'
                          }`}
                       >
                          <div className="flex items-center gap-3">
                              <item.icon size={20} />
                              <span className="font-medium text-base">{item.label}</span>
                          </div>
                          <ChevronRight size={16} className={`opacity-50 ${activeTab === item.id ? 'text-white' : 'text-slate-400'}`} />
                       </button>
                   ))}
               </div>

               <div className="mt-8 pt-6 border-t border-slate-200 space-y-3">
                    <button 
                        onClick={() => { setUserType('vendor'); setIsMobileMenuOpen(false); }}
                        className="w-full flex items-center gap-3 p-3 rounded-xl bg-slate-800 text-white font-medium"
                    >
                        <Briefcase size={20} />
                        Área do Fornecedor
                    </button>
                    {!isPremium && (
                        <button 
                            onClick={() => { setShowPremiumModal(true); setIsMobileMenuOpen(false); }}
                            className="w-full flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-amber-200 to-amber-400 text-amber-900 font-bold"
                        >
                            <Crown size={20} />
                            Seja Premium
                        </button>
                    )}
               </div>
           </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-white border-b border-rose-100 sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-rose-600">
            <Heart className="fill-current" size={28} />
            <h1 className="text-xl font-bold tracking-tight text-slate-900">Casamento<span className="text-rose-600">Planner</span> AI</h1>
          </div>
          <div className="flex items-center gap-3">
             {/* Desktop Controls */}
             <div className="hidden md:flex items-center gap-3">
                <button 
                    onClick={() => setUserType('vendor')}
                    className="flex items-center gap-2 text-slate-500 hover:text-slate-800 text-sm font-medium px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors"
                    title="Acessar painel de empresas"
                >
                    <Briefcase size={18} />
                    <span className="hidden lg:inline">Sou Fornecedor</span>
                </button>

                {!isPremium ? (
                    <button 
                        onClick={() => setShowPremiumModal(true)}
                        className="flex items-center gap-2 bg-gradient-to-r from-amber-200 to-amber-400 text-amber-900 px-3 py-2 rounded-full text-xs font-bold hover:brightness-105 transition-all shadow-sm"
                    >
                        <Crown size={16} />
                        <span className="hidden lg:inline">Seja Premium</span>
                    </button>
                ) : (
                    <div className="flex items-center gap-2 bg-slate-900 text-amber-300 px-3 py-1.5 rounded-full text-xs font-bold border border-amber-500/30">
                        <Crown size={14} />
                        <span className="hidden lg:inline">Membro VIP</span>
                    </div>
                )}
             </div>

             {/* Mobile Hamburger Button */}
             <button 
                onClick={() => setIsMobileMenuOpen(true)}
                className="md:hidden p-2 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
             >
                 <Menu size={28} />
             </button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs (Desktop Only) */}
      <div className="hidden md:block bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4">
          <nav className="flex space-x-2 lg:space-x-6 overflow-x-auto no-scrollbar py-1">
            {NAV_ITEMS.map((item) => (
                <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex items-center gap-2 py-3 px-2 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                        activeTab === item.id
                        ? 'border-rose-500 text-rose-600'
                        : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                    }`}
                >
                    <item.icon size={18} />
                    <span className="hidden lg:inline">{item.label}</span>
                </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl mx-auto px-4 py-6 w-full mb-16 md:mb-0">
        
        {/* TAB: DASHBOARD */}
        {activeTab === 'dashboard' && (
          <Dashboard 
            expenses={expenses} 
            savingsPlan={savingsPlan} 
            planningResult={plannerData} 
            onExportBackup={handleExportBackup}
            onImportBackup={handleImportBackup}
          />
        )}

        {/* TAB: VENUES (New) */}
        {activeTab === 'venues' && (
           <VenueFinder 
             onAddVenueToBudget={handleAddVenueToBudget}
           />
        )}

        {/* TAB: MOODBOARD (New) */}
        {activeTab === 'moodboard' && (
           <MoodBoard 
             inspirations={inspirations} 
             onAdd={handleAddInspiration} 
             onRemove={handleRemoveInspiration} 
             isPremium={isPremium}
           />
        )}

        {/* TAB: VENDORS (B2B Marketplace) */}
        {activeTab === 'vendors' && (
           <VendorMarketplace onContactVendor={handleContactVendor} />
        )}

        {/* TAB: TASKS */}
        {activeTab === 'tasks' && (
          <TaskManager 
            tasks={tasks}
            weddingDate={savingsPlan.targetDate}
            onAddTask={handleAddTask}
            onUpdateTask={handleUpdateTask}
            onDeleteTask={handleDeleteTask}
            onGenerateDefaults={handleGenerateDefaultTasks}
          />
        )}

        {/* TAB: EXPENSES */}
        {activeTab === 'expenses' && (
          <div className="space-y-6">
            
            {/* Totals Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
               <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-3 opacity-10">
                    <DollarSign size={48} className="text-slate-800" />
                  </div>
                  <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Total Previsto</span>
                  <span className="text-xl md:text-2xl font-bold text-slate-800">{formatCurrency(totalEstimated)}</span>
               </div>
               <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-3 opacity-10">
                    <CheckCircle2 size={48} className="text-emerald-600" />
                  </div>
                  <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Total Pago</span>
                  <span className="text-xl md:text-2xl font-bold text-emerald-600">{formatCurrency(totalPaid)}</span>
               </div>
               <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-3 opacity-10">
                    <Calendar size={48} className="text-rose-600" />
                  </div>
                  <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Restante a Pagar</span>
                  <span className="text-xl md:text-2xl font-bold text-rose-600">{formatCurrency(totalRemaining)}</span>
               </div>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mt-2">
              <h2 className="text-2xl font-bold text-slate-800">Lista de Despesas</h2>
              <div className="flex gap-2 w-full md:w-auto">
                <button
                  onClick={exportToCSV}
                  className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
                >
                  <Download size={18} />
                  Exportar Excel
                </button>
                <button
                  onClick={() => setShowForm(true)}
                  className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-rose-600 text-white px-4 py-2 rounded-lg hover:bg-rose-700 transition-colors shadow-sm"
                >
                  <Plus size={18} />
                  Nova Despesa
                </button>
              </div>
            </div>

            {showForm ? (
              <ExpenseForm 
                onSave={handleSaveExpense} 
                onCancel={() => { setShowForm(false); setEditingExpense(null); }} 
                onDelete={handleDeleteExpense}
                initialData={editingExpense}
              />
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                      <tr>
                        <th className="p-4 font-semibold">Item</th>
                        <th className="p-4 font-semibold hidden md:table-cell">Categoria</th>
                        <th className="p-4 font-semibold">Data</th>
                        <th className="p-4 font-semibold">Status</th>
                        <th className="p-4 font-semibold text-right">Estimado</th>
                        <th className="p-4 font-semibold text-right hidden md:table-cell">Pago</th>
                        <th className="p-4 font-semibold text-center">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {expenses.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="p-8 text-center text-slate-400">
                            Nenhuma despesa cadastrada ainda.
                          </td>
                        </tr>
                      ) : (
                        sortedExpenses.map((expense) => (
                          <tr key={expense.id} className="hover:bg-slate-50 transition-colors group">
                            <td className="p-4 font-medium text-slate-800">
                              {expense.name}
                              <div className="md:hidden text-xs text-slate-500 mt-1">{expense.category}</div>
                            </td>
                            <td className="p-4 text-slate-600 hidden md:table-cell">
                              <span className="px-2 py-1 bg-slate-100 rounded-md text-xs">
                                {expense.category}
                              </span>
                            </td>
                             <td className="p-4 text-slate-600">
                                {expense.dueDate ? (
                                  <div className="flex items-center gap-1.5">
                                    <Clock size={14} className="text-slate-400" />
                                    <span>{new Date(expense.dueDate).toLocaleDateString('pt-BR', {day: '2-digit', month: '2-digit', year: 'numeric'})}</span>
                                  </div>
                                ) : (
                                  <span className="text-slate-400 text-xs italic">Sem data</span>
                                )}
                            </td>
                            <td className="p-4">
                              <div className="flex flex-col gap-1 items-start">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${
                                  expense.status === ExpenseStatus.PAID 
                                    ? 'bg-green-50 text-green-700 border-green-200' 
                                    : expense.status === ExpenseStatus.DEPOSIT_PAID 
                                      ? 'bg-amber-50 text-amber-700 border-amber-200'
                                      : 'bg-slate-50 text-slate-600 border-slate-200'
                                }`}>
                                  {expense.status}
                                </span>
                              </div>
                            </td>
                            <td className="p-4 text-right text-slate-800">
                              <div>{formatCurrency(expense.estimatedCost)}</div>
                              {expense.depositRequired && expense.depositRequired > 0 && (
                                <div className="text-xs text-amber-600 mt-1" title="Valor do Sinal/Entrada">
                                  Sinal: {formatCurrency(expense.depositRequired)}
                                </div>
                              )}
                            </td>
                            <td className="p-4 text-right text-slate-600 hidden md:table-cell">{formatCurrency(expense.paidAmount)}</td>
                            <td className="p-4">
                              <div className="flex justify-center gap-2">
                                {expense.status !== ExpenseStatus.PAID && (
                                  <button
                                    onClick={() => handleMarkAsPaid(expense.id)}
                                    className="p-2 bg-green-50 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                                    title="Marcar como Pago Totalmente"
                                  >
                                    <Check size={18} />
                                  </button>
                                )}
                                <button 
                                  onClick={() => handleEditExpense(expense)} 
                                  className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors" 
                                  title="Editar"
                                >
                                  <Edit2 size={18} />
                                </button>
                                <button 
                                  onClick={() => handleDeleteExpense(expense.id)} 
                                  className="p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors cursor-pointer" 
                                  title="Excluir"
                                >
                                  <Trash2 size={18} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                    <tfoot className="bg-slate-50 border-t border-slate-200 font-semibold text-slate-800 md:hidden">
                        <tr>
                          <td className="p-4" colSpan={4}>Total Estimado</td>
                          <td className="p-4 text-right">{formatCurrency(totalEstimated)}</td>
                        </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* TAB: GUESTS */}
        {activeTab === 'guests' && (
           <GuestManager 
             guests={guests} 
             onAddGuest={handleAddGuest} 
             onRemoveGuest={handleRemoveGuest} 
             onToggleConfirmation={handleToggleGuestConfirmation}
           />
        )}

        {/* TAB: SEATING CHART */}
        {activeTab === 'seating' && (
          <SeatingChart 
            guests={guests} 
            tables={tables}
            onAddTable={handleAddTable}
            onRemoveTable={handleRemoveTable}
            onAssignGuest={handleAssignGuestToSeat}
            onUnassignGuest={handleUnassignGuest}
          />
        )}
        
        {/* TAB: INVITATION CREATOR */}
        {activeTab === 'invites' && (
          <InvitationCreator 
            data={invitation}
            onUpdate={setInvitation}
          />
        )}

        {/* TAB: GIFT REGISTRY */}
        {activeTab === 'registry' && (
          <GiftRegistryManager 
            items={giftItems}
            guestCount={guests.length}
            onAddItem={handleAddGiftItem}
            onUpdateItem={handleUpdateGiftItem}
            onRemoveItem={handleRemoveGiftItem}
          />
        )}

        {/* TAB: WEBSITE BUILDER */}
        {activeTab === 'website' && (
          <WebsiteBuilder 
            data={websiteData}
            giftItems={giftItems}
            onUpdate={setWebsiteData}
          />
        )}

        {/* TAB: PLANNING */}
        {activeTab === 'planning' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Input Section */}
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <Calendar size={20} className="text-rose-500" />
                  Configurar Planejamento
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Quanto vocês já tem guardado?
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">R$</span>
                      <input
                        type="number"
                        value={savingsPlan.currentSavings}
                        onChange={(e) => setSavingsPlan({...savingsPlan, currentSavings: parseFloat(e.target.value) || 0})}
                        className="w-full pl-10 p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-400 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100">
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      O que você deseja calcular?
                    </label>
                    <div className="flex gap-2 mb-4">
                      <button
                        onClick={() => setSavingsPlan({...savingsPlan, mode: 'calculate_date'})}
                        className={`flex-1 py-2 px-3 text-sm rounded-lg border transition-colors ${
                          savingsPlan.mode === 'calculate_date'
                            ? 'bg-rose-50 border-rose-200 text-rose-700 font-medium'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        Calcular Prazo
                      </button>
                      <button
                        onClick={() => setSavingsPlan({...savingsPlan, mode: 'calculate_amount'})}
                        className={`flex-1 py-2 px-3 text-sm rounded-lg border transition-colors ${
                          savingsPlan.mode === 'calculate_amount'
                            ? 'bg-rose-50 border-rose-200 text-rose-700 font-medium'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        Calcular Meta Mensal
                      </button>
                    </div>

                    {savingsPlan.mode === 'calculate_date' ? (
                      <div>
                         <label className="block text-sm font-medium text-slate-700 mb-1">
                          Quanto vocês podem guardar por mês?
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">R$</span>
                          <input
                            type="number"
                            value={savingsPlan.monthlyContribution}
                            onChange={(e) => setSavingsPlan({...savingsPlan, monthlyContribution: parseFloat(e.target.value) || 0})}
                            className="w-full pl-10 p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-400 focus:outline-none"
                          />
                        </div>
                        <p className="text-xs text-slate-500 mt-1">Calcularemos em quanto tempo vocês pagarão tudo.</p>
                      </div>
                    ) : (
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                          Qual a data do casamento?
                        </label>
                        <input
                          type="date"
                          value={savingsPlan.targetDate}
                          onChange={(e) => setSavingsPlan({...savingsPlan, targetDate: e.target.value})}
                          className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-400 focus:outline-none"
                        />
                        <p className="text-xs text-slate-500 mt-1">Calcularemos quanto guardar por mês.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Results Section */}
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-rose-500 to-rose-700 p-6 rounded-xl shadow-lg text-white">
                 <div className="flex items-start justify-between">
                    <div>
                      <p className="text-rose-100 text-sm font-medium mb-1">Valor Restante a Pagar</p>
                      <h3 className="text-3xl font-bold">{formatCurrency(plannerData.fundsNeeded)}</h3>
                    </div>
                    <div className="p-2 bg-white/20 rounded-lg">
                      <Calculator className="text-white" size={24} />
                    </div>
                 </div>
                 
                 <div className="mt-6 pt-6 border-t border-white/20">
                    <p className="text-rose-100 text-sm mb-2">
                      {savingsPlan.mode === 'calculate_date' ? 'Previsão de Conclusão' : 'Meta de Poupança Mensal'}
                    </p>
                    <div className="flex items-baseline gap-2">
                       {plannerData.resultValue && <span className="text-2xl font-bold">{plannerData.resultValue}</span>}
                       <span className="text-rose-100 text-sm">{savingsPlan.mode === 'calculate_amount' ? 'por mês' : ''}</span>
                    </div>
                    <p className="text-sm mt-2 opacity-90 font-light">
                      {plannerData.resultMessage}
                    </p>
                 </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <div className="flex gap-4">
                  <CheckCircle2 className="text-green-500 shrink-0" size={24} />
                  <div>
                    <h4 className="font-semibold text-slate-800">Dica Financeira</h4>
                    <p className="text-sm text-slate-600 mt-1">
                      Mantenha um fundo de emergência de pelo menos 10% do valor total do casamento para imprevistos. A Consultora IA pode ajudar a encontrar onde cortar gastos!
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* TAB: ADVISOR */}
        {activeTab === 'advisor' && (
          <div className="max-w-3xl mx-auto h-[calc(100vh-180px)] md:h-auto flex flex-col">
             <div className="mb-4 text-center shrink-0">
               <h2 className="text-xl md:text-2xl font-bold text-slate-800">Consultora de Casamentos</h2>
               <p className="text-xs md:text-base text-slate-500">Tire dúvidas, peça dicas de economia e organize suas ideias com IA.</p>
             </div>
             <div className="flex-1 min-h-0">
                <AIAdvisor expenses={expenses} savings={savingsPlan.currentSavings} />
             </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default App;