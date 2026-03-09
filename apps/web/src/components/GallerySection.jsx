
import React, { useState } from 'react';
import { Plus, Trash2, Edit2, X } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog.jsx';
import { useEditableContent } from '@/contexts/EditableContent.jsx';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast.js';

const GallerySection = () => {
  const { data, editMode, addGalleryImage, updateGalleryImage, removeGalleryImage } = useEditableContent();
  const [selectedImage, setSelectedImage] = useState(null);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newImageTitle, setNewImageTitle] = useState('');
  const { toast } = useToast();

  const handleAddImage = () => {
    if (!newImageUrl) {
      toast({
        title: "Error",
        description: "Por favor ingresa una URL de imagen",
        variant: "destructive"
      });
      return;
    }

    addGalleryImage({
      url: newImageUrl,
      title: newImageTitle || 'Nueva imagen'
    });

    setNewImageUrl('');
    setNewImageTitle('');
    
    toast({
      title: "Imagen agregada",
      description: "La imagen se ha agregado a la galería"
    });
  };

  // Default images if gallery is empty
  const displayGallery = data.gallery.length > 0 ? data.gallery : [
    { id: '1', url: 'https://images.unsplash.com/photo-1613591629098-8eb619ef84dd', title: 'Tacos Tradicionales' },
    { id: '2', url: 'https://images.unsplash.com/photo-1696420691045-330c5669e96c', title: 'Nuestro Espacio' },
    { id: '3', url: 'https://images.unsplash.com/photo-1697410154169-b2bbf83758e6', title: 'Sazón de Hogar' }
  ];

  return (
    <section id="gallery" className="py-24 bg-background wood-pattern-dark border-b-[12px] border-border">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16 bg-card/10 p-8 rounded-sm border-4 border-muted backdrop-blur-sm max-w-4xl mx-auto shadow-rustic"
        >
          <h2 className="text-5xl md:text-7xl font-serif font-bold text-foreground mb-6 uppercase tracking-wider drop-shadow-md">
            Galería
          </h2>
          <div className="flex justify-center items-center space-x-4 mb-6">
            <div className="h-1 w-16 bg-secondary"></div>
            <div className="w-4 h-4 bg-primary rotate-45"></div>
            <div className="h-1 w-16 bg-secondary"></div>
          </div>
          <p className="text-foreground/90 max-w-2xl mx-auto font-serif text-2xl leading-relaxed font-medium">
            Descubre la esencia de nuestra cocina a través de imágenes
          </p>
        </motion.div>

        {editMode && (
          <div className="max-w-2xl mx-auto mb-12 p-8 bg-card rounded-sm border-4 border-dashed border-primary shadow-rustic">
            <h3 className="text-2xl font-serif font-bold mb-6 text-card-foreground uppercase">Agregar Nueva Imagen</h3>
            <div className="space-y-4">
              <Input
                placeholder="URL de la imagen"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                className="border-2 border-muted font-serif text-lg h-12"
              />
              <Input
                placeholder="Título de la imagen (opcional)"
                value={newImageTitle}
                onChange={(e) => setNewImageTitle(e.target.value)}
                className="border-2 border-muted font-serif text-lg h-12"
              />
              <Button onClick={handleAddImage} className="w-full h-14 text-lg font-serif font-bold uppercase tracking-wider border-4 border-border">
                <Plus className="w-6 h-6 mr-2" />
                Agregar Imagen
              </Button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayGallery.map((image, index) => (
            <motion.div
              key={image.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative overflow-hidden rounded-sm shadow-rustic border-8 border-muted bg-card"
            >
              <div className="aspect-square overflow-hidden bg-black">
                <img
                  src={image.url}
                  alt={image.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                  loading="lazy"
                />
              </div>
              
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  {editMode ? (
                    <div className="space-y-3">
                      <Input
                        value={image.title}
                        onChange={(e) => updateGalleryImage(image.id, 'title', e.target.value)}
                        className="bg-card text-card-foreground border-2 border-muted font-serif font-bold"
                        placeholder="Título"
                      />
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => removeGalleryImage(image.id)}
                        className="w-full border-2 border-border font-serif font-bold"
                      >
                        <Trash2 className="w-5 h-5 mr-2" />
                        Eliminar
                      </Button>
                    </div>
                  ) : (
                    <h3 className="text-foreground font-serif font-bold text-2xl uppercase tracking-wider drop-shadow-md border-l-4 border-primary pl-3">
                      {image.title}
                    </h3>
                  )}
                </div>
              </div>

              <button
                onClick={() => setSelectedImage(image)}
                className="absolute top-4 right-4 w-12 h-12 bg-card border-4 border-muted rounded-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-primary hover:border-primary hover:text-white text-card-foreground shadow-lg"
              >
                <Edit2 className="w-6 h-6" />
              </button>
            </motion.div>
          ))}
        </div>

        {/* Image Preview Dialog */}
        <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
          <DialogContent className="max-w-5xl bg-card border-8 border-muted p-1 rounded-sm">
            <DialogHeader className="p-4 bg-background border-b-4 border-muted">
              <DialogTitle className="text-3xl font-serif font-bold text-foreground uppercase tracking-wider">
                {selectedImage?.title}
              </DialogTitle>
            </DialogHeader>
            {selectedImage && (
              <div className="relative bg-black p-2">
                <img
                  src={selectedImage.url}
                  alt={selectedImage.title}
                  className="w-full h-auto max-h-[70vh] object-contain border-4 border-muted"
                />
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
};

export default GallerySection;
