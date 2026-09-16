<template>
  <div class="glass-card rounded-3xl border border-[#e8d2c0] overflow-hidden shadow-xs">
    <div class="overflow-x-auto">
      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="border-b border-[#ebd8ca] bg-[#fbf3eb]/80 text-[11px] font-bold uppercase tracking-wider text-[#6e564a]">
            <th class="py-3.5 px-6">Producto</th>
            <th class="py-3.5 px-4">Categoría</th>
            <th class="py-3.5 px-4">Precio</th>
            <th class="py-3.5 px-4">Mostrar Precio</th>
            <th class="py-3.5 px-4">Estado</th>
            <th class="py-3.5 px-4 text-center">Portada</th>
            <th class="py-3.5 px-6 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-[#ebd8ca] text-sm text-[#2b1e1a]">
          <tr v-if="products.length === 0">
            <td colspan="7" class="py-12 text-center text-[#735a4d]">
              No se encontraron productos con el filtro aplicado.
            </td>
          </tr>

          <tr
            v-for="p in products"
            :key="p.id"
            class="hover:bg-white/60 transition-colors"
          >
            <!-- Image & Name & Description -->
            <td class="py-4 px-6">
              <div class="flex items-center gap-3">
                <img
                  :src="p.image_url || '/placeholder-pastry.svg'"
                  :alt="p.name"
                  class="w-12 h-12 rounded-xl object-cover bg-[#f3e5d8] border border-[#ebd8ca] shrink-0"
                />
                <div class="min-w-0">
                  <p class="font-bold text-[#2b1e1a] truncate max-w-[200px] sm:max-w-xs">
                    {{ p.name }}
                  </p>
                  <p class="text-xs text-[#735a4d] truncate max-w-[200px] sm:max-w-xs">
                    {{ p.description || 'Sin descripción' }}
                  </p>
                </div>
              </div>
            </td>

            <!-- Category -->
            <td class="py-4 px-4 whitespace-nowrap">
              <span
                class="px-2.5 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1.5"
                :class="p.category === 'ponquesitos' ? 'bg-amber-100 text-amber-900' : 'bg-rose-100 text-rose-900'"
              >
                <IconBase :name="p.category === 'ponquesitos' ? 'cupcake' : 'cake'" fontSize="0.9rem" />
                <span>{{ p.category === 'ponquesitos' ? 'Ponquesito' : 'Postre' }}</span>
              </span>
            </td>

            <!-- Price Text -->
            <td class="py-4 px-4 whitespace-nowrap">
              <span class="font-bold text-[#b8561d]">
                {{ p.price || 'No asignado' }}
              </span>
            </td>

            <!-- Show Price Toggle Switch -->
            <td class="py-4 px-4 whitespace-nowrap">
              <button
                type="button"
                @click="$emit('toggle-price', p)"
                class="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none"
                :class="p.show_price ? 'bg-amber-600' : 'bg-gray-300'"
                :aria-label="p.show_price ? 'Ocultar precio' : 'Mostrar precio'"
              >
                <span
                  class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out"
                  :class="p.show_price ? 'translate-x-5' : 'translate-x-0'"
                />
              </button>
            </td>

            <!-- Active Toggle Switch -->
            <td class="py-4 px-4 whitespace-nowrap">
              <button
                type="button"
                @click="$emit('toggle-active', p)"
                class="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none"
                :class="p.active ? 'bg-emerald-600' : 'bg-gray-300'"
                :aria-label="p.active ? 'Desactivar producto' : 'Activar producto'"
              >
                <span
                  class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out"
                  :class="p.active ? 'translate-x-5' : 'translate-x-0'"
                />
              </button>
              <span class="ml-2 text-xs font-medium" :class="p.active ? 'text-emerald-700' : 'text-gray-500'">
                {{ p.active ? 'Visible' : 'Oculto' }}
              </span>
            </td>

            <!-- Featured in Hero Toggle/Indicator -->
            <td class="py-4 px-4 text-center whitespace-nowrap">
              <button
                type="button"
                @click="$emit('toggle-featured', p)"
                class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold cursor-pointer transition-all border shadow-2xs"
                :class="p.is_featured 
                  ? 'bg-amber-100 border-amber-300 text-amber-900 ring-2 ring-amber-400/30' 
                  : 'bg-white/70 border-[#ebd8ca] text-gray-400 hover:text-amber-800 hover:bg-amber-50/60'"
                :title="p.is_featured ? 'Producto destacado en la portada principal (Hero). Haz clic para alternar.' : 'Hacer producto destacado en la portada principal (Hero)'"
              >
                <IconBase name="star" fontSize="0.95rem" />
                <span>{{ p.is_featured ? 'Destacado' : 'Destacar' }}</span>
              </button>
            </td>

            <!-- Actions: Edit & Delete -->
            <td class="py-4 px-6 text-right whitespace-nowrap">
              <div class="inline-flex items-center gap-2">
                <button
                  type="button"
                  @click="$emit('edit', p)"
                  class="p-2 text-[#735a4d] hover:text-[#d97736] hover:bg-[#f7ebe0] rounded-xl transition-colors cursor-pointer"
                  title="Editar producto"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  type="button"
                  @click="$emit('delete', p)"
                  class="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                  title="Eliminar producto"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Product } from '../../types/product';
import IconBase from '../IconBase.vue';

defineProps<{
  products: Product[];
}>();

defineEmits<{
  (e: 'edit', product: Product): void;
  (e: 'delete', product: Product): void;
  (e: 'toggle-active', product: Product): void;
  (e: 'toggle-price', product: Product): void;
  (e: 'toggle-featured', product: Product): void;
}>();
</script>
