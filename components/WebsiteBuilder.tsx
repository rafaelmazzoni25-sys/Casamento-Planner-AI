import React, { useState } from 'react';
import { WebsiteData, WebsiteSection, WebsiteSectionType, GiftItem } from '../types';
import { 
  Move, Trash2, Image as ImageIcon, Type, Clock, MapPin, 
  Plus, Eye, Layout, Smartphone, Monitor, Gift, Mail, Grid, Settings, Palette,
  AlignLeft, AlignCenter, AlignRight, PaintBucket, ShoppingBag, PieChart
} from 'lucide-react';

interface WebsiteBuilderProps {
  data: WebsiteData;
  giftItems: GiftItem[];
  onUpdate: (data: WebsiteData) => void;
}

export const WebsiteBuilder: React.FC<WebsiteBuilderProps> = ({ data, giftItems, onUpdate }) => {
  const [isPreview, setIsPreview] = useState(false);
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [activeSidebarTab, setActiveSidebarTab] = useState<'components' | 'settings'>('components');
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const addSection = (type: WebsiteSectionType) => {
    const newSection: WebsiteSection = {
      id: crypto.randomUUID(),
      type,
      content: getDefaultContent(type)
    };
    onUpdate({
      ...data,
      sections: [...data.sections, newSection]
    });
  };

  const removeSection = (id: string) => {
    if (confirm('Tem certeza que deseja remover esta seção?')) {
        onUpdate({
        ...data,
        sections: data.sections.filter(s => s.id !== id)
        });
    }
  };

  const updateSectionContent = (id: string, field: string, value: any) => {
    onUpdate({
      ...data,
      sections: data.sections.map(s => 
        s.id === id ? { ...s, content: { ...s.content, [field]: value } } : s
      )
    });
  };
  
  const updateGlobalSettings = (field: string, value: any) => {
      onUpdate({
          ...data,
          globalSettings: {
              ...data.globalSettings,
              [field]: value
          }
      });
  };

  const getDefaultContent = (type: WebsiteSectionType) => {
    const base: { bgColor: string; alignment: 'left' | 'center' | 'right' } = { bgColor: 'bg-white', alignment: 'center' };
    switch (type) {
      case 'hero': return { ...base, title: 'Maria & João', subtitle: 'Vamos nos casar!', imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=2070', bgColor: 'bg-slate-900' };
      case 'text': return { ...base, title: 'Nossa História', body: 'Escreva aqui como vocês se conheceram...' };
      case 'countdown': return { ...base, title: 'Contagem Regressiva', date: '2025-10-20', bgColor: 'bg-rose-600' };
      case 'location': return { ...base, title: 'O Local', subtitle: 'Cerimônia & Festa', body: 'Endereço completo do local...', bgColor: 'bg-slate-50' };
      case 'gallery': return { ...base, title: 'Nossos Momentos', images: [
          'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=600',
          'https://images.unsplash.com/photo-1511285560982-1351cdeb9821?auto=format&fit=crop&q=80&w=600',
          'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&q=80&w=600'
      ]};
      case 'rsvp': return { ...base, title: 'Confirme sua Presença', buttonText: 'Confirmar Presença', body: 'Por favor, confirme até dia 10/10.', bgColor: 'bg-rose-50' };
      case 'gifts': return { ...base, title: 'Lista de Presentes', body: 'Sua presença é nosso maior presente! Mas se quiser nos presentear:', bankInfo: 'Chave Pix: email@casamento.com\nBanco: Nubank\nNome: Noiva da Silva', showGiftGrid: true };
      default: return base;
    }
  };

  // Drag and Drop Handlers
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    
    const newSections = [...data.sections];
    const draggedItem = newSections[draggedIndex];
    newSections.splice(draggedIndex, 1);
    newSections.splice(index, 0, draggedItem);
    
    onUpdate({ ...data, sections: newSections });
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  // Helper styles based on Global Settings
  const getFontClass = () => {
      switch (data.globalSettings.fontFamily) {
          case 'serif': return 'font-serif';
          case 'mono': return 'font-mono';
          case 'cursive': return 'font-cursive';
          default: return 'font-sans';
      }
  };

  // Section Toolbar Component
  const SectionToolbar = ({ id, currentAlign, currentBg }: { id: string, currentAlign?: string, currentBg?: string }) => (
      <div className="absolute -top-10 left-0 bg-slate-800 text-white p-1 rounded-lg shadow-lg flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all z-20">
          <div className="flex bg-slate-700 rounded p-0.5">
              <button onClick={() => updateSectionContent(id, 'alignment', 'left')} className={`p-1.5 rounded hover:bg-slate-600 ${currentAlign === 'left' ? 'bg-slate-600' : ''}`}><AlignLeft size={14}/></button>
              <button onClick={() => updateSectionContent(id, 'alignment', 'center')} className={`p-1.5 rounded hover:bg-slate-600 ${currentAlign === 'center' ? 'bg-slate-600' : ''}`}><AlignCenter size={14}/></button>
              <button onClick={() => updateSectionContent(id, 'alignment', 'right')} className={`p-1.5 rounded hover:bg-slate-600 ${currentAlign === 'right' ? 'bg-slate-600' : ''}`}><AlignRight size={14}/></button>
          </div>
          <div className="w-px h-4 bg-slate-600"></div>
          <div className="flex bg-slate-700 rounded p-0.5 gap-1">
              <button onClick={() => updateSectionContent(id, 'bgColor', 'bg-white')} className={`w-5 h-5 rounded border border-slate-500 bg-white ${currentBg === 'bg-white' ? 'ring-2 ring-blue-400' : ''}`} title="Branco"></button>
              <button onClick={() => updateSectionContent(id, 'bgColor', 'bg-slate-50')} className={`w-5 h-5 rounded border border-slate-500 bg-slate-50 ${currentBg === 'bg-slate-50' ? 'ring-2 ring-blue-400' : ''}`} title="Cinza Claro"></button>
              <button onClick={() => updateSectionContent(id, 'bgColor', 'bg-rose-50')} className={`w-5 h-5 rounded border border-slate-500 bg-rose-50 ${currentBg === 'bg-rose-50' ? 'ring-2 ring-blue-400' : ''}`} title="Rose Claro"></button>
              <button onClick={() => updateSectionContent(id, 'bgColor', 'bg-slate-900')} className={`w-5 h-5 rounded border border-slate-500 bg-slate-900 ${currentBg === 'bg-slate-900' ? 'ring-2 ring-blue-400' : ''}`} title="Escuro"></button>
          </div>
      </div>
  );

  // Renderer
  const renderSection = (section: WebsiteSection, index: number) => {
    const isEditing = !isPreview;
    const { alignment = 'center', bgColor = 'bg-white' } = section.content;
    
    // Text alignment class
    const alignClass = alignment === 'left' ? 'text-left items-start' : alignment === 'right' ? 'text-right items-end' : 'text-center items-center';
    
    // Is dark background?
    const isDark = bgColor.includes('slate-900') || bgColor.includes('rose-600');
    const textColor = isDark ? 'text-white' : 'text-slate-800';
    const subTextColor = isDark ? 'text-slate-300' : 'text-slate-600';

    const commonWrapperClass = `relative group transition-all duration-200 ${
      isEditing ? 'hover:ring-2 hover:ring-rose-400 cursor-default mb-4 rounded-lg shadow-sm border border-slate-200 overflow-visible' : ''
    }`;

    const content = (
      <div className={`${bgColor} w-full transition-colors duration-300`}>
        {/* Type: Hero */}
        {section.type === 'hero' && (
          <div className="relative h-96 flex flex-col justify-center bg-slate-900 overflow-hidden">
             {section.content.imageUrl && (
                <img src={section.content.imageUrl} alt="Hero" className="absolute inset-0 w-full h-full object-cover opacity-60" />
             )}
             <div className={`relative z-10 p-8 w-full max-w-4xl mx-auto flex flex-col ${alignClass}`}>
                {isEditing ? (
                  <>
                    <input
                      value={section.content.title}
                      onChange={(e) => updateSectionContent(section.id, 'title', e.target.value)}
                      className={`bg-transparent text-4xl md:text-6xl ${getFontClass()} w-full outline-none border-b border-white/30 focus:border-white mb-4 placeholder-white/70 ${alignment === 'left' ? 'text-left' : alignment === 'right' ? 'text-right' : 'text-center'} text-white`}
                      placeholder="Título"
                    />
                    <input
                      value={section.content.subtitle}
                      onChange={(e) => updateSectionContent(section.id, 'subtitle', e.target.value)}
                      className={`bg-transparent text-xl md:text-2xl font-light w-full outline-none border-b border-white/30 focus:border-white placeholder-white/70 ${alignment === 'left' ? 'text-left' : alignment === 'right' ? 'text-right' : 'text-center'} text-white`}
                      placeholder="Subtítulo"
                    />
                  </>
                ) : (
                  <>
                    <h1 className={`text-4xl md:text-6xl ${getFontClass()} mb-4 text-white drop-shadow-md`}>{section.content.title}</h1>
                    <p className="text-xl md:text-2xl font-light text-white drop-shadow-md">{section.content.subtitle}</p>
                  </>
                )}
             </div>
          </div>
        )}

        {/* Type: Text Block */}
        {section.type === 'text' && (
          <div className={`py-16 px-8 max-w-4xl mx-auto flex flex-col ${alignClass}`}>
            {isEditing ? (
              <input
                value={section.content.title}
                onChange={(e) => updateSectionContent(section.id, 'title', e.target.value)}
                className={`text-3xl ${getFontClass()} ${textColor} w-full outline-none border-b border-slate-200 focus:border-rose-400 mb-6 bg-transparent ${alignment === 'left' ? 'text-left' : alignment === 'right' ? 'text-right' : 'text-center'}`}
              />
            ) : (
              <h2 className={`text-3xl ${getFontClass()} ${textColor} mb-6`}>{section.content.title}</h2>
            )}
            
            {isEditing ? (
              <textarea
                value={section.content.body}
                onChange={(e) => updateSectionContent(section.id, 'body', e.target.value)}
                rows={4}
                className={`w-full ${subTextColor} text-lg leading-relaxed outline-none border border-slate-200 focus:border-rose-400 rounded-lg p-2 bg-transparent ${alignment === 'left' ? 'text-left' : alignment === 'right' ? 'text-right' : 'text-center'}`}
              />
            ) : (
              <p className={`${subTextColor} text-lg leading-relaxed whitespace-pre-wrap`}>{section.content.body}</p>
            )}
          </div>
        )}

        {/* Type: RSVP */}
        {section.type === 'rsvp' && (
            <div className={`py-16 px-8 max-w-2xl mx-auto flex flex-col ${alignClass}`}>
                <h2 className={`text-3xl ${getFontClass()} ${textColor} mb-4`}>{section.content.title}</h2>
                <p className={`${subTextColor} mb-8`}>{section.content.body}</p>
                
                <div className="w-full bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                    <div className="space-y-4 text-left">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Nome Completo</label>
                            <input disabled={isEditing} type="text" className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-rose-500 outline-none disabled:bg-slate-50" placeholder="Seu nome" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Confirmação</label>
                            <select disabled={isEditing} className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-rose-500 outline-none disabled:bg-slate-50">
                                <option>Sim, eu vou!</option>
                                <option>Infelizmente não poderei ir</option>
                            </select>
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Acompanhantes</label>
                            <input disabled={isEditing} type="number" className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-rose-500 outline-none disabled:bg-slate-50" placeholder="0" />
                        </div>
                        <button disabled={isEditing} className={`w-full py-3 rounded font-bold text-white transition-colors ${data.globalSettings.primaryColor === 'rose' ? 'bg-rose-600 hover:bg-rose-700' : 'bg-slate-800 hover:bg-slate-900'} disabled:opacity-50`}>
                            {section.content.buttonText || 'Enviar Confirmação'}
                        </button>
                    </div>
                </div>
            </div>
        )}

        {/* Type: Gallery */}
        {section.type === 'gallery' && (
            <div className="py-16 px-4 md:px-8 max-w-6xl mx-auto">
                 <h2 className={`text-3xl ${getFontClass()} ${textColor} mb-10 text-center`}>{section.content.title}</h2>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                     {section.content.images?.map((img, idx) => (
                         <div key={idx} className="relative aspect-square group/img overflow-hidden rounded-lg">
                             <img src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-110" />
                             {isEditing && (
                                 <button 
                                    onClick={() => {
                                        const newImages = section.content.images?.filter((_, i) => i !== idx);
                                        updateSectionContent(section.id, 'images', newImages);
                                    }}
                                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover/img:opacity-100 transition-opacity"
                                 >
                                     <Trash2 size={14} />
                                 </button>
                             )}
                         </div>
                     ))}
                     {isEditing && (
                         <button 
                            onClick={() => {
                                const url = prompt('Cole a URL da imagem:');
                                if(url) updateSectionContent(section.id, 'images', [...(section.content.images || []), url]);
                            }}
                            className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-lg text-slate-400 hover:border-rose-400 hover:text-rose-500 transition-colors"
                         >
                             <Plus size={32} />
                             <span className="text-sm">Adicionar Foto</span>
                         </button>
                     )}
                 </div>
            </div>
        )}

        {/* Type: Gifts */}
        {section.type === 'gifts' && (
            <div className={`py-16 px-8 max-w-6xl mx-auto flex flex-col ${alignClass}`}>
                 <h2 className={`text-3xl ${getFontClass()} ${textColor} mb-4`}>{section.content.title}</h2>
                 <p className={`${subTextColor} mb-8`}>{section.content.body}</p>
                 
                 {/* Main Gift Grid */}
                 {section.content.showGiftGrid && giftItems && giftItems.length > 0 && (
                     <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-12 text-left">
                         {giftItems.map(item => {
                             const isShares = (item.totalShares || 1) > 1;
                             const sharePrice = item.price / (item.totalShares || 1);
                             
                             return (
                             <div key={item.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
                                 <div className="aspect-[4/3] bg-slate-100 relative">
                                     <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                                     {isShares && (
                                        <div className="absolute top-2 left-2 px-2 py-1 bg-rose-500 text-white text-xs font-bold rounded shadow-sm flex items-center gap-1">
                                            <PieChart size={12} /> Cotas
                                        </div>
                                     )}
                                 </div>
                                 <div className="p-4">
                                     <h4 className="font-bold text-slate-800 mb-1">{item.name}</h4>
                                     <div className="flex justify-between items-end">
                                         <div>
                                            {isShares ? (
                                                <>
                                                    <p className="text-xs text-slate-500 font-medium">Cota individual</p>
                                                    <span className="text-rose-600 font-bold">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(sharePrice)}</span>
                                                </>
                                            ) : (
                                                <span className="text-rose-600 font-bold">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.price)}</span>
                                            )}
                                         </div>
                                         <button disabled={isEditing} className={`px-3 py-1.5 rounded text-sm text-white transition-colors ${data.globalSettings.primaryColor === 'rose' ? 'bg-rose-600 hover:bg-rose-700' : 'bg-slate-800 hover:bg-slate-900'}`}>
                                            {isShares ? 'Comprar Cota' : 'Presentear'}
                                         </button>
                                     </div>
                                     
                                     {/* Progress Bar for Shares */}
                                     {isShares && (
                                         <div className="mt-3">
                                            <div className="flex justify-between text-xs text-slate-500 mb-1">
                                                <span>{item.soldShares || 0} vendidas</span>
                                                <span>{item.totalShares} total</span>
                                            </div>
                                            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                                                <div 
                                                    className="bg-emerald-400 h-full rounded-full transition-all duration-1000" 
                                                    style={{ width: `${((item.soldShares || 0) / (item.totalShares || 1)) * 100}%` }}
                                                />
                                            </div>
                                         </div>
                                     )}
                                 </div>
                             </div>
                         )})}
                     </div>
                 )}

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl mx-auto">
                     {/* Pix Card */}
                     <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center text-center">
                         <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4">
                             <Smartphone size={24} />
                         </div>
                         <h3 className="font-bold text-slate-800 mb-2">Pix Direto</h3>
                         {isEditing ? (
                             <textarea 
                                value={section.content.bankInfo}
                                onChange={(e) => updateSectionContent(section.id, 'bankInfo', e.target.value)}
                                className="w-full text-sm text-slate-600 bg-slate-50 p-2 rounded border border-slate-200"
                                rows={4}
                             />
                         ) : (
                             <pre className="text-sm text-slate-600 whitespace-pre-wrap font-sans bg-slate-50 p-3 rounded w-full">{section.content.bankInfo}</pre>
                         )}
                     </div>

                      {/* Store Card (Example) */}
                     <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center text-center">
                         <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
                             <Gift size={24} />
                         </div>
                         <h3 className="font-bold text-slate-800 mb-2">Lista em Loja</h3>
                         <p className="text-sm text-slate-500 mb-4">Camicado, Fast Shop, etc.</p>
                         <button disabled={isEditing} className="bg-slate-800 text-white px-4 py-2 rounded-lg text-sm hover:bg-slate-700 w-full">Ver Lista</button>
                     </div>
                 </div>

                 {isEditing && (
                     <div className="mt-6 flex items-center gap-2 bg-yellow-50 p-3 rounded-lg border border-yellow-200 text-yellow-800 text-sm">
                         <input 
                            type="checkbox" 
                            id="showGrid"
                            checked={section.content.showGiftGrid !== false}
                            onChange={(e) => updateSectionContent(section.id, 'showGiftGrid', e.target.checked)}
                            className="rounded text-rose-600"
                         />
                         <label htmlFor="showGrid">Mostrar Lista de Produtos Virtuais</label>
                     </div>
                 )}
            </div>
        )}

        {/* Type: Location */}
        {section.type === 'location' && (
           <div className={`py-16 px-8 ${alignClass} flex flex-col`}>
              <MapPin size={48} className="text-rose-500 mb-4" />
              {isEditing ? (
                 <input 
                    value={section.content.title}
                    onChange={(e) => updateSectionContent(section.id, 'title', e.target.value)}
                    className={`text-2xl font-bold ${textColor} bg-transparent w-full mb-2 outline-none ${alignment === 'left' ? 'text-left' : alignment === 'right' ? 'text-right' : 'text-center'}`} 
                 />
              ) : <h3 className={`text-2xl font-bold ${textColor} mb-2`}>{section.content.title}</h3>}
              
              {isEditing ? (
                <textarea
                  value={section.content.body}
                  onChange={(e) => updateSectionContent(section.id, 'body', e.target.value)}
                  className="w-full max-w-md text-slate-600 bg-white/50 border border-slate-200 rounded p-2"
                />
              ) : <p className={`${subTextColor} max-w-md`}>{section.content.body}</p>}
           </div>
        )}

        {/* Type: Countdown */}
        {section.type === 'countdown' && (
          <div className={`py-12 ${alignClass} flex flex-col text-white`}>
             <Clock size={32} className="mb-4 opacity-80" />
             {isEditing ? (
                <div className="flex flex-col items-center gap-2 w-full max-w-xs">
                   <input 
                      value={section.content.title}
                      onChange={(e) => updateSectionContent(section.id, 'title', e.target.value)}
                      className="text-2xl font-bold bg-transparent text-center text-white border-b border-white/30 outline-none placeholder-white/60 w-full"
                   />
                   <input 
                      type="date"
                      value={section.content.date}
                      onChange={(e) => updateSectionContent(section.id, 'date', e.target.value)}
                      className="bg-white/20 text-white p-2 rounded border border-white/30 w-full"
                   />
                </div>
             ) : (
                <>
                  <h3 className="text-2xl font-bold mb-4">{section.content.title}</h3>
                  <div className="text-4xl font-mono tracking-widest font-bold">
                     {section.content.date ? (
                        Math.max(0, Math.ceil((new Date(section.content.date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))) + " DIAS"
                     ) : "DATA NÃO DEFINIDA"}
                  </div>
                  <p className="mt-2 text-white/80">Para o grande dia</p>
                </>
             )}
          </div>
        )}
      </div>
    );

    if (isPreview) {
      return <div key={section.id}>{content}</div>;
    }

    return (
      <div 
        key={section.id} 
        className={commonWrapperClass}
        draggable
        onDragStart={(e) => handleDragStart(e, index)}
        onDragOver={(e) => handleDragOver(e, index)}
        onDragEnd={handleDragEnd}
      >
        {isEditing && <SectionToolbar id={section.id} currentAlign={alignment} currentBg={bgColor} />}
        
        {/* Edit Controls Overlay */}
        <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-50 bg-white/90 p-1 rounded-lg shadow-sm backdrop-blur-sm border border-slate-100">
           <div className="p-1.5 cursor-move text-slate-500 hover:text-slate-800" title="Arrastar para reordenar">
              <Move size={16} />
           </div>
           <button 
             onClick={() => removeSection(section.id)}
             className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded"
             title="Remover seção"
           >
              <Trash2 size={16} />
           </button>
        </div>
        
        {content}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)]">
      
      {/* Top Toolbar */}
      <div className="bg-white border-b border-slate-200 p-4 flex justify-between items-center shrink-0 shadow-sm z-30">
        <div className="flex items-center gap-2">
           <Layout className="text-rose-600" size={24} />
           <div>
             <h2 className="font-bold text-slate-800">Editor do Site</h2>
             <p className="text-xs text-slate-500 hidden md:block">Personalize seu site de casamento</p>
           </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex bg-slate-100 rounded-lg p-1 mr-4">
               <button 
                 onClick={() => setViewMode('desktop')}
                 className={`p-2 rounded transition-colors ${viewMode === 'desktop' ? 'bg-white shadow-sm text-rose-600' : 'text-slate-500 hover:text-slate-700'}`}
                 title="Desktop"
               >
                   <Monitor size={18} />
               </button>
               <button 
                 onClick={() => setViewMode('mobile')}
                 className={`p-2 rounded transition-colors ${viewMode === 'mobile' ? 'bg-white shadow-sm text-rose-600' : 'text-slate-500 hover:text-slate-700'}`}
                 title="Mobile"
               >
                   <Smartphone size={18} />
               </button>
          </div>

          <button
             onClick={() => setIsPreview(!isPreview)}
             className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
               isPreview 
               ? 'bg-rose-100 text-rose-700 border border-rose-200' 
               : 'bg-white border border-slate-300 text-slate-600 hover:bg-slate-50'
             }`}
          >
             {isPreview ? <Eye size={18} /> : <Eye size={18} />}
             {isPreview ? 'Editar' : 'Visualizar'}
          </button>
          
          <button className="bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-700 shadow-sm">
             Publicar
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        
        {/* Left Sidebar */}
        {!isPreview && (
          <div className="w-80 bg-white border-r border-slate-200 flex flex-col shrink-0 z-20">
             <div className="flex border-b border-slate-200">
                 <button 
                    onClick={() => setActiveSidebarTab('components')}
                    className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 ${activeSidebarTab === 'components' ? 'text-rose-600 border-b-2 border-rose-600' : 'text-slate-500 hover:text-slate-700'}`}
                 >
                     <Layout size={16} /> Seções
                 </button>
                 <button 
                    onClick={() => setActiveSidebarTab('settings')}
                    className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 ${activeSidebarTab === 'settings' ? 'text-rose-600 border-b-2 border-rose-600' : 'text-slate-500 hover:text-slate-700'}`}
                 >
                     <Settings size={16} /> Estilo
                 </button>
             </div>

             <div className="flex-1 overflow-y-auto p-4">
                 {activeSidebarTab === 'components' ? (
                     <>
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Básicos</h3>
                        <div className="space-y-3 mb-6">
                            {[
                                { id: 'hero', icon: ImageIcon, label: 'Capa / Hero' },
                                { id: 'text', icon: Type, label: 'Texto Simples' },
                                { id: 'location', icon: MapPin, label: 'Localização' },
                                { id: 'countdown', icon: Clock, label: 'Contagem Regressiva' },
                            ].map((item) => (
                                <button key={item.id} onClick={() => addSection(item.id as WebsiteSectionType)} className="w-full flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:border-rose-400 hover:bg-rose-50 transition-all text-left group bg-white shadow-sm">
                                    <div className="bg-slate-100 p-2 rounded group-hover:bg-white text-slate-500 group-hover:text-rose-500">
                                        <item.icon size={18} />
                                    </div>
                                    <span className="text-sm font-medium text-slate-700">{item.label}</span>
                                </button>
                            ))}
                        </div>

                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Interativos</h3>
                        <div className="space-y-3">
                            {[
                                { id: 'rsvp', icon: Mail, label: 'RSVP / Presença' },
                                { id: 'gallery', icon: Grid, label: 'Galeria de Fotos' },
                                { id: 'gifts', icon: Gift, label: 'Lista de Presentes' },
                            ].map((item) => (
                                <button key={item.id} onClick={() => addSection(item.id as WebsiteSectionType)} className="w-full flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:border-rose-400 hover:bg-rose-50 transition-all text-left group bg-white shadow-sm">
                                    <div className="bg-slate-100 p-2 rounded group-hover:bg-white text-slate-500 group-hover:text-rose-500">
                                        <item.icon size={18} />
                                    </div>
                                    <span className="text-sm font-medium text-slate-700">{item.label}</span>
                                </button>
                            ))}
                        </div>
                     </>
                 ) : (
                     <div className="space-y-6">
                         <div>
                             <label className="text-sm font-medium text-slate-700 mb-3 block flex items-center gap-2">
                                 <Palette size={16} /> Cor Principal
                             </label>
                             <div className="grid grid-cols-4 gap-2">
                                 {['slate', 'rose', 'blue', 'emerald', 'amber', 'purple'].map(color => (
                                     <button
                                        key={color}
                                        onClick={() => updateGlobalSettings('primaryColor', color)}
                                        className={`w-10 h-10 rounded-full border-2 ${data.globalSettings.primaryColor === color ? 'border-slate-800 scale-110' : 'border-transparent'} shadow-sm transition-all`}
                                        style={{ backgroundColor: color === 'slate' ? '#1e293b' : `var(--color-${color}-500, ${color === 'rose' ? '#f43f5e' : color === 'blue' ? '#3b82f6' : color === 'emerald' ? '#10b981' : color === 'amber' ? '#f59e0b' : '#a855f7'})` }}
                                     />
                                 ))}
                             </div>
                         </div>

                         <div>
                             <label className="text-sm font-medium text-slate-700 mb-3 block flex items-center gap-2">
                                 <Type size={16} /> Tipografia
                             </label>
                             <div className="space-y-2">
                                 {[
                                     { id: 'sans', label: 'Moderna (Sans)', class: 'font-sans' },
                                     { id: 'serif', label: 'Elegante (Serif)', class: 'font-serif' },
                                     { id: 'mono', label: 'Minimalista (Mono)', class: 'font-mono' },
                                     { id: 'cursive', label: 'Romântica (Cursive)', class: 'font-cursive' },
                                 ].map(font => (
                                     <button
                                        key={font.id}
                                        onClick={() => updateGlobalSettings('fontFamily', font.id)}
                                        className={`w-full p-3 text-left border rounded-lg transition-all ${data.globalSettings.fontFamily === font.id ? 'border-rose-500 bg-rose-50 text-rose-700' : 'border-slate-200 hover:border-slate-300'}`}
                                     >
                                         <span className={`text-lg ${font.class}`}>{font.label}</span>
                                     </button>
                                 ))}
                             </div>
                         </div>
                     </div>
                 )}
             </div>
          </div>
        )}

        {/* Main Canvas Area */}
        <div className={`flex-1 overflow-y-auto bg-slate-200/50 flex items-start justify-center p-8 transition-all`}>
          <div 
            className={`bg-white transition-all duration-300 ease-in-out shadow-2xl relative ${
                viewMode === 'mobile' ? 'w-[375px] min-h-[667px] rounded-3xl border-[8px] border-slate-800' : 'w-full max-w-5xl min-h-[800px] rounded-sm'
            }`}
          >
             {/* Mobile Camera Notch Simulation */}
             {viewMode === 'mobile' && (
                 <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-800 rounded-b-xl z-50 pointer-events-none"></div>
             )}

             {data.sections.length === 0 ? (
               <div className="h-96 flex flex-col items-center justify-center text-slate-400 p-8 text-center">
                  <Layout size={48} className="mb-4 opacity-30" />
                  <p className="font-medium">Seu site está vazio</p>
                  <p className="text-sm">Adicione seções usando o menu lateral para começar.</p>
               </div>
             ) : (
               <div className={`flex flex-col min-h-full ${viewMode === 'mobile' ? 'rounded-2xl overflow-hidden' : ''}`}>
                 {data.sections.map((section, index) => renderSection(section, index))}
                 
                 {/* Footer simulation */}
                 <div className="bg-slate-900 text-slate-500 py-8 text-center text-xs">
                     <p>Feito com CasamentoPlanner AI</p>
                 </div>
               </div>
             )}

          </div>
        </div>
      </div>
    </div>
  );
};