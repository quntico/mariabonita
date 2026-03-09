
import React from 'react';
import { Phone, MessageCircle, MapPin, Clock, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { useEditableContent } from '@/contexts/EditableContent.jsx';
import { motion } from 'framer-motion';

const ContactSection = () => {
  const { data, editMode, updateBusinessInfo, updateHours } = useEditableContent();

  const handleWhatsAppClick = () => {
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
                  className="w-full h-28 text-2xl font-serif font-bold bg-[#25D366] hover:bg-[#20BA5A] text-white shadow-rustic border-4 border-border uppercase tracking-wider rounded-sm"
                  size="lg"
                >
                  <MessageCircle className="w-10 h-10 mr-4" />
                  Pedir por WhatsApp
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
        className="fixed bottom-8 right-8 z-40"
      >
        <Button
          onClick={handleWhatsAppClick}
          className="w-20 h-20 rounded-full bg-[#25D366] hover:bg-[#20BA5A] text-white shadow-rustic hover:scale-110 transition-all border-4 border-white"
          size="icon"
        >
          <MessageCircle className="w-10 h-10" />
        </Button>
      </motion.div>
    </>
  );
};

export default ContactSection;
