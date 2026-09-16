<template>
  <div class="glass-card rounded-3xl p-4 sm:p-6 border border-[#e8d2c0] flex flex-col md:flex-row md:items-center md:justify-between gap-4">
    <div class="flex flex-wrap items-center gap-2">
      <button
        type="button"
        @click="$emit('update:modelValue', 'all')"
        :class="[
          'px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5',
          modelValue === 'all'
            ? 'bg-[#d97736] text-white shadow-xs'
            : 'bg-white text-[#6b5549] hover:bg-[#f5ece4]'
        ]"
      >
        <span>Todos ({{ totalCount }})</span>
      </button>

      <button
        type="button"
        @click="$emit('update:modelValue', 'ponquesitos')"
        :class="[
          'px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5',
          modelValue === 'ponquesitos'
            ? 'bg-[#d97736] text-white shadow-xs'
            : 'bg-white text-[#6b5549] hover:bg-[#f5ece4]'
        ]"
      >
        <IconBase name="cupcake" fontSize="1rem" />
        <span>Ponquesitos ({{ ponquesitosCount }})</span>
      </button>

      <button
        type="button"
        @click="$emit('update:modelValue', 'otros_postres')"
        :class="[
          'px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5',
          modelValue === 'otros_postres'
            ? 'bg-[#d97736] text-white shadow-xs'
            : 'bg-white text-[#6b5549] hover:bg-[#f5ece4]'
        ]"
      >
        <IconBase name="cake" fontSize="1rem" />
        <span>Otros Postres ({{ otrosPostresCount }})</span>
      </button>
    </div>

    <div class="relative w-full md:w-64">
      <input
        :value="searchQuery"
        @input="$emit('update:searchQuery', ($event.target as HTMLInputElement).value)"
        type="text"
        placeholder="Filtrar por nombre..."
        class="w-full pl-9 pr-4 py-2 bg-white border border-[#debfa8] rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#d97736]"
      />
      <svg
        class="w-3.5 h-3.5 text-[#9c7866] absolute left-3 top-1/2 -translate-y-1/2"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CategoryId } from '../../types/product';
import IconBase from '../IconBase.vue';

defineProps<{
  modelValue: 'all' | CategoryId;
  searchQuery: string;
  totalCount: number;
  ponquesitosCount: number;
  otrosPostresCount: number;
}>();

defineEmits<{
  (e: 'update:modelValue', val: 'all' | CategoryId): void;
  (e: 'update:searchQuery', val: string): void;
}>();
</script>
