<template>
  <div class="min-h-screen bg-[#f8f1ea] py-8 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto space-y-8">
      <!-- Top Bar / Header -->
      <div class="glass-card rounded-3xl p-6 sm:p-8 border border-[#e8d2c0] shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div class="flex items-center gap-4">
          <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-rose-500 flex items-center justify-center text-3xl shadow-md shadow-amber-500/20">
            🧁
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
              products.length >= 50
                ? 'bg-rose-100 border-rose-300 text-rose-800'
                : products.length >= 40
                ? 'bg-amber-100 border-amber-300 text-amber-800'
                : 'bg-white border-[#debfa8] text-[#523e32]'
            ]"
          >
            <span class="w-2.5 h-2.5 rounded-full" :class="products.length >= 50 ? 'bg-rose-500' : 'bg-emerald-500'"></span>
            <span>Capacidad: {{ products.length }} / 50 productos</span>
          </div>

          <!-- New Product Button -->
          <button
            type="button"
            @click="openCreateModal"
            :disabled="products.length >= 50"
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
            @click="handleLogout"
            class="px-4 py-2.5 rounded-2xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-sm font-medium transition-colors cursor-pointer"
          >
            Cerrar Sesión
          </button>
        </div>
      </div>

      <!-- Limit Reached Banner -->
      <div
        v-if="products.length >= 50"
        class="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-center gap-3"
      >
        <span class="text-xl">⚠️</span>
        <div>
          <strong>Límite de seguridad alcanzado (50 productos).</strong> Para crear un nuevo producto, elimina alguno inactivo o modifica los existentes. Esta medida protege la base de datos contra abuso.
        </div>
      </div>

      <!-- Filters and Search Bar -->
      <div class="glass-card rounded-3xl p-4 sm:p-6 border border-[#e8d2c0] flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div class="flex flex-wrap items-center gap-2">
          <button
            type="button"
            @click="filterCategory = 'all'"
            :class="[
              'px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer',
              filterCategory === 'all'
                ? 'bg-[#d97736] text-white shadow-xs'
                : 'bg-white text-[#6b5549] hover:bg-[#f5ece4]'
            ]"
          >
            Todos ({{ products.length }})
          </button>
          <button
            type="button"
            @click="filterCategory = 'ponquesitos'"
            :class="[
              'px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer',
              filterCategory === 'ponquesitos'
                ? 'bg-[#d97736] text-white shadow-xs'
                : 'bg-white text-[#6b5549] hover:bg-[#f5ece4]'
            ]"
          >
            🧁 Ponquesitos ({{ countByCat('ponquesitos') }})
          </button>
          <button
            type="button"
            @click="filterCategory = 'otros_postres'"
            :class="[
              'px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer',
              filterCategory === 'otros_postres'
                ? 'bg-[#d97736] text-white shadow-xs'
                : 'bg-white text-[#6b5549] hover:bg-[#f5ece4]'
            ]"
          >
            🍰 Otros Postres ({{ countByCat('otros_postres') }})
          </button>
        </div>

        <div class="relative w-full md:w-64">
          <input
            v-model="searchQuery"
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

      <!-- Products Table / List -->
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
                <th class="py-3.5 px-6 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[#ebd8ca] text-sm text-[#2b1e1a]">
              <tr v-if="filteredProducts.length === 0">
                <td colspan="6" class="py-12 text-center text-[#735a4d]">
                  No se encontraron productos con el filtro aplicado.
                </td>
              </tr>
              <tr
                v-for="p in filteredProducts"
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
                    class="px-2.5 py-1 rounded-full text-xs font-semibold"
                    :class="p.category === 'ponquesitos' ? 'bg-amber-100 text-amber-900' : 'bg-rose-100 text-rose-900'"
                  >
                    {{ p.category === 'ponquesitos' ? '🧁 Ponquesito' : '🍰 Postre' }}
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
                    @click="toggleShowPrice(p)"
                    class="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none"
                    :class="p.show_price ? 'bg-amber-600' : 'bg-gray-300'"
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
                    @click="toggleActive(p)"
                    class="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none"
                    :class="p.active ? 'bg-emerald-600' : 'bg-gray-300'"
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

                <!-- Actions: Edit & Delete -->
                <td class="py-4 px-6 text-right whitespace-nowrap">
                  <div class="inline-flex items-center gap-2">
                    <button
                      type="button"
                      @click="openEditModal(p)"
                      class="p-2 text-[#735a4d] hover:text-[#d97736] hover:bg-[#f7ebe0] rounded-xl transition-colors cursor-pointer"
                      title="Editar producto"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      @click="deleteProduct(p)"
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
    </div>

    <!-- Product Modal (Create & Edit) -->
    <div
      v-if="showModal"
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
            @click="closeModal"
            class="text-[#8a6e60] hover:text-[#2b1e1a] p-1 rounded-lg"
          >
            ✕
          </button>
        </div>

        <!-- Form Errors -->
        <div
          v-if="modalError"
          class="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2"
        >
          <span>⚠️</span>
          <span>{{ modalError }}</span>
        </div>

        <form @submit.prevent="saveProduct" class="space-y-4">
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
              <option value="ponquesitos">🧁 Ponquesitos</option>
              <option value="otros_postres">🍰 Otros Postres</option>
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
                {{ form.image_url }}
              </div>
              <button
                type="button"
                @click="form.image_url = ''"
                class="text-xs text-rose-600 hover:text-rose-800 font-bold px-2 py-1"
              >
                Quitar
              </button>
            </div>

            <!-- Upload Input -->
            <div class="flex items-center gap-2">
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/avif"
                @change="handleFileUpload"
                :disabled="uploadingImage"
                class="text-xs text-[#6e564a] file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-amber-100 file:text-amber-900 hover:file:bg-amber-200 cursor-pointer"
              />
              <span v-if="uploadingImage" class="text-xs text-amber-700 animate-pulse">
                Subiendo a R2...
              </span>
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
              @click="closeModal"
              class="px-4 py-2.5 rounded-xl border border-[#debfa8] text-xs font-semibold text-[#6e564a] hover:bg-[#f7ebe0] transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              :disabled="saving || uploadingImage"
              class="px-5 py-2.5 rounded-xl bg-[#d97736] hover:bg-[#c46527] text-white text-xs font-semibold shadow-xs disabled:opacity-50 transition-colors"
            >
              {{ saving ? 'Guardando...' : (isEditing ? 'Actualizar Producto' : 'Crear Producto') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, onMounted } from 'vue';

interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  show_price: boolean;
  category: 'ponquesitos' | 'otros_postres';
  image_url: string;
  image_key?: string;
  image_size?: number;
  image_mime?: string;
  active: boolean;
  order_index?: number;
}

const products = ref<Product[]>([]);
const filterCategory = ref<'all' | 'ponquesitos' | 'otros_postres'>('all');
const searchQuery = ref('');

// Modal & Form State
const showModal = ref(false);
const isEditing = ref(false);
const currentEditingId = ref('');
const saving = ref(false);
const uploadingImage = ref(false);
const modalError = ref('');

const form = reactive({
  name: '',
  description: '',
  price: '',
  show_price: true,
  category: 'ponquesitos' as 'ponquesitos' | 'otros_postres',
  image_url: '',
  image_key: '',
  image_size: 0,
  image_mime: '',
  active: true
});

const countByCat = (cat: string) => {
  return products.value.filter(p => p.category === cat).length;
};

const filteredProducts = computed(() => {
  return products.value.filter(p => {
    const matchesCat = filterCategory.value === 'all' || p.category === filterCategory.value;
    const query = searchQuery.value.trim().toLowerCase();
    const matchesSearch = !query ||
      p.name.toLowerCase().includes(query) ||
      p.description.toLowerCase().includes(query);
    return matchesCat && matchesSearch;
  });
});

const fetchProducts = async () => {
  try {
    const res = await fetch('/api/admin/products');
    const data = await res.json();
    if (data.success) {
      products.value = Array.isArray(data.data) ? data.data : (Array.isArray(data.products) ? data.products : []);
    }
  } catch (err) {
    console.error('Error fetching admin products:', err);
  }
};

const openCreateModal = () => {
  if (products.value.length >= 50) {
    alert('Has alcanzado el límite máximo de 50 productos.');
    return;
  }
  isEditing.value = false;
  currentEditingId.value = '';
  modalError.value = '';
  form.name = '';
  form.description = '';
  form.price = '';
  form.show_price = true;
  form.category = 'ponquesitos';
  form.image_url = '';
  form.image_key = '';
  form.image_size = 0;
  form.image_mime = '';
  form.active = true;
  showModal.value = true;
};

const openEditModal = (product: Product) => {
  isEditing.value = true;
  currentEditingId.value = product.id;
  modalError.value = '';
  form.name = product.name;
  form.description = product.description;
  form.price = product.price;
  form.show_price = product.show_price;
  form.category = product.category;
  form.image_url = product.image_url;
  form.image_key = product.image_key || '';
  form.image_size = product.image_size || 0;
  form.image_mime = product.image_mime || '';
  form.active = product.active;
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  modalError.value = '';
};

// Image Upload Handler (strictly <= 5MB)
const handleFileUpload = async (event: Event) => {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;

  // 5MB Limit Validation
  const maxBytes = 5 * 1024 * 1024;
  if (file.size > maxBytes) {
    modalError.value = `La imagen pesa ${(file.size / (1024 * 1024)).toFixed(2)}MB. El límite máximo permitido es de 5MB.`;
    input.value = '';
    return;
  }

  modalError.value = '';
  uploadingImage.value = true;

  try {
    const formData = new FormData();
    formData.append('image', file);

    const res = await fetch('/api/admin/upload', {
      method: 'POST',
      body: formData
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      modalError.value = data.error || 'Error subiendo la imagen a Cloudflare R2.';
      return;
    }

    const uploadData = data.data || data;
    form.image_url = uploadData.url;
    form.image_key = uploadData.key || '';
    form.image_size = uploadData.size || file.size;
    form.image_mime = uploadData.mimeType || file.type;
  } catch (err: any) {
    modalError.value = 'Error al subir la imagen.';
  } finally {
    uploadingImage.value = false;
  }
};

const saveProduct = async () => {
  modalError.value = '';

  // Validate Name (Max 30 chars)
  if (!form.name.trim()) {
    modalError.value = 'El nombre es obligatorio.';
    return;
  }
  if (form.name.trim().length > 30) {
    modalError.value = 'El nombre no puede tener más de 30 caracteres.';
    return;
  }

  // Validate Description (Max 500 chars)
  if (form.description.trim().length > 500) {
    modalError.value = 'La descripción no puede tener más de 500 caracteres.';
    return;
  }

  saving.value = true;

  try {
    const url = isEditing.value
      ? `/api/admin/products/${currentEditingId.value}`
      : '/api/admin/products';

    const method = isEditing.value ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: form.name.trim(),
        description: form.description.trim(),
        price: form.price.trim(),
        show_price: form.show_price,
        category: form.category,
        image_url: form.image_url.trim(),
        image_key: form.image_key.trim(),
        image_size: form.image_size,
        image_mime: form.image_mime.trim(),
        active: form.active
      })
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      modalError.value = data.error || 'Error al guardar el producto.';
      return;
    }

    closeModal();
    await fetchProducts();
  } catch (err: any) {
    modalError.value = 'Error al comunicarse con el servidor.';
  } finally {
    saving.value = false;
  }
};

// Fast toggles
const toggleActive = async (product: Product) => {
  const newStatus = !product.active;
  product.active = newStatus;

  try {
    const res = await fetch(`/api/admin/products/${product.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active: newStatus })
    });
    if (!res.ok) {
      product.active = !newStatus; // revert
    }
  } catch {
    product.active = !newStatus;
  }
};

const toggleShowPrice = async (product: Product) => {
  const newStatus = !product.show_price;
  product.show_price = newStatus;

  try {
    const res = await fetch(`/api/admin/products/${product.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ show_price: newStatus })
    });
    if (!res.ok) {
      product.show_price = !newStatus; // revert
    }
  } catch {
    product.show_price = !newStatus;
  }
};

const deleteProduct = async (product: Product) => {
  if (!confirm(`¿Estás seguro de que deseas eliminar permanentemente "${product.name}"?`)) {
    return;
  }

  try {
    const res = await fetch(`/api/admin/products/${product.id}`, {
      method: 'DELETE'
    });
    const data = await res.json();
    if (res.ok && data.success) {
      products.value = products.value.filter(p => p.id !== product.id);
    } else {
      alert(data.error || 'Error al eliminar el producto.');
    }
  } catch {
    alert('Error al conectar con el servidor.');
  }
};

const handleLogout = async () => {
  try {
    await fetch('/api/admin/logout', { method: 'POST' });
  } finally {
    window.location.href = '/admin/login';
  }
};

onMounted(() => {
  fetchProducts();
});
</script>
