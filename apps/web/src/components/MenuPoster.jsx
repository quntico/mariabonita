
import React, { useRef, useState } from 'react';
import { useEditableContent } from '@/contexts/EditableContent';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Download, FileText, Plus, Trash2 } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { useToast } from '@/hooks/use-toast';

const InlineEdit = ({ value, onChange, isEditing, className, type = "text" }) => {
  if (isEditing) {
    return (
      <Input
        type={type}
        value={value}
        onChange={(e) => onChange(type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value)}
        className={`h-8 bg-white/10 border-secondary/30 text-white placeholder:text-white/40 ${className}`}
      />
    );
  }
  return <span className={className}>{value}</span>;
};

const MenuPoster = () => {
  const { data, editMode, updateMenuItem, updatePosterConfig, addMenuItem, removeMenuItem } = useEditableContent();
  const posterRef = useRef(null);
  const { toast } = useToast();
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadPNG = async () => {
    if (!posterRef.current) return;
    setIsDownloading(true);
    try {
      const canvas = await html2canvas(posterRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#1a1a1a'
      });
      const link = document.createElement('a');
      link.download = 'menu-maria-bonita.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
      toast({ title: "¡Éxito!", description: "Menú descargado como PNG" });
    } catch (error) {
      toast({ title: "Error", description: "No se pudo descargar la imagen", variant: "destructive" });
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!posterRef.current) return;
    setIsDownloading(true);
    try {
      const canvas = await html2canvas(posterRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#1a1a1a'
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', [215.9, 355.6]);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('menu-maria-bonita.pdf');
      toast({ title: "¡Éxito!", description: "Menú descargado como PDF" });
    } catch (error) {
      toast({ title: "Error", description: "No se pudo descargar el PDF", variant: "destructive" });
    } finally {
      setIsDownloading(false);
    }
  };

  const renderMenuItem = (item, category) => (
    <div key={item.id} className="flex justify-between items-center group relative pb-3 mb-3 border-b border-white/10 last:border-0 last:mb-0 last:pb-0">
      {/* Golden bullet */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-secondary rotate-45 flex-shrink-0"></div>

      <div className="flex-1 mr-4 pl-5">
        <InlineEdit
          value={item.name}
          onChange={(val) => updateMenuItem(category, item.id, 'name', val)}
          isEditing={editMode}
          className="text-lg md:text-xl font-serif font-bold text-white tracking-wide uppercase drop-shadow-sm"
        />
      </div>
      <div className="flex items-center flex-shrink-0">
        <span className="text-lg md:text-xl font-bold text-primary mr-0.5">$</span>
        <InlineEdit
          value={item.price}
          onChange={(val) => updateMenuItem(category, item.id, 'price', val)}
          isEditing={editMode}
          type="number"
          className="text-lg md:text-xl font-bold text-white w-14 text-right"
        />
        {editMode && (
          <button
            onClick={() => removeMenuItem(category, item.id)}
            className="ml-2 text-red-400 hover:text-red-300 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );

  /* ── Category card ── */
  const CategoryCard = ({ title, accentColor = 'secondary', children, onAdd, category }) => {
    const accentMap = {
      secondary: 'border-secondary',
      primary: 'border-primary',
      accent: 'border-amber-500',
    };
    const textMap = {
      secondary: 'text-secondary',
      primary: 'text-primary',
      accent: 'text-amber-400',
    };
    return (
      <div className="rounded-sm border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden">
        {/* Card header */}
        <div className={`flex items-center justify-between px-5 py-3 border-b-2 ${accentMap[accentColor]} bg-white/5`}>
          <h3 className={`text-2xl md:text-3xl font-rustic tracking-widest uppercase ${textMap[accentColor]} drop-shadow-md`}>
            {title}
          </h3>
          {editMode && (
            <Button
              size="sm"
              variant="ghost"
              className="text-white/60 hover:text-white hover:bg-white/10 border border-white/20"
              onClick={onAdd}
            >
              <Plus className="w-4 h-4" />
            </Button>
          )}
        </div>
        {/* Card body */}
        <div className="px-5 py-4">
          {children}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center w-full max-w-5xl mx-auto">
      {/* ── POSTER ── */}
      <div
        ref={posterRef}
        className="w-full relative overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.8)] flex flex-col border-4 border-secondary/40"
        style={{ background: '#1a1a1a', minHeight: '1100px' }}
      >
        {/* Top golden gradient line */}
        <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-secondary to-transparent z-10 opacity-90"></div>
        <div className="absolute bottom-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-secondary to-transparent z-10 opacity-90"></div>

        {/* Inner frame */}
        <div className="absolute inset-3 border border-secondary/20 pointer-events-none z-20"></div>
        <div className="absolute inset-5 border border-white/5 pointer-events-none z-20"></div>

        {/* Corner decorations */}
        {[['top-4 left-4', ''], ['top-4 right-4', 'rotate-90'], ['bottom-4 left-4', '-rotate-90'], ['bottom-4 right-4', 'rotate-180']].map(([pos, rot], i) => (
          <div key={i} className={`absolute ${pos} ${rot} w-8 h-8 pointer-events-none z-20`}>
            <div className="absolute top-0 left-0 w-full h-[2px] bg-secondary opacity-70"></div>
            <div className="absolute top-0 left-0 w-[2px] h-full bg-secondary opacity-70"></div>
          </div>
        ))}

        {/* Subtle texture overlay */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-0"
          style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.4) 2px, rgba(255,255,255,0.4) 3px)' }}>
        </div>

        {/* ── HEADER ── */}
        <div className="text-center relative z-30 pt-12 pb-8 px-8 md:px-16">

          {/* Top tagline divider */}
          <div className="flex items-center justify-center space-x-4 mb-6">
            <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-secondary/60 to-secondary/60"></div>
            <span className="text-secondary/70 text-xs font-serif uppercase tracking-[0.4em] px-4">Tacos & Antojitos Mexicanos</span>
            <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-secondary/60 to-secondary/60"></div>
          </div>

          {/* Title part 1 */}
          <InlineEdit
            value={data.posterConfig.titlePart1}
            onChange={(val) => updatePosterConfig('titlePart1', val)}
            isEditing={editMode}
            className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-white block mb-6 tracking-widest uppercase drop-shadow-lg leading-tight"
          />

          {/* Pink banner */}
          <div className="relative inline-block my-4 w-full max-w-2xl mx-auto">
            <div className="absolute inset-0 bg-primary transform -skew-x-6 shadow-[0_4px_24px_rgba(255,63,152,0.35)] border border-primary/50"></div>
            <InlineEdit
              value={data.posterConfig.bannerText}
              onChange={(val) => updatePosterConfig('bannerText', val)}
              isEditing={editMode}
              className="relative z-10 text-4xl md:text-6xl font-rustic text-white px-12 py-4 block tracking-widest uppercase drop-shadow-md"
            />
          </div>

          {/* Title part 2 - TACOS  */}
          <InlineEdit
            value={data.posterConfig.titlePart2}
            onChange={(val) => updatePosterConfig('titlePart2', val)}
            isEditing={editMode}
            className="text-6xl md:text-8xl lg:text-9xl font-serif font-bold text-secondary block mt-4 tracking-widest drop-shadow-xl uppercase"
          />
        </div>

        {/* Decorative Divider */}
        <div className="flex justify-center items-center mb-10 relative z-30 space-x-3 px-8">
          <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-white/20 to-white/20"></div>
          <div className="w-3 h-3 bg-secondary rotate-45"></div>
          <div className="w-5 h-5 bg-primary rotate-45 border border-primary/50"></div>
          <div className="w-3 h-3 bg-secondary rotate-45"></div>
          <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-white/20 to-white/20"></div>
        </div>

        {/* ── MENU GRID ── */}
        <div className="relative z-30 px-8 md:px-12 flex flex-col md:flex-row gap-6 md:gap-10 flex-1 mb-10">

          {/* Vertical divider */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-[1px] border-l border-dashed border-white/10 -translate-x-1/2 pointer-events-none"></div>

          {/* Left Column */}
          <div className="flex-1 space-y-6">
            <CategoryCard
              title="TACOS"
              accentColor="secondary"
              category="tacos"
              onAdd={() => addMenuItem('tacos', { name: 'NUEVO TACO', price: 0 })}
            >
              {data.menu.tacos.map(item => renderMenuItem(item, 'tacos'))}
            </CategoryCard>

            <CategoryCard
              title="DESAYUNOS / ANTOJITOS"
              accentColor="accent"
              category="desayunos"
              onAdd={() => addMenuItem('desayunos', { name: 'NUEVO ANTOJITO', price: 0 })}
            >
              {data.menu.desayunos.map(item => renderMenuItem(item, 'desayunos'))}
            </CategoryCard>

            <CategoryCard
              title="OTROS"
              accentColor="secondary"
              category="otros"
              onAdd={() => addMenuItem('otros', { name: 'NUEVO PLATILLO', price: 0 })}
            >
              {data.menu.otros.map(item => renderMenuItem(item, 'otros'))}
            </CategoryCard>
          </div>

          {/* Right Column */}
          <div className="flex-1 space-y-6">
            <CategoryCard
              title="QUESADILLAS / SINCRONIZADAS"
              accentColor="primary"
              category="quesadillas"
              onAdd={() => addMenuItem('quesadillas', { name: 'NUEVA QUESADILLA', price: 0 })}
            >
              {data.menu.quesadillas.map(item => renderMenuItem(item, 'quesadillas'))}
            </CategoryCard>

            <CategoryCard
              title="SÁBADOS Y DOMINGOS"
              accentColor="accent"
              category="weekendSpecials"
              onAdd={() => addMenuItem('weekendSpecials', { name: 'NUEVO ESPECIAL', price: 0 })}
            >
              {data.menu.weekendSpecials.map(item => renderMenuItem(item, 'weekendSpecials'))}
            </CategoryCard>

            <CategoryCard
              title="BEBIDAS"
              accentColor="secondary"
              category="bebidas"
              onAdd={() => addMenuItem('bebidas', { name: 'NUEVA BEBIDA', price: 0 })}
            >
              {data.menu.bebidas.map(item => renderMenuItem(item, 'bebidas'))}
            </CategoryCard>
          </div>
        </div>

        {/* ── FOOTER ── */}
        <div className="relative z-30 w-full flex justify-center pb-10 px-8">
          <div
            className="relative py-5 px-10 md:px-20 text-center w-full max-w-3xl border border-secondary/40 overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #2a1a0e 0%, #1a1a1a 50%, #2a1a0e 100%)' }}
          >
            {/* Corner accents */}
            <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-secondary opacity-70"></div>
            <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-secondary opacity-70"></div>
            <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-secondary opacity-70"></div>
            <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-secondary opacity-70"></div>

            <InlineEdit
              value={data.posterConfig.footerText}
              onChange={(val) => updatePosterConfig('footerText', val)}
              isEditing={editMode}
              className="text-2xl md:text-3xl lg:text-4xl font-serif font-bold text-white tracking-widest drop-shadow-md block uppercase"
            />
          </div>
        </div>
      </div>

      {/* ── DOWNLOAD BUTTONS ── */}
      <div className="mt-8 flex flex-col sm:flex-row gap-4 w-full max-w-md">
        <Button
          onClick={handleDownloadPNG}
          disabled={isDownloading}
          className="flex-1 bg-secondary hover:bg-secondary/90 text-[#1a1a1a] h-14 text-lg font-serif font-bold rounded-sm shadow-rustic border-2 border-secondary/50 uppercase tracking-wider"
        >
          <Download className="w-5 h-5 mr-2" />
          Descargar PNG
        </Button>
        <Button
          onClick={handleDownloadPDF}
          disabled={isDownloading}
          className="flex-1 bg-primary hover:bg-primary/90 text-white h-14 text-lg font-serif font-bold rounded-sm shadow-rustic border-2 border-primary/50 uppercase tracking-wider"
        >
          <FileText className="w-5 h-5 mr-2" />
          Descargar PDF
        </Button>
      </div>
    </div>
  );
};

export default MenuPoster;
