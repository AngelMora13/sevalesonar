export const CATEGORIES = [
  { id: 'ponquesitos', label: 'Ponquesitos', icon: 'cake' },
  { id: 'otros_postres', label: 'Otros Postres', icon: 'dessert' }
] as const;

export type CategoryId = typeof CATEGORIES[number]['id'];

export const VALID_CATEGORIES: string[] = CATEGORIES.map(c => c.id);

export const PRODUCT_LIMITS = {
  MAX_PRODUCTS: 50,
  MAX_NAME_LENGTH: 30,
  MAX_DESCRIPTION_LENGTH: 500,
  MAX_IMAGE_SIZE_BYTES: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif']
} as const;

/**
 * CONFIGURACIÓN CENTRALIZADA DEL SITIO WEB Y DATOS DE CONTACTO
 * Toda la información personalizada, SEO y textos de la landing se gestionan aquí.
 */
export const SITE_INFO = {
  // Identidad de marca
  storeName: 'Se Vale Soñar',
  shortName: 'Se Vale Soñar',
  subheading: 'Repostería Fina',
  tagline: 'Repostería Artesanal & Momentos Dulces',
  siteUrl: 'https://sevalesonar.com', // Dominio canónico para SEO

  // Metadatos SEO y Redes Sociales
  title: 'Se Vale Soñar | Catálogo de Ponquesitos & Postres Artesanales',
  description: 'Catálogo exclusivo de ponquesitos y repostería artesanal en Maracaibo. Deliciosas creaciones horneadas con ingredientes premium para celebrar y regalar.',
  keywords: [
    'ponquesitos',
    'cupcakes maracaibo',
    'repostería artesanal',
    'postres maracaibo',
    'dulces para eventos',
    'ponquesitos artesanales',
    'mesas de postres',
    'se vale soñar'
  ],
  author: 'Se Vale Soñar',
  ogImage: '/assets/emojis/cupcake.png',
  locale: 'es_VE',

  // Textos personalizables de la sección Hero
  heroBadge: 'Horneado hoy con pasión',
  heroTitlePrefix: 'Endulzamos tus momentos',
  heroTitleHighlight: 'más felices',
  heroDescription: 'Descubre nuestra selección de ponquesitos y postres caseros hechos con ingredientes premium. Perfectos para celebrar, compartir o darte un gusto especial.',

  // Canales de Contacto Directo
  whatsappNumber: '584120757802', // Código de país + número sin símbolos para wa.me
  whatsappFormatted: '+58 412-0757802',
  whatsappDefaultMessage: '¡Hola Se Vale Soñar! 🧁 Me gustaría hacer una consulta o pedido.',
  whatsappCustomMessage: '¡Hola Se Vale Soñar! 🧁 Me gustaría hacer un pedido personalizado.',
  instagram: '@cupcakesevalesoñar',
  instagramUrl: 'https://instagram.com/cupcakesevalesoñar',

  // Horarios y Logística
  scheduleWeekdays: 'Lunes a Sábado: 9:00 AM - 7:00 PM',
  scheduleWeekend: 'Domingos: 10:00 AM - 4:00 PM',
  specialNotice: 'Pedidos para eventos especiales con 48h de anticipación.',
  location: 'Maracaibo, Venezuela',
  pickupNote: 'Entregas personales previo acuerdo y delivery en toda maracaibo'
} as const;

// Alias para compatibilidad con código existente
export const CONTACT_INFO = SITE_INFO;
