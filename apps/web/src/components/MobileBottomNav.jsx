import React from 'react';
import { UtensilsCrossed, Phone, MessageCircle, MapPin, Home } from 'lucide-react';
import { useEditableContent } from '@/contexts/EditableContent.jsx';
import { motion } from 'framer-motion';

const MobileBottomNav = () => {
  const { data, editMode } = useEditableContent();

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleWhatsAppClick = () => {
    const message = encodeURIComponent('¡Hola! Me gustaría hacer un pedido.');
    window.open(`https://wa.me/${data.businessInfo.whatsapp.replace(/\D/g, '')}?text=${message}`, '_blank');
  };

  const handleCallClick = () => {
    window.location.href = `tel:${data.businessInfo.phone}`;
  };

  const handleMapClick = () => {
    const address = encodeURIComponent(data.businessInfo.address);
    window.open(`https://www.google.com/maps/search/?api=1&query=${address}`, '_blank');
  };

  if (editMode) return null;

  return (
    <motion.div 
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="md:hidden fixed bottom-0 left-0 right-0 z-[100] px-4 pb-6 pt-2"
    >
      <div className="bg-[#1a1a1a]/90 backdrop-blur-xl border border-secondary/30 rounded-full flex items-center justify-around h-16 shadow-[0_10px_40px_rgba(0,0,0,0.8)] px-2">
        <NavButton icon={Home} onClick={() => scrollToSection('hero')} />
        <NavButton icon={UtensilsCrossed} onClick={() => scrollToSection('menu')} />
        
        {/* Floating pulse button for WhatsApp */}
        <div className="relative -mt-10">
          <div className="absolute inset-0 bg-[#25D366] rounded-full animate-ping opacity-20"></div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleWhatsAppClick}
            className="w-16 h-16 bg-[#25D366] rounded-full flex items-center justify-center shadow-[0_8px_25px_rgba(37,211,102,0.5)] border-4 border-[#1a1a1a] relative z-10"
          >
            <MessageCircle className="w-8 h-8 text-white fill-white" />
          </motion.button>
        </div>

        <NavButton icon={Phone} onClick={handleCallClick} />
        <NavButton icon={MapPin} onClick={handleMapClick} />
      </div>
    </motion.div>
  );
};

const NavButton = ({ icon: Icon, onClick }) => (
  <motion.button 
    whileTap={{ scale: 0.85 }}
    onClick={onClick}
    className="flex flex-col items-center justify-center p-2 rounded-full hover:bg-white/10 transition-all text-secondary/70 active:text-secondary"
  >
    <Icon className="w-6 h-6" />
  </motion.button>
);

export default MobileBottomNav;
