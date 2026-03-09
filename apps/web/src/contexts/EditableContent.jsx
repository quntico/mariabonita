import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

const EditableContentContext = createContext();

const initialData = {
  themeConfig: {
    fontFamily: "Playfair Display",
    fontSizeScale: 100,
    primaryColor: "#ff3f98",
    secondaryColor: "#d4af37",
    heroOverlayOpacity: 80,
    heroGradientStart: "#000000",
    headerHeight: 120,
    menuSpacing: 48,
  },
  businessInfo: {
    name: "LA FÉLIX",
    subtitle: "Tacos & Antojitos Mexicanos",
    tagline: "Auténtico sabor mexicano con tradición y corazón",
    whatsapp: "+521234567890",
    phone: "+521234567890",
    email: "contacto@lafelix.com",
    address: "Calle Principal #123, Colonia Centro, Ciudad de México",
    hours: {
      weekdays: "Lunes a Viernes: 8:00 AM - 10:00 PM",
      weekends: "Sábados y Domingos: 8:00 AM - 11:00 PM"
    },
    social: {
      facebook: "https://facebook.com/lafelix",
      instagram: "https://instagram.com/lafelix",
      twitter: "https://twitter.com/lafelix"
    },
    heroImage: "https://images.unsplash.com/photo-1701407312283-48083fa2c94d"
  },
  heroBackground: "https://images.unsplash.com/photo-1583438899925-84fde80483b9?q=80&w=2000&auto=format&fit=crop",
  heroDecorations: [
    { id: 'left-dec', url: "https://images.unsplash.com/photo-1613591629098-8eb619ef84dd?q=80&w=600&auto=format&fit=crop", x: -400, y: -200, size: 128 },
    { id: 'right-dec', url: "https://images.unsplash.com/photo-1697410154169-b2bbf83758e6?q=80&w=600&auto=format&fit=crop", x: 400, y: 200, size: 144 }
  ],
  logoUrl: null,
  faviconUrl: null,
  logoTransform: { x: 0, y: 0, scale: 100 },
  posterConfig: {
    titlePart1: "SI CAES QUE SEA EN LA TENTACIÓN",
    bannerText: "DE UNOS",
    titlePart2: "TACOS",
    footerText: "¡GRACIAS POR SU PREFERENCIA!"
  },
  aboutConfig: {
    title: "NUESTRA HISTORIA",
    text: "En MARIA BONITA, preparamos cada platillo con la misma pasión y sazón que nos enseñaron en casa. Utilizamos ingredientes frescos, tortillas hechas a mano y salsas de molcajete para llevar el verdadero sabor de México a tu mesa.",
    bgColor: "rgba(255, 255, 255, 0.6)",
    textColor: "inherit",
    textAlign: "center",
    badges: [
      { id: 1, text1: "100%", text2: "", bgColor: "#ff3f98", size: 80, fontSize: "1.5rem" },
      { id: 2, text1: "SABOR", text2: "REAL", bgColor: "#d4af37", size: 80, fontSize: "1.25rem" },
      { id: 3, text1: "HECHO", text2: "A MANO", bgColor: "#d4af37", size: 80, fontSize: "1.25rem" }
    ]
  },
  menuSectionConfig: {
    title: "NUESTRO MENÚ",
    text: "Descubre nuestros platillos tradicionales mexicanos preparados con amor, recetas de la abuela y los mejores ingredientes.",
    bgColor: "rgba(255, 255, 255, 0.1)",
    textColor: "inherit",
    textAlign: "center"
  },
  menu: {
    tacos: [
      { id: 1, name: "Cecina", description: "", price: 15, recommended: true },
      { id: 2, name: "Bistec", description: "", price: 15, recommended: false },
      { id: 3, name: "Longaniza roja", description: "", price: 15, recommended: false },
      { id: 4, name: "Chorizo verde", description: "", price: 15, recommended: true },
      { id: 5, name: "Pechuga", description: "", price: 15, recommended: false },
      { id: 6, name: "Campechanos", description: "", price: 18, recommended: true }
    ],
    desayunos: [
      { id: 7, name: "Chilaquiles verdes", description: "", price: 45, recommended: true },
      { id: 8, name: "Chilaquiles rojos", description: "", price: 45, recommended: false },
      { id: 9, name: "Huevos al gusto", description: "", price: 40, recommended: false },
      { id: 10, name: "Molletes dulces", description: "", price: 35, recommended: false },
      { id: 11, name: "Molletes salados", description: "", price: 35, recommended: false },
      { id: 12, name: "Waffles", description: "", price: 40, recommended: true }
    ],
    otros: [
      { id: 13, name: "Comida corrida", description: "", price: 65, recommended: true }
    ],
    quesadillas: [
      { id: 14, name: "Quesadillas", description: "", price: 25, recommended: false },
      { id: 15, name: "Sincronizadas", description: "", price: 30, recommended: false }
    ],
    weekendSpecials: [
      { id: 16, name: "Barbacoa", description: "", price: 120, recommended: true },
      { id: 17, name: "Pozole", description: "", price: 80, recommended: true },
      { id: 18, name: "Pancita", description: "", price: 70, recommended: false }
    ],
    bebidas: [
      { id: 19, name: "Aguas frescas", description: "", price: 20, recommended: false },
      { id: 20, name: "Refrescos", description: "", price: 18, recommended: false },
      { id: 21, name: "Licuados", description: "", price: 30, recommended: true },
      { id: 22, name: "Café", description: "", price: 25, recommended: false }
    ]
  },
  gallery: [
    { id: 1, url: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47", title: "Tacos al Pastor" },
    { id: 2, url: "https://images.unsplash.com/photo-1613514785940-daed07799d9b", title: "Tacos Dorados" },
    { id: 3, url: "https://images.unsplash.com/photo-1599974579688-8dbdd335c77f", title: "Quesadillas" }
  ],
  weekendSpecialsActive: true
};

export const EditableContentProvider = ({ children }) => {
  const [data, setData] = useState(() => {
    const saved = localStorage.getItem('lafelixData_v3');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Migrations
      if (!parsed.heroBackground) parsed.heroBackground = initialData.heroBackground;
      if (!parsed.heroDecorations) {
        parsed.heroDecorations = [
          { id: 'left-dec', url: parsed.heroImages?.left || initialData.heroDecorations[0].url, x: -400, y: -200, size: 128 },
          { id: 'right-dec', url: parsed.heroImages?.right || initialData.heroDecorations[1].url, x: 400, y: 200, size: 144 }
        ];
      }
      if (!('logoUrl' in parsed)) parsed.logoUrl = initialData.logoUrl;
      if (!('faviconUrl' in parsed)) parsed.faviconUrl = initialData.faviconUrl;
      if (!('logoTransform' in parsed)) parsed.logoTransform = initialData.logoTransform;
      if (!('themeConfig' in parsed)) parsed.themeConfig = initialData.themeConfig;
      if (!('aboutConfig' in parsed)) parsed.aboutConfig = initialData.aboutConfig;
      if (!('menuSectionConfig' in parsed)) parsed.menuSectionConfig = initialData.menuSectionConfig;
      return parsed;
    }
    return initialData;
  });

  const [editMode, setEditMode] = useState(false);
  const quotaAlertShown = useRef(false);

  useEffect(() => {
    const saveTimer = setTimeout(() => {
      try {
        localStorage.setItem('lafelixData_v3', JSON.stringify(data));
        // Si tuvo exito, reseteamos el ref en caso de que libere espacio despues
        quotaAlertShown.current = false;
      } catch (error) {
        console.error('Error al guardar en localStorage:', error);
        if ((error.name === 'QuotaExceededError' || error.message.includes('quota')) && !quotaAlertShown.current) {
          quotaAlertShown.current = true;
          alert('⚠️ Límite de almacenamiento alcanzado.\n\nEl navegador está lleno por las imágenes pesadas que se han subido. Usa menos fotos de archivo, reemplaza con fotos desde "URL" o usa imágenes ligeras.');
        }
      }
    }, 500);

    return () => clearTimeout(saveTimer);
  }, [data]);

  // Aplicar las configuraciones del tema (Global Styles)
  useEffect(() => {
    if (!data.themeConfig) return;

    const hexToHSL = (hex) => {
      let r = 0, g = 0, b = 0;
      if (hex.length === 4) {
        r = parseInt(hex[1] + hex[1], 16);
        g = parseInt(hex[2] + hex[2], 16);
        b = parseInt(hex[3] + hex[3], 16);
      } else if (hex.length === 7) {
        r = parseInt(hex.substring(1, 3), 16);
        g = parseInt(hex.substring(3, 5), 16);
        b = parseInt(hex.substring(5, 7), 16);
      }
      r /= 255;
      g /= 255;
      b /= 255;
      let cmin = Math.min(r, g, b),
        cmax = Math.max(r, g, b),
        delta = cmax - cmin,
        h = 0,
        s = 0,
        l = 0;

      if (delta === 0) h = 0;
      else if (cmax === r) h = ((g - b) / delta) % 6;
      else if (cmax === g) h = (b - r) / delta + 2;
      else h = (r - g) / delta + 4;

      h = Math.round(h * 60);
      if (h < 0) h += 360;
      l = (cmax + cmin) / 2;
      s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
      s = +(s * 100).toFixed(1);
      l = +(l * 100).toFixed(1);

      return `${h} ${s}% ${l}%`;
    };

    const root = document.documentElement;
    if (data.themeConfig.primaryColor) {
      root.style.setProperty('--primary', hexToHSL(data.themeConfig.primaryColor));
    }
    if (data.themeConfig.secondaryColor) {
      root.style.setProperty('--secondary', hexToHSL(data.themeConfig.secondaryColor));
    }
    if (data.themeConfig.fontFamily) {
      root.style.setProperty('--font-family', data.themeConfig.fontFamily);
      document.body.style.fontFamily = `"${data.themeConfig.fontFamily}", serif`;

      // Aplicar tipografía a encabezados
      const headers = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
      headers.forEach(h => {
        h.style.fontFamily = `"${data.themeConfig.fontFamily}", serif`;
      });
    }
    if (data.themeConfig.fontSizeScale) {
      document.documentElement.style.fontSize = `${data.themeConfig.fontSizeScale}%`;
    }
  }, [data.themeConfig]);

  const updateThemeConfig = (field, value) => {
    setData(prev => ({
      ...prev,
      themeConfig: {
        ...(prev.themeConfig || initialData.themeConfig),
        [field]: value
      }
    }));
  };

  const updateBusinessInfo = (field, value) => {
    setData(prev => ({
      ...prev,
      businessInfo: {
        ...prev.businessInfo,
        [field]: value
      }
    }));
  };

  const updateHeroBackground = (url) => {
    setData(prev => ({
      ...prev,
      heroBackground: url
    }));
  };

  const updateHeroImage = (position, url) => {
    setData(prev => ({
      ...prev,
      heroImages: {
        ...prev.heroImages,
        [position]: url
      }
    }));
  };

  const updateLogoUrl = (url) => {
    setData(prev => ({
      ...prev,
      logoUrl: url,
      // Reset transform when changing logo
      logoTransform: initialData.logoTransform
    }));
  };

  const updateLogoTransform = (field, value) => {
    setData(prev => ({
      ...prev,
      logoTransform: {
        ...(prev.logoTransform || initialData.logoTransform),
        [field]: value
      }
    }));
  };

  const updateFaviconUrl = (url) => {
    setData(prev => ({ ...prev, faviconUrl: url }));
    // Apply favicon instantly
    if (url) {
      let link = document.querySelector("link[rel~='icon']");
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
      }
      link.href = url;
    }
  };

  const updateAboutConfig = (field, value) => {
    setData(prev => ({
      ...prev,
      aboutConfig: {
        ...prev.aboutConfig,
        [field]: value
      }
    }));
  };

  const updateAboutBadge = (id, field, value) => {
    setData(prev => ({
      ...prev,
      aboutConfig: {
        ...prev.aboutConfig,
        badges: (prev.aboutConfig?.badges || initialData.aboutConfig.badges).map(b =>
          b.id === id ? { ...b, [field]: value } : b
        )
      }
    }));
  };

  const updateMenuSectionConfig = (field, value) => {
    setData(prev => ({
      ...prev,
      menuSectionConfig: {
        ...prev.menuSectionConfig,
        [field]: value
      }
    }));
  };

  const updatePosterConfig = (field, value) => {
    setData(prev => ({
      ...prev,
      posterConfig: {
        ...prev.posterConfig,
        [field]: value
      }
    }));
  };

  const updateHours = (type, value) => {
    setData(prev => ({
      ...prev,
      businessInfo: {
        ...prev.businessInfo,
        hours: {
          ...prev.businessInfo.hours,
          [type]: value
        }
      }
    }));
  };

  const updateSocial = (platform, value) => {
    setData(prev => ({
      ...prev,
      businessInfo: {
        ...prev.businessInfo,
        social: {
          ...prev.businessInfo.social,
          [platform]: value
        }
      }
    }));
  };

  const updateMenuItem = (category, itemId, field, value) => {
    setData(prev => ({
      ...prev,
      menu: {
        ...prev.menu,
        [category]: prev.menu[category].map(item =>
          item.id === itemId ? { ...item, [field]: value } : item
        )
      }
    }));
  };

  const addMenuItem = (category, item) => {
    setData(prev => ({
      ...prev,
      menu: {
        ...prev.menu,
        [category]: [...prev.menu[category], { ...item, id: Date.now() }]
      }
    }));
  };

  const removeMenuItem = (category, itemId) => {
    setData(prev => ({
      ...prev,
      menu: {
        ...prev.menu,
        [category]: prev.menu[category].filter(item => item.id !== itemId)
      }
    }));
  };

  const addGalleryImage = (image) => {
    setData(prev => ({
      ...prev,
      gallery: [...prev.gallery, { ...image, id: Date.now() }]
    }));
  };

  const updateGalleryImage = (imageId, field, value) => {
    setData(prev => ({
      ...prev,
      gallery: prev.gallery.map(img =>
        img.id === imageId ? { ...img, [field]: value } : img
      )
    }));
  };

  const removeGalleryImage = (imageId) => {
    setData(prev => ({
      ...prev,
      gallery: prev.gallery.filter(img => img.id !== imageId)
    }));
  };

  const toggleWeekendSpecials = () => {
    setData(prev => ({
      ...prev,
      weekendSpecialsActive: !prev.weekendSpecialsActive
    }));
  };

  const addHeroDecoration = (url) => {
    setData(prev => ({
      ...prev,
      heroDecorations: [
        ...(prev.heroDecorations || []),
        { id: Date.now().toString(), url, x: 0, y: 0, size: 128 }
      ]
    }));
  };

  const updateHeroDecoration = (id, field, value) => {
    setData(prev => ({
      ...prev,
      heroDecorations: (prev.heroDecorations || []).map(dec =>
        dec.id === id ? { ...dec, [field]: value } : dec
      )
    }));
  };

  const removeHeroDecoration = (id) => {
    setData(prev => ({
      ...prev,
      heroDecorations: (prev.heroDecorations || []).filter(dec => dec.id !== id)
    }));
  };

  const value = {
    data,
    editMode,
    setEditMode,
    updateBusinessInfo,
    updateHeroBackground,
    updateHeroImage,
    updateLogoUrl,
    updateLogoTransform,
    updateFaviconUrl,
    updateThemeConfig,
    updatePosterConfig,
    updateHours,
    updateSocial,
    updateMenuItem,
    addMenuItem,
    removeMenuItem,
    addGalleryImage,
    updateGalleryImage,
    removeGalleryImage,
    toggleWeekendSpecials,
    addHeroDecoration,
    updateHeroDecoration,
    removeHeroDecoration,
    updateAboutConfig,
    updateAboutBadge,
    updateMenuSectionConfig
  };

  return (
    <EditableContentContext.Provider value={value}>
      {children}
    </EditableContentContext.Provider>
  );
};

export const useEditableContent = () => {
  const context = useContext(EditableContentContext);
  if (!context) {
    throw new Error('useEditableContent must be used within EditableContentProvider');
  }
  return context;
};
