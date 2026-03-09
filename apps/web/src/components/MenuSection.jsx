import React, { useRef } from 'react';
import MenuPoster from './MenuPoster.jsx';
import { motion } from 'framer-motion';
import { useEditableContent } from '@/contexts/EditableContent.jsx';
import { AlignLeft, AlignCenter, AlignJustify, PaintBucket, Type, Image as ImageIcon, X } from 'lucide-react';
import { compressImage } from '@/lib/imageCompressor.js';
import { uploadFile } from '@/lib/storage.js';

const InlineEdit = ({ value, onChange, isEditing, className, type = "text" }) => {
  if (isEditing) {
    if (type === "textarea") {
      return (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`bg-black/20 border-b-2 border-dashed border-secondary/50 focus:outline-none focus:border-secondary w-full max-w-full resize-y min-h-[120px] p-2 rounded-sm ${className}`}
          style={{ textAlign: 'inherit' }}
        />
      );
    }
    return (
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`bg-black/20 border-b-2 border-dashed border-secondary/50 focus:outline-none focus:border-secondary px-1 py-0 w-full max-w-full rounded-sm ${className}`}
        style={{ textAlign: 'inherit' }}
      />
    );
  }
  return <span className={className} style={{ textAlign: 'inherit' }}>{value}</span>;
};

const MenuSection = () => {
  const { data, editMode, updateMenuSectionConfig } = useEditableContent();
  const menuBgFileRef = useRef(null);

  const handleMenuBgUpload = async (e) => {
    const file = e.target.files?.[0];
    if (e.target) e.target.value = '';
    if (!file) return;
    try {
      const compressedUrl = await compressImage(file, 1600, 0.7);
      const storageUrl = await uploadFile(compressedUrl);
      updateMenuSectionConfig("bgImage", storageUrl);
    } catch (error) {
      console.error("Error processing image:", error);
      alert("No se pudo procesar esta imagen.");
    }
  };
  return (
    <section id="menu" className="py-24 bg-background relative overflow-hidden wood-pattern-dark border-y-[12px] border-border">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-30">
        <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-secondary blur-[100px]"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-primary blur-[100px]"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative text-center mb-16 p-8 rounded-sm border-4 border-muted backdrop-blur-sm max-w-4xl mx-auto shadow-rustic overflow-hidden transition-colors duration-500"
          style={{
            color: data.menuSectionConfig?.textColor || "var(--foreground)",
            textAlign: data.menuSectionConfig?.textAlign || "center"
          }}
        >
          {/* Background Layers */}
          <div
            className="absolute inset-0 z-0 pointer-events-none bg-cover bg-center"
            style={{ backgroundImage: data.menuSectionConfig?.bgImage ? `url('${data.menuSectionConfig.bgImage}')` : 'none' }}
          ></div>
          <div
            className="absolute inset-0 z-0 pointer-events-none transition-colors duration-500"
            style={{ backgroundColor: data.menuSectionConfig?.bgColor || "rgba(255, 255, 255, 0.1)" }}
          ></div>

          {/* Toolbar for Editor Mode */}
          {editMode && (
            <div className="absolute top-2 right-2 flex gap-1.5 bg-[#1a1a1a]/90 border border-white/10 p-1.5 rounded-lg shadow-2xl z-50">
              <div className="relative group flex items-center justify-center tooltip-container" title="Imagen de Fondo">
                <button onClick={() => menuBgFileRef.current?.click()} className="text-white/70 hover:text-white transition-colors p-1 hover:bg-white/20 rounded-md">
                  <ImageIcon className="w-4 h-4" />
                </button>
                <input type="file" accept="image/*" ref={menuBgFileRef} className="hidden" onChange={handleMenuBgUpload} />
                {data.menuSectionConfig?.bgImage && (
                  <button
                    onClick={() => updateMenuSectionConfig("bgImage", "")}
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
                    updateMenuSectionConfig("bgColor", `rgba(${r}, ${g}, ${b}, 0.85)`);
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
                  onChange={(e) => updateMenuSectionConfig("textColor", e.target.value)}
                />
              </div>
              <div className="w-px h-6 bg-white/20 self-center mx-1"></div>
              <button
                title="Alinear Izquierda"
                onClick={() => updateMenuSectionConfig("textAlign", "left")}
                className={`p-1.5 rounded-md transition-all ${data.menuSectionConfig?.textAlign === "left" ? 'bg-secondary text-[#1a1a1a]' : 'text-white/70 hover:bg-white/20 hover:text-white'}`}
              >
                <AlignLeft className="w-4 h-4" />
              </button>
              <button
                title="Centrar"
                onClick={() => updateMenuSectionConfig("textAlign", "center")}
                className={`p-1.5 rounded-md transition-all ${(data.menuSectionConfig?.textAlign === "center" || !data.menuSectionConfig?.textAlign) ? 'bg-secondary text-[#1a1a1a]' : 'text-white/70 hover:bg-white/20 hover:text-white'}`}
              >
                <AlignCenter className="w-4 h-4" />
              </button>
              <button
                title="Justificar"
                onClick={() => updateMenuSectionConfig("textAlign", "justify")}
                className={`p-1.5 rounded-md transition-all ${data.menuSectionConfig?.textAlign === "justify" ? 'bg-secondary text-[#1a1a1a]' : 'text-white/70 hover:bg-white/20 hover:text-white'}`}
              >
                <AlignJustify className="w-4 h-4" />
              </button>
            </div>
          )}

          <h2 className="relative z-10 text-5xl md:text-7xl font-serif font-bold mb-6 uppercase tracking-wider drop-shadow-md" style={{ color: 'inherit' }}>
            <InlineEdit
              value={data.menuSectionConfig?.title || "NUESTRO MENÚ"}
              onChange={(val) => updateMenuSectionConfig('title', val)}
              isEditing={editMode}
            />
          </h2>
          <div className={`relative z-10 flex items-center mb-8 ${data.menuSectionConfig?.textAlign === 'left' ? 'justify-start space-x-4' : data.menuSectionConfig?.textAlign === 'justify' ? 'justify-center w-[500px] mx-auto space-x-12' : 'justify-center space-x-4'}`}>
            <div className="h-1 w-16 bg-secondary"></div>
            <div className="w-4 h-4 bg-primary rotate-45"></div>
            <div className="h-1 w-16 bg-secondary"></div>
          </div>
          <p className="relative z-10 max-w-2xl mx-auto font-serif text-2xl leading-relaxed font-medium" style={{ color: 'inherit' }}>
            <InlineEdit
              type="textarea"
              value={data.menuSectionConfig?.text || "Descubre nuestros platillos tradicionales mexicanos preparados con amor, recetas de la abuela y los mejores ingredientes."}
              onChange={(val) => updateMenuSectionConfig('text', val)}
              isEditing={editMode}
            />
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <MenuPoster />
        </motion.div>
      </div>
    </section>
  );
};

export default MenuSection;
