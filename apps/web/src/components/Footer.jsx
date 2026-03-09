
import React from 'react';
import { Facebook, Instagram, Phone, MapPin, Clock, Send } from 'lucide-react';
import { useEditableContent } from '@/contexts/EditableContent.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Button } from '@/components/ui/button.jsx';

const Footer = () => {
  const { data, editMode, updateBusinessInfo, updateHours, updateSocial } = useEditableContent();

  return (
    <footer className="bg-background text-foreground border-t-[12px] border-border wood-pattern-dark relative overflow-hidden">
      {/* Decorative top border pattern */}
      <div className="absolute top-0 left-0 w-full h-2 bg-primary z-10"></div>
      <div className="absolute top-2 left-0 w-full h-2 bg-secondary z-10"></div>

      <div className="container mx-auto px-4 py-20 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Section */}
          <div className="space-y-6">
            <div className="border-4 border-muted p-6 rounded-sm bg-card inline-block shadow-rustic">
              <h3 className="text-4xl font-serif font-bold text-card-foreground mb-2 uppercase tracking-wider">
                MARIA BONITA
              </h3>
              <div className="h-1 w-full bg-primary mb-2"></div>
              <p className="text-xl font-serif text-secondary font-bold">
                {data.businessInfo.subtitle}
              </p>
            </div>
            {editMode ? (
              <Input
                value={data.businessInfo.tagline}
                onChange={(e) => updateBusinessInfo('tagline', e.target.value)}
                className="text-sm bg-card border-muted text-card-foreground font-serif"
                placeholder="Tagline"
              />
            ) : (
              <p className="text-lg font-serif text-foreground/90 italic border-l-4 border-primary pl-4 py-2 bg-black/20">
                "{data.businessInfo.tagline}"
              </p>
            )}
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <h4 className="text-3xl font-serif font-bold text-secondary border-b-4 border-muted pb-2 inline-block">Encuéntranos</h4>
            <div className="space-y-6 font-serif text-lg">
              <div className="flex items-start space-x-4 bg-black/20 p-4 rounded-sm border border-white/10">
                <MapPin className="w-8 h-8 text-primary flex-shrink-0" />
                {editMode ? (
                  <Input
                    value={data.businessInfo.address}
                    onChange={(e) => updateBusinessInfo('address', e.target.value)}
                    className="text-sm flex-1 bg-card border-muted text-card-foreground"
                    placeholder="Dirección"
                  />
                ) : (
                  <span className="text-foreground leading-relaxed">{data.businessInfo.address}</span>
                )}
              </div>
              <div className="flex items-center space-x-4 bg-black/20 p-4 rounded-sm border border-white/10">
                <Phone className="w-8 h-8 text-primary flex-shrink-0" />
                {editMode ? (
                  <Input
                    value={data.businessInfo.phone}
                    onChange={(e) => updateBusinessInfo('phone', e.target.value)}
                    className="text-sm flex-1 bg-card border-muted text-card-foreground"
                    placeholder="Teléfono"
                  />
                ) : (
                  <a href={`tel:${data.businessInfo.phone}`} className="text-foreground hover:text-primary transition-colors font-bold">
                    {data.businessInfo.phone}
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Hours */}
          <div className="space-y-6">
            <h4 className="text-3xl font-serif font-bold text-secondary border-b-4 border-muted pb-2 inline-block">Horarios</h4>
            <div className="flex items-start space-x-4 font-serif bg-black/20 p-4 rounded-sm border border-white/10">
              <Clock className="w-8 h-8 text-primary flex-shrink-0" />
              <div className="flex-1 space-y-4 text-lg">
                {editMode ? (
                  <>
                    <Input
                      value={data.businessInfo.hours.weekdays}
                      onChange={(e) => updateHours('weekdays', e.target.value)}
                      className="text-sm bg-card border-muted text-card-foreground"
                      placeholder="Horario entre semana"
                    />
                    <Input
                      value={data.businessInfo.hours.weekends}
                      onChange={(e) => updateHours('weekends', e.target.value)}
                      className="text-sm bg-card border-muted text-card-foreground"
                      placeholder="Horario fin de semana"
                    />
                  </>
                ) : (
                  <>
                    <div>
                      <span className="block text-primary font-bold text-sm uppercase tracking-wider mb-1">Lunes a Viernes</span>
                      <p className="text-foreground font-medium">{data.businessInfo.hours.weekdays}</p>
                    </div>
                    <div className="h-px w-full bg-white/20"></div>
                    <div>
                      <span className="block text-secondary font-bold text-sm uppercase tracking-wider mb-1">Sábados y Domingos</span>
                      <p className="text-foreground font-medium">{data.businessInfo.hours.weekends}</p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Newsletter & Social */}
          <div className="space-y-6">
            <h4 className="text-3xl font-serif font-bold text-secondary border-b-4 border-muted pb-2 inline-block">Boletín</h4>
            <p className="font-serif text-foreground/90 text-lg bg-black/20 p-4 rounded-sm border border-white/10">
              Suscríbete para recibir nuestras promociones especiales.
            </p>
            <div className="flex space-x-2">
              <Input 
                placeholder="Tu correo electrónico" 
                className="bg-card border-4 border-muted text-card-foreground placeholder:text-card-foreground/50 font-serif h-12"
              />
              <Button className="bg-primary hover:bg-primary/90 text-white px-6 border-4 border-primary h-12">
                <Send className="w-5 h-5" />
              </Button>
            </div>

            <div className="pt-6">
              <h4 className="text-xl font-serif font-bold text-foreground mb-4 uppercase tracking-wider">Síguenos</h4>
              <div className="flex space-x-4">
                {editMode ? (
                  <div className="space-y-2 w-full">
                    <Input
                      value={data.businessInfo.social.facebook}
                      onChange={(e) => updateSocial('facebook', e.target.value)}
                      className="text-sm bg-card border-muted text-card-foreground"
                      placeholder="Facebook URL"
                    />
                    <Input
                      value={data.businessInfo.social.instagram}
                      onChange={(e) => updateSocial('instagram', e.target.value)}
                      className="text-sm bg-card border-muted text-card-foreground"
                      placeholder="Instagram URL"
                    />
                  </div>
                ) : (
                  <>
                    {data.businessInfo.social.facebook && (
                      <a
                        href={data.businessInfo.social.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-14 h-14 rounded-sm border-4 border-muted bg-card flex items-center justify-center hover:bg-primary hover:border-primary hover:text-white transition-all text-card-foreground shadow-md"
                      >
                        <Facebook className="w-7 h-7" />
                      </a>
                    )}
                    {data.businessInfo.social.instagram && (
                      <a
                        href={data.businessInfo.social.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-14 h-14 rounded-sm border-4 border-muted bg-card flex items-center justify-center hover:bg-primary hover:border-primary hover:text-white transition-all text-card-foreground shadow-md"
                      >
                        <Instagram className="w-7 h-7" />
                      </a>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-20 pt-8 border-t-4 border-muted text-center">
          <p className="text-lg font-serif text-foreground/80 font-bold tracking-wide">
            © {new Date().getFullYear()} MARIA BONITA. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
