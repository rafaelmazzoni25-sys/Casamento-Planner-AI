import React, { useState } from 'react';
import { Guest, GuestSide } from '../types';
import { Users, UserPlus, Check, X, Download, Trash2, UserCheck } from 'lucide-react';

interface GuestManagerProps {
  guests: Guest[];
  onAddGuest: (guest: Guest) => void;
  onRemoveGuest: (id: string) => void;
  onToggleConfirmation: (id: string) => void;
}

export const GuestManager: React.FC<GuestManagerProps> = ({ guests, onAddGuest, onRemoveGuest, onToggleConfirmation }) => {
  const [newName, setNewName] = useState('');
  const [newSide, setNewSide] = useState<GuestSide>(GuestSide.BRIDE);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const newGuest: Guest = {
      id: crypto.randomUUID(),
      name: newName,
      side: newSide,
      confirmed: false
    };

    onAddGuest(newGuest);
    setNewName('');
  };

  const exportGuestsToCSV = () => {
    const headers = ['Nome', 'Lado', 'Confirmado'];
    const rows = guests.map(g => [
      `"${g.name.replace(/"/g, '""')}"`,
      `"${g.side}"`,
      `"${g.confirmed ? 'Sim' : 'Não'}"`
    ]);

    const csvContent = '\uFEFF' + [headers.join(';'), ...rows.map(r => r.join(';'))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'lista_convidados.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const brideGuests = guests.filter(g => g.side === GuestSide.BRIDE);
  const groomGuests = guests.filter(g => g.side === GuestSide.GROOM);

  const totalConfirmed = guests.filter(g => g.confirmed).length;

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <div className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Total Convidados</div>
          <div className="text-2xl font-bold text-slate-800">{guests.length}</div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <div className="text-emerald-600 text-xs font-semibold uppercase tracking-wider">Confirmados</div>
          <div className="text-2xl font-bold text-emerald-600">{totalConfirmed}</div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <div className="text-rose-500 text-xs font-semibold uppercase tracking-wider">Lado da Noiva</div>
          <div className="text-2xl font-bold text-slate-800">{brideGuests.length}</div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <div className="text-blue-500 text-xs font-semibold uppercase tracking-wider">Lado do Noivo</div>
          <div className="text-2xl font-bold text-slate-800">{groomGuests.length}</div>
        </div>
      </div>

      {/* Input Form */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <UserPlus size={20} className="text-rose-500" />
          Adicionar Convidado
        </h3>
        <form onSubmit={handleAdd} className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Nome do convidado"
              className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-400 focus:outline-none"
            />
          </div>
          <div className="w-full md:w-48">
            <select
              value={newSide}
              onChange={(e) => setNewSide(e.target.value as GuestSide)}
              className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-400 focus:outline-none"
            >
              <option value={GuestSide.BRIDE}>Lado da Noiva</option>
              <option value={GuestSide.GROOM}>Lado do Noivo</option>
            </select>
          </div>
          <button
            type="submit"
            className="bg-rose-600 text-white px-6 py-2 rounded-lg hover:bg-rose-700 transition-colors font-medium flex items-center justify-center gap-2"
          >
            <UserPlus size={18} />
            <span className="md:hidden">Adicionar na Lista</span>
            <span className="hidden md:inline">Adicionar</span>
          </button>
        </form>
      </div>

      <div className="flex justify-end">
         <button
            onClick={exportGuestsToCSV}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-800 bg-white border border-slate-300 hover:bg-slate-50 px-4 py-2 rounded-lg transition-colors text-sm"
          >
            <Download size={16} />
            Exportar Lista (Excel)
          </button>
      </div>

      {/* Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Bride Side */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-full">
          <div className="bg-rose-50 p-4 border-b border-rose-100 flex justify-between items-center">
             <h4 className="font-bold text-rose-800 flex items-center gap-2">
               <Users size={18} />
               Convidados da Noiva
             </h4>
             <span className="bg-white text-rose-600 px-2 py-0.5 rounded-full text-xs font-bold border border-rose-100">
               {brideGuests.length}
             </span>
          </div>
          <div className="divide-y divide-slate-100 flex-1">
             {brideGuests.length === 0 ? (
               <div className="p-8 text-center text-slate-400 italic">Nenhum convidado ainda.</div>
             ) : (
               brideGuests.map(guest => (
                 <div key={guest.id} className="p-3 flex items-center justify-between hover:bg-slate-50 group">
                    <div className="flex items-center gap-3">
                       <button 
                         onClick={() => onToggleConfirmation(guest.id)}
                         className={`w-6 h-6 rounded-full border flex items-center justify-center transition-colors ${
                           guest.confirmed 
                             ? 'bg-emerald-100 border-emerald-200 text-emerald-600' 
                             : 'bg-white border-slate-300 text-transparent hover:border-slate-400'
                         }`}
                         title={guest.confirmed ? "Presença Confirmada" : "Marcar presença"}
                       >
                         <Check size={14} />
                       </button>
                       <span className={`text-slate-700 ${guest.confirmed ? 'font-medium' : ''}`}>{guest.name}</span>
                    </div>
                    <button 
                      onClick={() => onRemoveGuest(guest.id)}
                      className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all p-1"
                      title="Remover convidado"
                    >
                      <Trash2 size={16} />
                    </button>
                 </div>
               ))
             )}
          </div>
        </div>

        {/* Groom Side */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-full">
          <div className="bg-blue-50 p-4 border-b border-blue-100 flex justify-between items-center">
             <h4 className="font-bold text-blue-800 flex items-center gap-2">
               <Users size={18} />
               Convidados do Noivo
             </h4>
             <span className="bg-white text-blue-600 px-2 py-0.5 rounded-full text-xs font-bold border border-blue-100">
               {groomGuests.length}
             </span>
          </div>
          <div className="divide-y divide-slate-100 flex-1">
             {groomGuests.length === 0 ? (
               <div className="p-8 text-center text-slate-400 italic">Nenhum convidado ainda.</div>
             ) : (
               groomGuests.map(guest => (
                 <div key={guest.id} className="p-3 flex items-center justify-between hover:bg-slate-50 group">
                    <div className="flex items-center gap-3">
                       <button 
                         onClick={() => onToggleConfirmation(guest.id)}
                         className={`w-6 h-6 rounded-full border flex items-center justify-center transition-colors ${
                           guest.confirmed 
                             ? 'bg-emerald-100 border-emerald-200 text-emerald-600' 
                             : 'bg-white border-slate-300 text-transparent hover:border-slate-400'
                         }`}
                         title={guest.confirmed ? "Presença Confirmada" : "Marcar presença"}
                       >
                         <Check size={14} />
                       </button>
                       <span className={`text-slate-700 ${guest.confirmed ? 'font-medium' : ''}`}>{guest.name}</span>
                    </div>
                    <button 
                      onClick={() => onRemoveGuest(guest.id)}
                      className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all p-1"
                      title="Remover convidado"
                    >
                      <Trash2 size={16} />
                    </button>
                 </div>
               ))
             )}
          </div>
        </div>

      </div>
    </div>
  );
};