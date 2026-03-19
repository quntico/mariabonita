
import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Link2, RotateCcw, Image, FileText, PaintBucket, Layers, Type } from 'lucide-react';
import { useEditableContent } from '@/contexts/EditableContent.jsx';
import { compressImage } from '@/lib/imageCompressor.js';
import { uploadFile } from '@/lib/storage.js';
import { Input } from '@/components/ui/input.jsx';

const UploadZone = ({ preview, label, hint, onUrl, onFile, onReset }) => {
    const [tab, setTab] = useState('upload'); // 'upload' | 'url'
    const [urlInput, setUrlInput] = useState('');
    const fileRef = useRef(null);

    const handleFile = async (e) => {
        const file = e.target.files?.[0];
        if (e.target) e.target.value = '';
        if (!file) return;
        try {
            const compressedUrl = await compressImage(file, 1600, 0.7);
            const storageUrl = await uploadFile(compressedUrl);
            onFile(storageUrl);
        } catch (error) {
            console.error("Error processing poster bg:", error);
            alert("No se pudo procesar esta imagen.");
        }
    };

    const handleApplyUrl = () => {
        if (urlInput.trim()) { onUrl(urlInput.trim()); setUrlInput(''); }
    };

    return (
        <div className="space-y-3">
            {/* Preview card */}
            <div className="flex items-center gap-4 p-3 rounded-lg border border-white/10 bg-white/5">
                <div className="w-20 h-14 rounded-md border border-white/20 overflow-hidden bg-[#1a1a1a] flex items-center justify-center flex-shrink-0 shadow-inner">
                    {preview ? (
                        <img src={preview} alt={label} className="w-full h-full object-cover" />
                    ) : (
                        <Image className="w-6 h-6 text-white/20" />
                    )}
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-white/80 text-xs font-serif font-bold uppercase tracking-wider">{label}</p>
                    <p className="text-white/35 text-[10px] font-serif mt-0.5 leading-relaxed">{hint}</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-white/10">
                {[
                    { key: 'upload', label: 'Subir archivo', icon: Upload },
                    { key: 'url', label: 'Desde URL', icon: Link2 },
                ].map(({ key, label, icon: Icon }) => (
                    <button
                        key={key}
                        onClick={() => setTab(key)}
                        className={`flex items-center gap-1.5 px-3 py-2 text-[10px] font-serif font-bold uppercase tracking-wider border-b-2 transition-all ${tab === key
                            ? 'text-secondary border-secondary'
                            : 'text-white/35 border-transparent hover:text-white/55'
                            }`}
                    >
                        <Icon className="w-3 h-3" />
                        {label}
                    </button>
                ))}
            </div>

            {/* Tab content */}
            {tab === 'upload' ? (
                <div className="space-y-2">
                    <input
                        ref={fileRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFile}
                        onClick={(e) => { e.target.value = null; }}
                        className="hidden"
                    />
                    <button
                        onClick={() => fileRef.current?.click()}
                        className="w-full py-4 border border-dashed border-white/20 rounded-lg text-white/40 hover:border-secondary/50 hover:text-white/60 transition-all flex flex-col items-center gap-1.5 group bg-white/3 hover:bg-white/5"
                    >
                        <Upload className="w-5 h-5 group-hover:text-secondary transition-colors" />
                        <span className="text-[11px] font-serif uppercase tracking-wider">Seleccionar imagen</span>
                        <span className="text-[9px] text-white/25">JPG, PNG, WEBP — Imágenes de alta resolución</span>
                    </button>
                </div>
            ) : (
                <div className="space-y-2">
                    <div className="flex gap-2">
                        <Input
                            type="url"
                            value={urlInput}
                            onChange={(e) => setUrlInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleApplyUrl()}
                            placeholder="https://images.unsplash.com/..."
                            className="h-9 bg-white/5 border-white/10 text-white text-xs placeholder:text-white/20 focus-visible:ring-secondary/40"
                        />
                        <button
                            onClick={handleApplyUrl}
                            className="bg-secondary text-[#1a1a1a] px-3 py-1 rounded-sm text-[10px] font-bold uppercase tracking-wider hover:bg-secondary/90 transition-colors"
                        >
                            Listo
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

const PosterEditorDialog = ({ open, onClose }) => {
    const { data, updatePosterConfig } = useEditableContent();
    const [activeTab, setActiveTab] = useState('text'); // 'text' | 'bg'

    if (!open) return null;

    const handleReset = () => {
        if (confirm("¿Estás seguro de restablecer los valores del PDF a los originales?")) {
            updatePosterConfig('tagline', "Tacos & Antojitos Mexicanos");
            updatePosterConfig('titlePart1', "SI CAES QUE SEA EN LA TENTACIÓN");
            updatePosterConfig('bannerText', "DE UNOS");
            updatePosterConfig('titlePart2', "TACOS");
            updatePosterConfig('footerText', "¡GRACIAS POR SU PREFERENCIA!");
            updatePosterConfig('bgColor', "#1a1a1a");
            updatePosterConfig('bgOpacity', 0);
            updatePosterConfig('bgImage', "");
        }
    };

    const tabs = [
        { id: 'text', label: 'Frases / Títulos', icon: Type },
        { id: 'bg', label: 'Fondo / Diseño', icon: Layers },
    ];

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                />

                {/* Dialog Content */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative w-full max-w-lg bg-[#1a1a1a] border border-secondary/30 rounded-lg shadow-[0_0_50px_rgba(0,0,0,1)] overflow-hidden"
                >
                    {/* Golden top accent */}
                    <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-secondary to-transparent z-10" />

                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#251a14]/50">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-secondary/10 rounded-sm">
                                <FileText className="w-5 h-5 text-secondary" />
                            </div>
                            <div>
                                <h3 className="text-white font-serif font-bold text-lg leading-tight uppercase tracking-wider">Editor de Plantilla PDF</h3>
                                <p className="text-white/30 text-[10px] uppercase font-bold tracking-widest mt-0.5">Control visual y de contenido</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                             <button 
                                onClick={() => {
                                    onClose();
                                    document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' });
                                }}
                                className="px-3 py-1.5 border border-secondary/30 text-secondary hover:bg-secondary/10 rounded-sm text-[10px] font-bold uppercase tracking-widest transition-all"
                             >
                                Ir al Menú (Vista previa)
                             </button>
                             <button onClick={onClose} className="p-2 text-white/30 hover:text-white transition-colors hover:rotate-90 duration-300">
                                <X className="w-5 h-5" />
                             </button>
                        </div>
                    </div>

                    {/* Tabs navigation */}
                    <div className="flex px-6 border-b border-white/5 bg-[#1f1610]/30">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-4 py-3 text-[10px] font-bold uppercase tracking-widest border-b-2 transition-all ${activeTab === tab.id
                                    ? 'text-secondary border-secondary bg-secondary/5'
                                    : 'text-white/30 border-transparent hover:text-white/60 hover:bg-white/3'
                                    }`}
                            >
                                <tab.icon className="w-3.5 h-3.5" />
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Scrollable Body */}
                    <div className="p-6 max-h-[65vh] overflow-y-auto custom-scrollbar">
                        <div className="space-y-8">
                            {activeTab === 'text' ? (
                                <div className="space-y-5">
                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase font-bold tracking-wider text-white/40 ml-1">Parte Superior (Tagline)</label>
                                        <Input 
                                            value={data.posterConfig?.tagline || ""} 
                                            onChange={(e) => updatePosterConfig('tagline', e.target.value)}
                                            placeholder="Tacos & Antojitos Mexicanos"
                                            className="!bg-black/60 border-white/20 text-white font-serif h-11 focus-visible:ring-secondary/40 placeholder:text-white/20"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase font-bold tracking-wider text-white/40 ml-1">Título Principal (Línea 1)</label>
                                        <Input 
                                            value={data.posterConfig?.titlePart1 || ""} 
                                            onChange={(e) => updatePosterConfig('titlePart1', e.target.value)}
                                            placeholder="SI CAES QUE SEA EN LA TENTACIÓN"
                                            className="!bg-black/60 border-white/20 text-white font-serif h-11 focus-visible:ring-secondary/40 placeholder:text-white/20"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase font-bold tracking-wider text-white/40 ml-1">Banner Central (Fondo Rosa)</label>
                                        <Input 
                                            value={data.posterConfig?.bannerText || ""} 
                                            onChange={(e) => updatePosterConfig('bannerText', e.target.value)}
                                            placeholder="DE UNOS"
                                            className="!bg-black/60 border-white/20 text-white font-serif h-11 focus-visible:ring-secondary/40 placeholder:text-white/20"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase font-bold tracking-wider text-white/40 ml-1">Título Grande (Línea 2)</label>
                                        <Input 
                                            value={data.posterConfig?.titlePart2 || ""} 
                                            onChange={(e) => updatePosterConfig('titlePart2', e.target.value)}
                                            placeholder="TACOS"
                                            className="!bg-black/60 border-white/20 text-white font-serif h-11 focus-visible:ring-secondary/40 placeholder:text-white/20"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase font-bold tracking-wider text-white/40 ml-1">Texto de Cierre (Footer)</label>
                                        <Input 
                                            value={data.posterConfig?.footerText || ""} 
                                            onChange={(e) => updatePosterConfig('footerText', e.target.value)}
                                            placeholder="¡GRACIAS POR SU PREFERENCIA!"
                                            className="!bg-black/60 border-white/20 text-white font-serif h-11 focus-visible:ring-secondary/40 placeholder:text-white/20"
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    <div className="p-4 rounded-lg bg-[#2a1a0e]/30 border border-secondary/10 space-y-5">
                                        <div className="flex items-center gap-3">
                                            <PaintBucket className="w-4 h-4 text-secondary" />
                                            <span className="text-xs font-serif font-bold text-white uppercase tracking-widest">Colores del Fondo</span>
                                        </div>
                                        
                                        <div className="grid grid-cols-2 gap-4 pt-2">
                                            <div className="space-y-2">
                                                <label className="text-[10px] uppercase font-bold tracking-wider text-white/30 ml-1">Color Base</label>
                                                <div className="flex gap-2">
                                                    <div className="w-10 h-10 rounded-sm border border-white/20 relative overflow-hidden flex-shrink-0" style={{ backgroundColor: data.posterConfig?.bgColor }}>
                                                        <input 
                                                            type="color" 
                                                            value={data.posterConfig?.bgColor || "#1a1a1a"}
                                                            onChange={(e) => updatePosterConfig('bgColor', e.target.value)}
                                                            className="absolute inset-x-0 inset-y-0 opacity-0 cursor-pointer scale-150" 
                                                        />
                                                    </div>
                                                    <Input 
                                                        value={data.posterConfig?.bgColor || "#1a1a1a"}
                                                        onChange={(e) => updatePosterConfig('bgColor', e.target.value)}
                                                        className="h-10 bg-white/5 border-white/10 text-white font-mono text-[10px]"
                                                    />
                                                </div>
                                            </div>
                                            
                                            <div className="space-y-3">
                                                <label className="text-[10px] uppercase font-bold tracking-wider text-white/30 ml-1">Oscurecimiento: {data.posterConfig?.bgOpacity || 0}%</label>
                                                <div className="pt-2 px-1">
                                                    <input
                                                        type="range"
                                                        min="0"
                                                        max="95"
                                                        step="5"
                                                        value={data.posterConfig?.bgOpacity || 0}
                                                        onChange={(e) => updatePosterConfig('bgOpacity', parseInt(e.target.value))}
                                                        className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-secondary"
                                                    />
                                                </div>
                                                <p className="text-[8px] text-white/20 uppercase tracking-tighter">Ayuda a la legibilidad del texto</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-2">
                                        <UploadZone
                                            label="Imagen de Fondo del PDF"
                                            hint="Esta imagen se verá detrás de todo el contenido del menú exportado."
                                            preview={data.posterConfig?.bgImage}
                                            onFile={(url) => updatePosterConfig('bgImage', url)}
                                            onUrl={(url) => updatePosterConfig('bgImage', url)}
                                        />
                                        {data.posterConfig?.bgImage && (
                                            <button
                                                onClick={() => updatePosterConfig('bgImage', '')}
                                                className="mt-3 w-full py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-[10px] font-bold uppercase tracking-wider rounded-sm transition-colors border border-rose-500/20"
                                            >
                                                Quitar imagen de fondo
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Reset button at bottom of active content */}
                            <div className="pt-4 mt-6 border-t border-white/5">
                                <button
                                    onClick={handleReset}
                                    className="flex items-center gap-2 text-white/20 hover:text-white/50 transition-colors text-[9px] font-bold uppercase tracking-widest"
                                >
                                    <RotateCcw className="w-3 h-3" />
                                    Restablecer plantilla original
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Footer / Info */}
                    <div className="px-8 py-5 bg-[#251a14]/60 flex items-center justify-between border-t border-white/5">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-secondary font-bold text-[10px] uppercase tracking-widest">Vista Previa</span>
                          <span className="text-white/30 text-[9px] font-serif italic italic leading-none">Los cambios afectan al PNG y PDF automáticamente.</span>
                        </div>
                        <button
                            onClick={onClose}
                            className="bg-secondary text-[#1a1a1a] px-8 py-3 rounded-sm font-serif font-bold uppercase tracking-widest text-xs hover:bg-secondary/90 transition-all shadow-[0_4px_20px_rgba(184,142,67,0.3)] hover:-translate-y-0.5 active:translate-y-0"
                        >
                            Ver Resultado
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default PosterEditorDialog;
