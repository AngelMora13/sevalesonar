<template>
  <section id="catalogo" class="py-12 md:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <!-- Category & Search Bar -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">
      <!-- Category Filter Tabs -->
      <div class="inline-flex p-1.5 bg-[#f5ebe1] rounded-2xl border border-[#e8d7c8] shadow-inner self-start md:self-auto overflow-x-auto max-w-full">
        <button
          type="button"
          @click="activeCategory = 'all'"
          :class="[
            'px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 flex items-center gap-2 whitespace-nowrap cursor-pointer',
            activeCategory === 'all'
              ? 'bg-white text-[#8c3b1a] shadow-sm font-semibold'
              : 'text-[#6b5549] hover:text-[#2b1e1a]'
          ]"
        >
          <span>✨ Todos</span>
          <span class="text-xs px-2 py-0.5 rounded-full bg-[#faefe5] font-bold text-[#8c3b1a]">
            {{ products.length }}
          </span>
        </button>

        <button
          type="button"
          @click="activeCategory = 'ponquesitos'"
          :class="[
            'px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 flex items-center gap-2 whitespace-nowrap cursor-pointer',
            activeCategory === 'ponquesitos'
              ? 'bg-white text-[#8c3b1a] shadow-sm font-semibold'
              : 'text-[#6b5549] hover:text-[#2b1e1a]'
          ]"
        >
          <span>🧁 Ponquesitos</span>
          <span class="text-xs px-2 py-0.5 rounded-full bg-[#faefe5] font-bold text-[#8c3b1a]">
            {{ countByCategory('ponquesitos') }}
          </span>
        </button>

        <button
          type="button"
          @click="activeCategory = 'otros_postres'"
          :class="[
            'px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 flex items-center gap-2 whitespace-nowrap cursor-pointer',
            activeCategory === 'otros_postres'
              ? 'bg-white text-[#8c3b1a] shadow-sm font-semibold'
              : 'text-[#6b5549] hover:text-[#2b1e1a]'
          ]"
        >
          <span>🍰 Otros Postres</span>
          <span class="text-xs px-2 py-0.5 rounded-full bg-[#faefe5] font-bold text-[#8c3b1a]">
            {{ countByCategory('otros_postres') }}
          </span>
        </button>
      </div>

      <!-- Live Search Box -->
      <div class="relative w-full md:w-72">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Buscar sabor o postre..."
          class="w-full pl-10 pr-4 py-2.5 bg-white border border-[#e5cbba] rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#d97736] focus:border-transparent transition-all shadow-xs"
        />
        <svg
          class="w-4 h-4 text-[#9c7866] absolute left-3.5 top-1/2 -translate-y-1/2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      <div v-for="i in 6" :key="i" class="animate-pulse bg-white rounded-3xl p-4 border border-[#f0ded2]">
        <div class="h-64 bg-[#f4e7dc] rounded-2xl mb-4"></div>
        <div class="h-6 bg-[#f4e7dc] rounded w-3/4 mb-2"></div>
        <div class="h-4 bg-[#f4e7dc] rounded w-full mb-2"></div>
        <div class="h-4 bg-[#f4e7dc] rounded w-2/3 mb-4"></div>
        <div class="h-10 bg-[#f4e7dc] rounded-xl"></div>
      </div>
    </div>

    <!-- Empty Results State -->
    <div v-else-if="filteredProducts.length === 0" class="text-center py-16 bg-white/70 rounded-3xl border border-[#f0ded2] p-8 max-w-lg mx-auto">
      <div class="text-5xl mb-3">🧁</div>
      <h3 class="text-xl font-bold font-display text-[#2b1e1a] mb-1">No encontramos ese dulce</h3>
      <p class="text-sm text-[#735a4d] mb-4">Prueba buscando con otro nombre o selecciona otra categoría.</p>
      <button
        @click="searchQuery = ''; activeCategory = 'all'"
        class="px-4 py-2 bg-[#d97736] text-white rounded-xl text-sm font-medium hover:bg-[#c46527] transition-colors"
      >
        Ver todos los productos
      </button>
    </div>

    <!-- Product Grid -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      <article
        v-for="product in filteredProducts"
        :key="product.id"
        class="group glass-card rounded-3xl overflow-hidden border border-[#f0ded2] transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col justify-between"
      >
        <div>
          <!-- Product Image Container -->
          <div class="relative h-64 overflow-hidden bg-[#faefe5]">
            <img
              :src="product.image_url || '/placeholder-pastry.svg'"
              :alt="product.name"
              class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
              @error="handleImageError($event)"
            />
            <!-- Category Tag Badge -->
            <span
              class="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md shadow-xs"
              :class="product.category === 'ponquesitos' ? 'bg-amber-500/90 text-white' : 'bg-rose-600/90 text-white'"
            >
              {{ product.category === 'ponquesitos' ? '🧁 Ponquesito' : '🍰 Postre' }}
            </span>
          </div>

          <!-- Product Details -->
          <div class="p-6 pb-2">
            <div class="flex items-start justify-between gap-2 mb-2">
              <h3 class="text-xl font-bold font-display text-[#2b1e1a] group-hover:text-[#d97736] transition-colors line-clamp-1">
                {{ product.name }}
              </h3>
            </div>

            <!-- Price Tag (if show_price is enabled) -->
            <div v-if="product.show_price && product.price" class="mb-3">
              <span class="inline-flex items-center text-lg font-bold text-[#b8561d] bg-[#fcf2ea] px-3 py-1 rounded-xl border border-[#eed4c2]">
                {{ product.price }}
              </span>
            </div>
            <div v-else-if="product.show_price === false" class="mb-3">
              <span class="inline-flex items-center text-xs font-semibold text-[#826a5d] bg-[#f5ece4] px-2.5 py-1 rounded-lg">
                Precio a consultar
              </span>
            </div>

            <p class="text-sm text-[#614b3f] leading-relaxed line-clamp-3">
              {{ product.description }}
            </p>
          </div>
        </div>

        <!-- Order via WhatsApp Action Button -->
        <div class="p-6 pt-4 border-t border-[#f7eae0]/60 mt-auto">
          <a
            :href="getWhatsAppLink(product)"
            target="_blank"
            rel="noopener noreferrer"
            class="w-full inline-flex items-center justify-center gap-2.5 py-3 px-5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold shadow-md shadow-emerald-600/20 hover:shadow-lg hover:shadow-emerald-600/30 transition-all duration-200 active:scale-[0.98]"
          >
            <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.699c.969.54 1.761.802 2.796.802 3.181 0 5.767-2.586 5.768-5.766 0-3.18-2.587-5.768-5.768-5.768zm3.393 8.354c-.143.403-.834.774-1.161.824-.307.047-.698.077-1.127-.061-.264-.085-.595-.213-1.018-.396-1.782-.771-2.94-2.569-3.03-2.688-.089-.119-.726-.967-.726-1.846 0-.879.461-1.312.625-1.49.164-.178.357-.223.476-.223.119 0 .238.001.341.006.109.005.253-.042.395.3.143.342.49 1.196.535 1.285.045.089.075.193.015.312-.06.119-.089.193-.178.297-.089.104-.188.232-.268.312-.089.089-.182.186-.078.364.104.178.463.764.994 1.237.684.61 1.261.799 1.44.888.178.089.282.074.386-.045.104-.119.446-.52.565-.698.119-.178.238-.149.395-.089.158.06 1.002.472 1.173.558.171.086.286.128.328.2.042.072.042.417-.101.82zM12 2C6.477 2 2 6.477 2 12c0 1.891.526 3.66 1.444 5.174L2 22l4.981-1.393C8.423 21.493 10.154 22 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2z"/>
            </svg>
            <span>Pedir por WhatsApp</span>
          </a>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';

interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  show_price: boolean;
  category: string;
  image_url: string;
  active: boolean;
  order_index?: number;
}

const props = defineProps<{
  initialProducts?: Product[];
  whatsappNumber: string;
}>();

const products = ref<Product[]>(props.initialProducts || []);
const activeCategory = ref<'all' | 'ponquesitos' | 'otros_postres'>('all');
const searchQuery = ref('');
const loading = ref(false);

const countByCategory = (cat: string) => {
  return products.value.filter(p => p.category === cat).length;
};

const filteredProducts = computed(() => {
  return products.value.filter(item => {
    const matchesCat = activeCategory.value === 'all' || item.category === activeCategory.value;
    const query = searchQuery.value.trim().toLowerCase();
    const matchesSearch = !query ||
      item.name.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query);
    return matchesCat && matchesSearch;
  });
});

const getWhatsAppLink = (product: Product) => {
  let message = `¡Hola Se Vale Soñar! 🧁 Me gustaría hacer un pedido del producto: *${product.name}*`;
  if (product.show_price && product.price) {
    message += ` (${product.price})`;
  }
  message += `. ¿Tienen disponibilidad? ¡Muchas gracias!`;

  const encoded = encodeURIComponent(message);
  return `https://wa.me/${props.whatsappNumber}?text=${encoded}`;
};

const handleImageError = (event: Event) => {
  const target = event.target as HTMLImageElement;
  target.src = 'https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?auto=format&fit=crop&w=600&q=80';
};

onMounted(async () => {
  // If no initial products were SSR passed, fetch from /api/products
  if (products.value.length === 0) {
    try {
      loading.value = true;
      const res = await fetch('/api/products');
      const data = await res.json();
      if (data.success) {
        products.value = Array.isArray(data.data) ? data.data : (Array.isArray(data.products) ? data.products : []);
      }
    } catch (e) {
      console.error('Error fetching products:', e);
    } finally {
      loading.value = false;
    }
  }
});
</script>
