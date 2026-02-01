import React from 'react';
import { Check, X, Crown, Sparkles, Globe, CreditCard } from 'lucide-react';

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: () => void;
}

export const PremiumModal: React.FC<PremiumModalProps> = ({ isOpen, onClose, onUpgrade }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col md:flex-row animate-in zoom-in duration-300">
        
        {/* Left Side - Value Prop */}
        <div className="bg-slate-900 text-white p-8 md:w-2/5 flex flex-col justify-between relative overflow-hidden">
           <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500 rounded-full blur-[100px] opacity-20 -translate-y-1/2 translate-x-1/2"></div>
           <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500 rounded-full blur-[100px] opacity-20 translate-y-1/2 -translate-x-1/2"></div>
           
           <div className="relative z-10">
               <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest text-rose-300 mb-6 border border-white/10">
                   <Crown size={12} /> Plano Premium
               </div>
               <h2 className="text-3xl font-serif mb-4 leading-tight">Torne seu planejamento inesquecível.</h2>
               <p className="text-slate-300">Desbloqueie ferramentas exclusivas, taxas reduzidas e suporte prioritário para o dia mais importante da sua vida.</p>
           </div>

           <div className="relative z-10 mt-8">
               <p className="text-xs text-slate-400 uppercase tracking-widest mb-4">Parceiros Oficiais</p>
               <div className="flex gap-4 opacity-50 grayscale hover:grayscale-0 transition-all">
                   <div className="w-8 h-8 bg-white/20 rounded-full"></div>
                   <div className="w-8 h-8 bg-white/20 rounded-full"></div>
                   <div className="w-8 h-8 bg-white/20 rounded-full"></div>
                   <div className="w-8 h-8 bg-white/20 rounded-full"></div>
               </div>
           </div>
        </div>

        {/* Right Side - Plans */}
        <div className="p-8 md:w-3/5 bg-white flex flex-col relative">
            <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
                <X size={24} />
            </button>

            <h3 className="text-2xl font-bold text-slate-800 mb-2">Escolha seu plano</h3>
            <p className="text-slate-500 mb-8">Cancele a qualquer momento. Sem fidelidade.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {/* Free Plan */}
                <div className="border border-slate-200 rounded-xl p-4 hover:border-slate-300 transition-colors">
                    <h4 className="font-bold text-slate-700">Básico</h4>
                    <div className="text-2xl font-bold text-slate-800 my-2">Grátis</div>
                    <ul className="space-y-2 text-sm text-slate-600 mb-4">
                        <li className="flex gap-2"><Check size={16} className="text-emerald-500" /> Lista de Tarefas</li>
                        <li className="flex gap-2"><Check size={16} className="text-emerald-500" /> Gestão de Orçamento</li>
                        <li className="flex gap-2"><Check size={16} className="text-emerald-500" /> Site Básico</li>
                        <li className="flex gap-2 opacity-50"><X size={16} /> Taxa de Presentes: 6%</li>
                    </ul>
                </div>

                {/* Premium Plan */}
                <div className="border-2 border-rose-500 rounded-xl p-4 bg-rose-50 relative">
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">Recomendado</div>
                    <h4 className="font-bold text-rose-700">Casal Premium</h4>
                    <div className="text-2xl font-bold text-slate-800 my-2">R$ 29,90<span className="text-sm font-normal text-slate-500">/mês</span></div>
                    <ul className="space-y-2 text-sm text-slate-700 mb-4">
                        <li className="flex gap-2"><Check size={16} className="text-rose-500" /> <strong>Taxa de Presentes: 3.9%</strong></li>
                        <li className="flex gap-2"><Check size={16} className="text-rose-500" /> Domínio Personalizado</li>
                        <li className="flex gap-2"><Check size={16} className="text-rose-500" /> Consultoria IA Ilimitada</li>
                        <li className="flex gap-2"><Check size={16} className="text-rose-500" /> Convites Premium</li>
                    </ul>
                </div>
            </div>

            <button 
                onClick={onUpgrade}
                className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-slate-800 transition-all shadow-lg flex items-center justify-center gap-2 mt-auto"
            >
                <Sparkles size={20} className="text-amber-300" />
                Experimentar Premium
            </button>
            <p className="text-center text-xs text-slate-400 mt-3">Pagamento seguro processado via Stripe.</p>
        </div>
      </div>
    </div>
  );
};