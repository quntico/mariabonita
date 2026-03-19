
import React, { useRef } from 'react';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button.jsx';
import { MessageCircle, UtensilsCrossed, MapPin, Clock, AlignLeft, AlignCenter, AlignJustify, PaintBucket, Type, Image as ImageIcon, X } from 'lucide-react';
import { useEditableContent } from '@/contexts/EditableContent.jsx';
import { compressImage } from '@/lib/imageCompressor.js';
import { uploadFile } from '@/lib/storage.js';
import { motion } from 'framer-motion';
import MenuSection from '@/components/MenuSection.jsx';
import WeekendSpecialsSection from '@/components/WeekendSpecialsSection.jsx';
import GallerySection from '@/components/GallerySection.jsx';
import ContactSection from '@/components/ContactSection.jsx';

const InlineEdit = ({ value, onChange, isEditing, className, type = "text" }) => {
  const [localValue, setLocalValue] = React.useState(value);

  React.useEffect(() => {
    setLocalValue(value);
  }, [value]);

  if (isEditing) {
    if (type === "textarea") {
      return (
        <textarea
          value={localValue}
          onChange={(e) => setLocalValue(e.target.value)}
          onBlur={() => onChange(localValue)}
          className={`bg-black/20 border-b-2 border-dashed border-secondary/50 focus:outline-none focus:border-secondary w-full max-w-full resize-y min-h-[120px] p-2 rounded-sm ${className}`}
          style={{ textAlign: 'inherit' }}
        />
      );
    }
    return (
      <input
        type="text"
        value={localValue}
        onChange={(e) => {
          setLocalValue(e.target.value);
          onChange(e.target.value);
        }}
        className={`bg-black/20 border-b-2 border-dashed border-secondary/50 focus:outline-none focus:border-secondary px-1 py-0 w-full max-w-full rounded-sm ${className}`}
        style={{ textAlign: 'inherit' }}
      />
    );
  }
  return <span className={className} style={{ textAlign: 'inherit' }}>{value}</span>;
};

const HomePage = () => {
  const { data, editMode, updateThemeConfig, updateHeroConfig, updatePosterConfig, updateHeroDecoration, removeHeroDecoration, updateAboutConfig, updateAboutBadge, updateHeroBackground } = useEditableContent();
  const aboutFileRef = useRef(null);
  const heroFileRef = useRef(null);

  const handleAboutBgUpload = async (e) => {
    const file = e.target.files?.[0];
    if (e.target) e.target.value = '';
    if (!file) return;
    try {
      const compressedUrl = await compressImage(file, 1600, 0.7);
      const storageUrl = await uploadFile(compressedUrl);
      updateAboutConfig("bgImage", storageUrl);
    } catch (error) {
      console.error("Error processing image:", error);
      alert("No se pudo procesar esta imagen.");
    }
  };

  const handleHeroBgUpload = async (e) => {
    const file = e.target.files?.[0];
    if (e.target) e.target.value = '';
    if (!file) return;
    try {
      const compressedUrl = await compressImage(file, 2000, 0.7);
      const storageUrl = await uploadFile(compressedUrl);
      updateHeroBackground(storageUrl);
    } catch (error) {
      console.error("Error processing hero image:", error);
      alert("No se pudo procesar la imagen de fondo.");
    }
  };

  const scrollToMenu = () => {
    const element = document.getElementById('menu');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleWhatsAppClick = () => {
    const message = encodeURIComponent('Hola! Me gustaría hacer un pedido');
    window.open(`https://wa.me/${data.businessInfo.whatsapp.replace(/\D/g, '')}?text=${message}`, '_blank');
  };

  return (
    <>
      <Helmet>
        <title>{`MARIA BONITA - ${data.businessInfo.subtitle}`}</title>
        <meta
          name="description"
          content={`${data.businessInfo.tagline}. Disfruta de los mejores tacos y antojitos mexicanos en ${data.businessInfo.address}`}
        />
      </Helmet>

      {/* Hero Section - Compact 1-screen layout */}
      <section id="hero" className="relative h-screen flex items-center justify-center overflow-hidden bg-background border-b-[8px] border-border">
        {/* Background Image - dynamic from editor */}
        <div
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url('${data.heroBackground || 'https://images.unsplash.com/photo-1583438899925-84fde80483b9?q=80&w=2000&auto=format&fit=crop'}')` }}
        ></div>

        {/* Editor Toolbar specifically for the Hero background */}
        {editMode && (
          <div className="absolute top-6 left-6 flex items-center gap-4 bg-black/80 border border-white/20 p-3 rounded-xl shadow-2xl z-50 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <span className="text-white/60 text-[10px] uppercase font-bold tracking-tighter">Oscurecer</span>
              <input
                type="range"
                min="0"
                max="100"
                value={data.themeConfig?.heroOverlayOpacity || 80}
                onChange={(e) => updateThemeConfig('heroOverlayOpacity', parseInt(e.target.value))}
                className="w-24 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <span className="text-white font-mono text-[11px] w-8">{data.themeConfig?.heroOverlayOpacity || 80}%</span>
            </div>
            <div className="w-px h-6 bg-white/20"></div>
            <button
              onClick={() => heroFileRef.current?.click()}
              className="flex items-center gap-2 text-white/80 hover:text-white transition-colors group"
              title="Cambiar Imagen"
            >
              <ImageIcon className="w-4 h-4 text-secondary" />
              <span className="text-[10px] uppercase font-bold tracking-tighter">Imagen</span>
            </button>
            <input type="file" ref={heroFileRef} className="hidden" accept="image/*" onChange={handleHeroBgUpload} />
          </div>
        )}

        {/* Overlays */}
        <div
          className="absolute inset-0 z-0 mix-blend-multiply"
          style={{
            backgroundColor: data.themeConfig?.heroGradientStart || '#000000',
            opacity: typeof data.themeConfig?.heroOverlayOpacity !== 'undefined' ? data.themeConfig.heroOverlayOpacity / 100 : 0.8
          }}
        ></div>
        <div className="absolute inset-0 z-0 wood-pattern-dark opacity-70"></div>
        <div
          className="absolute inset-0 z-0"
          style={{
            background: `linear-gradient(to bottom, ${data.themeConfig?.heroGradientStart || '#000000'}cc, transparent, hsl(var(--background)))`
          }}
        ></div>

        {/* Dynamic Decorative Food Images */}
        {data.heroDecorations?.map((dec) => (
          <motion.div
            key={dec.id}
            drag={editMode}
            dragMomentum={false}
            initial={{ opacity: 0, x: dec.x || 0, y: dec.y || 0 }}
            animate={{ opacity: 1, x: dec.x || 0, y: dec.y || 0 }}
            onDragEnd={(e, info) => {
              updateHeroDecoration(dec.id, 'x', (dec.x || 0) + info.offset.x);
              updateHeroDecoration(dec.id, 'y', (dec.y || 0) + info.offset.y);
            }}
            transition={{ duration: editMode ? 0 : 1.5 }}
            className={`absolute rounded-full overflow-hidden border-4 border-muted shadow-rustic opacity-80 mix-blend-luminosity z-20 group ${editMode ? 'cursor-grab active:cursor-grabbing' : ''}`}
            style={{
              width: dec.size || 128,
              height: dec.size || 128,
              left: '50%',
              top: '50%',
              marginLeft: -(dec.size || 128) / 2,
              marginTop: -(dec.size || 128) / 2
            }}
          >
            <img src={dec.url} alt="Decoración" className="w-full h-full object-cover pointer-events-none" />

            {editMode && (
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-1 transition-opacity duration-200">
                <button
                  title="Aumentar tamaño"
                  onClick={(e) => { e.stopPropagation(); updateHeroDecoration(dec.id, 'size', (dec.size || 128) + 20); }}
                  className="w-6 h-6 bg-secondary text-[#1a1a1a] rounded-full flex items-center justify-center font-black text-lg hover:scale-110 shadow-lg"
                >+</button>
                <button
                  title="Reducir tamaño"
                  onClick={(e) => { e.stopPropagation(); updateHeroDecoration(dec.id, 'size', Math.max(64, (dec.size || 128) - 20)); }}
                  className="w-6 h-6 bg-white text-[#1a1a1a] rounded-full flex items-center justify-center font-black text-lg hover:scale-110 shadow-lg"
                >-</button>
                <div className="h-px w-6 bg-white/20 my-0.5"></div>
                <button
                  title="Eliminar círculo"
                  onClick={(e) => { e.stopPropagation(); removeHeroDecoration(dec.id); }}
                  className="w-6 h-6 bg-rose-500 text-white rounded-full flex items-center justify-center font-black text-xs hover:scale-110 shadow-lg"
                >✕</button>
              </div>
            )}
          </motion.div>
        ))}

        {/* Main Content Container */}
        <div className="relative z-10 container mx-auto px-4 flex flex-col items-center justify-center h-full">
          <motion.div
            drag={editMode}
            dragMomentum={false}
            dragElastic={0}
            dragTransition={{ power: 0 }}
            initial={{ 
              opacity: 0, 
              scale: 0.9, 
              x: data.themeConfig?.heroOffsetX || 0,
              y: data.themeConfig?.heroOffsetY || 0 
            }}
            animate={{ 
              opacity: 1, 
              scale: data.themeConfig?.heroScale || 1, 
              x: data.themeConfig?.heroOffsetX || 0,
              y: data.themeConfig?.heroOffsetY || 0 
            }}
            onDragEnd={(e, info) => {
              const currentX = data.themeConfig?.heroOffsetX || 0;
              const currentY = data.themeConfig?.heroOffsetY || 0;
              updateThemeConfig('heroOffsetX', currentX + info.offset.x);
              updateThemeConfig('heroOffsetY', currentY + info.offset.y);
            }}
            transition={{ duration: editMode ? 0 : 1.5, ease: "easeOut" }}
            className={`w-full max-w-3xl relative ${editMode ? 'cursor-grab active:cursor-grabbing pointer-events-auto border-2 border-secondary/40 rounded-lg p-2' : ''}`}
          >
            {/* Canva-style Resize Handles for Hero Block */}
            {editMode && (
              <>
                <div className="absolute -top-3 -left-3 w-5 h-5 bg-secondary rounded-full shadow-lg border-2 border-white z-50"></div>
                <div className="absolute -top-3 -right-3 w-5 h-5 bg-secondary rounded-full shadow-lg border-2 border-white z-50"></div>
                <div className="absolute -bottom-3 -left-3 w-5 h-5 bg-secondary rounded-full shadow-lg border-2 border-white z-50"></div>
                <motion.div 
                  drag
                  dragMomentum={false}
                  dragElastic={0}
                  onDragStart={(e) => e.stopPropagation()}
                  onDrag={(e, info) => {
                    e.stopPropagation();
                    const currentScale = data.themeConfig?.heroScale || 1;
                    const sensitivity = 0.01;
                    const delta = (info.delta.x + info.delta.y) * sensitivity;
                    updateThemeConfig('heroScale', Math.max(0.2, currentScale + delta));
                  }}
                  className="absolute -bottom-4 -right-4 w-9 h-9 bg-yellow-400 rounded-full shadow-2xl border-4 border-white z-[70] cursor-nwse-resize flex items-center justify-center hover:scale-125 transition-transform"
                >
                  <div className="w-2 h-2 bg-black rounded-full"></div>
                </motion.div>
              </>
            )}

            {/* Rustic Frame */}
            <div className="absolute inset-0 border-[10px] border-border rounded-sm opacity-90 mix-blend-overlay pointer-events-none shadow-[inset_0_0_30px_rgba(0,0,0,0.9)]"></div>
            <div className="absolute inset-3 border-2 border-double border-muted rounded-sm pointer-events-none z-20 opacity-80"></div>

            {/* Poster Background */}
            <div className="bg-background/60 backdrop-blur-md p-4 md:p-7 border-4 border-muted rounded-sm shadow-rustic relative overflow-hidden">

              {/* Corner Decorations */}
              <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-secondary"></div>
              <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-secondary"></div>
              <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-secondary"></div>
              <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-secondary"></div>

              <div className="flex flex-col items-center text-center relative z-20 gap-0">

                {/* Top Branding */}
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  className="flex items-center justify-center space-x-4 w-full"
                >
                  <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-secondary to-transparent"></div>
                  <h2 className="text-base md:text-lg font-serif font-bold text-foreground tracking-[0.4em] uppercase drop-shadow-md">
                    MARIA BONITA
                  </h2>
                  <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-secondary to-transparent"></div>
                </motion.div>

                {/* Main Heading */}
                <motion.h1
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.7, duration: 0.8 }}
                  className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-serif font-bold text-foreground leading-tight tracking-wide drop-shadow-lg uppercase w-full mobile-text-balance"
                >
                  <InlineEdit
                    value={data.heroConfig?.titlePart1 || "SI CAES QUE SEA EN LA TENTACIÓN"}
                    onChange={(val) => updateHeroConfig('titlePart1', val)}
                    isEditing={editMode}
                  />
                </motion.h1>

                {/* Mexican Pink Banner */}
                <motion.div
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.9, duration: 0.6, type: "spring" }}
                  className="relative inline-block w-full max-w-sm mx-auto my-0"
                >
                  <div className="absolute inset-0 bg-primary transform -skew-x-12 shadow-rustic border-2 border-border"></div>
                  <h2 className="relative z-10 text-2xl md:text-4xl font-rustic text-white px-8 py-2 block tracking-widest uppercase drop-shadow-md">
                    <InlineEdit
                      value={data.heroConfig?.bannerText || "DE UNOS"}
                      onChange={(val) => updateHeroConfig('bannerText', val)}
                      isEditing={editMode}
                    />
                  </h2>
                </motion.div>

                <motion.h1
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 1.1, duration: 0.8 }}
                  className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-secondary tracking-widest drop-shadow-xl uppercase w-full"
                >
                  <InlineEdit
                    value={data.heroConfig?.titlePart2 || "TACOS"}
                    onChange={(val) => updateHeroConfig('titlePart2', val)}
                    isEditing={editMode}
                  />
                </motion.h1>

                {/* Decorative Divider */}
                <div className="flex justify-center items-center space-x-3">
                  <div className="h-1 w-16 bg-muted"></div>
                  <div className="w-3 h-3 bg-primary rotate-45 border border-border"></div>
                  <div className="w-4 h-4 bg-secondary rotate-45 border border-border"></div>
                  <div className="w-3 h-3 bg-primary rotate-45 border border-border"></div>
                  <div className="h-1 w-16 bg-muted"></div>
                </div>

                {/* Action Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.5, duration: 0.8 }}
                  className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-lg"
                >
                  <Button
                    onClick={scrollToMenu}
                    size="lg"
                    className="w-full sm:w-auto text-sm px-7 py-4 bg-card hover:bg-card/90 text-card-foreground border-4 border-muted shadow-rustic transition-all hover:-translate-y-1 rounded-sm font-serif font-bold uppercase tracking-wider"
                  >
                    <UtensilsCrossed className="w-4 h-4 mr-2 text-secondary" />
                    <InlineEdit
                      value={data.heroConfig?.menuText || "Ver Menú"}
                      onChange={(val) => updateHeroConfig('menuText', val)}
                      isEditing={editMode}
                    />
                  </Button>
                  <Button
                    onClick={handleWhatsAppClick}
                    size="lg"
                    className="w-full sm:w-auto text-sm px-7 py-4 bg-primary hover:bg-primary/90 text-white border-4 border-border shadow-rustic transition-all hover:-translate-y-1 rounded-sm font-serif font-bold uppercase tracking-wider"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    <InlineEdit
                      value={data.heroConfig?.whatsappText || "Pedir Ahora"}
                      onChange={(val) => updateHeroConfig('whatsappText', val)}
                      isEditing={editMode}
                    />
                  </Button>
                </motion.div>

              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 bg-card parchment-pattern border-b-[12px] border-border">
        <div className="container mx-auto px-4">
          <div
            className="max-w-4xl mx-auto p-12 rounded-sm border-4 border-muted shadow-rustic relative transition-colors duration-500 overflow-hidden"
            style={{
              color: data.aboutConfig?.textColor || "var(--card-foreground)"
            }}
          >
            {/* Background Layers */}
            <div
              className="absolute inset-0 z-0 pointer-events-none bg-cover bg-center"
              style={{ backgroundImage: data.aboutConfig?.bgImage ? `url('${data.aboutConfig.bgImage}')` : 'none' }}
            ></div>
            <div
              className="absolute inset-0 z-0 pointer-events-none transition-colors duration-500"
              style={{ backgroundColor: data.aboutConfig?.bgColor || "rgba(255, 255, 255, 0.6)" }}
            ></div>

            {/* Toolbar for Editor Mode */}
            {editMode && (
              <div className="absolute top-2 right-2 flex gap-1.5 bg-[#1a1a1a]/90 border border-white/10 p-1.5 rounded-lg shadow-2xl z-50">
                <div className="relative group flex items-center justify-center tooltip-container" title="Imagen de Fondo">
                  <button onClick={() => aboutFileRef.current?.click()} className="text-white/70 hover:text-white transition-colors p-1 hover:bg-white/20 rounded-md">
                    <ImageIcon className="w-4 h-4" />
                  </button>
                  <input type="file" accept="image/*" ref={aboutFileRef} className="hidden" onChange={handleAboutBgUpload} />
                  {data.aboutConfig?.bgImage && (
                    <button
                      onClick={() => updateAboutConfig("bgImage", "")}
                      className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-white flex items-center justify-center hover:scale-110"
                      title="Quitar Imagen"
                    >
                      <X className="w-2 h-2" />
                    </button>
                  )}
                </div>
                <div className="w-px h-6 bg-white/20 self-center mx-1"></div>
                <div className="relative group flex items-center justify-center tooltip-container" title="Color del Recuadro">
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <PaintBucket className="w-4 h-4 text-white/70 group-hover:text-white transition-colors" />
                  </div>
                  <input
                    type="color"
                    className="w-8 h-8 opacity-0 cursor-pointer"
                    onChange={(e) => {
                      const hex = e.target.value;
                      const r = parseInt(hex.slice(1, 3), 16);
                      const g = parseInt(hex.slice(3, 5), 16);
                      const b = parseInt(hex.slice(5, 7), 16);
                      updateAboutConfig("bgColor", `rgba(${r}, ${g}, ${b}, 0.85)`);
                    }}
                  />
                </div>
                <div className="relative group flex items-center justify-center" title="Color de Texto">
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <Type className="w-4 h-4 text-white/70 group-hover:text-white transition-colors" />
                  </div>
                  <input
                    type="color"
                    className="w-8 h-8 opacity-0 cursor-pointer"
                    onChange={(e) => updateAboutConfig("textColor", e.target.value)}
                  />
                </div>
                <div className="w-px h-6 bg-white/20 self-center mx-1"></div>

                {/* Aligned Groups for Title & Text */}
                <div className="flex flex-col gap-1.5 px-1 py-0.5 bg-black/40 rounded-md border border-white/5">
                  <div className="flex items-center gap-1">
                    <span className="text-[7px] text-white/40 uppercase w-7 text-right pr-1">Tít</span>
                    <button onClick={() => updateAboutConfig("titleTextAlign", "left")} className={`p-1 rounded transition-all ${data.aboutConfig?.titleTextAlign === "left" ? 'bg-secondary text-[#1a1a1a]' : 'text-white/50 hover:text-white'}`}><AlignLeft className="w-2.5 h-2.5" /></button>
                    <button onClick={() => updateAboutConfig("titleTextAlign", "center")} className={`p-1 rounded transition-all ${(data.aboutConfig?.titleTextAlign === "center" || !data.aboutConfig?.titleTextAlign) ? 'bg-secondary text-[#1a1a1a]' : 'text-white/50 hover:text-white'}`}><AlignCenter className="w-2.5 h-2.5" /></button>
                    <button onClick={() => updateAboutConfig("titleTextAlign", "justify")} className={`p-1 rounded transition-all ${data.aboutConfig?.titleTextAlign === "justify" ? 'bg-secondary text-[#1a1a1a]' : 'text-white/50 hover:text-white'}`}><AlignJustify className="w-2.5 h-2.5" /></button>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-[7px] text-white/40 uppercase w-7 text-right pr-1">Pár</span>
                    <button onClick={() => updateAboutConfig("textTextAlign", "left")} className={`p-1 rounded transition-all ${data.aboutConfig?.textTextAlign === "left" ? 'bg-secondary text-[#1a1a1a]' : 'text-white/50 hover:text-white'}`}><AlignLeft className="w-2.5 h-2.5" /></button>
                    <button onClick={() => updateAboutConfig("textTextAlign", "center")} className={`p-1 rounded transition-all ${data.aboutConfig?.textTextAlign === "center" ? 'bg-secondary text-[#1a1a1a]' : 'text-white/50 hover:text-white'}`}><AlignCenter className="w-2.5 h-2.5" /></button>
                    <button onClick={() => updateAboutConfig("textTextAlign", "justify")} className={`p-1 rounded transition-all ${data.aboutConfig?.textTextAlign === "justify" ? 'bg-secondary text-[#1a1a1a]' : 'text-white/50 hover:text-white'}`}><AlignJustify className="w-2.5 h-2.5" /></button>
                  </div>
                </div>
              </div>
            )}

            {/* Decorative corner */}
            <div className="absolute top-0 left-0 w-16 h-16 bg-secondary transform -translate-x-8 -translate-y-8 rotate-45 z-10"></div>

            <h2
              className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-6 md:mb-8 uppercase tracking-wider relative z-20"
              style={{ color: 'inherit', textAlign: data.aboutConfig?.titleTextAlign || 'center' }}
            >
              <InlineEdit
                value={data.aboutConfig?.title || "NUESTRA HISTORIA"}
                onChange={(val) => updateAboutConfig('title', val)}
                isEditing={editMode}
              />
            </h2>
            <div className={`flex items-center space-x-4 mb-8 ${(data.aboutConfig?.textTextAlign || data.aboutConfig?.textAlign) === 'left' ? 'justify-start' :
              (data.aboutConfig?.textTextAlign || data.aboutConfig?.textAlign) === 'right' ? 'justify-end' :
                'justify-center'
              }`}>
              <div className="h-1 w-16 bg-secondary"></div>
              <div className="w-4 h-4 bg-primary rotate-45"></div>
              <div className="h-1 w-16 bg-secondary"></div>
            </div>

            <p
              className="text-xl md:text-2xl font-serif leading-relaxed mb-8 md:mb-10 font-medium relative z-20 mobile-text-balance"
              style={{ color: 'inherit', textAlign: data.aboutConfig?.textTextAlign || 'center' }}
            >
              <InlineEdit
                type="textarea"
                value={data.aboutConfig?.text || "En MARIA BONITA, preparamos cada platillo con la misma pasión y sazón que nos enseñaron en casa. Utilizamos ingredientes frescos, tortillas hechas a mano y salsas de molcajete para llevar el verdadero sabor de México a tu mesa."}
                onChange={(val) => updateAboutConfig('text', val)}
                isEditing={editMode}
              />
            </p>

            <div className={`flex flex-wrap gap-6 relative z-20 ${data.aboutConfig?.textAlign === 'left' ? 'justify-start' : data.aboutConfig?.textAlign === 'justify' ? 'justify-center sm:justify-between max-w-[500px] mx-auto' : 'justify-center'}`}>
              {(data.aboutConfig?.badges || []).map((badge) => (
                <div key={badge.id} className="relative group/badge">
                  <div
                    className="rounded-full border-4 border-border shadow-md flex flex-col items-center justify-center flex-shrink-0 transition-all duration-300 relative z-10"
                    style={{
                      width: badge.size || 80,
                      height: badge.size || 80,
                      backgroundColor: badge.bgColor || '#d4af37'
                    }}
                  >
                    <span className="font-rustic text-white text-center leading-none flex flex-col items-center justify-center w-[85%]" style={{ fontSize: badge.fontSize || '1.25rem' }}>
                      {editMode ? (
                        <>
                          <input
                            type="text"
                            value={badge.text1 || ''}
                            onChange={(e) => updateAboutBadge(badge.id, 'text1', e.target.value)}
                            className="bg-transparent text-center outline-none w-full py-0.5 border-b border-transparent focus:border-white/30 placeholder-white/50"
                            placeholder="Línea 1"
                          />
                          <input
                            type="text"
                            value={badge.text2 || ''}
                            onChange={(e) => updateAboutBadge(badge.id, 'text2', e.target.value)}
                            className="bg-transparent text-center outline-none w-full py-0.5 border-b border-transparent focus:border-white/30 placeholder-white/50"
                            placeholder="Línea 2"
                          />
                        </>
                      ) : (
                        <>
                          {badge.text1}{(badge.text1 && badge.text2) ? <br /> : ''}{badge.text2}
                        </>
                      )}
                    </span>
                  </div>

                  {editMode && (
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-[#1a1a1a]/95 border border-white/10 p-1 rounded-lg flex gap-1 opacity-0 group-hover/badge:opacity-100 transition-opacity whitespace-nowrap z-50 shadow-xl pointer-events-none group-hover/badge:pointer-events-auto">
                      <label className="cursor-pointer p-1.5 hover:bg-white/20 rounded flex items-center justify-center text-white/70 hover:text-white" title="Color del Círculo">
                        <PaintBucket className="w-3.5 h-3.5" />
                        <input type="color" className="hidden" value={badge.bgColor || '#d4af37'} onChange={(e) => updateAboutBadge(badge.id, 'bgColor', e.target.value)} />
                      </label>
                      <div className="w-px h-4 bg-white/20 self-center mx-0.5"></div>
                      <button title="Aumentar tamaño" onClick={() => updateAboutBadge(badge.id, 'size', Math.min(200, (badge.size || 80) + 10))} className="w-6 h-6 flex items-center justify-center hover:bg-white/20 rounded text-sm font-bold text-white/70 hover:text-white">+</button>
                      <button title="Reducir tamaño" onClick={() => updateAboutBadge(badge.id, 'size', Math.max(50, (badge.size || 80) - 10))} className="w-6 h-6 flex items-center justify-center hover:bg-white/20 rounded text-sm font-bold text-white/70 hover:text-white">-</button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <MenuSection />
      <WeekendSpecialsSection />
      <GallerySection />
      <ContactSection />
    </>
  );
};

export default HomePage;
