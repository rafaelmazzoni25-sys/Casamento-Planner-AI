import React, { useRef, useState } from 'react';
import { InvitationData, InvitationTheme } from '../types';
import { Download, Palette, Type, MapPin, Calendar, Heart, Image as ImageIcon } from 'lucide-react';
import html2canvas from 'html2canvas';

interface InvitationCreatorProps {
  data: InvitationData;
  onUpdate: (data: InvitationData) => void;
}

export const InvitationCreator: React.FC<InvitationCreatorProps> = ({ data, onUpdate }) => {
  const previewRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);

  const handleChange = (field: keyof InvitationData, value: string) => {
    onUpdate({ ...data, [field]: value });
  };

  const handleDownload = async () => {
    if (!previewRef.current) return;
    setIsExporting(true);

    try {
      // Create a temporary container for rendering at high resolution
      const originalWidth = previewRef.current.offsetWidth;
      const originalHeight = previewRef.current.offsetHeight;
      
      const canvas = await html2canvas(previewRef.current, {
        scale: 2, // Higher quality
        backgroundColor: null,
        logging: false,
        useCORS: true
      });

      const image = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = image;
      link.download = `convite_casamento_${data.brideName}_${data.groomName}.png`;
      link.click();
    } catch (error) {
      console.error("Erro ao gerar imagem do convite", error);
      alert("Houve um erro ao gerar a imagem. Tente novamente.");
    } finally {
      setIsExporting(false);
    }
  };

  const getThemeClasses = (theme: InvitationTheme) => {
    switch (theme) {
      case 'modern':
        return {
          container: "bg-slate-900 text-white border-none",
          border: "border-4 border-slate-700",
          names: "font-sans uppercase tracking-[0.2em] text-3xl md:text-5xl font-light text-amber-100",
          date: "font-sans text-slate-400 uppercase tracking-widest text-sm mt-4",
          body: "font-light text-slate-300",
          accent: "text-amber-200"
        };
      case 'romantic':
        return {
          container: "bg-rose-50 text-rose-900",
          border: "border-[12px] border-double border-rose-200 rounded-xl",
          names: "font-cursive text-5xl md:text-7xl text-rose-600",
          date: "font-serif italic text-rose-800 text-lg mt-4",
          body: "font-serif text-rose-800/80",
          accent: "text-rose-500"
        };
      case 'rustic':
        return {
          container: "bg-[#fdf6e3] text-[#5c4b37]", // Cream/Paper color
          border: "border-2 border-dashed border-[#8b7355] m-4", // Dashed inner border
          names: "font-mono text-3xl md:text-5xl font-bold tracking-tight text-[#4a3b2a]",
          date: "font-mono text-[#8b7355] text-sm mt-4 uppercase border-y border-[#8b7355] py-2 inline-block px-8",
          body: "font-mono text-sm leading-relaxed mt-6",
          accent: "text-[#d2691e]"
        };
      case 'classic':
      default:
        return {
          container: "bg-white text-slate-800",
          border: "border-4 border-double border-amber-300 m-6 outline outline-1 outline-slate-200 outline-offset-8",
          names: "font-serif text-4xl md:text-6xl text-slate-900 italic",
          date: "font-serif text-slate-600 uppercase tracking-widest text-xs mt-6",
          body: "font-serif text-slate-600 italic",
          accent: "text-amber-500"
        };
    }
  };

  const styles = getThemeClasses(data.theme);

  return (
    <div className="flex flex-col lg:flex-row gap-8 h-full">
      {/* Sidebar Controls */}
      <div className="w-full lg:w-96 flex flex-col gap-6 overflow-y-auto pr-2 pb-10">
        
        {/* Theme Selector */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
          <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Palette size={18} className="text-rose-500" />
            Estilo do Convite
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {(['classic', 'modern', 'romantic', 'rustic'] as InvitationTheme[]).map((t) => (
              <button
                key={t}
                onClick={() => handleChange('theme', t)}
                className={`p-3 rounded-lg border text-sm font-medium transition-all capitalize ${
                  data.theme === t
                    ? 'border-rose-500 bg-rose-50 text-rose-700 ring-1 ring-rose-500'
                    : 'border-slate-200 hover:border-slate-300 text-slate-600 bg-white'
                }`}
              >
                {t === 'classic' && 'Clássico'}
                {t === 'modern' && 'Moderno'}
                {t === 'romantic' && 'Romântico'}
                {t === 'rustic' && 'Rústico'}
              </button>
            ))}
          </div>
        </div>

        {/* Text Inputs */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 space-y-4">
          <h3 className="font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-2">
            <Type size={18} className="text-rose-500" />
            Detalhes
          </h3>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
               <label className="text-xs font-semibold text-slate-500 uppercase">Noiva(o) 1</label>
               <input 
                 type="text" 
                 value={data.brideName}
                 onChange={(e) => handleChange('brideName', e.target.value)}
                 className="w-full p-2 border border-slate-300 rounded text-sm focus:ring-2 focus:ring-rose-400 outline-none"
               />
            </div>
            <div>
               <label className="text-xs font-semibold text-slate-500 uppercase">Noiva(o) 2</label>
               <input 
                 type="text" 
                 value={data.groomName}
                 onChange={(e) => handleChange('groomName', e.target.value)}
                 className="w-full p-2 border border-slate-300 rounded text-sm focus:ring-2 focus:ring-rose-400 outline-none"
               />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase flex items-center gap-1">
              <Calendar size={12} /> Data e Hora
            </label>
            <div className="flex gap-2">
               <input 
                type="text" 
                value={data.date}
                onChange={(e) => handleChange('date', e.target.value)}
                placeholder="20 de Outubro de 2025"
                className="w-2/3 p-2 border border-slate-300 rounded text-sm focus:ring-2 focus:ring-rose-400 outline-none"
              />
               <input 
                type="text" 
                value={data.time}
                onChange={(e) => handleChange('time', e.target.value)}
                placeholder="16:00"
                className="w-1/3 p-2 border border-slate-300 rounded text-sm focus:ring-2 focus:ring-rose-400 outline-none"
              />
            </div>
          </div>

          <div>
             <label className="text-xs font-semibold text-slate-500 uppercase flex items-center gap-1">
                <MapPin size={12} /> Local
             </label>
             <input 
                type="text" 
                value={data.venue}
                onChange={(e) => handleChange('venue', e.target.value)}
                placeholder="Nome do Local"
                className="w-full p-2 border border-slate-300 rounded text-sm mb-2 focus:ring-2 focus:ring-rose-400 outline-none"
              />
              <input 
                type="text" 
                value={data.address}
                onChange={(e) => handleChange('address', e.target.value)}
                placeholder="Endereço completo"
                className="w-full p-2 border border-slate-300 rounded text-sm focus:ring-2 focus:ring-rose-400 outline-none"
              />
          </div>

          <div>
             <label className="text-xs font-semibold text-slate-500 uppercase">Mensagem</label>
             <textarea 
               value={data.message}
               onChange={(e) => handleChange('message', e.target.value)}
               rows={3}
               className="w-full p-2 border border-slate-300 rounded text-sm focus:ring-2 focus:ring-rose-400 outline-none"
             />
          </div>
        </div>

        <button
          onClick={handleDownload}
          disabled={isExporting}
          className="w-full py-3 bg-slate-800 text-white rounded-xl font-bold hover:bg-slate-700 transition-colors flex items-center justify-center gap-2 shadow-md"
        >
          {isExporting ? 'Gerando...' : 'Baixar Imagem (PNG)'}
          {!isExporting && <Download size={20} />}
        </button>

      </div>

      {/* Live Preview Area */}
      <div className="flex-1 bg-slate-200 rounded-xl border border-slate-300 flex items-center justify-center p-8 overflow-hidden relative shadow-inner">
         <div className="absolute top-4 left-4 text-xs font-bold text-slate-500 bg-white/50 px-2 py-1 rounded backdrop-blur-sm">
           Visualização em Tempo Real
         </div>

         {/* The Invitation Card */}
         <div 
           ref={previewRef}
           id="invitation-preview"
           className={`relative w-[500px] min-h-[700px] shadow-2xl transition-all duration-500 flex flex-col ${styles.container}`}
         >
            {/* Inner Content Wrapper for padding/border */}
            <div className={`flex-1 m-4 p-8 flex flex-col items-center justify-center text-center ${styles.border}`}>
              
              <div className={`mb-8 text-sm uppercase tracking-widest ${styles.accent}`}>
                Convidamos você para celebrar o casamento de
              </div>
              
              <div className="space-y-4 mb-8">
                <div className={styles.names}>{data.brideName}</div>
                <div className={`text-2xl ${styles.accent}`}>&</div>
                <div className={styles.names}>{data.groomName}</div>
              </div>

              <div className={styles.date}>
                {data.date} • {data.time}
              </div>

              <div className={`w-16 h-[1px] my-8 ${data.theme === 'modern' ? 'bg-slate-700' : 'bg-slate-300'}`}></div>

              <div className="mb-6 space-y-1">
                <div className={`text-lg font-bold uppercase tracking-wide ${data.theme === 'modern' ? 'text-white' : 'text-slate-800'}`}>
                  {data.venue}
                </div>
                <div className={`text-sm ${styles.body}`}>
                  {data.address}
                </div>
              </div>

              <div className={`mt-auto max-w-xs text-sm ${styles.body}`}>
                "{data.message}"
              </div>

              {data.theme === 'romantic' && (
                <div className="mt-8 text-rose-300 opacity-50">
                   <Heart size={24} fill="currentColor" />
                </div>
              )}
            </div>
         </div>
      </div>
    </div>
  );
};