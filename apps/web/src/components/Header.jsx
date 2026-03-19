
import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Pencil, Check, Lock, Image, Link2, Upload, Eye, EyeOff, Palette, Smartphone, Monitor, Heart, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';
import { useEditableContent } from '@/contexts/EditableContent.jsx';
import { motion, AnimatePresence } from 'framer-motion';
import LogoEditorDialog from '@/components/LogoEditorDialog.jsx';
import ThemeEditorDialog from '@/components/ThemeEditorDialog.jsx';
import { compressImage } from '@/lib/imageCompressor.js';
import { uploadFile } from '@/lib/storage.js';
import PosterEditorDialog from '@/components/PosterEditorDialog.jsx';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const {
    editMode,
    setEditMode,
    data,
    updateHeroBackground,
    updateThemeConfig,
    addHeroDecoration,
    mobilePreview,
    setMobilePreview
  } = useEditableContent();

  // Logo editor dialog
  const [showLogoEditor, setShowLogoEditor] = useState(false);
  // Theme editor dialog
  const [showThemeEditor, setShowThemeEditor] = useState(false);
  // Poster editor dialog
  const [showPosterEditor, setShowPosterEditor] = useState(false);

  // Password modal state
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [shaking, setShaking] = useState(false);

  // Editor panel state
  const [showBgPanel, setShowBgPanel] = useState(false);
  const [panelSection, setPanelSection] = useState('fondo'); // 'fondo' | 'img-left' | 'img-right'
  const [bgUrlInput, setBgUrlInput] = useState('');
  const [newDecUrl, setNewDecUrl] = useState('');
  const [bgTab, setBgTab] = useState('url'); // 'url' | 'upload'
  const fileInputRef = useRef(null);
  const fileDecRef = useRef(null);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  };

  const handleEditorIconClick = () => {
    if (editMode) {
      // Exit edit mode
      setEditMode(false);
      setShowBgPanel(false);
    } else {
      // Show password modal
      setPassword('');
      setPasswordError('');
      setShowPasswordModal(true);
    }
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (password === '2020' || password === '2021') {
      setEditMode(true);
      setShowPasswordModal(false);
      setPassword('');
      setPasswordError('');
    } else {
      setPasswordError('Contraseña incorrecta. Intenta de nuevo.');
      setShaking(true);
      setTimeout(() => setShaking(false), 600);
    }
  };

  const handleApplyUrl = () => {
    if (bgUrlInput.trim()) {
      updateHeroBackground(bgUrlInput.trim());
      setBgUrlInput('');
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (e.target) e.target.value = ''; // Limpiar pre-await
    if (!file) return;

    try {
      const compressedDataUrl = await compressImage(file, 1600, 0.7);
      const storageUrl = await uploadFile(compressedDataUrl);
      updateHeroBackground(storageUrl);
    } catch (error) {
      console.error("Error processing image:", error);
      alert("No se pudo procesar esta imagen. Intenta con otra o desde URL.");
    }
  };

  const handleDecUrlApply = () => {
    if (newDecUrl.trim()) { addHeroDecoration(newDecUrl.trim()); setNewDecUrl(''); }
  };

  const handleDecFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (e.target) e.target.value = '';
    if (!file) return;

    try {
      const compressedDataUrl = await compressImage(file, 800, 0.8);
      const storageUrl = await uploadFile(compressedDataUrl);
      addHeroDecoration(storageUrl);
    } catch (error) {
      console.error("Error processing image:", error);
      alert("No se pudo procesar esta imagen. Intenta con otra o desde URL.");
    }
  };

  return (
    <>
      <header className="sticky top-0 z-[100] bg-[#1a1a1a] text-white border-b border-secondary/30 shadow-gold overflow-visible">
        {/* Elegant Golden Top Accent */}
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-secondary to-transparent z-[101] opacity-70"></div>

        <div className="container mx-auto px-4 relative z-20 overflow-visible">
          <div
            className="flex items-center justify-between relative transition-all duration-300 py-2 md:py-0 overflow-visible"
            style={{ minHeight: `${window.innerWidth < 768 ? 100 : (data.themeConfig?.headerHeight || 120)}px` }}
          >
            {/* ── VERSION BADGE (Beating LED) ── */}
            <div className="absolute left-8 top-1/2 -translate-y-1/2 flex items-center gap-3 pointer-events-none z-[150]">
              <div className="relative flex items-center justify-center">
                <div className="absolute w-5 h-5 bg-[#ff3f98] rounded-full blur-[6px] animate-pulse opacity-60"></div>
                <div className="relative w-3 h-3 bg-[#ff3f98] rounded-full shadow-[0_0_15px_#ff3f98] border border-white/40"></div>
              </div>
              <span className="text-[11px] font-mono font-bold text-white tracking-widest drop-shadow-md">VER 1.0</span>
            </div>

            {/* ── LEFT DESKTOP MENU (Inicio, Menú) ── */}
            <motion.nav
              drag={editMode ? "x" : false}
              dragMomentum={false}
              dragConstraints={{ left: -500, right: 500 }}
              initial={{ x: data.themeConfig?.menuOffsetXLeft || 0 }}
              animate={{ x: data.themeConfig?.menuOffsetXLeft || 0 }}
              onDragEnd={(e, info) => {
                const currentX = data.themeConfig?.menuOffsetXLeft || 0;
                updateThemeConfig('menuOffsetXLeft', currentX + info.offset.x);
              }}
              className={`hidden md:flex flex-1 items-center justify-end relative z-50 ${editMode ? 'cursor-grab active:cursor-grabbing hover:bg-white/5 rounded-lg' : 'pointer-events-auto'}`}
              style={{ gap: `${data.themeConfig?.menuSpacing || 48}px`, paddingRight: `${data.themeConfig?.menuSpacing || 48}px` }}
            >
              {['Inicio', 'Menú'].map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => scrollToSection(item === 'Nosotros' ? 'about' : item.toLowerCase())}
                  className={`text-sm md:text-base font-serif font-bold hover:text-secondary py-2 relative group uppercase tracking-widest transition-colors duration-300 transform hover:scale-105 ${editMode ? 'pointer-events-none' : ''}`}
                  style={{ color: 'hsl(var(--nav-text))' }}
                >
                  {item}
                  <span className="absolute bottom-0 left-1/2 w-0 h-[2px] bg-secondary transform -translate-x-1/2 group-hover:w-full transition-all duration-300 ease-out"></span>
                </button>
              ))}
            </motion.nav>

            {/* Logo — click to edit in editor mode */}
            {/* We add pointer-events-none to prevent large invisible bounding boxes from blocking clicks on the rest of the header, but re-enable it on the logo directly */}
            <div className="absolute left-1/2 -translate-x-1/2 flex-shrink-0 flex items-center justify-center z-40 pointer-events-none w-auto h-full">
              <div className="flex items-center space-x-2 group pointer-events-auto">
                {data.logoUrl ? (
                  /* Custom uploaded logo (sin fondo) */
                  <motion.div 
                    drag={editMode}
                    dragMomentum={false}
                    dragElastic={0}
                    dragTransition={{ power: 0 }}
                    onDragEnd={(e, info) => {
                      updateLogoTransform('x', (data.logoTransform?.x || 0) + info.offset.x);
                      updateLogoTransform('y', (data.logoTransform?.y || 0) + info.offset.y);
                    }}
                    initial={{ 
                      x: data.logoTransform?.x || 0, 
                      y: data.logoTransform?.y || 0,
                      scale: (data.logoTransform?.scale || 100) / 100
                    }}
                    animate={{ 
                      x: data.logoTransform?.x || 0, 
                      y: data.logoTransform?.y || 0,
                      scale: (data.logoTransform?.scale || 100) / 100
                    }}
                    className={`relative flex flex-col items-center justify-center transition-all duration-500 ${editMode ? 'cursor-grab active:cursor-grabbing pointer-events-auto border-2 border-secondary/50 rounded-lg p-2' : ''}`}
                    style={{ transformOrigin: 'center center' }}
                  >
                    {/* Canva-style Resize Handles */}
                    {editMode && (
                      <>
                        <div className="absolute -top-2 -left-2 w-4 h-4 bg-secondary rounded-full shadow-lg border-2 border-white z-[60]"></div>
                        <div className="absolute -top-2 -right-2 w-4 h-4 bg-secondary rounded-full shadow-lg border-2 border-white z-[60]"></div>
                        <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-secondary rounded-full shadow-lg border-2 border-white z-[60]"></div>
                        <motion.div 
                          drag
                          dragMomentum={false}
                          dragElastic={0}
                          onDragStart={(e) => e.stopPropagation()}
                          onDrag={(e, info) => {
                            e.stopPropagation();
                            const sensitivity = 1.5;
                            const newScale = Math.max(20, (data.logoTransform?.scale || 100) + (info.delta.x + info.delta.y) * sensitivity);
                            updateLogoTransform('scale', newScale);
                          }}
                          className="absolute -bottom-3 -right-3 w-7 h-7 bg-secondary rounded-full shadow-2xl border-4 border-white z-[70] cursor-nwse-resize flex items-center justify-center hover:scale-125 transition-transform"
                        >
                          <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                        </motion.div>
                      </>
                    )}

                    {!editMode ? (
                      <Link to="/" onClick={(e) => scrollToSection('hero')}>
                        <img
                          src={data.logoUrl}
                          alt="Maria Bonita Logo"
                          className="h-20 md:h-24 lg:h-32 w-auto object-contain z-10 drop-shadow-md transition-transform duration-300"
                        />
                      </Link>
                    ) : (
                      <img
                        src={data.logoUrl}
                        alt="Maria Bonita Logo"
                        className="h-20 md:h-24 lg:h-32 w-auto object-contain z-10 drop-shadow-md transition-transform duration-300"
                      />
                    )}
                  </motion.div>
                ) : (
                  /* Default text logo */
                  <motion.div 
                    drag={editMode}
                    dragMomentum={false}
                    dragElastic={0}
                    dragTransition={{ power: 0 }}
                    onDragEnd={(e, info) => {
                      updateLogoTransform('x', (data.logoTransform?.x || 0) + info.offset.x);
                      updateLogoTransform('y', (data.logoTransform?.y || 0) + info.offset.y);
                    }}
                    initial={{ 
                      x: data.logoTransform?.x || 0, 
                      y: data.logoTransform?.y || 0,
                      scale: 1
                    }}
                    animate={{ 
                      x: data.logoTransform?.x || 0, 
                      y: data.logoTransform?.y || 0,
                      scale: 1
                    }}
                    className={`flex flex-col items-center justify-center transition-all duration-500 group ${editMode ? 'cursor-grab active:cursor-grabbing pointer-events-auto' : ''}`}
                    style={{ transformOrigin: 'center center' }}
                  >
                    {!editMode ? (
                      <Link to="/" onClick={(e) => scrollToSection('hero')} className="flex flex-col items-center">
                        <span className="text-xl md:text-4xl font-serif font-bold tracking-[0.2em] uppercase z-10 drop-shadow-lg transition-colors duration-500"
                          style={{ color: 'hsl(var(--logo-text))' }}>
                          {data.businessInfo?.name || "MARIA BONITA"}
                        </span>
                        <div className="h-[1px] w-1/2 bg-gradient-to-r from-transparent via-secondary to-transparent mt-1"></div>
                      </Link>
                    ) : (
                      <>
                        <span className="text-xl md:text-4xl font-serif font-bold tracking-[0.2em] uppercase z-10 drop-shadow-lg transition-colors duration-500"
                          style={{ color: 'hsl(var(--logo-text))' }}>
                          {data.businessInfo?.name || "MARIA BONITA"}
                        </span>
                        <div className="h-[1px] w-1/2 bg-gradient-to-r from-transparent via-secondary to-transparent mt-1"></div>
                      </>
                    )}
                  </motion.div>
                )}
              </div>

              {/* Edit logo overlay button (only in editor mode) */}
              {editMode && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowLogoEditor(true);
                  }}
                  title="Editar logo y favicon"
                  className="absolute -top-1.5 -right-1.5 w-7 h-7 bg-secondary rounded-full border-2 border-[#1a1a1a] flex items-center justify-center shadow-lg hover:bg-secondary/80 hover:scale-110 cursor-pointer transition-all z-[100] group pointer-events-auto"
                >
                  <Pencil className="w-3 h-3 text-[#1a1a1a]" />
                </button>
              )}
            </div>

            {/* ── RIGHT DESKTOP MENU & ACTIONS ── */}
            <div className="flex flex-1 items-center justify-between relative z-50 pointer-events-auto">
              {/* Desktop Nav Right */}
              <motion.nav
                drag={editMode ? "x" : false}
                dragMomentum={false}
                dragConstraints={{ left: -500, right: 500 }}
                initial={{ x: data.themeConfig?.menuOffsetXRight || 0 }}
                animate={{ x: data.themeConfig?.menuOffsetXRight || 0 }}
                onDragEnd={(e, info) => {
                  const currentX = data.themeConfig?.menuOffsetXRight || 0;
                  updateThemeConfig('menuOffsetXRight', currentX + info.offset.x);
                }}
                className={`hidden md:flex items-center relative z-50 ${editMode ? 'cursor-grab active:cursor-grabbing hover:bg-white/5 rounded-lg' : 'pointer-events-auto'}`}
                style={{ gap: `${data.themeConfig?.menuSpacing || 48}px`, paddingLeft: `${data.themeConfig?.menuSpacing || 48}px` }}
              >
                {['Nosotros', 'Contacto'].map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => scrollToSection(item === 'Nosotros' ? 'about' : item.toLowerCase())}
                    className={`text-sm md:text-base font-serif font-bold hover:text-white py-2 relative group uppercase tracking-widest transition-colors duration-300 transform hover:scale-105 ${editMode ? 'pointer-events-none' : ''}`}
                    style={{ color: 'hsl(var(--nav-text))' }}
                  >
                    {item}
                    <span className="absolute bottom-0 left-1/2 w-0 h-[2px] bg-secondary transform -translate-x-1/2 group-hover:w-full transition-all duration-300 ease-out"></span>
                  </button>
                ))}
              </motion.nav>

              {/* Actions Container */}
              <div className="flex items-center space-x-3">
                {/* Editor Mode Icon */}
                <div className="relative flex-shrink-0">
                  <motion.button
                    id="editor-mode-btn"
                    whileTap={{ scale: 0.92 }}
                    onClick={handleEditorIconClick}
                    title={editMode ? 'Salir del modo editor' : 'Modo Editor'}
                    className={`relative flex items-center justify-center w-11 h-11 rounded-full border-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-secondary/50
                    ${editMode
                        ? 'bg-primary border-primary text-white shadow-[0_0_18px_rgba(255,63,152,0.55)]'
                        : 'bg-transparent border-secondary/40 text-secondary hover:border-secondary hover:bg-secondary/10'
                      }`}
                  >
                    {editMode ? <Check className="w-5 h-5" /> : <Pencil className="w-4 h-4" />}
                    {editMode && (
                      <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-green-400 border-2 border-[#1a1a1a] animate-pulse"></span>
                    )}
                  </motion.button>

                  {/* Fixed Editor Toolbar at the bottom */}
                  {editMode && (
                    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[200] flex items-center gap-2 bg-[#1a1a1a]/95 backdrop-blur-md border border-secondary/40 px-6 py-3 rounded-full shadow-[0_10px_40px_rgba(0,0,0,0.8)] border-b-2">
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/4 h-[1px] bg-secondary/50"></div>

                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowThemeEditor(true)}
                        className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-secondary hover:text-white uppercase tracking-widest transition-all rounded-full hover:bg-secondary/10"
                      >
                        <Palette className="w-4 h-4" />
                        Estilos
                      </motion.button>

                      <div className="w-px h-6 bg-secondary/20"></div>

                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowLogoEditor(true)}
                        className={`flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-widest transition-all rounded-full ${showLogoEditor ? 'bg-secondary text-[#1a1a1a]' : 'text-secondary hover:text-white hover:bg-secondary/10'}`}
                      >
                        <Image className="w-4 h-4" />
                        Logo
                      </motion.button>

                      <div className="w-px h-6 bg-secondary/20"></div>

                      <div className="w-px h-6 bg-secondary/20"></div>

                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowBgPanel(!showBgPanel)}
                        className={`flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-widest transition-all rounded-full ${showBgPanel ? 'bg-secondary text-[#1a1a1a]' : 'text-secondary hover:text-white hover:bg-secondary/10'}`}
                      >
                        <Upload className="w-4 h-4" />
                        Fondo
                      </motion.button>

                      <div className="w-px h-6 bg-secondary/20"></div>

                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => { setShowPosterEditor(true); setShowBgPanel(false); }}
                        className={`flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-widest transition-all rounded-full ${showPosterEditor ? 'bg-secondary text-[#1a1a1a]' : 'text-secondary hover:text-white hover:bg-secondary/10'}`}
                      >
                        <FileText className="w-4 h-4" />
                        Menú PDF
                      </motion.button>

                      <div className="w-px h-6 bg-secondary/20"></div>

                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setMobilePreview(!mobilePreview)}
                        className={`flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-widest transition-all rounded-full ${mobilePreview ? 'bg-primary text-white border-primary' : 'text-secondary hover:text-white hover:bg-secondary/10'}`}
                      >
                        {mobilePreview ? <Monitor className="w-4 h-4" /> : <Smartphone className="w-4 h-4" />}
                        {mobilePreview ? 'Escritorio' : 'Móvil'}
                      </motion.button>
                    </div>
                  )}
                </div>

                {/* Mobile menu button */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="md:hidden text-secondary hover:bg-secondary/10 border border-secondary/30 bg-transparent flex-shrink-0"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                  {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, x: '100%' }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: '100%' }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="md:hidden fixed inset-0 z-[150] bg-[#1a1a1a] flex flex-col pt-24"
            >
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-secondary to-transparent z-[151] opacity-70"></div>

              <nav className="container mx-auto px-6 py-8 flex flex-col space-y-4">
                {['Inicio', 'Menú', 'Nosotros', 'Contacto'].map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => scrollToSection(item === 'Nosotros' ? 'about' : item.toLowerCase())}
                    className="text-center py-3 px-6 text-xl font-serif font-bold text-white/90 border border-secondary/20 rounded-sm hover:border-secondary hover:text-secondary transition-all uppercase tracking-widest"
                  >
                    {item}
                  </button>
                ))}
                <div className="pt-6 border-t border-secondary/20 flex justify-center">
                  <Button
                    variant="outline"
                    onClick={() => {
                      handleEditorIconClick();
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full max-w-xs flex items-center justify-center space-x-3 border h-14 ${editMode ? 'bg-primary text-white border-primary shadow-[0_0_15px_rgba(255,63,152,0.4)]' : 'bg-transparent text-secondary border-secondary/50 hover:bg-secondary/10'}`}
                  >
                    {editMode ? <Check className="w-5 h-5" /> : <Pencil className="w-5 h-5" />}
                    <span className="font-serif font-bold text-lg tracking-widest uppercase">{editMode ? 'Salir Editor' : 'Modo Editor'}</span>
                  </Button>
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ── PASSWORD MODAL ── */}
      <AnimatePresence>
        {showPasswordModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-sm"
            onClick={(e) => { if (e.target === e.currentTarget) { setShowPasswordModal(false); setPassword(''); setPasswordError(''); } }}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 20 }}
              animate={shaking
                ? { scale: 1, opacity: 1, y: 0, x: [0, -10, 10, -8, 8, -4, 4, 0] }
                : { scale: 1, opacity: 1, y: 0, x: 0 }
              }
              exit={{ scale: 0.85, opacity: 0, y: 20 }}
              transition={{ duration: shaking ? 0.4 : 0.3, ease: 'easeOut' }}
              className="relative bg-[#1a1a1a] border border-secondary/40 rounded-sm shadow-[0_0_60px_rgba(0,0,0,0.8)] p-10 w-full max-w-md mx-4"
              style={{ fontFamily: 'system-ui, sans-serif' }}
            >
              {/* Golden top accent */}
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-secondary to-transparent opacity-80 rounded-t-sm"></div>

              {/* Corner decorations */}
              <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-secondary/60"></div>
              <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-secondary/60"></div>
              <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-secondary/60"></div>
              <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-secondary/60"></div>

              {/* Lock icon */}
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 rounded-full bg-secondary/10 border-2 border-secondary/40 flex items-center justify-center">
                  <Lock className="w-7 h-7 text-secondary" />
                </div>
              </div>

              <h2 className="text-center text-2xl font-serif font-bold text-white tracking-widest uppercase mb-2">
                Modo Editor
              </h2>
              <p className="text-center text-white/50 text-sm mb-8 font-serif">
                Ingresa la contraseña de administrador para continuar
              </p>

              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div className="relative">
                  <input
                    autoFocus
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setPasswordError(''); }}
                    placeholder="Contraseña"
                    className="w-full bg-white/5 border border-secondary/30 rounded-sm px-5 py-3.5 text-white placeholder-white/30 font-serif tracking-widest focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary/30 pr-12 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-secondary transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {passwordError && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-400 text-sm font-serif text-center"
                  >
                    {passwordError}
                  </motion.p>
                )}

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => { setShowPasswordModal(false); setPassword(''); setPasswordError(''); }}
                    className="flex-1 py-3 border border-white/20 text-white/60 font-serif font-bold uppercase tracking-wider text-sm rounded-sm hover:border-white/40 hover:text-white/80 transition-all"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-secondary text-[#1a1a1a] font-serif font-bold uppercase tracking-wider text-sm rounded-sm hover:bg-secondary/90 transition-all shadow-[0_0_20px_rgba(184,142,67,0.3)]"
                  >
                    Ingresar
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── EDITOR PANEL ── */}
      <AnimatePresence>
        {editMode && showBgPanel && (
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.97 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="fixed top-[7.5rem] right-4 z-[100] w-84 bg-[#1a1a1a]/96 backdrop-blur-md border border-secondary/40 rounded-sm shadow-[0_8px_40px_rgba(0,0,0,0.7)] overflow-hidden"
            style={{ width: '22rem', fontFamily: 'system-ui, sans-serif' }}
          >
            {/* Golden top accent */}
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-secondary to-transparent opacity-80"></div>

            {/* Panel header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-secondary/20 bg-black/50">
              <div className="flex items-center gap-2">
                <Image className="w-4 h-4 text-secondary" />
                <span className="font-bold text-white text-sm uppercase tracking-wider">Editor de Portada</span>
              </div>
              <button onClick={() => setShowBgPanel(false)} className="text-white/40 hover:text-white transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Section selector */}
            <div className="flex border-b border-secondary/20">
              {[
                { key: 'fondo', label: 'Fondo', icon: Image },
                { key: 'decoraciones', label: 'Círculos Decor.', icon: Upload },
              ].map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => { setPanelSection(key); setBgTab('url'); }}
                  className={`flex-1 flex items-center justify-center gap-1 py-2.5 text-[10px] font-bold uppercase tracking-wider border-b-2 transition-all ${panelSection === key
                    ? 'text-secondary border-secondary bg-secondary/5'
                    : 'text-white/40 border-transparent hover:text-white/80 hover:bg-white/5'
                    }`}
                >
                  <Icon className="w-3 h-3" />
                  {label}
                </button>
              ))}
            </div>

            {/* ─ FONDO section ─ */}
            {panelSection === 'fondo' && (
              <div>
                <div className="px-5 pt-4 pb-3">
                  <p className="text-white/60 text-[10px] font-bold uppercase tracking-wider mb-2">Vista previa de la imagen</p>
                  <div
                    className="w-full h-20 rounded-lg border border-white/10 bg-cover bg-center shadow-inner"
                    style={{ backgroundImage: `url('${data.heroBackground}')` }}
                  ></div>

                  {/* SLIDER DE OSCURECIMIENTO AQUI */}
                  <div className="mt-4 bg-black/30 p-3 rounded-lg border border-white/5">
                    <label className="block text-[10px] text-white/60 uppercase font-bold tracking-wider mb-2 flex justify-between">
                      <span>Oscurecimiento de Portada</span>
                      <span className="text-secondary">{data.themeConfig?.heroOverlayOpacity ?? 80}%</span>
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
                <div className="flex border-y border-white/10 bg-black/20 px-5">
                  {[{ key: 'url', label: 'URL', icon: Link2 }, { key: 'upload', label: 'Subir', icon: Upload }].map(({ key, label, icon: Icon }) => (
                    <button key={key} onClick={() => setBgTab(key)}
                      className={`flex items-center gap-1 px-4 py-2 text-[10px] font-serif font-bold uppercase tracking-wider border-b-2 transition-all ${bgTab === key ? 'text-secondary border-secondary' : 'text-white/40 border-transparent hover:text-white/60'
                        }`}>
                      <Icon className="w-3 h-3" />{label}
                    </button>
                  ))}
                </div>
                <div className="px-5 py-4 space-y-3">
                  {bgTab === 'url' ? (
                    <>
                      <input type="url" value={bgUrlInput} onChange={(e) => setBgUrlInput(e.target.value)}
                        placeholder="https://..."
                        className="w-full bg-white/5 border border-secondary/25 rounded-sm px-3 py-2 text-white placeholder-white/25 text-xs font-serif focus:outline-none focus:border-secondary transition" />
                      <button onClick={handleApplyUrl} disabled={!bgUrlInput.trim()}
                        className="w-full py-2 bg-secondary text-[#1a1a1a] font-serif font-bold uppercase tracking-wider text-xs rounded-sm hover:bg-secondary/90 transition-all disabled:opacity-40 disabled:cursor-not-allowed">
                        Aplicar
                      </button>
                    </>
                  ) : (
                    <>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        onClick={(e) => { e.target.value = null; }}
                        className="hidden"
                      />
                      <button onClick={() => fileInputRef.current?.click()}
                        className="w-full py-5 border-2 border-dashed border-secondary/30 rounded-sm text-white/50 hover:border-secondary/60 hover:text-white/70 transition-all flex flex-col items-center gap-1.5 group">
                        <Upload className="w-5 h-5 group-hover:text-secondary transition-colors" />
                        <span className="text-xs font-serif uppercase tracking-wider">Seleccionar archivo</span>
                        <span className="text-[10px] text-white/30">JPG, PNG, WEBP, GIF</span>
                      </button>
                    </>
                  )}
                  <button onClick={() => updateHeroBackground(initialData.heroBackground)}
                    className="w-full py-1.5 text-white/30 text-[10px] font-serif uppercase tracking-wider hover:text-white/60 transition-colors border border-white/10 rounded-sm hover:border-white/20">
                    Restaurar original
                  </button>
                </div>
              </div>
            )}

            {/* ─ DECORACIONES section ─ */}
            {panelSection === 'decoraciones' && (
              <div>
                <div className="px-5 pt-4 pb-2">
                  <p className="text-white/40 text-xs uppercase tracking-wider font-serif mb-2">Agregar Círculo Decorativo</p>
                  <p className="text-white/40 text-[10px] font-serif leading-relaxed">Se agregará una nueva imagen con forma de círculo sobre la portada principal. Podrás moverla libremente y escalarla con los controles +/- posando el ratón sobre ella.</p>
                </div>
                <div className="flex border-b border-secondary/10 mx-5 mt-2">
                  {[{ key: 'url', label: 'URL', icon: Link2 }, { key: 'upload', label: 'Subir', icon: Upload }].map(({ key, label, icon: Icon }) => (
                    <button key={key} onClick={() => setBgTab(key)}
                      className={`flex items-center gap-1 px-4 py-2 text-[10px] font-serif font-bold uppercase tracking-wider border-b-2 transition-all ${bgTab === key ? 'text-secondary border-secondary' : 'text-white/40 border-transparent hover:text-white/60'
                        }`}>
                      <Icon className="w-3 h-3" />{label}
                    </button>
                  ))}
                </div>
                <div className="px-5 py-4 space-y-3">
                  {bgTab === 'url' ? (
                    <>
                      <input type="url" value={newDecUrl} onChange={(e) => setNewDecUrl(e.target.value)}
                        placeholder="https://..."
                        className="w-full bg-white/5 border border-secondary/25 rounded-sm px-3 py-2 text-white placeholder-white/25 text-xs font-serif focus:outline-none focus:border-secondary transition" />
                      <button onClick={handleDecUrlApply} disabled={!newDecUrl.trim()}
                        className="w-full py-2 bg-secondary text-[#1a1a1a] font-serif font-bold uppercase tracking-wider text-xs rounded-sm hover:bg-secondary/90 transition-all disabled:opacity-40 disabled:cursor-not-allowed">
                        Agregar Círculo Nuevo
                      </button>
                    </>
                  ) : (
                    <>
                      <input
                        ref={fileDecRef}
                        type="file"
                        accept="image/*"
                        onChange={handleDecFileUpload}
                        onClick={(e) => { e.target.value = null; }}
                        className="hidden"
                      />
                      <button onClick={() => fileDecRef.current?.click()}
                        className="w-full py-5 border-2 border-dashed border-secondary/30 rounded-sm text-white/50 hover:border-secondary/60 hover:text-white/70 transition-all flex flex-col items-center gap-1.5 group">
                        <Upload className="w-5 h-5 group-hover:text-secondary transition-colors" />
                        <span className="text-xs font-serif uppercase tracking-wider">Seleccionar archivo</span>
                        <span className="text-[10px] text-white/30">JPG, PNG, WEBP, GIF</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── LOGO EDITOR DIALOG ── */}
      <LogoEditorDialog open={showLogoEditor} onClose={() => setShowLogoEditor(false)} />

      {/* ── THEME EDITOR DIALOG ── */}
      <ThemeEditorDialog open={showThemeEditor} onClose={() => setShowThemeEditor(false)} />

      {/* ── POSTER EDITOR DIALOG ── */}
      <PosterEditorDialog open={showPosterEditor} onClose={() => setShowPosterEditor(false)} />
    </>
  );
};

// Default image values for reset
const initialData = {
  heroBackground: "https://images.unsplash.com/photo-1583438899925-84fde80483b9?q=80&w=2000&auto=format&fit=crop",
  heroImages: {
    left: "https://images.unsplash.com/photo-1613591629098-8eb619ef84dd?q=80&w=600&auto=format&fit=crop",
    right: "https://images.unsplash.com/photo-1697410154169-b2bbf83758e6?q=80&w=600&auto=format&fit=crop"
  }
};

export default Header;
