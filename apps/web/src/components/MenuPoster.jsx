
import React, { useRef, useState } from 'react';
import { useEditableContent } from '@/contexts/EditableContent';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Download, FileText, Plus, Trash2, Image as ImageIcon, PaintBucket, Type, X } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';

const InlineEdit = ({ value, onChange, isEditing, className, type = "text" }) => {
  const [localValue, setLocalValue] = React.useState(value);

  React.useEffect(() => {
    setLocalValue(value);
  }, [value]);

  if (isEditing) {
    const isPrice = type === 'number' || className.includes('w-24');

    const handleChange = (e) => {
      const val = e.target.value;
      setLocalValue(val);
      if (!isPrice) {
        onChange(val);
      }
    };

    const handleBlur = () => {
      if (isPrice) {
        const numeric = parseFloat(localValue) || 0;
        onChange(numeric);
        setLocalValue(numeric); // Normalize display
      }
    };

    if (isPrice) {
      return (
        <Input
          type="text"
          value={localValue}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`bg-white/10 border-secondary/30 text-white placeholder:text-white/40 focus:ring-1 focus:ring-secondary ${className}`}
          style={{ textAlign: 'inherit' }}
        />
      );
    }
    return (
      <textarea
        value={localValue}
        onChange={handleChange}
        className={`bg-white/5 border-b border-dashed border-secondary/50 text-white placeholder:text-white/20 focus:outline-none focus:border-secondary w-full resize-none overflow-hidden py-1 rounded-sm ${className}`}
        style={{ textAlign: 'inherit', height: 'auto', minHeight: '1.2em' }}
        onInput={(e) => {
          e.target.style.height = 'auto';
          e.target.style.height = e.target.scrollHeight + 'px';
        }}
        ref={(el) => {
          if (el) {
            el.style.height = 'auto';
            el.style.height = el.scrollHeight + 'px';
          }
        }}
      />
    );
  }
  return <span className={className} style={{ textAlign: 'inherit' }}>{value}</span>;
};

const MenuItemRow = ({ item, category, updateMenuItem, removeMenuItem, editMode }) => (
  <div className="flex flex-col group relative pb-3 mb-3 border-b border-white/5 last:border-0 last:mb-0 last:pb-0">
    <div className="flex justify-between items-start w-full gap-4">
      {/* Golden bullet */}
      <div className="mt-2.5 w-2 h-2 bg-secondary rotate-45 flex-shrink-0 ml-0.5"></div>

      <div className="flex-1 pl-4 min-w-0">
        <InlineEdit
          value={item.name}
          onChange={(val) => updateMenuItem(category, item.id, 'name', val)}
          isEditing={editMode}
          className="text-lg md:text-xl font-serif font-bold text-white tracking-wide uppercase drop-shadow-sm leading-tight block"
        />

        {/* Description Field */}
        {(editMode || item.description) && (
          <div className="mt-1">
            <InlineEdit
              value={item.description || ""}
              onChange={(val) => updateMenuItem(category, item.id, 'description', val)}
              isEditing={editMode}
              className={`text-xs md:text-sm font-sans italic leading-snug block w-full pr-2 ${item.description ? 'text-white/60' : 'text-white/30'}`}
              placeholder="Añadir descripción del producto..."
            />
          </div>
        )}
      </div>

      <div className="flex items-center flex-shrink-0 pt-0.5">
        <span className="text-lg md:text-xl font-bold text-primary mr-0.5">$</span>
        <InlineEdit
          value={item.price}
          onChange={(val) => updateMenuItem(category, item.id, 'price', val)}
          isEditing={editMode}
          type="number"
          className="text-lg md:text-xl font-bold text-white w-20 md:w-24 px-2 text-right"
        />
        {editMode && (
          <button
            onClick={() => removeMenuItem(category, item.id)}
            className="ml-3 text-red-400 hover:text-red-300 opacity-0 group-hover:opacity-100 transition-all p-1 hover:bg-white/10 rounded-full"
            title="Eliminar producto"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  </div>
);

/* ── Category card ── */
const CategoryCard = ({ title, accentColor = 'secondary', children, onAdd, onTitleChange, editMode }) => {
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
      <div className={`flex items-center justify-between px-4 md:px-5 py-3 border-b-2 ${accentMap[accentColor]} bg-white/5`}>
        <InlineEdit
          value={title}
          onChange={onTitleChange}
          isEditing={editMode}
          className={`text-xl sm:text-2xl md:text-3xl font-rustic tracking-widest uppercase ${textMap[accentColor]} drop-shadow-md`}
        />
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

const MenuPoster = () => {
  const { data, editMode, updateMenuItem, updatePosterConfig, addMenuItem, removeMenuItem } = useEditableContent();
  const posterRef = useRef(null);
  const posterBgFileRef = useRef(null);
  const { toast } = useToast();
  const [isDownloading, setIsDownloading] = useState(false);

  const handlePosterBgUpload = async (e) => {
    const file = e.target.files?.[0];
    if (e.target) e.target.value = '';
    if (!file) return;
    try {
      const { compressImage } = await import('@/lib/imageCompressor.js');
      const { uploadFile } = await import('@/lib/storage.js');
      const compressedUrl = await compressImage(file, 1600, 0.7);
      const storageUrl = await uploadFile(compressedUrl);
      updatePosterConfig("bgImage", storageUrl);
    } catch (error) {
      console.error("Error processing poster bg:", error);
    }
  };

  const handleDownloadPNG = async () => {
    if (!posterRef.current) return;
    setIsDownloading(true);
    try {
      await Promise.race([
        document.fonts.ready,
        new Promise(resolve => setTimeout(resolve, 3000))
      ]);

      const canvas = await html2canvas(posterRef.current, {
        scale: 3,
        useCORS: true,
        backgroundColor: null,
        logging: false,
        onclone: async (clonedDoc) => {
          const el = clonedDoc.getElementById('menu-to-export');
          if (el) {
            el.style.transform = 'none';
            el.style.width = '1000px';
            el.style.height = 'auto';
            el.style.margin = '0';
            el.style.padding = '0';
          }
          // Give a small extra time for fonts inside the clone
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      });
      const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png', 1.0));
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = 'Menu_Maria_Bonita.png';
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);
      toast({ title: "¡Éxito!", description: "Menú descargado como PNG" });
    } catch (error) {
      console.error("Export Error: ", error);
      toast({ title: "Error", description: "No se pudo descargar la imagen", variant: "destructive" });
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!posterRef.current) return;
    setIsDownloading(true);
    try {
      await Promise.race([
        document.fonts.ready,
        new Promise(resolve => setTimeout(resolve, 3000))
      ]);

      const canvas = await html2canvas(posterRef.current, {
        scale: 3,
        useCORS: true,
        backgroundColor: null,
        logging: false,
        onclone: async (clonedDoc) => {
          const el = clonedDoc.getElementById('menu-to-export');
          if (el) {
            el.style.transform = 'none';
            el.style.width = '1000px';
            el.style.height = 'auto';
            el.style.margin = '0';
            el.style.padding = '0';
          }
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      });
      const imgData = canvas.toDataURL('image/png', 1.0);

      const pdfWidth = 215.9; 
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: [pdfWidth, pdfHeight],
        compress: true
      });

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
      pdf.save('Menu_Maria_Bonita.pdf');
      toast({ title: "¡Éxito!", description: "Menú descargado como PDF" });
    } catch (error) {
      console.error("PDF Export Error: ", error);
      toast({ title: "Error", description: "No se pudo descargar el PDF", variant: "destructive" });
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-5xl mx-auto">
      {/* ── POSTER ── */}
      <div
        ref={posterRef}
        id="menu-to-export"
        className="w-full relative overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.8)] flex flex-col border-[12px] md:border-[20px] border-secondary/80"
        style={{
          backgroundColor: data.posterConfig?.bgColor || '#1a1a1a',
          minHeight: '1200px'
        }}
      >
        {/* Real image background for better PDF/PNG capture (fixes CORS issues) */}
        {data.posterConfig?.bgImage && (
          <img 
            src={data.posterConfig.bgImage} 
            alt="" 
            crossOrigin="anonymous"
            className="absolute inset-0 w-full h-full object-cover pointer-events-none z-0"
            style={{ opacity: 1 }}
          />
        )}

        {/* Editor Toolbar specifically for the Poster background */}
        {editMode && (
          <div className="absolute top-6 right-6 flex items-center gap-3 bg-[#1a1a1a]/95 border border-white/10 p-2 px-4 rounded-full shadow-2xl z-50 transition-all hover:bg-[#1a1a1a]">
            {/* Opacity Slider */}
            <div className="flex items-center gap-2 mr-2">
              <span className="text-white/60 text-[8px] uppercase font-bold tracking-tighter">Oscuro</span>
              <input
                type="range"
                min="0"
                max="90"
                value={data.posterConfig?.bgOpacity || 0}
                onChange={(e) => updatePosterConfig('bgOpacity', parseInt(e.target.value))}
                className="w-16 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-primary"
              />
            </div>

            <div className="w-px h-6 bg-white/10"></div>

            <div className="relative group flex items-center justify-center p-2 hover:bg-white/10 rounded-full cursor-pointer transition-all" title="Cambiar Fondo de Menú">
              <button onClick={() => posterBgFileRef.current?.click()} className="text-secondary">
                <ImageIcon className="w-5 h-5" />
              </button>
              <input type="file" ref={posterBgFileRef} className="hidden" accept="image/*" onChange={handlePosterBgUpload} />
            </div>
            <div className="w-px h-6 bg-white/10"></div>
            <div className="relative flex items-center justify-center p-2 hover:bg-white/10 rounded-full cursor-pointer transition-all" title="Color de Fondo">
              <PaintBucket className="w-5 h-5 text-secondary pointer-events-none absolute" />
              <input
                type="color"
                className="w-8 h-8 opacity-0 cursor-pointer"
                value={data.posterConfig?.bgColor || '#1a1a1a'}
                onChange={(e) => updatePosterConfig('bgColor', e.target.value)}
              />
            </div>
            {data.posterConfig?.bgImage && (
              <>
                <div className="w-px h-6 bg-white/10"></div>
                <button
                  onClick={() => updatePosterConfig('bgImage', '')}
                  className="p-2 hover:bg-red-500/20 text-red-400 rounded-full transition-all"
                  title="Eliminar Imagen de Fondo"
                >
                  <X className="w-5 h-5" />
                </button>
              </>
            )}
          </div>
        )}
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

        {/* Subtle noise texture (simpler) */}
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none z-0 artisanal-texture"></div>

        {/* Global Darkener Overlay */}
        <div
          className="absolute inset-0 z-10 pointer-events-none transition-all duration-300"
          style={{ backgroundColor: `rgba(0,0,0,${(data.posterConfig?.bgOpacity || 0) / 100})` }}
        ></div>

        {/* ── HEADER ── */}
        <div className="text-center relative z-30 pt-8 pb-4 px-8 md:px-16">
          {/* Logo in Poster */}
          <div className="flex justify-center mb-8 relative">
            {data.logoUrl ? (
              <img
                src={data.logoUrl}
                alt="Logo"
                crossOrigin="anonymous"
                className="h-32 md:h-40 w-auto object-contain drop-shadow-2xl"
                style={{ filter: 'drop-shadow(0 0 10px rgba(0,0,0,0.5))' }}
              />
            ) : (
              <div className="flex flex-col items-center">
                <span className="text-3xl md:text-5xl font-serif font-bold text-secondary tracking-[0.2em] uppercase drop-shadow-lg">
                  {data.businessInfo?.name || "MARIA BONITA"}
                </span>
                <div className="h-[1px] w-32 bg-gradient-to-r from-transparent via-secondary to-transparent mt-2"></div>
              </div>
            )}
            
            {/* Horizontal divider line behind logo area */}
            <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
          </div>

          {/* Top tagline divider */}
          <motion.div 
            drag={editMode ? "y" : false}
            dragMomentum={false}
            onDragEnd={(e, info) => updatePosterConfig('taglineY', (data.posterConfig?.taglineY || 0) + info.offset.y)}
            animate={{ y: data.posterConfig?.taglineY || 0 }}
            className={`flex items-center justify-center space-x-4 mb-3 ${editMode ? 'cursor-ns-resize' : ''}`}
          >
            <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-secondary/60 to-secondary/60"></div>
            <div className="px-4 text-white/90 text-xs font-serif uppercase tracking-[0.4em]">
              <InlineEdit
                value={data.posterConfig?.tagline || "Tacos & Antojitos Mexicanos"}
                onChange={(val) => updatePosterConfig('tagline', val)}
                isEditing={editMode}
                className="inline-block"
              />
            </div>
            <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-secondary/60 to-secondary/60"></div>
          </motion.div>

          {/* Main Heading Parte 1 */}
          <motion.div 
            drag={editMode ? "y" : false}
            dragMomentum={false}
            onDragEnd={(e, info) => updatePosterConfig('titlePart1Y', (data.posterConfig?.titlePart1Y || 0) + info.offset.y)}
            animate={{ y: data.posterConfig?.titlePart1Y || 0 }}
            className={`w-full flex justify-center mb-5 ${editMode ? 'cursor-ns-resize' : ''}`}
          >
            <InlineEdit
              value={data.posterConfig.titlePart1}
              onChange={(val) => updatePosterConfig('titlePart1', val)}
              isEditing={editMode}
              className="text-2xl md:text-3xl lg:text-[2.5rem] font-serif font-bold text-white block tracking-widest uppercase drop-shadow-lg leading-tight text-center"
            />
          </motion.div>

          {/* Pink banner - Improved for export stability */}
          <motion.div 
            drag={editMode ? "y" : false}
            dragMomentum={false}
            onDragEnd={(e, info) => updatePosterConfig('bannerY', (data.posterConfig?.bannerY || 0) + info.offset.y)}
            animate={{ y: data.posterConfig?.bannerY || 0 }}
            className={`w-full flex justify-center mt-6 mb-2 ${editMode ? 'cursor-ns-resize' : ''}`}
          >
            <div
              className="bg-primary shadow-[0_4px_30px_rgba(255,63,152,0.4)] border border-primary/50 px-10 py-4 md:px-16 md:py-6 relative overflow-visible"
              style={{ 
                clipPath: 'polygon(5% 0%, 100% 0%, 95% 100%, 0% 100%)',
                display: 'inline-flex', 
                alignItems: 'center', 
                justifyContent: 'center' 
              }}
            >
              <div className="relative z-10 flex justify-center w-full px-4">
                <InlineEdit
                  value={data.posterConfig.bannerText}
                  onChange={(val) => updatePosterConfig('bannerText', val)}
                  isEditing={editMode}
                  className="text-3xl md:text-4xl lg:text-[3.2rem] font-rustic text-white block tracking-widest uppercase drop-shadow-md text-center whitespace-nowrap"
                />
              </div>
            </div>
          </motion.div>

          {/* Title part 2 - TACOS  */}
          <motion.div 
            drag={editMode ? "y" : false}
            dragMomentum={false}
            onDragEnd={(e, info) => updatePosterConfig('titlePart2Y', (data.posterConfig?.titlePart2Y || 0) + info.offset.y)}
            animate={{ y: data.posterConfig?.titlePart2Y || 0 }}
            className={`w-full flex justify-center mt-2 pb-2 ${editMode ? 'cursor-ns-resize' : ''}`}
          >
            <InlineEdit
              value={data.posterConfig.titlePart2}
              onChange={(val) => updatePosterConfig('titlePart2', val)}
              isEditing={editMode}
              className="text-5xl sm:text-6xl md:text-7xl lg:text-[6.8rem] font-serif font-bold text-secondary block tracking-[0.1em] drop-shadow-xl uppercase mobile-text-balance text-center leading-none"
            />
          </motion.div>
        </div>

        {/* Decorative Divider */}
        <div className="flex justify-center items-center mb-6 relative z-30 space-x-3 px-8">
          <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-white/20 to-white/20"></div>
          <div className="w-3 h-3 bg-secondary rotate-45"></div>
          <div className="w-5 h-5 bg-primary rotate-45 border border-primary/50"></div>
          <div className="w-3 h-3 bg-secondary rotate-45"></div>
          <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-white/20 to-white/20"></div>
        </div>

        {/* ── MENU GRID ── */}
        <div className="relative z-30 px-4 md:px-12 flex flex-col md:flex-row gap-6 md:gap-10 flex-1 mb-10">

          {/* Vertical divider */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-[1px] border-l border-dashed border-white/10 -translate-x-1/2 pointer-events-none"></div>

          {/* Left Column */}
          <div className="flex-1 space-y-6">
            <CategoryCard
              title={data.posterConfig?.categoryTitles?.tacos || "TACOS"}
              accentColor="secondary"
              onAdd={() => addMenuItem('tacos', { name: 'NUEVO TACO', price: 0, description: '' })}
              onTitleChange={(val) => updatePosterConfig('categoryTitles', { ...data.posterConfig.categoryTitles, tacos: val })}
              editMode={editMode}
            >
              {data.menu.tacos.map(item => (
                <MenuItemRow
                  key={item.id}
                  item={item}
                  category="tacos"
                  updateMenuItem={updateMenuItem}
                  removeMenuItem={removeMenuItem}
                  editMode={editMode}
                />
              ))}
            </CategoryCard>

            <CategoryCard
              title={data.posterConfig?.categoryTitles?.desayunos || "DESAYUNOS / ANTOJITOS"}
              accentColor="accent"
              onAdd={() => addMenuItem('desayunos', { name: 'NUEVO ANTOJITO', price: 0, description: '' })}
              onTitleChange={(val) => updatePosterConfig('categoryTitles', { ...data.posterConfig.categoryTitles, desayunos: val })}
              editMode={editMode}
            >
              {data.menu.desayunos.map(item => (
                <MenuItemRow
                  key={item.id}
                  item={item}
                  category="desayunos"
                  updateMenuItem={updateMenuItem}
                  removeMenuItem={removeMenuItem}
                  editMode={editMode}
                />
              ))}
            </CategoryCard>
          </div>

          {/* Right Column */}
          <div className="flex-1 space-y-6">
            <CategoryCard
              title={data.posterConfig?.categoryTitles?.quesadillas || "QUESADILLAS / SINCRONIZADAS"}
              accentColor="primary"
              onAdd={() => addMenuItem('quesadillas', { name: 'NUEVA QUESADILLA', price: 0, description: '' })}
              onTitleChange={(val) => updatePosterConfig('categoryTitles', { ...data.posterConfig.categoryTitles, quesadillas: val })}
              editMode={editMode}
            >
              {data.menu.quesadillas.map(item => (
                <MenuItemRow
                  key={item.id}
                  item={item}
                  category="quesadillas"
                  updateMenuItem={updateMenuItem}
                  removeMenuItem={removeMenuItem}
                  editMode={editMode}
                />
              ))}
            </CategoryCard>

            <CategoryCard
              title={data.posterConfig?.categoryTitles?.weekendSpecials || "SÁBADOS Y DOMINGOS"}
              accentColor="accent"
              onAdd={() => addMenuItem('weekendSpecials', { name: 'NUEVO ESPECIAL', price: 0, description: '' })}
              onTitleChange={(val) => updatePosterConfig('categoryTitles', { ...data.posterConfig.categoryTitles, weekendSpecials: val })}
              editMode={editMode}
            >
              {data.menu.weekendSpecials.map(item => (
                <MenuItemRow
                  key={item.id}
                  item={item}
                  category="weekendSpecials"
                  updateMenuItem={updateMenuItem}
                  removeMenuItem={removeMenuItem}
                  editMode={editMode}
                />
              ))}
            </CategoryCard>

            <CategoryCard
              title={data.posterConfig?.categoryTitles?.otros || "OTROS"}
              accentColor="secondary"
              onAdd={() => addMenuItem('otros', { name: 'NUEVO PLATILLO', price: 0, description: '' })}
              onTitleChange={(val) => updatePosterConfig('categoryTitles', { ...data.posterConfig.categoryTitles, otros: val })}
              editMode={editMode}
            >
              {data.menu.otros.map(item => (
                <MenuItemRow
                  key={item.id}
                  item={item}
                  category="otros"
                  updateMenuItem={updateMenuItem}
                  removeMenuItem={removeMenuItem}
                  editMode={editMode}
                />
              ))}
            </CategoryCard>

            <CategoryCard
              title={data.posterConfig?.categoryTitles?.bebidas || "BEBIDAS"}
              accentColor="secondary"
              onAdd={() => addMenuItem('bebidas', { name: 'NUEVA BEBIDA', price: 0, description: '' })}
              onTitleChange={(val) => updatePosterConfig('categoryTitles', { ...data.posterConfig.categoryTitles, bebidas: val })}
              editMode={editMode}
            >
              {data.menu.bebidas.map(item => (
                <MenuItemRow
                  key={item.id}
                  item={item}
                  category="bebidas"
                  updateMenuItem={updateMenuItem}
                  removeMenuItem={removeMenuItem}
                  editMode={editMode}
                />
              ))}
            </CategoryCard>
          </div>
        </div>

        {/* ── FOOTER ── */}
        <motion.div 
          drag={editMode ? "y" : false}
          dragMomentum={false}
          onDragEnd={(e, info) => updatePosterConfig('footerY', (data.posterConfig?.footerY || 0) + info.offset.y)}
          animate={{ y: data.posterConfig?.footerY || 0 }}
          className={`relative z-30 w-full flex justify-center pb-10 px-8 ${editMode ? 'cursor-ns-resize' : ''}`}
        >
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
              className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-serif font-bold text-white tracking-widest drop-shadow-md block uppercase mobile-text-balance"
            />
          </div>
        </motion.div>
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
