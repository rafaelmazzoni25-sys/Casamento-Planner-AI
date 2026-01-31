import React, { useState, useEffect } from 'react';
import { Dashboard } from './components/Dashboard';
import { ExpenseForm } from './components/ExpenseForm';
import { AIAdvisor } from './components/AIAdvisor';
import { Expense, ExpenseCategory, ExpenseStatus, SavingsPlan } from './types';
import { Heart, LayoutDashboard, List, Calendar, MessageSquareText, Download, Trash2, Edit2, Plus, Calculator, CheckCircle2, Check, DollarSign, Clock } from 'lucide-react';

const STORAGE_KEY = 'wedding_planner_data';

const App: React.FC = () => {
  // State
  const [activeTab, setActiveTab] = useState<'dashboard' | 'expenses' | 'planning' | 'advisor'>('dashboard');
  const [expenses, setExpenses] = useState<Expense[]>([]);
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
        // Preserve saved mode if exists, otherwise default to calculate_amount
        setSavingsPlan(parsed.savingsPlan || {
          currentSavings: 0,
          monthlyContribution: 1000,
          targetDate: new Date().toISOString().split('T')[0],
          mode: 'calculate_amount'
        });
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
    }
  }, []);

  // Save data on change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ expenses, savingsPlan }));
  }, [expenses, savingsPlan]);

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
    // Removed confirmation dialog to ensure immediate action and avoid browser blocks
    setExpenses(prev => prev.filter(e => e.id !== id));
    
    // If we are currently editing the item we just deleted, close the form
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

  const handleExportBackup = () => {
    const data = {
      expenses,
      savingsPlan,
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
        if (parsed.savingsPlan) {
          setSavingsPlan(parsed.savingsPlan);
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
    // Definição das colunas
    const headers = ['Nome', 'Categoria', 'Data Vencimento', 'Status', 'Custo Estimado (R$)', 'Sinal Necessário (R$)', 'Valor Pago (R$)', 'Observações'];
    
    // Sort before export for better organization
    const sortedForExport = [...expenses].sort((a, b) => {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return a.dueDate.localeCompare(b.dueDate);
    });

    // Mapeamento dos dados com formatação específica para Excel BR
    const rows = sortedForExport.map(e => {
      const formattedDate = e.dueDate ? new Date(e.dueDate).toLocaleDateString('pt-BR') : '-';
      return [
        `"${e.name.replace(/"/g, '""')}"`, // Escapa aspas duplas
        `"${e.category}"`,
        `"${formattedDate}"`, // Nova coluna de data
        `"${e.status}"`,
        `"${e.estimatedCost.toFixed(2).replace('.', ',')}"`, // Formato numérico com vírgula
        `"${(e.depositRequired || 0).toFixed(2).replace('.', ',')}"`, // Sinal
        `"${e.paidAmount.toFixed(2).replace('.', ',')}"`, // Formato numérico com vírgula
        `"${(e.notes || '').replace(/"/g, '""').replace(/\n/g, ' ')}"` // Remove quebras de linha das notas para manter integridade da linha
      ];
    });

    // Adiciona BOM (\uFEFF) para garantir que o Excel reconheça os acentos (UTF-8)
    // Usa ponto e vírgula (;) como separador, padrão no Excel em português
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

  // Sort expenses for display: Dates first (earliest to latest), then those without dates
  const sortedExpenses = [...expenses].sort((a, b) => {
    if (a.dueDate && b.dueDate) return a.dueDate.localeCompare(b.dueDate);
    if (a.dueDate) return -1;
    if (b.dueDate) return 1;
    return 0;
  });

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-rose-100 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-rose-600">
            <Heart className="fill-current" size={28} />
            <h1 className="text-xl font-bold tracking-tight text-slate-900">Casamento<span className="text-rose-600">Planner</span> AI</h1>
          </div>
          <div className="text-xs md:text-sm text-slate-500 hidden md:block">
             Planeje seu sonho, controle seu bolso
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4">
          <nav className="flex space-x-1 md:space-x-8 overflow-x-auto">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                activeTab === 'dashboard'
                  ? 'border-rose-500 text-rose-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              <LayoutDashboard size={18} />
              Visão Geral
            </button>
            <button
              onClick={() => setActiveTab('expenses')}
              className={`flex items-center gap-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                activeTab === 'expenses'
                  ? 'border-rose-500 text-rose-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              <List size={18} />
              Despesas
            </button>
            <button
              onClick={() => setActiveTab('planning')}
              className={`flex items-center gap-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                activeTab === 'planning'
                  ? 'border-rose-500 text-rose-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              <Calculator size={18} />
              Planejamento
            </button>
            <button
              onClick={() => setActiveTab('advisor')}
              className={`flex items-center gap-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                activeTab === 'advisor'
                  ? 'border-rose-500 text-rose-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              <MessageSquareText size={18} />
              Consultora IA
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl mx-auto px-4 py-8 w-full">
        
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
          <div className="max-w-3xl mx-auto">
             <div className="mb-4 text-center">
               <h2 className="text-2xl font-bold text-slate-800">Consultora de Casamentos</h2>
               <p className="text-slate-500">Tire dúvidas, peça dicas de economia e organize suas ideias com IA.</p>
             </div>
             <AIAdvisor expenses={expenses} savings={savingsPlan.currentSavings} />
          </div>
        )}

      </main>
    </div>
  );
};

export default App;