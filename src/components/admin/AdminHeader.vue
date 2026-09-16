<template>
  <header class="glass-card rounded-3xl p-6 sm:p-8 border border-[#e8d2c0] shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-6">
    <div class="flex items-center gap-4">
      <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-rose-500 flex items-center justify-center text-3xl shadow-md shadow-amber-500/20">
        <IconBase name="cupcake" fontSize="1.8rem" />
      </div>
      <div>
        <div class="flex items-center gap-3">
          <h1 class="text-2xl sm:text-3xl font-bold font-display text-[#2b1e1a]">
            Panel de Administración
          </h1>
          <span class="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
            Se Vale Soñar
          </span>
        </div>
        <p class="text-sm text-[#735a4d] mt-0.5">
          Gestión de catálogo, precios y almacenamiento en Cloudflare
        </p>
      </div>
    </div>

    <div class="flex flex-wrap items-center gap-3">
      <!-- Capacity Counter Badge (Max 50 products) -->
      <div
        :class="[
          'px-4 py-2 rounded-2xl text-xs font-bold border flex items-center gap-2',
          productCount >= maxProducts
            ? 'bg-rose-100 border-rose-300 text-rose-800'
            : productCount >= 40
            ? 'bg-amber-100 border-amber-300 text-amber-800'
            : 'bg-white border-[#debfa8] text-[#523e32]'
        ]"
      >
        <span class="w-2.5 h-2.5 rounded-full" :class="productCount >= maxProducts ? 'bg-rose-500' : 'bg-emerald-500'"></span>
        <span>Capacidad: {{ productCount }} / {{ maxProducts }} productos</span>
      </div>

      <!-- New Product Button -->
      <button
        type="button"
        @click="$emit('create')"
        :disabled="productCount >= maxProducts"
        class="px-5 py-2.5 rounded-2xl bg-[#d97736] hover:bg-[#c46527] text-white font-semibold text-sm shadow-md transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        <span>Nuevo Producto</span>
      </button>

      <!-- Back to Public Site -->
      <a
        href="/"
        class="px-4 py-2.5 rounded-2xl bg-white border border-[#debfa8] text-[#523e32] hover:text-[#2b1e1a] text-sm font-medium transition-colors"
      >
        Ver Catálogo
      </a>


      <!-- Logout Button -->
      <button
        type="button"
        @click="$emit('logout')"
        class="px-4 py-2.5 rounded-2xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-sm font-medium transition-colors cursor-pointer"
      >
        Cerrar Sesión
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
import IconBase from '../IconBase.vue';

defineProps<{
  productCount: number;
  maxProducts: number;
}>();

defineEmits<{
  (e: 'create'): void;
  (e: 'logout'): void;
}>();
</script>
