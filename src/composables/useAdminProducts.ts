import { ref, computed, onMounted } from 'vue';
import type { Product, CategoryId } from '../types/product';
import type { ApiResponse } from '../types/api';

export function useAdminProducts() {
  const products = ref<Product[]>([]);
  const filterCategory = ref<'all' | CategoryId>('all');
  const searchQuery = ref<string>('');
  const loading = ref<boolean>(false);
  const error = ref<string>('');

  const countByCat = (cat: CategoryId): number => {
    return products.value.filter(p => p.category === cat).length;
  };

  const filteredProducts = computed<Product[]>(() => {
    return products.value.filter(p => {
      const matchesCat = filterCategory.value === 'all' || p.category === filterCategory.value;
      const query = searchQuery.value.trim().toLowerCase();
      const matchesSearch =
        !query ||
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query);
      return matchesCat && matchesSearch;
    });
  });

  const fetchProducts = async (): Promise<void> => {
    try {
      loading.value = true;
      error.value = '';
      const res = await fetch('/api/admin/products');
      const data: ApiResponse<Product[]> = await res.json();
      if (data.success && Array.isArray(data.data)) {
        products.value = data.data;
      }
    } catch (err: any) {
      error.value = 'Error al cargar productos.';
      console.error('Error fetching admin products:', err);
    } finally {
      loading.value = false;
    }
  };

  const toggleActive = async (product: Product): Promise<void> => {
    const originalStatus = product.active;
    product.active = !originalStatus;

    try {
      const res = await fetch(`/api/admin/products/${product.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: product.active })
      });
      if (!res.ok) {
        product.active = originalStatus; // revertir
      }
    } catch {
      product.active = originalStatus;
    }
  };

  const toggleShowPrice = async (product: Product): Promise<void> => {
    const originalStatus = product.show_price;
    product.show_price = !originalStatus;

    try {
      const res = await fetch(`/api/admin/products/${product.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ show_price: product.show_price })
      });
      if (!res.ok) {
        product.show_price = originalStatus; // revertir
      }
    } catch {
      product.show_price = originalStatus;
    }
  };

  const toggleFeatured = async (product: Product): Promise<void> => {
    const newFeatured = !product.is_featured;

    // Actualización optimista: si se marca como destacado, desmarcar cualquier otro
    if (newFeatured) {
      products.value.forEach(p => {
        p.is_featured = p.id === product.id;
      });
    } else {
      product.is_featured = false;
    }

    try {
      const res = await fetch(`/api/admin/products/${product.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_featured: newFeatured })
      });
      if (!res.ok) {
        await fetchProducts();
      }
    } catch {
      await fetchProducts();
    }
  };

  const deleteProduct = async (product: Product): Promise<boolean> => {
    if (!confirm(`¿Estás seguro de que deseas eliminar permanentemente "${product.name}"?`)) {
      return false;
    }

    try {
      const res = await fetch(`/api/admin/products/${product.id}`, {
        method: 'DELETE'
      });
      const data: ApiResponse = await res.json();
      if (res.ok && data.success) {
        products.value = products.value.filter(p => p.id !== product.id);
        return true;
      } else {
        alert(data.error || 'Error al eliminar el producto.');
        return false;
      }
    } catch {
      alert('Error al conectar con el servidor.');
      return false;
    }
  };

  onMounted(() => {
    fetchProducts();
  });

  return {
    products,
    filterCategory,
    searchQuery,
    loading,
    error,
    filteredProducts,
    countByCat,
    fetchProducts,
    toggleActive,
    toggleShowPrice,
    toggleFeatured,
    deleteProduct
  };
}
