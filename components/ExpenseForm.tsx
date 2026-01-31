import React, { useState, useEffect } from 'react';
import { Expense, ExpenseCategory, ExpenseStatus } from '../types';
import { Plus, Save, X, Trash2 } from 'lucide-react';

interface ExpenseFormProps {
  onSave: (expense: Expense) => void;
  onCancel: () => void;
  onDelete?: (id: string) => void;
  initialData?: Expense | null;
}

export const ExpenseForm: React.FC<ExpenseFormProps> = ({ onSave, onCancel, onDelete, initialData }) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>(ExpenseCategory.OTHER);
  const [estimatedCost, setEstimatedCost] = useState<string>('');
  const [depositRequired, setDepositRequired] = useState<string>('');
  const [paidAmount, setPaidAmount] = useState<string>('');
  const [dueDate, setDueDate] = useState<string>('');
  const [status, setStatus] = useState<ExpenseStatus>(ExpenseStatus.PENDING);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setCategory(initialData.category);
      setEstimatedCost(initialData.estimatedCost.toString());
      setDepositRequired(initialData.depositRequired?.toString() || '');
      setPaidAmount(initialData.paidAmount.toString());
      setDueDate(initialData.dueDate || '');
      setStatus(initialData.status);
      setNotes(initialData.notes || '');
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newExpense: Expense = {
      id: initialData ? initialData.id : crypto.randomUUID(),
      name,
      category,
      estimatedCost: parseFloat(estimatedCost) || 0,
      paidAmount: parseFloat(paidAmount) || 0,
      depositRequired: parseFloat(depositRequired) || 0,
      dueDate: dueDate || undefined,
      status,
      notes
    };
    onSave(newExpense);
  };

  const handleDelete = () => {
    if (initialData && onDelete) {
       onDelete(initialData.id);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-slate-800">
          {initialData ? 'Editar Despesa' : 'Nova Despesa'}
        </h3>
        <button onClick={onCancel} className="text-slate-400 hover:text-slate-600">
          <X size={24} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Item</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-400 focus:outline-none"
            placeholder="Ex: Aluguel do Salão"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-slate-700 mb-1">Categoria</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
              className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-400 focus:outline-none"
            >
              {Object.values(ExpenseCategory).map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div className="md:col-span-1">
             <label className="block text-sm font-medium text-slate-700 mb-1">Data Vencimento</label>
             <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-400 focus:outline-none"
            />
          </div>
          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as ExpenseStatus)}
              className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-400 focus:outline-none"
            >
              {Object.values(ExpenseStatus).map((stat) => (
                <option key={stat} value={stat}>{stat}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Custo Total (R$)</label>
            <input
              type="number"
              step="0.01"
              required
              value={estimatedCost}
              onChange={(e) => setEstimatedCost(e.target.value)}
              className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-400 focus:outline-none"
              placeholder="0.00"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-rose-600 mb-1">Entrada / Sinal (R$)</label>
            <input
              type="number"
              step="0.01"
              value={depositRequired}
              onChange={(e) => setDepositRequired(e.target.value)}
              className="w-full p-2 border border-rose-200 bg-rose-50 rounded-lg focus:ring-2 focus:ring-rose-400 focus:outline-none"
              placeholder="Necessário p/ reservar"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Já Pago (R$)</label>
            <input
              type="number"
              step="0.01"
              value={paidAmount}
              onChange={(e) => setPaidAmount(e.target.value)}
              className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-400 focus:outline-none"
              placeholder="0.00"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Observações</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-400 focus:outline-none"
            rows={3}
          />
        </div>

        <div className="flex justify-between items-center pt-2">
           {initialData && onDelete ? (
             <button
              type="button"
              onClick={handleDelete}
              className="flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 transition-colors border border-red-100"
            >
              <Trash2 size={18} />
              <span className="hidden sm:inline">Excluir</span>
            </button>
           ) : <div />}

          <button
            type="submit"
            className="flex items-center gap-2 bg-rose-600 text-white px-6 py-2 rounded-lg hover:bg-rose-700 transition-colors"
          >
            <Save size={18} />
            Salvar
          </button>
        </div>
      </form>
    </div>
  );
};