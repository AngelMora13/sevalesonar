<template>
  <span
    class="inline-flex items-center justify-center shrink-0 align-middle select-none icon-base"
    :style="computedStyle"
    :title="name"
    aria-hidden="true"
  >
    <!-- Prioridad 1: Si hay SVG inline definido en emojiSvgMap -->
    <span
      v-if="svgContent"
      class="inline-flex items-center justify-center w-full h-full [&>svg]:w-full [&>svg]:h-full"
      v-html="svgContent"
    ></span>

    <!-- Prioridad 2: Si existe la imagen PNG en /assets/emojis/ -->
    <img
      v-else-if="imageSrc"
      :src="imageSrc"
      :alt="name"
      class="w-full h-full object-contain pointer-events-none select-none"
      loading="lazy"
      @error="imageError = true"
    />

    <!-- Prioridad 3: Fallback de texto con el emoji tradicional -->
    <span v-else class="leading-none text-center">
      {{ emojiFallback[name] || '✨' }}
    </span>
  </span>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { emojiSvgMap, emojiImageMap, emojiFallback, type EmojiName } from '../types/icons';

interface Props {
  /**
   * Nombre del emoji a renderizar
   */
  name: EmojiName;

  /**
   * Tamaño del icono (ej: '1.25rem', '24px', '2em', o número en píxeles como 24)
   * Modifica el width y height equivalentes
   */
  fontSize?: string | number;

  /**
   * Ancho explícito (opcional, sobrescribe fontSize)
   */
  width?: string | number;

  /**
   * Alto explícito (opcional, sobrescribe fontSize)
   */
  height?: string | number;

  /**
   * Color de relleno o stroke (opcional)
   */
  color?: string;
}

const props = withDefaults(defineProps<Props>(), {
  fontSize: '1em'
});

const imageError = ref<boolean>(false);

const svgContent = computed(() => {
  return emojiSvgMap[props.name]?.trim() || '';
});

const imageSrc = computed(() => {
  if (imageError.value) return '';
  return emojiImageMap[props.name] || '';
});

const formatDimension = (value?: string | number): string => {
  if (value === undefined || value === null) return '1em';
  return typeof value === 'number' ? `${value}px` : value;
};

const computedStyle = computed(() => {
  const size = formatDimension(props.fontSize);
  const w = props.width ? formatDimension(props.width) : size;
  const h = props.height ? formatDimension(props.height) : size;

  return {
    width: w,
    height: h,
    fontSize: size,
    color: props.color || 'currentColor'
  };
});
</script>
