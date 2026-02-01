import React, { useState } from 'react';
import { Inspiration } from '../types';
import { generateWeddingImage } from '../services/geminiService';
import { Sparkles, Plus, Image as ImageIcon, Trash2, Download, Wand2, Loader2, X } from 'lucide-react';

interface MoodBoardProps {
  inspirations: Inspiration[];
  onAdd: (item: Inspiration) => void;
  onRemove: (id: string) => void;
  isPremium: boolean;
}

export const MoodBoard: React.FC<MoodBoardProps> = ({ inspirations, onAdd, onRemove, isPremium }) => {
  const [showModal, setShowModal] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [category, setCategory] = useState('Geral');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  const categories = ['Bolo', 'Vestido', 'Decoração', 'Buquê', 'Convite', 'Lembrancinha', 'Geral'];

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setGeneratedImage(null);

    try {
      // Chama o serviço de IA
      const base64Image = await generateWeddingImage(prompt);
      if (base64Image) {
        setGeneratedImage(base64Image);
      } else {
        alert("Não foi possível gerar a imagem. Tente descrever de outra forma.");
      }
    } catch (e) {
      console.error(e);
      alert("Erro ao conectar com a IA.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = () => {
    if (!generatedImage) return;
    
    const newInspiration: Inspiration = {
      id: crypto.randomUUID(),
      imageUrl: generatedImage,
      prompt: prompt,
      category: category,
      createdAt: new Date().toISOString()
    };

    onAdd(newInspiration);
    resetModal();
  };

  const resetModal = () => {
    setPrompt('');
    setGeneratedImage(null);
    setCategory('Geral');
    setShowModal(false);
  };

  // Upload manual handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newInspiration: Inspiration = {
          id: crypto.randomUUID(),
          imageUrl: reader.result as string,
          category: 'Upload',
          createdAt: new Date().toISOString()
        };
        onAdd(newInspiration);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-3xl font-bold mb-2 flex items-center gap-2">
            <Sparkles className="text-yellow-300" /> Inspirações IA
          </h2>
          <p className="text-violet-100 max-w-xl">
            Visualize o casamento dos seus sonhos. Descreva o que você imagina e nossa Inteligência Artificial criará uma imagem exclusiva para o seu quadro de referências.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button 
              onClick={() => setShowModal(true)}
              className="bg-white text-violet-700 px-6 py-2.5 rounded-full font-bold shadow-lg hover:bg-violet-50 transition-colors flex items-center gap-2"
            >
              <Wand2 size={18} />
              Criar com IA
            </button>
            <label className="bg-violet-700/50 border border-violet-400 text-white px-6 py-2.5 rounded-full font-bold hover:bg-violet-700/70 transition-colors flex items-center gap-2 cursor-pointer">
              <ImageIcon size={18} />
              Upload Foto
              <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
            </label>
          </div>
        </div>
        <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-black/20 to-transparent"></div>
        <Sparkles className="absolute bottom-4 right-10 text-white/20 w-32 h-32" />
      </div>

      {/* Gallery Grid */}
      {inspirations.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-dashed border-slate-300">
          <ImageIcon size={48} className="mx-auto text-slate-300 mb-4" />
          <h3 className="text-slate-500 font-medium">Seu quadro está vazio</h3>
          <p className="text-slate-400 text-sm mt-1">Comece criando imagens com IA ou fazendo upload.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {inspirations.map((item) => (
            <div key={item.id} className="group relative rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 bg-white break-inside-avoid">
              <img 
                src={item.imageUrl} 
                alt={item.category} 
                className="w-full h-auto object-cover min-h-[200px]" 
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                <div className="flex justify-between items-end">
                  <div>
                    <span className="bg-white/20 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-md">
                      {item.category}
                    </span>
                    {item.prompt && (
                      <p className="text-white/80 text-xs mt-2 line-clamp-2" title={item.prompt}>
                        "{item.prompt}"
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <a 
                      href={item.imageUrl} 
                      download={`inspiracao-${item.id}.png`}
                      className="p-2 bg-white/20 text-white rounded-full hover:bg-white hover:text-slate-900 transition-colors"
                    >
                      <Download size={16} />
                    </a>
                    <button 
                      onClick={() => onRemove(item.id)}
                      className="p-2 bg-red-500/80 text-white rounded-full hover:bg-red-500 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Generation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/70 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in duration-200 flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <Wand2 className="text-violet-600" size={20} />
                Gerador de Ideias
              </h3>
              <button onClick={resetModal} className="text-slate-400 hover:text-slate-600">
                <X size={24} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
                {/* Input Side */}
                <div className="flex flex-col gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">O que você imagina?</label>
                    <textarea 
                      value={prompt}
                      onChange={e => setPrompt(e.target.value)}
                      placeholder="Ex: Um bolo de casamento de 3 andares com flores silvestres roxas e acabamento rústico..."
                      className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-violet-400 outline-none h-32 resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Categoria</label>
                    <div className="flex flex-wrap gap-2">
                      {categories.map(cat => (
                        <button
                          key={cat}
                          onClick={() => setCategory(cat)}
                          className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                            category === cat 
                              ? 'bg-violet-100 border-violet-300 text-violet-700' 
                              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>
                  <button 
                    onClick={handleGenerate}
                    disabled={isGenerating || !prompt.trim()}
                    className="mt-auto w-full py-3 bg-violet-600 text-white rounded-xl font-bold hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md transition-all"
                  >
                    {isGenerating ? (
                      <><Loader2 className="animate-spin" /> Criando...</>
                    ) : (
                      <><Sparkles size={18} /> Gerar Imagem</>
                    )}
                  </button>
                </div>

                {/* Preview Side */}
                <div className="bg-slate-100 rounded-xl flex items-center justify-center min-h-[300px] relative overflow-hidden border border-slate-200">
                  {isGenerating ? (
                    <div className="text-center text-slate-400">
                      <Wand2 size={48} className="mx-auto mb-4 animate-pulse text-violet-400" />
                      <p className="font-medium animate-pulse">A IA está sonhando...</p>
                    </div>
                  ) : generatedImage ? (
                    <>
                      <img src={generatedImage} alt="Gerada pela IA" className="w-full h-full object-contain" />
                      <button 
                        onClick={handleSave}
                        className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded-full font-bold shadow-lg transition-transform hover:scale-105 flex items-center gap-2"
                      >
                        <Download size={18} />
                        Salvar no Quadro
                      </button>
                    </>
                  ) : (
                    <div className="text-center text-slate-400 p-6">
                      <ImageIcon size={48} className="mx-auto mb-4 opacity-50" />
                      <p>Sua imagem aparecerá aqui</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Footer Upsell */}
            {!isPremium && (
              <div className="bg-amber-50 p-3 text-center text-amber-800 text-xs border-t border-amber-100">
                <span className="font-bold">Dica Premium:</span> Assinantes podem gerar imagens ilimitadas em alta resolução!
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
