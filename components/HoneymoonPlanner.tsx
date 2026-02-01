
import React, { useState } from 'react';
import { HoneymoonPlan, HoneymoonDestination } from '../types';
import { suggestHoneymoonDestinations } from '../services/geminiService';
import { Plane, Map, Calendar, DollarSign, Loader2, CheckCircle2, Palmtree, Mountain, Camera, Heart, PlusCircle, Trash2, Luggage } from 'lucide-react';

interface HoneymoonPlannerProps {
  plan: HoneymoonPlan;
  onUpdatePlan: (plan: HoneymoonPlan) => void;
  onAddExpense: (name: string, cost: number) => void;
}

export const HoneymoonPlanner: React.FC<HoneymoonPlannerProps> = ({ plan, onUpdatePlan, onAddExpense }) => {
  const [preferences, setPreferences] = useState({
    vibe: 'Praia e Relaxamento',
    month: 'Setembro',
    budget: 'R$ 10.000 - R$ 15.000'
  });
  const [suggestions, setSuggestions] = useState<HoneymoonDestination[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [newItem, setNewItem] = useState('');

  const vibes = ['Praia e Relaxamento', 'Aventura e Natureza', 'Cidade e Cultura', 'Romântico e Frio', 'Gastronomia e Vinhos', 'Luxo Exclusivo'];
  const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

  const handleSearch = async () => {
    setIsLoading(true);
    setSuggestions([]);
    try {
      const results = await suggestHoneymoonDestinations(preferences);
      // Add random IDs just in case AI returns static ones or repeats
      const processed = results.map(r => ({ ...r, id: crypto.randomUUID() }));
      setSuggestions(processed);
    } catch (error) {
      alert("Erro ao buscar sugestões. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectDestination = (dest: HoneymoonDestination) => {
    // Generate default packing list based on vibes (simple logic for now)
    const packingList = [
      { item: 'Documentos (Passaporte/RG)', packed: false },
      { item: 'Cartões de Crédito/Dinheiro', packed: false },
      { item: 'Carregadores e Adaptadores', packed: false },
      { item: 'Remédios básicos', packed: false },
    ];

    if (dest.description.toLowerCase().includes('praia') || preferences.vibe.includes('Praia')) {
      packingList.push({ item: 'Protetor Solar', packed: false });
      packingList.push({ item: 'Roupas de Banho', packed: false });
      packingList.push({ item: 'Óculos de Sol', packed: false });
    } else if (preferences.vibe.includes('Frio')) {
      packingList.push({ item: 'Casacos Pesados', packed: false });
      packingList.push({ item: 'Luvas e Cachecol', packed: false });
    }

    onUpdatePlan({
      ...plan,
      selectedDestination: dest,
      packingList
    });
    
    // Prompt to add to budget
    if (confirm(`Deseja adicionar o custo estimado de ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(dest.estimatedCost)} ao seu orçamento geral de despesas?`)) {
        onAddExpense(`Lua de Mel: ${dest.name}`, dest.estimatedCost);
    }
  };

  const toggleItem = (idx: number) => {
    const newList = [...plan.packingList];
    newList[idx].packed = !newList[idx].packed;
    onUpdatePlan({ ...plan, packingList: newList });
  };

  const addItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.trim()) return;
    onUpdatePlan({
      ...plan,
      packingList: [...plan.packingList, { item: newItem, packed: false }]
    });
    setNewItem('');
  };

  const removeItem = (idx: number) => {
    const newList = plan.packingList.filter((_, i) => i !== idx);
    onUpdatePlan({ ...plan, packingList: newList });
  };

  const resetSearch = () => {
    if (confirm('Tem certeza? Isso apagará seu plano atual.')) {
        onUpdatePlan({ selectedDestination: null, packingList: [], notes: '' });
        setSuggestions([]);
    }
  };

  // -- RENDER: DASHBOARD MODE (If destination selected) --
  if (plan.selectedDestination) {
    const dest = plan.selectedDestination;
    return (
      <div className="space-y-6 animate-in fade-in duration-300">
        {/* Header Card */}
        <div className="bg-gradient-to-r from-cyan-600 to-blue-600 rounded-2xl p-6 md:p-10 text-white shadow-xl relative overflow-hidden">
           <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
              <div>
                  <div className="flex items-center gap-2 text-cyan-200 mb-2 font-bold uppercase tracking-wider text-sm">
                     <Plane size={16} /> Destino Confirmado
                  </div>
                  <h2 className="text-4xl md:text-5xl font-serif font-bold mb-2">{dest.name}</h2>
                  <p className="text-xl text-cyan-100 flex items-center gap-2"><Map size={20} /> {dest.country}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20">
                  <p className="text-xs text-cyan-100 uppercase mb-1">Custo Estimado</p>
                  <p className="text-2xl font-bold">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(dest.estimatedCost)}</p>
              </div>
           </div>
           
           {/* Decorative Background Icons */}
           <Palmtree className="absolute top-[-20px] right-[-20px] w-64 h-64 text-white/5 rotate-12" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
           {/* Left Col: Details */}
           <div className="lg:col-span-2 space-y-6">
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                  <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-bold text-slate-800">Sobre o Destino</h3>
                      <button onClick={resetSearch} className="text-sm text-red-500 hover:underline">Alterar Destino</button>
                  </div>
                  <p className="text-slate-600 leading-relaxed mb-6">{dest.description}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-slate-50 p-4 rounded-lg">
                          <h4 className="font-bold text-slate-700 mb-2 flex items-center gap-2">
                              <Heart size={16} className="text-rose-500" /> O que amar
                          </h4>
                          <ul className="space-y-1">
                              {dest.pros.map((pro, i) => (
                                  <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                                      <CheckCircle2 size={14} className="text-emerald-500 mt-0.5 shrink-0" /> {pro}
                                  </li>
                              ))}
                          </ul>
                      </div>
                       <div className="bg-slate-50 p-4 rounded-lg">
                          <h4 className="font-bold text-slate-700 mb-2 flex items-center gap-2">
                              <Camera size={16} className="text-blue-500" /> Atividades Imperdíveis
                          </h4>
                           <ul className="space-y-1">
                              {dest.activities.map((act, i) => (
                                  <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                                      <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-1.5 shrink-0"></span> {act}
                                  </li>
                              ))}
                          </ul>
                      </div>
                  </div>
              </div>

               <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                  <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                      <Luggage className="text-amber-500" /> Mala de Viagem
                  </h3>
                  
                  <form onSubmit={addItem} className="flex gap-2 mb-4">
                      <input 
                        value={newItem}
                        onChange={e => setNewItem(e.target.value)}
                        placeholder="Adicionar item..."
                        className="flex-1 p-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-cyan-500"
                      />
                      <button type="submit" className="bg-slate-800 text-white p-2 rounded-lg hover:bg-slate-700">
                          <PlusCircle size={20} />
                      </button>
                  </form>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {plan.packingList.map((item, idx) => (
                          <div key={idx} className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${item.packed ? 'bg-slate-50 border-slate-100 opacity-60' : 'bg-white border-slate-200'}`}>
                              <button 
                                onClick={() => toggleItem(idx)}
                                className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${item.packed ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300 hover:border-cyan-500'}`}
                              >
                                  {item.packed && <CheckCircle2 size={14} />}
                              </button>
                              <span className={`text-sm flex-1 ${item.packed ? 'line-through text-slate-400' : 'text-slate-700'}`}>{item.item}</span>
                              <button onClick={() => removeItem(idx)} className="text-slate-300 hover:text-red-500">
                                  <Trash2 size={14} />
                              </button>
                          </div>
                      ))}
                  </div>
              </div>
           </div>

           {/* Right Col: Notes */}
           <div className="lg:col-span-1">
               <div className="bg-amber-50 p-6 rounded-xl border border-amber-100 h-full">
                   <h3 className="font-bold text-amber-800 mb-4">Notas da Viagem</h3>
                   <textarea 
                     value={plan.notes}
                     onChange={(e) => onUpdatePlan({...plan, notes: e.target.value})}
                     className="w-full h-[300px] bg-white border border-amber-200 rounded-lg p-4 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none"
                     placeholder="Anote números de voos, reservas de hotel, dicas de restaurantes..."
                   />
               </div>
           </div>
        </div>
      </div>
    );
  }

  // -- RENDER: SEARCH MODE --
  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="text-center space-y-4 py-8">
        <div className="w-16 h-16 bg-cyan-100 text-cyan-600 rounded-full flex items-center justify-center mx-auto mb-4">
           <Plane size={32} />
        </div>
        <h2 className="text-3xl font-bold text-slate-800">Vamos planejar a Lua de Mel?</h2>
        <p className="text-slate-500 max-w-lg mx-auto">Conte para a nossa IA como seria a viagem dos seus sonhos e receba sugestões personalizadas de destinos incríveis.</p>
      </div>

      {/* Search Form */}
      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-slate-100">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
             <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                <Heart size={16} className="text-rose-500" /> Vibe do Casal
             </label>
             <select 
               value={preferences.vibe}
               onChange={e => setPreferences({...preferences, vibe: e.target.value})}
               className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500"
             >
                {vibes.map(v => <option key={v} value={v}>{v}</option>)}
             </select>
          </div>
          <div>
             <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                <Calendar size={16} className="text-blue-500" /> Quando?
             </label>
             <select 
               value={preferences.month}
               onChange={e => setPreferences({...preferences, month: e.target.value})}
               className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500"
             >
                {months.map(m => <option key={m} value={m}>{m}</option>)}
             </select>
          </div>
          <div>
             <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                <DollarSign size={16} className="text-emerald-500" /> Orçamento
             </label>
             <select 
               value={preferences.budget}
               onChange={e => setPreferences({...preferences, budget: e.target.value})}
               className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500"
             >
                <option value="Até R$ 5.000">Econômico (Até R$ 5k)</option>
                <option value="R$ 5.000 - R$ 10.000">Confortável (R$ 5k - 10k)</option>
                <option value="R$ 10.000 - R$ 20.000">Alto Padrão (R$ 10k - 20k)</option>
                <option value="Acima de R$ 20.000">Luxo (Acima de R$ 20k)</option>
             </select>
          </div>
        </div>
        <button 
          onClick={handleSearch}
          disabled={isLoading}
          className="w-full mt-6 bg-slate-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-slate-800 transition-all shadow-md flex items-center justify-center gap-3"
        >
          {isLoading ? <Loader2 className="animate-spin" /> : <Plane className="rotate-45" />}
          {isLoading ? 'Consultando Agência IA...' : 'Encontrar Destinos Perfeitos'}
        </button>
      </div>

      {/* Results */}
      {suggestions.length > 0 && (
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in slide-in-from-bottom duration-500">
            {suggestions.map((dest, i) => (
                <div key={i} className="bg-white rounded-xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 flex flex-col h-full">
                    <div className="h-40 bg-slate-200 relative overflow-hidden">
                       {/* Placeholder for destination image since text-only API doesn't return real images easily without another call */}
                       <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-cyan-500 to-blue-600 text-white">
                           {dest.name.includes('Praia') || preferences.vibe.includes('Praia') ? <Palmtree size={48} /> : <Mountain size={48} />}
                       </div>
                       <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                           <h3 className="text-white font-bold text-xl">{dest.name}</h3>
                           <p className="text-white/80 text-sm">{dest.country}</p>
                       </div>
                    </div>
                    <div className="p-6 flex-1 flex flex-col">
                        <div className="mb-4">
                            <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-2 py-1 rounded-full">
                                ~ {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(dest.estimatedCost)}
                            </span>
                        </div>
                        <p className="text-slate-600 text-sm mb-4 line-clamp-4">{dest.description}</p>
                        
                        <div className="mt-auto pt-4 border-t border-slate-100">
                             <p className="text-xs font-bold text-slate-500 mb-2 uppercase">Melhor Época</p>
                             <p className="text-sm text-slate-700 mb-4">{dest.bestTime}</p>
                             
                             <button 
                                onClick={() => handleSelectDestination(dest)}
                                className="w-full py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg font-bold transition-colors"
                             >
                                 Escolher Este
                             </button>
                        </div>
                    </div>
                </div>
            ))}
         </div>
      )}
    </div>
  );
};
