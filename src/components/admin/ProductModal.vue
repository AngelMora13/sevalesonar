<template>
  <div
    v-if="show"
    class="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-4"
  >
    <div class="bg-[#fffbf7] rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-[#e8d2c0] shadow-2xl space-y-6 relative max-h-[90vh] overflow-y-auto">
      <!-- Modal Header -->
      <div class="flex items-center justify-between border-b border-[#ebd8ca] pb-4">
        <h3 class="text-xl font-bold font-display text-[#2b1e1a]">
          {{ isEditing ? 'Editar Producto' : 'Crear Nuevo Producto' }}
        </h3>
        <button
          type="button"
          @click="$emit('close')"
          class="text-[#8a6e60] hover:text-[#2b1e1a] p-1 rounded-lg cursor-pointer"
        >
          ✕
        </button>
      </div>

      <!-- Form Errors -->
      <div
        v-if="modalError"
        class="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2"
      >
        <IconBase name="warning" fontSize="1rem" />
        <span>{{ modalError }}</span>
      </div>

      <form @submit.prevent="$emit('save')" class="space-y-4">
        <!-- Name (Max 30 chars) -->
        <div>
          <div class="flex justify-between items-center mb-1">
            <label class="text-xs font-bold uppercase tracking-wider text-[#523e32]">
              Nombre del Producto *
            </label>
            <span
              class="text-[11px]"
              :class="form.name.length > 30 ? 'text-rose-600 font-bold' : 'text-[#8a6e60]'"
            >
              {{ form.name.length }} / 30
            </span>
          </div>
          <input
            v-model="form.name"
            type="text"
            required
            maxlength="30"
            placeholder="Ej: Ponquesito Red Velvet"
            class="w-full px-4 py-2.5 bg-white border border-[#debfa8] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#d97736]"
          />
        </div>

        <!-- Category (Fixed in Code) -->
        <div>
          <label class="block text-xs font-bold uppercase tracking-wider text-[#523e32] mb-1">
            Categoría (Fija) *
          </label>
          <select
            v-model="form.category"
            required
            class="w-full px-4 py-2.5 bg-white border border-[#debfa8] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#d97736]"
          >
            <option value="ponquesitos">Ponquesitos</option>
            <option value="otros_postres">Otros Postres</option>
          </select>
        </div>

        <!-- Price & Show Price -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-[#523e32] mb-1">
              Precio (Texto libre)
            </label>
            <input
              v-model="form.price"
              type="text"
              placeholder="Ej: $2.00 c/u, 3 por $5"
              class="w-full px-4 py-2.5 bg-white border border-[#debfa8] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#d97736]"
            />
          </div>

          <div class="flex flex-col justify-end">
            <label class="flex items-center gap-2 cursor-pointer pt-3 sm:pt-0">
              <input
                v-model="form.show_price"
                type="checkbox"
                class="rounded text-[#d97736] focus:ring-[#d97736] w-4 h-4"
              />
              <span class="text-xs font-semibold text-[#523e32]">Mostrar precio al público</span>
            </label>
          </div>
        </div>

        <!-- Description (Max 500 chars) -->
        <div>
          <div class="flex justify-between items-center mb-1">
            <label class="text-xs font-bold uppercase tracking-wider text-[#523e32]">
              Descripción del Producto
            </label>
            <span
              class="text-[11px]"
              :class="form.description.length > 500 ? 'text-rose-600 font-bold' : 'text-[#8a6e60]'"
            >
              {{ form.description.length }} / 500
            </span>
          </div>
          <textarea
            v-model="form.description"
            rows="3"
            maxlength="500"
            placeholder="Detalles sobre sabor, rellenos, ingredientes..."
            class="w-full px-4 py-2.5 bg-white border border-[#debfa8] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#d97736]"
          ></textarea>
        </div>

        <!-- Image Upload (Max 5MB) -->
        <div>
          <label class="block text-xs font-bold uppercase tracking-wider text-[#523e32] mb-1">
            Imagen del Producto (Máx 5MB)
          </label>

          <!-- Image preview -->
          <div v-if="form.image_url" class="mb-3 flex items-center gap-3 p-2 bg-white rounded-xl border border-[#debfa8]">
            <img
              :src="form.image_url"
              alt="Vista previa"
              class="w-14 h-14 object-cover rounded-lg bg-[#f3e5d8]"
            />
            <div class="text-xs truncate flex-1 text-[#735a4d]">
              <span class="font-medium text-[#2b1e1a] block truncate">{{ form.image_url }}</span>
              <span v-if="form.image_size" class="text-[10px] text-gray-500">
                {{ (form.image_size / (1024 * 1024)).toFixed(2) }} MB
              </span>
            </div>
            <button
              type="button"
              @click="$emit('remove-image')"
              class="text-xs text-rose-600 hover:text-rose-800 font-bold px-2 py-1 cursor-pointer"
            >
              Quitar
            </button>
          </div>

          <!-- Upload Input -->
          <div class="flex items-center gap-2">
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/avif"
              @change="$emit('file-upload', $event)"
              :disabled="uploadingImage"
              class="text-xs text-[#6e564a] file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-amber-100 file:text-amber-900 hover:file:bg-amber-200 cursor-pointer"
            />
            <span v-if="uploadingImage" class="text-xs text-amber-700 animate-pulse">
              Subiendo a R2...
            </span>
          </div>
        </div>

        <!-- Featured on Hero Section -->
        <div class="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-3">
          <label class="flex items-center gap-2.5 cursor-pointer">
            <input
              v-model="form.is_featured"
              type="checkbox"
              class="rounded text-amber-600 focus:ring-amber-500 w-4 h-4"
            />
            <span class="text-xs font-bold text-[#6b3e15] flex items-center gap-1.5">
              <span>⭐</span>
              <span>Destacar en la Portada Principal (Hero)</span>
            </span>
          </label>
          <p class="text-[11px] text-[#855938] leading-relaxed">
            Si se activa, este producto aparecerá en la tarjeta principal del Hero en el inicio. Al activarlo, reemplazará a cualquier producto destacado anterior.
          </p>

          <div v-if="form.is_featured" class="space-y-3 pt-2 border-t border-amber-200/60">
            <div>
              <label class="block text-[11px] font-bold uppercase tracking-wider text-[#6b3e15] mb-1">
                Etiqueta / Badge en portada
              </label>
              <input
                v-model="form.featured_label"
                type="text"
                maxlength="40"
                placeholder="Ej: Especialidad de la casa"
                class="w-full px-3.5 py-2 bg-white border border-amber-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#d97736]"
              />
            </div>

            <div>
              <label class="block text-[11px] font-bold uppercase tracking-wider text-[#6b3e15] mb-1">
                Descripción / Subtítulo en portada
              </label>
              <input
                v-model="form.featured_description"
                type="text"
                maxlength="100"
                placeholder="Ej: Horneados frescos cada mañana"
                class="w-full px-3.5 py-2 bg-white border border-amber-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#d97736]"
              />
            </div>

            <div class="p-2.5 rounded-xl bg-white/80 border border-amber-200 text-[11px] text-[#73513b]">
              <span class="font-semibold block mb-0.5">Vista previa en portada:</span>
              <span class="text-amber-800 font-bold uppercase text-[10px] block">🏷️ {{ form.featured_label || 'Especialidad de la casa' }}</span>
              <span class="font-display font-bold text-[#2b1e1a] text-xs block">{{ form.name || 'Nombre del producto' }}</span>
              <span class="text-gray-600 block text-[10px]">{{ form.featured_description || 'Horneados frescos cada mañana' }}</span>
            </div>
          </div>
        </div>

        <!-- Active Checkbox -->
        <div class="pt-2">
          <label class="flex items-center gap-2 cursor-pointer">
            <input
              v-model="form.active"
              type="checkbox"
              class="rounded text-emerald-600 focus:ring-emerald-600 w-4 h-4"
            />
            <span class="text-xs font-semibold text-[#523e32]">
              Producto activo (visible en el catálogo público)
            </span>
          </label>
        </div>

        <!-- Modal Action Buttons -->
        <div class="pt-4 border-t border-[#ebd8ca] flex items-center justify-end gap-3">
          <button
            type="button"
            @click="$emit('close')"
            class="px-4 py-2.5 rounded-xl border border-[#debfa8] text-xs font-semibold text-[#6e564a] hover:bg-[#f7ebe0] transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="submit"
            :disabled="saving || uploadingImage"
            class="px-5 py-2.5 rounded-xl bg-[#d97736] hover:bg-[#c46527] text-white text-xs font-semibold shadow-xs disabled:opacity-50 transition-colors cursor-pointer"
          >
            {{ saving ? 'Guardando...' : (isEditing ? 'Actualizar Producto' : 'Crear Producto') }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ProductFormData } from '../../types/product';
import IconBase from '../IconBase.vue';

defineProps<{
  show: boolean;
  isEditing: boolean;
  form: ProductFormData;
  saving: boolean;
  uploadingImage: boolean;
  modalError: string;
}>();

defineEmits<{
  (e: 'close'): void;
  (e: 'save'): void;
  (e: 'file-upload', event: Event): void;
  (e: 'remove-image'): void;
}>();
</script>
