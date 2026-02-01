import React, { useRef } from 'react';
import { Expense, ExpenseCategory } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';
import { DollarSign, Wallet, AlertCircle, Target, BookmarkCheck, Save, Upload, Database } from 'lucide-react';

interface DashboardProps {
  expenses: Expense[];
  savingsPlan: { currentSavings: number, mode: string };
  planningResult: { fundsNeeded: number, resultMessage: string, resultValue: string };
  onExportBackup: () => void;
  onImportBackup: (file: File) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ expenses, savingsPlan, planningResult, onExportBackup, onImportBackup }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const totalEstimated = expenses.reduce((acc, curr) => acc + curr.estimatedCost, 0);
  const totalPaid = expenses.reduce((acc, curr) => acc + curr.paidAmount, 0);
  const remainingCost = totalEstimated - totalPaid;

  // Deposit Logic
  const totalDepositRequired = expenses.reduce((acc, curr) => acc + (curr.depositRequired || 0), 0);
  const pendingDeposit = expenses.reduce((acc, curr) => {
    const required = curr.depositRequired || 0;
    const paid = curr.paidAmount || 0;
    return acc + Math.max(0, required - paid);
  }, 0);


  // Data for Category Pie Chart
  const categoryData = Object.values(ExpenseCategory).map(cat => {
    const value = expenses
      .filter(e => e.category === cat)
      .reduce((acc, curr) => acc + curr.estimatedCost, 0);
    return { name: cat, value };
  }).filter(item => item.value > 0);

  // Data for Status Bar Chart
  const statusData = [
    {
      name: 'Total',
      Estimado: totalEstimated,
      Pago: totalPaid
    }
  ];

  const COLORS = ['#e11d48', '#fb7185', '#f43f5e', '#fda4af', '#881337', '#be123c', '#9f1239', '#e11d48'];

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImportBackup(file);
    }
    // Reset input value to allow selecting the same file again if needed
    if (event.target) {
        event.target.value = '';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Financial Planning Insight Card */}
      {planningResult && (
        <div className="bg-gradient-to-r from-violet-600 to-indigo-600 rounded-xl shadow-lg p-6 text-white flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex-1">
            <h3 className="text-indigo-100 font-semibold text-sm uppercase tracking-wide mb-1">
              {savingsPlan.mode === 'calculate_date' ? 'Previsão de Término' : 'Meta de Economia Mensal'}
            </h3>
            <div className="flex items-baseline gap-2">
               <span className="text-3xl md:text-4xl font-bold">{planningResult.resultValue || '---'}</span>
               {savingsPlan.mode === 'calculate_amount' && <span className="text-indigo-200">/mês</span>}
            </div>
            <p className="text-indigo-100 mt-2 text-sm opacity-90">{planningResult.resultMessage}</p>
          </div>
          <div className="bg-white/10 p-4 rounded-full backdrop-blur-sm">
            <Target size={32} className="text-white" />
          </div>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-rose-100 text-rose-600 rounded-full">
              <DollarSign size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500">Custo Total Estimado</p>
              <h3 className="text-2xl font-bold text-slate-800">{formatCurrency(totalEstimated)}</h3>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 text-green-600 rounded-full">
              <Wallet size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500">Valor Já Pago</p>
              <h3 className="text-2xl font-bold text-slate-800">{formatCurrency(totalPaid)}</h3>
            </div>
          </div>
        </div>

        {/* New Card for Deposits */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 relative overflow-hidden">
           <div className={`absolute right-0 top-0 w-1 h-full ${pendingDeposit > 0 ? 'bg-amber-400' : 'bg-green-400'}`} />
          <div className="flex items-center gap-4">
            <div className="p-3 bg-amber-100 text-amber-600 rounded-full">
              <BookmarkCheck size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500">Pendência de Reservas</p>
               {pendingDeposit > 0 ? (
                 <>
                  <h3 className="text-2xl font-bold text-amber-600">{formatCurrency(pendingDeposit)}</h3>
                  <p className="text-xs text-slate-400">De {formatCurrency(totalDepositRequired)} em sinais</p>
                 </>
               ) : (
                 <h3 className="text-lg font-bold text-green-600 mt-1">Tudo Garantido! 🎉</h3>
               )}
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-orange-100 text-orange-600 rounded-full">
              <AlertCircle size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500">Total Restante</p>
              <h3 className="text-2xl font-bold text-slate-800">{formatCurrency(remainingCost)}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h4 className="text-lg font-semibold mb-4 text-slate-700">Gastos por Categoria</h4>
          <div className="h-64 w-full">
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => formatCurrency(value)} />
                  <Legend verticalAlign="bottom" height={36}/>
                </PieChart>
              </ResponsiveContainer>
            ) : (
               <div className="h-full flex items-center justify-center text-slate-400">Sem dados para exibir</div>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h4 className="text-lg font-semibold mb-4 text-slate-700">Progresso de Pagamentos</h4>
           <div className="h-64 w-full">
             <ResponsiveContainer width="100%" height="100%">
               <BarChart data={statusData} layout="vertical">
                 <CartesianGrid strokeDasharray="3 3" />
                 <XAxis type="number" tickFormatter={(val) => `R$${val/1000}k`}/>
                 <YAxis type="category" dataKey="name" />
                 <Tooltip formatter={(value: number) => formatCurrency(value)} />
                 <Legend />
                 <Bar dataKey="Pago" stackId="a" fill="#10b981" />
                 <Bar dataKey="Estimado" stackId="a" fill="#e11d48" />
               </BarChart>
             </ResponsiveContainer>
           </div>
        </div>
      </div>

      {/* Data Persistence Section */}
      <div className="bg-slate-800 text-slate-200 p-6 rounded-xl shadow-md border border-slate-700">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-start gap-4">
             <div className="p-3 bg-slate-700 rounded-lg">
                <Database className="text-slate-300" size={24} />
             </div>
             <div>
               <h4 className="text-lg font-semibold text-white">Backup e Restauração</h4>
               <p className="text-sm text-slate-400 mt-1 max-w-lg">
                 Seus dados são salvos automaticamente no navegador. Para garantir segurança total ou transferir para outro dispositivo, faça o download do backup periodicamente.
               </p>
             </div>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <button 
              onClick={onExportBackup}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg transition-colors border border-slate-600"
            >
              <Save size={18} />
              Baixar Backup
            </button>
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Upload size={18} />
              Restaurar Dados
            </button>
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".json"
              className="hidden" 
            />
          </div>
        </div>
      </div>
    </div>
  );
};