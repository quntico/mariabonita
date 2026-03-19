import { useRef } from 'react';
import { Phone, MessageCircle, MapPin, Clock, Mail, ImageIcon, X, Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { useEditableContent } from '@/contexts/EditableContent.jsx';
import { motion } from 'framer-motion';
import { compressImage } from '@/lib/imageCompressor.js';
import { uploadFile } from '@/lib/storage.js';

const ContactSection = () => {
  const { data, editMode, updateBusinessInfo, updateHours, updateWhatsAppLogoUrl, updateWhatsAppLogoSize } = useEditableContent();
  const whatsappFileRef = useRef(null);

  const handleWhatsAppLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (e.target) e.target.value = '';
    if (!file) return;
    try {
      const compressedUrl = await compressImage(file, 400, 0.8);
      const storageUrl = await uploadFile(compressedUrl);
      updateWhatsAppLogoUrl(storageUrl);
    } catch (error) {
      console.error("Error upload whatsapp logo:", error);
    }
  };

  const handleWhatsAppClick = () => {
    if (editMode) return;
    const message = encodeURIComponent('Hola! Me gustaría hacer un pedido');
    window.open(`https://wa.me/${data.businessInfo.whatsapp.replace(/\D/g, '')}?text=${message}`, '_blank');
  };

  const handleCallClick = () => {
    window.location.href = `tel:${data.businessInfo.phone}`;
  };

  const handleMapClick = () => {
    const address = encodeURIComponent(data.businessInfo.address);
    window.open(`https://www.google.com/maps/search/?api=1&query=${address}`, '_blank');
  };

  return (
    <>
      <section id="contact" className="py-24 bg-card parchment-pattern border-b-[12px] border-border">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl md:text-7xl font-serif font-bold text-card-foreground mb-6 uppercase tracking-wider">
              Contáctanos
            </h2>
            <div className="flex justify-center items-center space-x-4 mb-6">
              <div className="h-1 w-24 bg-secondary"></div>
              <div className="w-4 h-4 bg-primary rotate-45"></div>
              <div className="h-1 w-24 bg-secondary"></div>
            </div>
            <p className="text-2xl text-card-foreground/80 font-serif font-medium max-w-2xl mx-auto">
              Haz tu pedido fácil y rápido, te esperamos con los brazos abiertos.
            </p>
          </motion.div>

          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              {/* WhatsApp Button */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <Button
                  onClick={handleWhatsAppClick}
                  className="w-full h-28 text-2xl font-serif font-bold bg-[#128C7E]/10 hover:bg-[#128C7E]/20 text-[#25D366] shadow-rustic border-4 border-muted uppercase tracking-wider rounded-sm flex items-center justify-center gap-4 group transition-all relative"
                  size="lg"
                >
                  {data.whatsappLogoUrl ? (
                    <img
                      src={data.whatsappLogoUrl}
                      className="object-contain group-hover:scale-110 transition-all duration-300"
                      style={{ width: `${data.whatsappLogoSize || 48}px`, height: `${data.whatsappLogoSize || 48}px` }}
                    />
                  ) : (
                    <svg
                      viewBox="0 0 24 24"
                      className="fill-current group-hover:scale-110 transition-all duration-300"
                      xmlns="http://www.w3.org/2000/svg"
                      style={{ width: `${data.whatsappLogoSize || 48}px`, height: `${data.whatsappLogoSize || 48}px` }}
                    >
                      <path d="M12.011 2.148c-5.466 0-9.914 4.448-9.914 9.914 0 1.747.456 3.454 1.321 4.952L2.148 21.852l4.981-1.307c1.455.793 3.091 1.212 4.774 1.212 5.466 0 9.914-4.448 9.914-9.914 0-5.466-4.448-9.907-9.914-9.907zm0 18.125c-1.54 0-3.051-.414-4.372-1.198l-.314-.186-3.245.852.866-3.163-.205-.327c-.859-1.368-1.313-2.96-1.313-4.59s.454-3.222 1.313-4.59l.205-.327-.866-3.163 3.245.852.314-.186c1.321-.784 2.832-1.198 4.372-1.198 5.466 0 9.914 4.448 9.914 9.914S17.476 20.273 12.01 20.273z" />
                      <path d="M16.892 14.192c-.267-.134-1.58-.779-1.825-.869-.245-.09-.423-.134-.601.134-.178.267-.689.869-.844 1.047-.156.178-.312.2-.579.067-.267-.134-1.129-.416-2.15-1.327-.794-.709-1.33-1.584-1.486-1.851-.156-.267-.016-.412.117-.545.121-.119.267-.312.4-.467.134-.156.178-.267.267-.445.09-.178.045-.334-.022-.467-.067-.134-.601-1.448-.823-1.983-.217-.521-.438-.45-.601-.459-.156-.007-.334-.009-.512-.009-.178 0-.467.067-.712.334-.245.267-.935.913-.935 2.227 0 1.314.957 2.583 1.091 2.761.134.178 1.883 2.875 4.561 4.03.637.275 1.134.439 1.522.562.64.204 1.222.175 1.68.106.511-.077 1.579-.646 1.801-1.269.223-.623.223-1.158.156-1.269-.067-.111-.245-.178-.512-.312z" />
                    </svg>
                  )}
                  Pedir por WhatsApp

                  {editMode && (
                    <div className="absolute -top-4 right-0 flex flex-col items-end gap-2 z-50">
                      <div className="flex gap-1">
                        <button
                          onClick={(e) => { e.stopPropagation(); whatsappFileRef.current?.click(); }}
                          className="p-1.5 bg-black/60 hover:bg-black/90 text-white rounded-md shadow-lg transition-all"
                          title="Subir Logo de WhatsApp"
                        >
                          <ImageIcon className="w-4 h-4" />
                        </button>
                        <input type="file" ref={whatsappFileRef} className="hidden" accept="image/*" onChange={handleWhatsAppLogoUpload} />
                        {data.whatsappLogoUrl && (
                          <button
                            onClick={(e) => { e.stopPropagation(); updateWhatsAppLogoUrl(null); }}
                            className="p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-md shadow-lg transition-all"
                            title="Restaurar Logo Original"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      {/* Size Control */}
                      <div className="bg-black/80 backdrop-blur-md p-2 rounded-lg border border-white/20 flex items-center gap-3 shadow-2xl" onClick={e => e.stopPropagation()}>
                        <span className="text-[10px] text-white/50 uppercase font-bold tracking-widest">Tamaño</span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateWhatsAppLogoSize(Math.max(24, (data.whatsappLogoSize || 48) - 4))}
                            className="w-6 h-6 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded text-white"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs text-secondary font-mono w-6 text-center">{data.whatsappLogoSize || 48}</span>
                          <button
                            onClick={() => updateWhatsAppLogoSize(Math.min(120, (data.whatsappLogoSize || 48) + 4))}
                            className="w-6 h-6 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded text-white"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </Button>
              </motion.div>

              {/* Call Button */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <Button
                  onClick={handleCallClick}
                  className="w-full h-28 text-2xl font-serif font-bold bg-secondary hover:bg-secondary/90 text-white shadow-rustic border-4 border-border uppercase tracking-wider rounded-sm"
                  size="lg"
                >
                  <Phone className="w-10 h-10 mr-4" />
                  Llamar Ahora
                </Button>
              </motion.div>
            </div>

            {/* Contact Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Address */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white/60 p-8 rounded-sm border-4 border-muted shadow-rustic hover:border-primary transition-all"
              >
                <div className="flex items-start space-x-6">
                  <div className="w-16 h-16 bg-background border-4 border-muted rounded-sm flex items-center justify-center flex-shrink-0 shadow-md">
                    <MapPin className="w-8 h-8 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-serif font-bold text-card-foreground mb-3 uppercase tracking-wide">Dirección</h3>
                    {editMode ? (
                      <Input
                        value={data.businessInfo.address}
                        onChange={(e) => updateBusinessInfo('address', e.target.value)}
                        className="text-lg font-serif border-2 border-muted bg-card"
                      />
                    ) : (
                      <>
                        <p className="text-xl font-serif text-card-foreground/80 mb-4 leading-relaxed">
                          {data.businessInfo.address}
                        </p>
                        <Button
                          variant="outline"
                          onClick={handleMapClick}
                          className="border-2 border-muted font-serif font-bold uppercase tracking-wider bg-card text-card-foreground"
                        >
                          Ver en Mapa
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </motion.div>

              {/* Hours */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="bg-white/60 p-8 rounded-sm border-4 border-muted shadow-rustic hover:border-secondary transition-all"
              >
                <div className="flex items-start space-x-6">
                  <div className="w-16 h-16 bg-background border-4 border-muted rounded-sm flex items-center justify-center flex-shrink-0 shadow-md">
                    <Clock className="w-8 h-8 text-secondary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-serif font-bold text-card-foreground mb-3 uppercase tracking-wide">Horarios</h3>
                    {editMode ? (
                      <div className="space-y-3">
                        <Input
                          value={data.businessInfo.hours.weekdays}
                          onChange={(e) => updateHours('weekdays', e.target.value)}
                          className="text-lg font-serif border-2 border-muted bg-card"
                        />
                        <Input
                          value={data.businessInfo.hours.weekends}
                          onChange={(e) => updateHours('weekends', e.target.value)}
                          className="text-lg font-serif border-2 border-muted bg-card"
                        />
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <p className="text-xl font-serif text-card-foreground/80">
                          <span className="font-bold text-card-foreground">L-V:</span> {data.businessInfo.hours.weekdays}
                        </p>
                        <p className="text-xl font-serif text-card-foreground/80">
                          <span className="font-bold text-card-foreground">S-D:</span> {data.businessInfo.hours.weekends}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>

              {/* Phone */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="bg-white/60 p-8 rounded-sm border-4 border-muted shadow-rustic hover:border-accent transition-all"
              >
                <div className="flex items-start space-x-6">
                  <div className="w-16 h-16 bg-background border-4 border-muted rounded-sm flex items-center justify-center flex-shrink-0 shadow-md">
                    <Phone className="w-8 h-8 text-accent" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-serif font-bold text-card-foreground mb-3 uppercase tracking-wide">Teléfono</h3>
                    {editMode ? (
                      <Input
                        value={data.businessInfo.phone}
                        onChange={(e) => updateBusinessInfo('phone', e.target.value)}
                        className="text-lg font-serif border-2 border-muted bg-card"
                      />
                    ) : (
                      <a
                        href={`tel:${data.businessInfo.phone}`}
                        className="text-2xl font-serif font-bold text-card-foreground/80 hover:text-primary transition-colors"
                      >
                        {data.businessInfo.phone}
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>

              {/* Email */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="bg-white/60 p-8 rounded-sm border-4 border-muted shadow-rustic hover:border-primary transition-all"
              >
                <div className="flex items-start space-x-6">
                  <div className="w-16 h-16 bg-background border-4 border-muted rounded-sm flex items-center justify-center flex-shrink-0 shadow-md">
                    <Mail className="w-8 h-8 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-serif font-bold text-card-foreground mb-3 uppercase tracking-wide">Email</h3>
                    {editMode ? (
                      <Input
                        value={data.businessInfo.email}
                        onChange={(e) => updateBusinessInfo('email', e.target.value)}
                        className="text-lg font-serif border-2 border-muted bg-card"
                      />
                    ) : (
                      <a
                        href={`mailto:${data.businessInfo.email}`}
                        className="text-xl font-serif font-bold text-card-foreground/80 hover:text-primary transition-colors break-all"
                      >
                        {data.businessInfo.email}
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Floating WhatsApp Button */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, type: "spring" }}
        className="fixed bottom-8 right-8 z-40 flex flex-col items-center gap-4"
      >
        {editMode && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-2 bg-black/80 backdrop-blur-md p-2 rounded-xl border border-white/20 shadow-2xl"
          >
            <div className="flex items-center gap-2">
              <button
                onClick={() => updateWhatsAppLogoSize(Math.max(24, (data.whatsappLogoSize || 48) - 4))}
                className="w-8 h-8 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
                title="Reducir"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="text-xs text-secondary font-mono w-8 text-center">{data.whatsappLogoSize || 48}</span>
              <button
                onClick={() => updateWhatsAppLogoSize(Math.min(200, (data.whatsappLogoSize || 48) + 4))}
                className="w-8 h-8 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
                title="Agrandar"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        <button
          onClick={editMode ? () => whatsappFileRef.current?.click() : handleWhatsAppClick}
          className="flex items-center justify-center transition-all hover:scale-110 active:scale-95 group relative z-[300]"
          style={{
            width: `${(data.whatsappLogoSize || 48) + 16}px`,
            height: `${(data.whatsappLogoSize || 48) + 16}px`
          }}
          aria-label={editMode ? "Cambiar Logo de WhatsApp" : "Contactar por WhatsApp"}
        >
          {/* Very Subtle Glow behind the logo */}
          <div className="absolute inset-0 bg-[#25D366]/10 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>

          {editMode && (
            <div className="absolute -top-1 -right-1 bg-secondary rounded-full p-1.5 shadow-lg z-10 animate-pulse">
              <ImageIcon className="w-4 h-4 text-white" />
            </div>
          )}

          {data.whatsappLogoUrl ? (
            <img
              src={data.whatsappLogoUrl}
              className="object-contain transition-all duration-300 group-hover:rotate-[8deg]"
              style={{ width: `${data.whatsappLogoSize || 48}px`, height: `${data.whatsappLogoSize || 48}px` }}
            />
          ) : (
            <svg
              viewBox="0 0 24 24"
              className="fill-[#25D366] transition-all duration-300 group-hover:rotate-[8deg]"
              xmlns="http://www.w3.org/2000/svg"
              style={{ width: `${data.whatsappLogoSize || 48}px`, height: `${data.whatsappLogoSize || 48}px` }}
            >
              <path d="M12.011 2.148c-5.466 0-9.914 4.448-9.914 9.914 0 1.747.456 3.454 1.321 4.952L2.148 21.852l4.981-1.307c1.455.793 3.091 1.212 4.774 1.212 5.466 0 9.914-4.448 9.914-9.914 0-5.466-4.448-9.907-9.914-9.907zm0 18.125c-1.54 0-3.051-.414-4.372-1.198l-.314-.186-3.245.852.866-3.163-.205-.327c-.859-1.368-1.313-2.96-1.313-4.59s.454-3.222 1.313-4.59l.205-.327-.866-3.163 3.245.852.314-.186c1.321-.784 2.832-1.198 4.372-1.198 5.466 0 9.914 4.448 9.914 9.914S17.476 20.273 12.01 20.273z" />
              <path d="M16.892 14.192c-.267-.134-1.58-.779-1.825-.869-.245-.09-.423-.134-.601.134-.178.267-.689.869-.844 1.047-.156.178-.312.2-.579.067-.267-.134-1.129-.416-2.15-1.327-.794-.709-1.33-1.584-1.486-1.851-.156-.267-.016-.412.117-.545.121-.119.267-.312.4-.467.134-.156.178-.267.267-.445.09-.178.045-.334-.022-.467-.067-.134-.601-1.448-.823-1.983-.217-.521-.438-.45-.601-.459-.156-.007-.334-.009-.512-.009-.178 0-.467.067-.712.334-.245.267-.935.913-.935 2.227 0 1.314.957 2.583 1.091 2.761.134.178 1.883 2.875 4.561 4.03.637.275 1.134.439 1.522.562.64.204 1.222.175 1.68.106.511-.077 1.579-.646 1.801-1.269.223-.623.223-1.158.156-1.269-.067-.111-.245-.178-.512-.312z" />
            </svg>
          )}
        </button>
      </motion.div>
    </>
  );
};

export default ContactSection;
