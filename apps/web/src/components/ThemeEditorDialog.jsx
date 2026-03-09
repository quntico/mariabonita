import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Palette, Type, Droplet, Layout, RotateCcw, Minus, Maximize2 } from 'lucide-react';
import { useEditableContent } from '@/contexts/EditableContent.jsx';

const FONTS = [
    { name: 'Playfair Display', value: 'Playfair Display' },
    { name: 'Inter', value: 'Inter' },
    { name: 'Roboto', value: 'Roboto' },
    { name: 'Righteous', value: 'Righteous' },
    { name: 'Fredoka One', value: 'Fredoka One' },
    { name: 'Cinzel', value: 'Cinzel' },
];

const ThemeEditorDialog = ({ open, onClose }) => {
    const { data, updateThemeConfig } = useEditableContent();
    const [isMinimized, setIsMinimized] = useState(false);

    return (
        <AnimatePresence>
            {open && <motion.div
                key="backdrop-theme"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={onClose}
                className="fixed inset-0 z-[200] bg-black/40 backdrop-blur-[2px]"
            />}

            {open && <motion.div
                key="dialog-theme"
                initial={{ opacity: 0, scale: 0.94, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: isMinimized ? '40vh' : 0 }}
                exit={{ opacity: 0, scale: 0.94, y: 20 }}
                transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
                className={`fixed z-[201] flex items-center justify-center pointer-events-none ${isMinimized ? 'bottom-4 right-4 items-end justify-end' : 'inset-0'}`}
            >
                <div
                    className="pointer-events-auto relative w-full max-w-lg mx-4 rounded-2xl overflow-hidden transition-all duration-300"
                    style={{
                        fontFamily: 'system-ui, -apple-system, sans-serif',
                        background: 'linear-gradient(135deg, rgba(255,255,255,0.13) 0%, rgba(255,255,255,0.05) 50%, rgba(255,255,255,0.10) 100%)',
                        backdropFilter: 'blur(24px) saturate(180%)',
                        WebkitBackdropFilter: 'blur(24px) saturate(180%)',
                        border: '1px solid rgba(255,255,255,0.18)',
                        boxShadow: `
                  inset 1px 1px 0 rgba(255,255,255,0.25),
                  inset -1px -1px 0 rgba(0,0,0,0.15),
                  0 32px 80px rgba(0,0,0,0.6),
                  0 0 0 1px rgba(184,142,67,0.15)
                `,
                    }}
                >
                    {/* Top golden light streak (bevel effect) */}
                    <div
                        className="absolute top-0 left-0 w-full h-[1px] z-10 pointer-events-none"
                        style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.5) 30%, rgba(255,255,255,0.7) 50%, rgba(255,255,255,0.5) 70%, transparent 100%)' }}
                    />

                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
                        <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-full bg-secondary/20 border border-secondary/40 flex items-center justify-center">
                                <Palette className="w-3.5 h-3.5 text-secondary" />
                            </div>
                            <div>
                                <h3 className="text-white font-serif font-bold text-sm uppercase tracking-widest">Tema Visual</h3>
                                <p className="text-white/40 text-[10px] font-serif">Ajustes Globales</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => setIsMinimized(!isMinimized)}
                            title={isMinimized ? "Maximizar" : "Minimizar (Ver Cambios)"}
                            className="w-7 h-7 rounded-full border border-white/15 flex items-center justify-center text-white/40 hover:text-white hover:border-white/40 transition-all group"
                        >
                            {isMinimized ? (
                                <Maximize2 className="w-3.5 h-3.5 group-hover:scale-110 transition-transform duration-200" />
                            ) : (
                                <Minus className="w-3.5 h-3.5 group-hover:scale-110 transition-transform duration-200" />
                            )}
                        </button>
                        <button
                            onClick={onClose}
                            title="Cerrar"
                            className="w-7 h-7 rounded-full border border-white/15 flex items-center justify-center text-white/40 hover:text-white hover:border-white/40 transition-all group"
                        >
                            <X className="w-3.5 h-3.5 group-hover:rotate-90 transition-transform duration-200" />
                        </button>
                    </div>

                    {/* Body */}
                    {!isMinimized && (
                        <>
                            <div className="px-6 py-5 space-y-6 max-h-[65vh] overflow-y-auto">

                                {/* TIPOGRAFIA */}
                                <div>
                                    <div className="flex items-center gap-2 mb-3">
                                        <Type className="w-3.5 h-3.5 text-white/50" />
                                        <span className="text-white/80 text-[11px] font-serif font-bold uppercase tracking-[0.2em]">Tipografías</span>
                                        <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-white/10" />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-[10px] text-white/50 uppercase tracking-wider mb-1.5">Fuente Principal</label>
                                            <select
                                                value={data.themeConfig?.fontFamily || 'Playfair Display'}
                                                onChange={(e) => updateThemeConfig('fontFamily', e.target.value)}
                                                className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-white text-xs focus:border-secondary transition-colors outline-none cursor-pointer"
                                                style={{ fontFamily: data.themeConfig?.fontFamily }}
                                            >
                                                {FONTS.map(font => (
                                                    <option key={font.value} value={font.value} className="bg-[#1a1a1a] text-white">
                                                        {font.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-[10px] text-white/50 uppercase tracking-wider mb-2 flex justify-between">
                                                <span>Tamaño Global</span>
                                                <span className="text-white/80">{data.themeConfig?.fontSizeScale || 100}%</span>
                                            </label>
                                            <input
                                                type="range"
                                                min="70" max="150"
                                                value={data.themeConfig?.fontSizeScale || 100}
                                                onChange={(e) => updateThemeConfig('fontSizeScale', Number(e.target.value))}
                                                className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-secondary"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* CABECERA (HEADER) */}
                                <div>
                                    <div className="flex items-center gap-2 mb-3 mt-4">
                                        <Layout className="w-3.5 h-3.5 text-white/50" />
                                        <span className="text-white/80 text-[11px] font-serif font-bold uppercase tracking-[0.2em]">Diseño de Cabecera</span>
                                        <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-white/10" />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-[10px] text-white/50 uppercase tracking-wider mb-2 flex justify-between">
                                                <span>Alto de Cabecera</span>
                                                <span className="text-white/80">{data.themeConfig?.headerHeight || 120}px</span>
                                            </label>
                                            <input
                                                type="range"
                                                min="70" max="300" step="5"
                                                value={data.themeConfig?.headerHeight || 120}
                                                onChange={(e) => updateThemeConfig('headerHeight', Number(e.target.value))}
                                                className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-secondary"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-[10px] text-white/50 uppercase tracking-wider mb-2 flex justify-between">
                                                <span>Espacio de Menús</span>
                                                <span className="text-white/80">{data.themeConfig?.menuSpacing || 48}px</span>
                                            </label>
                                            <input
                                                type="range"
                                                min="0" max="150" step="2"
                                                value={data.themeConfig?.menuSpacing || 48}
                                                onChange={(e) => updateThemeConfig('menuSpacing', Number(e.target.value))}
                                                className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-secondary"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* COLORES */}
                                <div className="mt-6">
                                    <div className="flex items-center gap-2 mb-3">
                                        <Droplet className="w-3.5 h-3.5 text-white/50" />
                                        <span className="text-white/80 text-[11px] font-serif font-bold uppercase tracking-[0.2em]">Colores de Acento</span>
                                        <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-white/10" />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-[10px] text-white/50 uppercase tracking-wider mb-1.5">Acento Principal</label>
                                            <div className="flex items-center gap-3 bg-black/30 border border-white/10 p-1.5 rounded-lg">
                                                <input
                                                    type="color"
                                                    value={data.themeConfig?.primaryColor || '#ff3f98'}
                                                    onChange={(e) => updateThemeConfig('primaryColor', e.target.value)}
                                                    className="w-8 h-8 rounded border-0 bg-transparent cursor-pointer"
                                                />
                                                <span className="text-xs text-white/70 font-mono uppercase">
                                                    {data.themeConfig?.primaryColor || '#ff3f98'}
                                                </span>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-[10px] text-white/50 uppercase tracking-wider mb-1.5">Acento Secundario</label>
                                            <div className="flex items-center gap-3 bg-black/30 border border-white/10 p-1.5 rounded-lg">
                                                <input
                                                    type="color"
                                                    value={data.themeConfig?.secondaryColor || '#d4af37'}
                                                    onChange={(e) => updateThemeConfig('secondaryColor', e.target.value)}
                                                    className="w-8 h-8 rounded border-0 bg-transparent cursor-pointer"
                                                />
                                                <span className="text-xs text-white/70 font-mono uppercase">
                                                    {data.themeConfig?.secondaryColor || '#d4af37'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* HERO OVERLAYS */}
                                <div>
                                    <div className="flex items-center gap-2 mb-3">
                                        <Layout className="w-3.5 h-3.5 text-white/50" />
                                        <span className="text-white/80 text-[11px] font-serif font-bold uppercase tracking-[0.2em]">Filtros de Portada</span>
                                        <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-white/10" />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-[10px] text-white/50 uppercase tracking-wider mb-1.5">Color Oscurecimiento</label>
                                            <div className="flex items-center gap-3 bg-black/30 border border-white/10 p-1.5 rounded-lg">
                                                <input
                                                    type="color"
                                                    value={data.themeConfig?.heroGradientStart || '#000000'}
                                                    onChange={(e) => updateThemeConfig('heroGradientStart', e.target.value)}
                                                    className="w-8 h-8 rounded border-0 bg-transparent cursor-pointer"
                                                />
                                                <span className="text-xs text-white/70 font-mono uppercase">
                                                    {data.themeConfig?.heroGradientStart || '#000000'}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex flex-col justify-end pb-2">
                                            <label className="block text-[10px] text-white/50 uppercase tracking-wider mb-2 flex justify-between">
                                                <span>Opacidad</span>
                                                <span className="text-white/80">{data.themeConfig?.heroOverlayOpacity ?? 80}%</span>
                                            </label>
                                            <input
                                                type="range"
                                                min="0" max="100"
                                                value={data.themeConfig?.heroOverlayOpacity ?? 80}
                                                onChange={(e) => updateThemeConfig('heroOverlayOpacity', Number(e.target.value))}
                                                className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-secondary"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="sticky bottom-0 px-6 py-4 border-t border-white/10 bg-black/90 md:bg-black/20 flex flex-col md:flex-row items-center justify-between gap-3 mt-0">
                                <button
                                    onClick={() => {
                                        updateThemeConfig('fontFamily', 'Playfair Display');
                                        updateThemeConfig('fontSizeScale', 100);
                                        updateThemeConfig('primaryColor', '#ff3f98');
                                        updateThemeConfig('secondaryColor', '#d4af37');
                                        updateThemeConfig('heroGradientStart', '#000000');
                                        updateThemeConfig('heroOverlayOpacity', 80);
                                        updateThemeConfig('headerHeight', 120);
                                        updateThemeConfig('menuSpacing', 48);
                                        updateThemeConfig('menuOffsetXLeft', 0);
                                        updateThemeConfig('menuOffsetXRight', 0);
                                        updateThemeConfig('heroOffsetY', 0);
                                    }}
                                    className="flex items-center gap-1.5 text-[9px] font-serif uppercase tracking-wider text-rose-400 hover:text-rose-300 transition-colors"
                                >
                                    <RotateCcw className="w-3 h-3" />
                                    Restaurar Valores por Defecto
                                </button>
                                <button
                                    onClick={onClose}
                                    className="w-full md:w-auto px-5 py-2.5 bg-secondary text-[#1a1a1a] hover:bg-white rounded-lg text-xs font-serif font-bold uppercase tracking-wider transition-all"
                                >
                                    Listo
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </motion.div>}
        </AnimatePresence >
    );
};

export default ThemeEditorDialog;
