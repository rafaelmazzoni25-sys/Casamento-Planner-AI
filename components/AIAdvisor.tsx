import React, { useState, useRef, useEffect } from 'react';
import { Expense, ChatMessage } from '../types';
import { askWeddingAdvisor } from '../services/geminiService';
import { Send, Sparkles, Loader2, MessageSquare } from 'lucide-react';

interface AIAdvisorProps {
  expenses: Expense[];
  savings: number;
}

export const AIAdvisor: React.FC<AIAdvisorProps> = ({ expenses, savings }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'model',
      text: 'Olá! Sou sua consultora de casamentos virtual. Posso analisar seu orçamento, sugerir cortes de gastos ou estimar preços de fornecedores. Como posso ajudar hoje?'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const totalCost = expenses.reduce((acc, curr) => acc + curr.estimatedCost, 0);
    const contextData = `
      Custo Total Estimado: R$ ${totalCost.toFixed(2)}
      Valor Guardado: R$ ${savings.toFixed(2)}
      Lista de Despesas: ${expenses.map(e => `${e.name} (${e.category}): R$ ${e.estimatedCost}`).join(', ')}
    `;

    const responseText = await askWeddingAdvisor(userMessage.text, contextData);

    const botMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'model',
      text: responseText
    };

    setMessages(prev => [...prev, botMessage]);
    setIsLoading(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200 h-[600px] flex flex-col">
      <div className="p-4 border-b border-slate-100 flex items-center gap-2 bg-rose-50 rounded-t-xl">
        <Sparkles className="text-rose-500" size={20} />
        <h3 className="font-semibold text-rose-800">Consultora IA</h3>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl p-3 px-4 ${
                msg.role === 'user'
                  ? 'bg-rose-600 text-white rounded-br-none'
                  : 'bg-slate-100 text-slate-800 rounded-bl-none'
              }`}
            >
              <div className="whitespace-pre-wrap text-sm">{msg.text}</div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-slate-100 rounded-2xl p-3 px-4 rounded-bl-none flex items-center gap-2 text-slate-500">
              <Loader2 className="animate-spin" size={16} />
              <span className="text-sm">Digitando...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-slate-100">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Pergunte sobre preços, dicas ou análise..."
            className="flex-1 p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-400 focus:outline-none"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="bg-rose-600 text-white p-2.5 rounded-lg hover:bg-rose-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};