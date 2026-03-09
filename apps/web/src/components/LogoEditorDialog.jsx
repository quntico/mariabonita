
import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Link2, RotateCcw, Image, Star, Minus, Maximize2 } from 'lucide-react';
import { useEditableContent } from '@/contexts/EditableContent.jsx';
import { compressImage } from '@/lib/imageCompressor.js';
import { uploadFile } from '@/lib/storage.js';

const UploadZone = ({ preview, label, hint, onUrl, onFile, onReset, defaultPreview }) => {
    const [tab, setTab] = useState('upload'); // 'upload' | 'url'
    const [urlInput, setUrlInput] = useState('');
    const fileRef = useRef(null);

    const handleFile = async (e) => {
        const file = e.target.files?.[0];
        // Limpiamos el input INMEDIATAMENTE para que el usuario pueda volver a hacer clic sin quedarse trabado
        if (e.target) e.target.value = '';
        if (!file) return;

        try {
            // Comprimir logo o favicon a max 800px ancho (que es mas que suficiente para logo web)
            const compressedUrl = await compressImage(file, 800, 0.8);
            const storageUrl = await uploadFile(compressedUrl);
            onFile(storageUrl);
        } catch (error) {
            console.error("Error procesando imagen:", error);
            alert("No se pudo procesar esta imagen. Intenta con otra o desde URL.");
        }
    };

    const handleApplyUrl = () => {
        if (urlInput.trim()) { onUrl(urlInput.trim()); setUrlInput(''); }
    };

    return (
        <div className="space-y-3">
            {/* Preview card */}
            <div className="flex items-center gap-4 p-3 rounded-lg border border-white/10 bg-white/5">
                <div className="w-20 h-14 rounded-md border border-white/20 overflow-hidden bg-[#2a1a0e] flex items-center justify-center flex-shrink-0 shadow-inner">
                    {preview ? (
                        <img src={preview} alt={label} className="w-full h-full object-contain" />
                    ) : defaultPreview ? (
                        <img src={defaultPreview} alt={label} className="w-full h-full object-contain opacity-40" />
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
                        <span className="text-[9px] text-white/25">PNG, JPG, SVG, WEBP — recomendado fondo transparente</span>
                    </button>
                </div>
            ) : (
                <div className="space-y-2">
                    <input
                        type="url"
                        value={urlInput}
                        onChange={(e) => setUrlInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleApplyUrl()}
                        placeholder="https://..."
                        className="w-full bg-white/5 border border-white/15 rounded-lg px-3 py-2 text-white placeholder-white/20 text-xs font-serif focus:outline-none focus:border-secondary/60 transition"
                    />
                    <button
                        onClick={handleApplyUrl}
                        disabled={!urlInput.trim()}
                        className="w-full py-2 bg-secondary/90 text-[#1a1a1a] font-serif font-bold uppercase tracking-wider text-[10px] rounded-lg hover:bg-secondary transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                        Aplicar URL
                    </button>
                </div>
            )}

            {/* Reset */}
            {preview && (
                <button
                    onClick={onReset}
                    className="flex items-center gap-1.5 text-white/30 hover:text-rose-400 text-[10px] font-serif uppercase tracking-wider transition-colors w-full justify-center py-1 border border-white/10 rounded-lg hover:border-rose-500/30"
                >
                    <RotateCcw className="w-3 h-3" />
                    Eliminar y restaurar original
                </button>
            )}
        </div>
    );
};

const LogoEditorDialog = ({ open, onClose }) => {
    const { data, updateLogoUrl, updateLogoTransform, updateFaviconUrl } = useEditableContent();
    const [isMinimized, setIsMinimized] = useState(false);

    return (
        <AnimatePresence>
            {open && <motion.div
                key="backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={onClose}
                className="fixed inset-0 z-[200] bg-black/40 backdrop-blur-[2px]"
            />}

            {open && <motion.div
                key="dialog"
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
                        /* Cristal biselado 30%: fondo semitransparente + blur + borde luminoso */
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
                    {/* Left bevel streak */}
                    <div
                        className="absolute top-0 left-0 w-[1px] h-full z-10 pointer-events-none"
                        style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.4) 0%, transparent 60%)' }}
                    />
                    {/* Bottom-right inner shadow (depth) */}
                    <div
                        className="absolute bottom-0 right-0 w-full h-[1px] z-10 pointer-events-none"
                        style={{ background: 'linear-gradient(90deg, transparent 30%, rgba(0,0,0,0.3) 100%)' }}
                    />

                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
                        <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-full bg-secondary/20 border border-secondary/40 flex items-center justify-center">
                                <Star className="w-3.5 h-3.5 text-secondary" />
                            </div>
                            <div>
                                <h3 className="text-white font-serif font-bold text-sm uppercase tracking-widest">Editor de Marca</h3>
                                <p className="text-white/40 text-[10px] font-serif">Logo · Favicon</p>
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
                    </div>

                    {/* Body */}
                    {!isMinimized && (
                        <>
                            <div className="px-6 py-5 space-y-6 max-h-[65vh] overflow-y-auto">

                                {/* Logo section */}
                                <div>
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="h-[1px] flex-1 bg-gradient-to-r from-secondary/40 to-transparent" />
                                        <span className="text-secondary text-[10px] font-serif font-bold uppercase tracking-[0.2em] px-2">Logotipo</span>
                                        <div className="h-[1px] flex-1 bg-gradient-to-l from-secondary/40 to-transparent" />
                                    </div>
                                    <UploadZone
                                        preview={data.logoUrl}
                                        label="Logo principal"
                                        hint="Se mostrará en el header. Recomendado: PNG con fondo transparente, mínimo 300×120 px."
                                        onUrl={updateLogoUrl}
                                        onFile={updateLogoUrl}
                                        onReset={() => updateLogoUrl(null)}
                                    />

                                    {/* Logo Transform Controls */}
                                    {data.logoUrl && (
                                        <div className="mt-4 p-4 rounded-xl border border-white/5 bg-black/20 space-y-4 shadow-inner">
                                            <p className="text-[10px] text-white/50 font-serif uppercase tracking-widest mb-1 flex items-center gap-2">
                                                <span className="w-1.5 h-1.5 rounded-full bg-secondary/50"></span>
                                                Ajustes de Logo en Header
                                            </p>

                                            {/* Horizontal (X) */}
                                            <div className="space-y-1.5">
                                                <div className="flex justify-between text-[10px] text-white/70 font-mono">
                                                    <span>Mover Izquierda / Derecha</span>
                                                    <span>{data.logoTransform?.x || 0}px</span>
                                                </div>
                                                <input
                                                    type="range"
                                                    min="-400" max="400"
                                                    value={data.logoTransform?.x || 0}
                                                    onChange={(e) => updateLogoTransform('x', Number(e.target.value))}
                                                    className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-secondary"
                                                />
                                            </div>

                                            {/* Vertical (Y) */}
                                            <div className="space-y-1.5">
                                                <div className="flex justify-between text-[10px] text-white/70 font-mono">
                                                    <span>Mover Arriba / Abajo</span>
                                                    <span>{data.logoTransform?.y || 0}px</span>
                                                </div>
                                                <input
                                                    type="range"
                                                    min="-200" max="200"
                                                    value={data.logoTransform?.y || 0}
                                                    onChange={(e) => updateLogoTransform('y', Number(e.target.value))}
                                                    className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-secondary"
                                                />
                                            </div>

                                            {/* Escala */}
                                            <div className="space-y-1.5">
                                                <div className="flex justify-between text-[10px] text-white/70 font-mono">
                                                    <span>Tamaño</span>
                                                    <span>{data.logoTransform?.scale || 100}%</span>
                                                </div>
                                                <input
                                                    type="range"
                                                    min="10" max="800"
                                                    value={data.logoTransform?.scale || 100}
                                                    onChange={(e) => updateLogoTransform('scale', Number(e.target.value))}
                                                    className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-secondary"
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Divider */}
                                <div className="w-full h-[1px] bg-white/10 rounded" />

                                {/* Favicon section */}
                                <div>
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="h-[1px] flex-1 bg-gradient-to-r from-primary/40 to-transparent" />
                                        <span className="text-primary text-[10px] font-serif font-bold uppercase tracking-[0.2em] px-2">Favicon</span>
                                        <div className="h-[1px] flex-1 bg-gradient-to-l from-primary/40 to-transparent" />
                                    </div>
                                    <UploadZone
                                        preview={data.faviconUrl}
                                        label="Ícono de pestaña"
                                        hint="Aparece en la pestaña del navegador. Recomendado: PNG cuadrado 64×64 px o ICO."
                                        onUrl={updateFaviconUrl}
                                        onFile={updateFaviconUrl}
                                        onReset={() => updateFaviconUrl(null)}
                                    />
                                </div>

                            </div>

                            {/* Footer */}
                            <div className="sticky bottom-0 bg-[#1a1a1a] px-6 py-4 border-t border-white/10 flex items-center justify-between mt-0">
                                <p className="text-white/25 text-[9px] font-serif uppercase tracking-wider">
                                    Los cambios se guardan automáticamente
                                </p>
                                <button
                                    onClick={onClose}
                                    className="px-5 py-2 bg-white/10 hover:bg-white/15 border border-white/15 rounded-lg text-white/70 hover:text-white text-xs font-serif uppercase tracking-wider transition-all"
                                >
                                    Cerrar
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </motion.div>}
        </AnimatePresence>
    );
};

export default LogoEditorDialog;
