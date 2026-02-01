import React, { useState } from 'react';
import { searchVenuesWithMaps } from '../services/geminiService';
import { Search, MapPin, Star, Navigation, Building2, Loader2, PlusCircle } from 'lucide-react';
import { Expense } from '../types';

interface VenueFinderProps {
  onAddVenueToBudget: (name: string) => void;
}

export const VenueFinder: React.FC<VenueFinderProps> = ({ onAddVenueToBudget }) => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<{text: string, chunks: any[]} | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    try {
      const data = await searchVenuesWithMaps(query);
      setResults(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Extract map links from grounding chunks
  const places = results?.chunks?.filter((c: any) => c.web?.uri && c.web?.title) || [];

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-8 text-white shadow-xl">
        <h2 className="text-3xl font-bold mb-4 flex items-center gap-2">
          <MapPin className="text-emerald-200" />
          Localizador de Espaços
        </h2>
        <p className="text-emerald-100 max-w-2xl mb-6">
          Encontre igrejas, salões de festa, fazendas e praias reais para o seu casamento.
          Nossa IA busca diretamente no Google Maps as melhores opções na sua região.
        </p>

        <form onSubmit={handleSearch} className="flex gap-2 max-w-3xl bg-white p-2 rounded-xl shadow-lg">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ex: Fazendas para casamento em Campinas com preço acessível..."
            className="flex-1 p-3 outline-none text-slate-800 rounded-lg"
          />
          <button 
            type="submit"
            disabled={isLoading}
            className="bg-emerald-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-emerald-700 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {isLoading ? <Loader2 className="animate-spin" /> : <Search size={20} />}
            Buscar
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Text Response Column */}
        <div className="lg:col-span-1 bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-fit">
          <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Building2 size={20} className="text-emerald-600" />
            Sugestões da IA
          </h3>
          {results ? (
            <div className="prose prose-sm prose-emerald text-slate-600">
               <div className="whitespace-pre-wrap">{results.text}</div>
            </div>
          ) : (
            <div className="text-slate-400 text-sm italic">
              Faça uma busca para ver as sugestões detalhadas e dicas sobre os locais.
            </div>
          )}
        </div>

        {/* Maps Results Cards */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <Navigation size={20} className="text-emerald-600" />
            Locais Encontrados ({places.length})
          </h3>
          
          {places.length === 0 && !isLoading && (
            <div className="bg-slate-50 border border-dashed border-slate-300 rounded-xl p-8 text-center text-slate-400">
              <MapPin size={48} className="mx-auto mb-4 opacity-50" />
              <p>Nenhum local específico identificado no mapa ainda.</p>
              <p className="text-sm">Tente buscar por "Salões de festa em [Sua Cidade]"</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {places.map((place: any, idx: number) => (
              <div key={idx} className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 hover:shadow-md transition-shadow flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-slate-800 line-clamp-2" title={place.web.title}>
                    {place.web.title}
                  </h4>
                  <a 
                    href={place.web.uri} 
                    target="_blank" 
                    rel="noreferrer"
                    className="text-emerald-600 hover:text-emerald-700 bg-emerald-50 p-2 rounded-full"
                    title="Abrir no Google Maps"
                  >
                    <Navigation size={16} />
                  </a>
                </div>
                
                {/* Simulated Rating if generic web result doesn't have it explicitly structure, 
                    but Grounding chunks often contain snippets. For now we keep it simple. */}
                
                <div className="mt-auto pt-4 flex gap-2">
                   <button 
                     onClick={() => onAddVenueToBudget(place.web.title)}
                     className="flex-1 flex items-center justify-center gap-2 text-xs font-bold bg-slate-800 text-white py-2 rounded-lg hover:bg-slate-700 transition-colors"
                   >
                     <PlusCircle size={14} />
                     Adicionar ao Orçamento
                   </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
