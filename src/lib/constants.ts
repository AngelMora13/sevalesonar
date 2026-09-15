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

export const CONTACT_INFO = {
  storeName: 'Se Vale Soñar',
  tagline: 'Repostería Artesanal & Momentos Dulces',
  whatsappNumber: '584120000000', // Reemplazar con el número real de WhatsApp internacional
  whatsappFormatted: '+58 412-000-0000',
  instagram: '@sevalesonar.reposteria',
  instagramUrl: 'https://instagram.com',
  scheduleWeekdays: 'Lunes a Sábado: 9:00 AM - 7:00 PM',
  scheduleWeekend: 'Domingos: 10:00 AM - 4:00 PM',
  location: 'Caracas, Venezuela',
  pickupNote: 'Entregas personales previo acuerdo y delivery en la zona metropolitana'
} as const;
