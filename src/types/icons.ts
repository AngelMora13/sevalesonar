export type EmojiName =
  | 'cupcake'   // 🧁
  | 'cake'      // 🍰
  | 'sparkles'  // ✨
  | 'warning'   // ⚠️
  | 'clock'     // ⏰
  | 'chat'      // 💬
  | 'delivery'  // 🛵
  | 'pin'       // 📍
  | 'lock'      // 🔐
  | 'star';     // ⭐

/**
 * ARCHIVOS PNG VECTORIZADOS/RENDERIZADOS EN /public/assets/emojis/
 */
export const emojiImageMap: Record<EmojiName, string> = {
  cupcake: '/assets/emojis/cupcake.png',
  cake: '/assets/emojis/cake.png',
  sparkles: '/assets/emojis/sparkles.png',
  warning: '/assets/emojis/warning.png',
  clock: '/assets/emojis/clock.png',
  chat: '/assets/emojis/chat.png',
  delivery: '/assets/emojis/delivery.png',
  pin: '/assets/emojis/pin.png',
  lock: '/assets/emojis/lock.png',
  star: '/assets/emojis/star.png'
};

/**
 * DICCIONARIO DE SVGS VECTORIZADOS
 * Si se define un string SVG aquí, tendrá prioridad sobre la imagen PNG.
 */
export const emojiSvgMap: Record<EmojiName, string> = {
  cupcake: '',   // 🧁 Ponquesito / Logo / Menú
  cake: '',      // 🍰 Postres / Otros postres
  sparkles: '',  // ✨ Destellos / Todos / Calidad
  warning: '',   // ⚠️ Alerta de límite / errores
  clock: '',     // ⏰ Horarios de atención
  chat: '',      // 💬 WhatsApp / Mensajes
  delivery: '',  // 🛵 Entregas y envíos
  pin: '',       // 📍 Ubicación / Contacto
  lock: '',      // 🔐 Panel administrativo / Seguridad
  star: ''       // ⭐ Calificaciones / Reseñas
};

/**
 * Caracteres de respaldo
 */
export const emojiFallback: Record<EmojiName, string> = {
  cupcake: '🧁',
  cake: '🍰',
  sparkles: '✨',
  warning: '⚠️',
  clock: '⏰',
  chat: '💬',
  delivery: '🛵',
  pin: '📍',
  lock: '🔐',
  star: '⭐'
};
