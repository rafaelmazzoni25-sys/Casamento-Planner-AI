import React, { useState } from 'react';
import { VendorLead, VendorStats } from '../types';
import { 
  LayoutDashboard, Users, BarChart3, Settings, Crown, 
  MessageSquare, Calendar, ChevronRight, Eye, MousePointerClick, 
  TrendingUp, Search, Bell, ShieldCheck
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface VendorPortalProps {
  // Em um app real, receberia os dados do fornecedor logado
}

const MOCK_STATS: VendorStats = {
  profileViews: 1240,
  clicksToContact: 85,
  totalLeads: 12,
  conversionRate: 3.5,
  planLevel: 'basic'
};

const MOCK_LEADS: VendorLead[] = [
  { id: '1', coupleName: 'Fernanda & Rafael', weddingDate: '2025-09-12', budget: 15000, message: 'Olá, gostaríamos de um orçamento para 150 convidados.', status: 'new', receivedAt: '2h atrás' },
  { id: '2', coupleName: 'Juliana & Marcos', weddingDate: '2025-11-05', budget: 12000, message: 'Vocês têm disponibilidade para esta data?', status: 'read', receivedAt: '1 dia atrás' },
  { id: '3', coupleName: 'Carla & Pedro', weddingDate: '2026-02-20', budget: 18000, message: 'Adoramos as fotos! Podem nos enviar o PDF de preços?', status: 'contacted', receivedAt: '3 dias atrás' },
  { id: '4', coupleName: 'Ana & Lucas', weddingDate: '2025-07-15', budget: 10000, message: 'Fazemos questão de ter vocês no nosso dia.', status: 'booked', receivedAt: '1 semana atrás' },
];

const MOCK_CHART_DATA = [
  { name: 'Seg', views: 40, clicks: 2 },
  { name: 'Ter', views: 55, clicks: 4 },
  { name: 'Qua', views: 35, clicks: 1 },
  { name: 'Qui', views: 80, clicks: 8 },
  { name: 'Sex', views: 120, clicks: 15 },
  { name: 'Sab', views: 150, clicks: 20 },
  { name: 'Dom', views: 110, clicks: 12 },
];

export const VendorPortal: React.FC<VendorPortalProps> = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'leads' | 'profile' | 'plans'>('dashboard');
  const [plan, setPlan] = useState<'basic' | 'pro'>('basic');

  return (
    <div className="flex h-full min-h-screen bg-slate-50 text-slate-800 font-sans">
      
      {/* Sidebar */}
      <div className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0">
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-2 text-white mb-1">
            <Crown className="text-amber-400 fill-amber-400" size={24} />
            <span className="font-bold text-lg tracking-tight">Portal Parceiro</span>
          </div>
          <p className="text-xs text-slate-500">Buffet Delícias Reais</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'dashboard' ? 'bg-slate-800 text-white' : 'hover:bg-slate-800/50'}`}
          >
            <LayoutDashboard size={20} />
            Dashboard
          </button>
          <button 
            onClick={() => setActiveTab('leads')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'leads' ? 'bg-slate-800 text-white' : 'hover:bg-slate-800/50'}`}
          >
            <div className="relative">
              <MessageSquare size={20} />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-slate-900"></span>
            </div>
            Leads / Orçamentos
          </button>
           <button 
            onClick={() => setActiveTab('plans')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'plans' ? 'bg-slate-800 text-white' : 'hover:bg-slate-800/50'}`}
          >
            <TrendingUp size={20} />
            Impulsionar
          </button>
          <button 
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'profile' ? 'bg-slate-800 text-white' : 'hover:bg-slate-800/50'}`}
          >
            <Settings size={20} />
            Meu Perfil
          </button>
        </nav>

        <div className="p-4 border-t border-slate-800">
           <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-lg p-4 text-white">
             <h4 className="font-bold text-sm mb-1">Seja Pro</h4>
             <p className="text-xs text-amber-100 mb-2">Receba 3x mais leads aparecendo no topo.</p>
             <button onClick={() => setActiveTab('plans')} className="w-full py-1.5 bg-white text-amber-600 text-xs font-bold rounded shadow-sm">
               Fazer Upgrade
             </button>
           </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* Header */}
        <header className="bg-white h-16 border-b border-slate-200 flex items-center justify-between px-8">
           <h2 className="text-xl font-bold text-slate-800">
             {activeTab === 'dashboard' && 'Visão Geral'}
             {activeTab === 'leads' && 'Gestão de Orçamentos'}
             {activeTab === 'plans' && 'Planos e Marketing'}
             {activeTab === 'profile' && 'Editar Perfil'}
           </h2>
           <div className="flex items-center gap-4">
              <button className="p-2 text-slate-400 hover:text-slate-600 relative">
                 <Bell size={20} />
                 <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="w-8 h-8 bg-slate-200 rounded-full overflow-hidden">
                 <img src="https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&q=80&w=100" className="w-full h-full object-cover" />
              </div>
           </div>
        </header>

        {/* Content Scroll Area */}
        <div className="flex-1 overflow-y-auto p-8">
           
           {/* DASHBOARD TAB */}
           {activeTab === 'dashboard' && (
             <div className="space-y-6">
                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                   <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                      <div className="flex justify-between items-start mb-2">
                         <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Eye size={20} /></div>
                         <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">+12%</span>
                      </div>
                      <h3 className="text-2xl font-bold text-slate-800">{MOCK_STATS.profileViews}</h3>
                      <p className="text-sm text-slate-500">Visualizações do Perfil</p>
                   </div>
                   <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                      <div className="flex justify-between items-start mb-2">
                         <div className="p-2 bg-purple-50 text-purple-600 rounded-lg"><MousePointerClick size={20} /></div>
                         <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">+5%</span>
                      </div>
                      <h3 className="text-2xl font-bold text-slate-800">{MOCK_STATS.clicksToContact}</h3>
                      <p className="text-sm text-slate-500">Cliques no WhatsApp</p>
                   </div>
                   <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                      <div className="flex justify-between items-start mb-2">
                         <div className="p-2 bg-rose-50 text-rose-600 rounded-lg"><MessageSquare size={20} /></div>
                         <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">+2</span>
                      </div>
                      <h3 className="text-2xl font-bold text-slate-800">{MOCK_STATS.totalLeads}</h3>
                      <p className="text-sm text-slate-500">Orçamentos Solicitados</p>
                   </div>
                   <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                      <div className="flex justify-between items-start mb-2">
                         <div className="p-2 bg-amber-50 text-amber-600 rounded-lg"><Crown size={20} /></div>
                         <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">Basic</span>
                      </div>
                      <h3 className="text-2xl font-bold text-slate-800">4.8</h3>
                      <p className="text-sm text-slate-500">Nota Média (Avaliações)</p>
                   </div>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                   <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                      <h4 className="font-bold text-slate-800 mb-6">Performance da Semana</h4>
                      <div className="h-64">
                         <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={MOCK_CHART_DATA}>
                               <defs>
                                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                                     <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                                     <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                  </linearGradient>
                               </defs>
                               <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                               <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                               <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                               <Tooltip />
                               <Area type="monotone" dataKey="views" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorViews)" />
                            </AreaChart>
                         </ResponsiveContainer>
                      </div>
                   </div>
                   
                   <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
                      <h4 className="font-bold text-slate-800 mb-4">Últimos Leads</h4>
                      <div className="flex-1 overflow-y-auto space-y-3">
                         {MOCK_LEADS.slice(0, 3).map(lead => (
                            <div key={lead.id} className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-lg transition-colors border border-transparent hover:border-slate-100 cursor-pointer">
                               <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center font-bold text-xs">
                                  {lead.coupleName.substring(0,2)}
                               </div>
                               <div className="flex-1">
                                  <div className="flex justify-between">
                                     <h5 className="font-bold text-slate-800 text-sm">{lead.coupleName}</h5>
                                     <span className="text-[10px] text-slate-400">{lead.receivedAt}</span>
                                  </div>
                                  <p className="text-xs text-slate-500 line-clamp-1">{lead.message}</p>
                               </div>
                            </div>
                         ))}
                      </div>
                      <button onClick={() => setActiveTab('leads')} className="mt-4 text-center text-sm font-bold text-rose-600 hover:text-rose-700 py-2 border-t border-slate-100">
                         Ver todos
                      </button>
                   </div>
                </div>
             </div>
           )}

           {/* LEADS TAB */}
           {activeTab === 'leads' && (
             <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
                   <div className="relative w-64">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                      <input className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-rose-400" placeholder="Buscar noivo(a)..." />
                   </div>
                   <div className="flex gap-2">
                      <select className="text-sm border-slate-300 rounded-lg p-2 focus:outline-none">
                         <option>Todos os Status</option>
                         <option>Novos</option>
                         <option>Lidos</option>
                      </select>
                   </div>
                </div>
                <table className="w-full text-left text-sm">
                   <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                      <tr>
                         <th className="p-4">Casal</th>
                         <th className="p-4">Data Casamento</th>
                         <th className="p-4">Orçamento Est.</th>
                         <th className="p-4">Status</th>
                         <th className="p-4 text-right">Ação</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-100">
                      {MOCK_LEADS.map(lead => (
                         <tr key={lead.id} className="hover:bg-slate-50">
                            <td className="p-4 font-medium text-slate-800">{lead.coupleName}</td>
                            <td className="p-4 text-slate-600 flex items-center gap-2">
                               <Calendar size={14} /> {new Date(lead.weddingDate).toLocaleDateString()}
                            </td>
                            <td className="p-4 text-slate-600">R$ {lead.budget.toLocaleString()}</td>
                            <td className="p-4">
                               <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                  lead.status === 'new' ? 'bg-blue-100 text-blue-700' :
                                  lead.status === 'booked' ? 'bg-emerald-100 text-emerald-700' :
                                  'bg-slate-100 text-slate-600'
                               }`}>
                                  {lead.status === 'new' ? 'Novo' : lead.status === 'booked' ? 'Fechado' : 'Contatado'}
                               </span>
                            </td>
                            <td className="p-4 text-right">
                               <button className="text-rose-600 font-bold text-xs border border-rose-200 px-3 py-1.5 rounded hover:bg-rose-50 transition-colors">
                                  Responder
                               </button>
                            </td>
                         </tr>
                      ))}
                   </tbody>
                </table>
             </div>
           )}

           {/* PLANS TAB (MONETIZATION) */}
           {activeTab === 'plans' && (
             <div className="max-w-4xl mx-auto space-y-8">
                <div className="text-center">
                   <h3 className="text-2xl font-bold text-slate-800 mb-2">Acelere seus Resultados</h3>
                   <p className="text-slate-500">Fornecedores Destaque recebem em média 3x mais pedidos de orçamento.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Free */}
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm opacity-75">
                        <h4 className="font-bold text-slate-600">Básico</h4>
                        <div className="text-3xl font-bold text-slate-800 my-4">Grátis</div>
                        <ul className="space-y-3 text-sm text-slate-600 mb-8">
                           <li className="flex gap-2"><CheckMark /> Perfil com fotos</li>
                           <li className="flex gap-2"><CheckMark /> Receba orçamentos</li>
                           <li className="flex gap-2 opacity-50"><XMark /> Posição privilegiada</li>
                           <li className="flex gap-2 opacity-50"><XMark /> Selo Verificado</li>
                        </ul>
                        <button disabled className="w-full py-2 bg-slate-100 text-slate-500 rounded-lg font-bold">Plano Atual</button>
                    </div>

                    {/* Pro */}
                    <div className="bg-white p-6 rounded-xl border-2 border-amber-400 shadow-xl relative transform scale-105">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full">MAIS POPULAR</div>
                        <h4 className="font-bold text-amber-600 flex items-center gap-2"><Crown size={18} /> Profissional</h4>
                        <div className="text-3xl font-bold text-slate-800 my-4">R$ 99<span className="text-sm font-normal text-slate-500">/mês</span></div>
                        <ul className="space-y-3 text-sm text-slate-700 mb-8">
                           <li className="flex gap-2"><CheckMark color="text-amber-500" /> <strong>Destaque nas buscas</strong></li>
                           <li className="flex gap-2"><CheckMark color="text-amber-500" /> Selo Verificado <ShieldCheck size={14} className="text-emerald-500" /></li>
                           <li className="flex gap-2"><CheckMark color="text-amber-500" /> WhatsApp liberado</li>
                           <li className="flex gap-2"><CheckMark color="text-amber-500" /> Analytics avançado</li>
                        </ul>
                        <button className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg font-bold shadow-md hover:shadow-lg transition-all">
                           Fazer Upgrade
                        </button>
                    </div>

                    {/* Enterprise */}
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                        <h4 className="font-bold text-slate-800">Elite</h4>
                        <div className="text-3xl font-bold text-slate-800 my-4">R$ 249<span className="text-sm font-normal text-slate-500">/mês</span></div>
                        <ul className="space-y-3 text-sm text-slate-600 mb-8">
                           <li className="flex gap-2"><CheckMark /> Topo garantido</li>
                           <li className="flex gap-2"><CheckMark /> Email marketing para noivos</li>
                           <li className="flex gap-2"><CheckMark /> Gestor de conta dedicado</li>
                        </ul>
                        <button className="w-full py-2 bg-slate-800 text-white rounded-lg font-bold hover:bg-slate-700">Contatar Vendas</button>
                    </div>
                </div>
             </div>
           )}

           {/* PROFILE TAB (Placeholder) */}
           {activeTab === 'profile' && (
             <div className="bg-white p-8 rounded-xl border border-slate-200 text-center text-slate-500">
               <Settings size={48} className="mx-auto mb-4 opacity-20" />
               <h3 className="text-lg font-bold text-slate-800">Editor de Perfil</h3>
               <p>Aqui o fornecedor edita fotos, descrição e categorias de serviço.</p>
             </div>
           )}

        </div>
      </div>
    </div>
  );
};

const CheckMark = ({ color = "text-emerald-500" }: { color?: string }) => (
  <svg className={`w-5 h-5 ${color} shrink-0`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const XMark = () => (
  <svg className="w-5 h-5 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);