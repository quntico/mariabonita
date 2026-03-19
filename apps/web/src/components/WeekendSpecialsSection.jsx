
import React, { useState } from 'react';
import { Star, Calendar, Edit2, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Textarea } from '@/components/ui/textarea.jsx';
import { useEditableContent } from '@/contexts/EditableContent.jsx';
import { motion } from 'framer-motion';

const WeekendSpecialsSection = () => {
  const { data, editMode, updateMenuItem, toggleWeekendSpecials } = useEditableContent();
  const [editingItem, setEditingItem] = useState(null);

  if (!data.weekendSpecialsActive && !editMode) {
    return null;
  }

  return (
    <section className="py-24 bg-card parchment-pattern border-b-[12px] border-border relative overflow-hidden">
      {/* Decorative Images */}
      <div className="absolute top-0 right-0 w-64 h-64 opacity-20 pointer-events-none mix-blend-multiply">
        <img src="https://images.unsplash.com/photo-1697410154169-b2bbf83758e6?q=80&w=800&auto=format&fit=crop" alt="Clay pots" className="w-full h-full object-cover rounded-bl-full" />
      </div>
      <div className="absolute bottom-0 left-0 w-64 h-64 opacity-20 pointer-events-none mix-blend-multiply">
        <img src="https://images.unsplash.com/photo-1690944254380-c97a2881d940?q=80&w=800&auto=format&fit=crop" alt="Mexican food" className="w-full h-full object-cover rounded-tr-full" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center space-x-3 bg-background border-4 border-muted px-6 py-3 rounded-sm mb-6 shadow-rustic">
            <Calendar className="w-6 h-6 text-primary" />
            <span className="text-lg font-serif font-bold text-foreground uppercase tracking-widest">
              Especiales de Fin de Semana
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-7xl font-serif font-bold text-card-foreground mb-6 uppercase tracking-wider mobile-text-balance">
            Sábados y Domingos
          </h2>
          <div className="flex justify-center items-center space-x-4 mb-6">
            <div className="h-1 w-24 bg-secondary"></div>
            <div className="w-4 h-4 bg-primary rotate-45"></div>
            <div className="h-1 w-24 bg-secondary"></div>
          </div>
          <p className="text-2xl font-serif text-card-foreground/80 max-w-2xl mx-auto font-medium">
            Platillos tradicionales que solo encontrarás los fines de semana
          </p>

          {editMode && (
            <div className="mt-8">
              <Button
                variant={data.weekendSpecialsActive ? "default" : "outline"}
                onClick={toggleWeekendSpecials}
                className="border-4 border-border font-serif font-bold text-lg h-12"
              >
                {data.weekendSpecialsActive ? 'Sección Activa' : 'Sección Desactivada'}
              </Button>
            </div>
          )}
        </motion.div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {data.menu.weekendSpecials?.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full bg-white/80 border-4 border-muted shadow-rustic hover:border-secondary transition-all duration-300 overflow-hidden group rounded-sm relative">
                {/* Decorative corner */}
                <div className="absolute top-0 right-0 w-12 h-12 bg-secondary transform translate-x-6 -translate-y-6 rotate-45"></div>

                <CardHeader className="bg-background border-b-4 border-muted p-6">
                  <CardTitle className="flex items-start justify-between gap-4">
                    <span className="text-2xl font-serif font-bold text-foreground uppercase tracking-wide leading-tight">{item.name}</span>
                    {item.recommended && (
                      <Star className="w-6 h-6 fill-primary text-primary flex-shrink-0 mt-1" />
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  {editMode && editingItem === item.id ? (
                    <div className="space-y-4">
                      <Input
                        value={item.name}
                        onChange={(e) => updateMenuItem('weekendSpecials', item.id, 'name', e.target.value)}
                        placeholder="Nombre"
                        className="border-2 border-muted font-serif"
                      />
                      <Textarea
                        value={item.description}
                        onChange={(e) => updateMenuItem('weekendSpecials', item.id, 'description', e.target.value)}
                        placeholder="Descripción"
                        rows={3}
                        className="border-2 border-muted font-serif"
                      />
                      <div className="flex items-center space-x-3">
                        <span className="text-xl font-bold text-primary">$</span>
                        <Input
                          type="number"
                          value={item.price}
                          onChange={(e) => updateMenuItem('weekendSpecials', item.id, 'price', parseFloat(e.target.value))}
                          className="w-24 border-2 border-muted font-serif font-bold"
                        />
                        <Button
                          size="sm"
                          variant={item.recommended ? "default" : "outline"}
                          onClick={() => updateMenuItem('weekendSpecials', item.id, 'recommended', !item.recommended)}
                          className="border-2 border-muted"
                        >
                          <Star className="w-5 h-5" />
                        </Button>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => setEditingItem(null)}
                        className="w-full bg-secondary hover:bg-secondary/90 text-white font-serif font-bold border-2 border-border"
                      >
                        Listo
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col h-full justify-between">
                      <p className="text-lg font-serif text-card-foreground/80 mb-6 min-h-[80px] leading-relaxed">
                        {item.description}
                      </p>
                      <div className="flex items-center justify-between pt-4 border-t-2 border-muted/30">
                        <p className="text-3xl font-serif font-bold text-primary">
                          ${item.price}
                        </p>
                        {editMode && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingItem(item.id)}
                            className="border-2 border-muted"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WeekendSpecialsSection;
