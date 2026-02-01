import React, { useState } from 'react';
import { GiftItem } from '../types';
import { Plus, Edit2, Trash2, Gift, DollarSign, Image as ImageIcon, ShoppingBag, X, Save, Wand2, PieChart } from 'lucide-react';

interface GiftRegistryManagerProps {
  items: GiftItem[];
  guestCount: number;
  onAddItem: (item: GiftItem) => void;
  onUpdateItem: (item: GiftItem) => void;
  onRemoveItem: (id: string) => void;
}

export const GiftRegistryManager: React.FC<GiftRegistryManagerProps> = ({ items, guestCount, onAddItem, onUpdateItem, onRemoveItem }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Form State
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [category, setCategory] = useState('');
  const [isCrowdfunding, setIsCrowdfunding] = useState(false);
  const [shares, setShares] = useState('1');

  const resetForm = () => {
    setName('');
    setPrice('');
    setImageUrl('');
    setCategory('');
    setIsCrowdfunding(false);
    setShares('1');
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (item: GiftItem) => {
    setName(item.name);
    setPrice(item.price.toString());
    setImageUrl(item.imageUrl);
    setCategory(item.category || '');
    setIsCrowdfunding((item.totalShares || 1) > 1);
    setShares(item.totalShares?.toString() || '1');
    setEditingId(item.id);
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const totalShares = isCrowdfunding ? Math.max(2, parseInt(shares) || 2) : 1;

    const itemData: GiftItem = {
      id: editingId || crypto.randomUUID(),
      name,
      price: parseFloat(price) || 0,
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&q=80&w=400',
      category: category || 'Geral',
      totalShares: totalShares,
      soldShares: editingId ? items.find(i => i.id === editingId)?.soldShares : 0
    };

    if (editingId) {
      onUpdateItem(itemData);
    } else {
      onAddItem(itemData);
    }
    resetForm();
  };

  const generateRandomPrice = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
  };

  const loadSamples = () => {
      // Regra de quantidade: Pelo menos 12 itens, ou 60% do número de convidados para ter variedade
      const targetTotal = Math.max(12, Math.ceil(guestCount * 0.6));
      
      // Distribuição
      const counts = {
        entry: Math.floor(targetTotal * 0.20),   // 20% - R$ 50 a 100
        medium: Math.floor(targetTotal * 0.50),  // 50% - R$ 150 a 350
        high: Math.floor(targetTotal * 0.20),    // 20% - R$ 400 a 700
        premium: Math.ceil(targetTotal * 0.10)   // 10% - R$ 800+
      };

      const templates = {
        entry: [
          { name: 'Drinks na Lua de Mel', cat: 'Lua de Mel', img: 'https://images.unsplash.com/photo-1536935338788-843bb6303473?auto=format&fit=crop&q=80&w=400' },
          { name: 'Sobremesa dos Noivos', cat: 'Jantar', img: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&q=80&w=400' },
          { name: 'Café da Manhã na Cama', cat: 'Lua de Mel', img: 'https://images.unsplash.com/photo-1533006927909-64582f3484c9?auto=format&fit=crop&q=80&w=400' },
          { name: 'Petiscos na Praia', cat: 'Lua de Mel', img: 'https://images.unsplash.com/photo-1629205634839-a93108c4a161?auto=format&fit=crop&q=80&w=400' },
          { name: 'Ingressos de Museu', cat: 'Passeio', img: 'https://images.unsplash.com/photo-1566127444979-b3d2b654e3d7?auto=format&fit=crop&q=80&w=400' },
          { name: 'Taças de Vinho', cat: 'Casa Nova', img: 'https://images.unsplash.com/photo-1566552881560-0be862a7c445?auto=format&fit=crop&q=80&w=400' }
        ],
        medium: [
          { name: 'Jantar Romântico', cat: 'Jantar', img: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=80&w=400' },
          { name: 'Passeio de Barco', cat: 'Passeio', img: 'https://images.unsplash.com/photo-1544551763-46a8e3d17118?auto=format&fit=crop&q=80&w=400' },
          { name: 'Massagem para o Casal', cat: 'Relax', img: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&q=80&w=400' },
          { name: 'Diária de Carro', cat: 'Transporte', img: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&q=80&w=400' },
          { name: 'Jogo de Cama King', cat: 'Casa Nova', img: 'https://images.unsplash.com/photo-1631679706909-1844bbd07221?auto=format&fit=crop&q=80&w=400' },
          { name: 'Kit Churrasco', cat: 'Casa Nova', img: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=400' },
          { name: 'Show ou Espetáculo', cat: 'Entretenimento', img: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=400' }
        ],
        high: [
          { name: 'Diária Hotel Boutique', cat: 'Lua de Mel', img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=400' },
          { name: 'Passagem Aérea (Trecho)', cat: 'Viagem', img: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80&w=400' },
          { name: 'Jantar Estrelado Michelin', cat: 'Gastronomia', img: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80&w=400' },
          { name: 'Eletrodoméstico Premium', cat: 'Casa Nova', img: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=400' }
        ],
        premium: [
          { name: 'Upgrade Suíte Master', cat: 'Lua de Mel', img: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&q=80&w=400' },
          { name: 'Cota Lua de Mel Completa', cat: 'Viagem', img: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=400' },
          { name: 'Geladeira Inverse', cat: 'Casa Nova', img: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=400' },
          { name: 'Sofá de Design', cat: 'Casa Nova', img: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=400' }
        ]
      };

      const newItems: GiftItem[] = [];
      const getRandom = (arr: any[]) => arr[Math.floor(Math.random() * arr.length)];

      // Entry: Nunca são cotas
      for (let i = 0; i < counts.entry; i++) {
        const t = getRandom(templates.entry);
        newItems.push({ id: crypto.randomUUID(), name: t.name, category: t.cat, imageUrl: t.img, price: generateRandomPrice(50, 100), totalShares: 1, soldShares: 0 });
      }

      // Medium: Podem ser cotas raramente, mas geralmente inteiros
      for (let i = 0; i < counts.medium; i++) {
        const t = getRandom(templates.medium);
        newItems.push({ id: crypto.randomUUID(), name: t.name, category: t.cat, imageUrl: t.img, price: generateRandomPrice(150, 350), totalShares: 1, soldShares: 0 });
      }

      // High: 50% de chance de ser cota
      for (let i = 0; i < counts.high; i++) {
        const t = getRandom(templates.high);
        const price = generateRandomPrice(400, 700);
        const isShare = Math.random() > 0.5;
        const shares = isShare ? Math.floor(price / 100) : 1; // Cotas de ~100 reais
        newItems.push({ id: crypto.randomUUID(), name: t.name, category: t.cat, imageUrl: t.img, price, totalShares: shares, soldShares: isShare ? Math.floor(Math.random() * shares) : 0 });
      }

      // Premium: Sempre são cotas para ficar acessível
      for (let i = 0; i < counts.premium; i++) {
        const t = getRandom(templates.premium);
        const price = generateRandomPrice(800, 2000);
        const shares = Math.floor(price / 150); // Cotas de ~150 reais
        newItems.push({ id: crypto.randomUUID(), name: t.name, category: t.cat, imageUrl: t.img, price, totalShares: shares, soldShares: Math.floor(Math.random() * shares) });
      }

      newItems.forEach(item => onAddItem(item));
      alert(`${newItems.length} sugestões de presentes foram adicionadas! Itens mais caros foram divididos em cotas.`);
  };

  return (
    <div className="space-y-6">
       {/* Header with Stats */}
       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
           <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
               <div className="p-3 bg-rose-100 text-rose-600 rounded-full">
                   <Gift size={24} />
               </div>
               <div>
                   <p className="text-sm text-slate-500">Total de Presentes</p>
                   <h3 className="text-2xl font-bold text-slate-800">{items.length}</h3>
               </div>
           </div>
           <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
               <div className="p-3 bg-emerald-100 text-emerald-600 rounded-full">
                   <DollarSign size={24} />
               </div>
               <div>
                   <p className="text-sm text-slate-500">Valor Total Estimado</p>
                   <h3 className="text-2xl font-bold text-emerald-600">
                       {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(items.reduce((acc, curr) => acc + curr.price, 0))}
                   </h3>
               </div>
           </div>
           <div className="bg-gradient-to-br from-rose-500 to-rose-600 p-6 rounded-xl shadow-md text-white flex flex-col justify-center items-start">
               <h3 className="font-bold text-lg mb-1">Dica</h3>
               <p className="text-sm opacity-90">Divida itens caros em cotas para facilitar a compra pelos convidados.</p>
           </div>
       </div>

       {/* Actions */}
       <div className="flex justify-between items-center">
           <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
               <ShoppingBag className="text-rose-500" />
               Gerenciar Produtos
           </h2>
           <div className="flex gap-2">
               <button 
                onClick={loadSamples}
                className="px-4 py-2 text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-lg hover:bg-rose-100 transition-colors flex items-center gap-2"
                title="Gera presentes baseados no número de convidados"
               >
                   <Wand2 size={16} />
                   Sugestão Inteligente
               </button>
               <button 
                onClick={() => setShowForm(true)}
                className="px-4 py-2 text-sm font-medium text-white bg-slate-800 rounded-lg hover:bg-slate-900 transition-colors flex items-center gap-2"
               >
                   <Plus size={16} /> Novo Presente
               </button>
           </div>
       </div>

       {/* Form Modal/Inline */}
       {showForm && (
           <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
               <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 animate-in fade-in zoom-in duration-200">
                   <div className="flex justify-between items-center mb-6">
                       <h3 className="text-lg font-bold text-slate-800">{editingId ? 'Editar Presente' : 'Novo Presente Virtual'}</h3>
                       <button onClick={resetForm} className="text-slate-400 hover:text-slate-600"><X size={24}/></button>
                   </div>
                   <form onSubmit={handleSubmit} className="space-y-4">
                       <div>
                           <label className="block text-sm font-medium text-slate-700 mb-1">Nome do Produto</label>
                           <input 
                            required
                            value={name}
                            onChange={e => setName(e.target.value)}
                            placeholder="Ex: Jantar à Luz de Velas"
                            className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-400 outline-none"
                           />
                       </div>
                       <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Valor Total (R$)</label>
                                <input 
                                    required
                                    type="number"
                                    step="0.01"
                                    value={price}
                                    onChange={e => setPrice(e.target.value)}
                                    placeholder="0.00"
                                    className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-400 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Categoria</label>
                                <input 
                                    value={category}
                                    onChange={e => setCategory(e.target.value)}
                                    placeholder="Ex: Lua de Mel"
                                    className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-400 outline-none"
                                />
                            </div>
                       </div>
                       
                       {/* Cotas Toggle */}
                       <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                            <div className="flex items-center justify-between mb-2">
                                <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                                    <PieChart size={16} className="text-rose-500" />
                                    Dividir em Cotas?
                                </label>
                                <input 
                                    type="checkbox"
                                    checked={isCrowdfunding}
                                    onChange={e => setIsCrowdfunding(e.target.checked)}
                                    className="accent-rose-600 w-5 h-5"
                                />
                            </div>
                            {isCrowdfunding && (
                                <div className="mt-3 space-y-2">
                                    <label className="block text-xs font-medium text-slate-500">Número de Cotas</label>
                                    <input 
                                        type="number"
                                        min="2"
                                        value={shares}
                                        onChange={e => setShares(e.target.value)}
                                        className="w-full p-2 bg-white border border-slate-300 rounded focus:ring-2 focus:ring-rose-400 outline-none"
                                    />
                                    {price && shares && (
                                        <p className="text-xs text-rose-600 font-medium">
                                            Valor por cota: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(parseFloat(price) / parseInt(shares))}
                                        </p>
                                    )}
                                </div>
                            )}
                       </div>

                       <div>
                           <label className="block text-sm font-medium text-slate-700 mb-1">URL da Imagem</label>
                           <div className="flex gap-2">
                               <input 
                                value={imageUrl}
                                onChange={e => setImageUrl(e.target.value)}
                                placeholder="https://..."
                                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-400 outline-none text-sm"
                               />
                               <div className="w-10 h-10 shrink-0 bg-slate-100 rounded border border-slate-200 overflow-hidden flex items-center justify-center">
                                   {imageUrl ? <img src={imageUrl} className="w-full h-full object-cover" alt="" /> : <ImageIcon size={16} className="text-slate-300" />}
                               </div>
                           </div>
                           <p className="text-xs text-slate-500 mt-1">Deixe em branco para usar uma imagem padrão.</p>
                       </div>
                       <div className="pt-4 flex gap-3">
                           <button type="button" onClick={resetForm} className="flex-1 py-2 text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50">Cancelar</button>
                           <button type="submit" className="flex-1 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 font-medium flex justify-center items-center gap-2">
                               <Save size={18} /> Salvar
                           </button>
                       </div>
                   </form>
               </div>
           </div>
       )}

       {/* Grid of Items */}
       {items.length === 0 ? (
           <div className="bg-slate-50 border border-dashed border-slate-300 rounded-xl p-12 flex flex-col items-center justify-center text-slate-400">
               <ShoppingBag size={48} className="mb-4 opacity-50" />
               <p className="font-medium">Sua lista está vazia</p>
               <p className="text-sm">Adicione itens para seus convidados presentearem.</p>
               <button 
                onClick={loadSamples}
                className="mt-4 px-4 py-2 text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-lg hover:bg-rose-100 transition-colors flex items-center gap-2"
               >
                   <Wand2 size={16} />
                   Gerar Lista Inteligente
               </button>
           </div>
       ) : (
           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
               {items.map(item => {
                   const isShares = (item.totalShares || 1) > 1;
                   const sharePrice = item.price / (item.totalShares || 1);
                   
                   return (
                   <div key={item.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden group hover:shadow-md transition-shadow">
                       <div className="aspect-square relative overflow-hidden bg-slate-100">
                           <img 
                            src={item.imageUrl} 
                            alt={item.name} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                           />
                           <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                               <button 
                                onClick={() => handleEdit(item)}
                                className="p-2 bg-white/90 text-slate-700 rounded-full shadow-sm hover:text-rose-600"
                               >
                                   <Edit2 size={16} />
                               </button>
                               <button 
                                onClick={() => onRemoveItem(item.id)}
                                className="p-2 bg-white/90 text-slate-700 rounded-full shadow-sm hover:text-red-600"
                               >
                                   <Trash2 size={16} />
                               </button>
                           </div>
                           {item.category && (
                               <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/50 text-white text-xs rounded backdrop-blur-sm">
                                   {item.category}
                               </div>
                           )}
                           {isShares && (
                               <div className="absolute top-2 left-2 px-2 py-1 bg-rose-500 text-white text-xs font-bold rounded shadow-sm flex items-center gap-1">
                                   <PieChart size={12} /> Cotas
                               </div>
                           )}
                       </div>
                       <div className="p-4">
                           <h4 className="font-bold text-slate-800 line-clamp-1" title={item.name}>{item.name}</h4>
                           <div className="mt-2 flex justify-between items-end">
                               <div>
                                   {isShares ? (
                                       <>
                                        <p className="text-xs text-slate-500">{item.totalShares} cotas de</p>
                                        <span className="text-lg font-bold text-rose-600">
                                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(sharePrice)}
                                        </span>
                                       </>
                                   ) : (
                                       <span className="text-lg font-bold text-rose-600">
                                           {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.price)}
                                       </span>
                                   )}
                               </div>
                           </div>
                           {isShares && (
                               <div className="mt-2 w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                                   <div 
                                    className="bg-emerald-400 h-full rounded-full" 
                                    style={{ width: `${((item.soldShares || 0) / (item.totalShares || 1)) * 100}%` }}
                                   />
                               </div>
                           )}
                       </div>
                   </div>
               )})}
           </div>
       )}
    </div>
  );
};