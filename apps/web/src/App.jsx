
import React from 'react';
import { useEditableContent } from '@/contexts/EditableContent.jsx';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import ScrollToTop from '@/components/ScrollToTop.jsx';
import { EditableContentProvider } from '@/contexts/EditableContent.jsx';
import { Toaster } from '@/components/ui/toaster.jsx';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import HomePage from '@/pages/HomePage.jsx';
import MobileBottomNav from '@/components/MobileBottomNav.jsx';
import { Smartphone, Monitor } from 'lucide-react';

function App() {
  const { mobilePreview, setMobilePreview, editMode, data } = useEditableContent();

  const globalBgStyle = data.themeConfig?.globalPageBg ? {
    backgroundImage: `url('${data.themeConfig.globalPageBg}')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed',
  } : {};

  const globalOverlayOpacity = (data.themeConfig?.globalPageBgOpacity ?? 70) / 100;

  return (
    <Router>
      <ScrollToTop />
      <div className={`min-h-screen bg-[#0e0e0e] transition-all duration-500 flex flex-col items-center justify-center ${mobilePreview && editMode ? 'py-10' : ''}`}>
        <div
          className={`
            relative transition-all duration-500 overflow-hidden
            ${mobilePreview && editMode
              ? 'w-[375px] h-[667px] border-[12px] border-[#1a1a1a] rounded-[3rem] shadow-[0_0_100px_rgba(0,0,0,0.8)] bg-background flex flex-col'
              : 'w-full min-h-screen flex flex-col'
            }
          `}
          style={{
            ...(mobilePreview && editMode ? { maxHeight: '90vh' } : {}),
            ...globalBgStyle
          }}
        >
          {/* Global Pattern Layer */}
          {data.themeConfig?.globalPageBgTexture !== false && (
            <div className="absolute inset-0 z-0 wood-pattern-dark pointer-events-none opacity-20"></div>
          )}

          {/* Global Color Overlay */}
          <div
            className="absolute inset-0 z-0 pointer-events-none transition-opacity duration-500"
            style={{
              backgroundColor: '#000000',
              opacity: data.themeConfig?.globalPageBg ? globalOverlayOpacity : 0
            }}
          ></div>
          {/* Mobile Status Bar (Mockup) */}
          {mobilePreview && editMode && (
            <div className="h-7 w-full flex justify-between px-8 pt-1.5 text-[10px] text-white/40 font-sans z-[100] bg-[#1a1a1a]">
              <span className="font-bold">9:41</span>
              <div className="flex gap-2">
                <span>📶</span>
                <span>🔋</span>
              </div>
            </div>
          )}

          <div className={`relative z-10 flex flex-col flex-1 overflow-y-auto no-scrollbar`}>
            <Header />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<HomePage />} />
              </Routes>
            </main>
            <Footer />
            <MobileBottomNav />
          </div>

          {/* Home Indicator */}
          {mobilePreview && editMode && (
            <div className="h-5 w-full bg-[#1a1a1a] flex justify-center items-center">
              <div className="w-1/3 h-1 bg-white/20 rounded-full"></div>
            </div>
          )}
        </div>
      </div>
      {/* Floating Toggle View Button (Only in Editor Mode) */}
      {editMode && (
        <div className="fixed top-24 right-5 z-[200] flex flex-col gap-3">
          <button
            onClick={() => setMobilePreview(!mobilePreview)}
            className={`
              w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 border-2
              ${mobilePreview 
                ? 'bg-secondary border-secondary/50 text-[#1a1a1a] scale-110' 
                : 'bg-[#1a1a1a] border-white/10 text-secondary hover:border-secondary/50'
              }
            `}
            title={mobilePreview ? "Ver en Escritorio" : "Ver en Móvil"}
          >
            {mobilePreview ? <Monitor className="w-6 h-6" /> : <Smartphone className="w-6 h-6" />}
            
            {/* Tooltip-like label */}
            <span className="absolute right-16 px-4 py-2 bg-[#1a1a1a] border border-white/10 rounded-lg text-[10px] font-bold uppercase tracking-widest text-secondary opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-2xl">
              Vista {mobilePreview ? 'Escritorio' : 'Móvil'}
            </span>
          </button>
        </div>
      )}
      
      <Toaster />
    </Router>
  );
}

const WrappedApp = () => (
  <EditableContentProvider>
    <App />
  </EditableContentProvider>
);

export default WrappedApp;
