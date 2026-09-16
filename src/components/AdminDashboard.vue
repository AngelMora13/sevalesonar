<template>
  <div class="min-h-screen bg-[#f8f1ea] py-8 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto space-y-8">
      <!-- Header -->
      <AdminHeader
        :productCount="products.length"
        :maxProducts="PRODUCT_LIMITS.MAX_PRODUCTS"
        @create="openCreateModal(products.length)"
        @logout="handleLogout"
      />

      <!-- Limit Reached Banner -->
      <div
        v-if="products.length >= PRODUCT_LIMITS.MAX_PRODUCTS"
        class="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-center gap-3"
      >
        <IconBase name="warning" fontSize="1.25rem" />
        <div>
          <strong>Límite de seguridad alcanzado ({{ PRODUCT_LIMITS.MAX_PRODUCTS }} productos).</strong>
          Para crear un nuevo producto, elimina alguno inactivo o modifica los existentes.
        </div>
      </div>

      <!-- Filters and Search Bar -->
      <AdminFilters
        v-model="filterCategory"
        v-model:searchQuery="searchQuery"
        :totalCount="products.length"
        :ponquesitosCount="countByCat('ponquesitos')"
        :otrosPostresCount="countByCat('otros_postres')"
      />

      <!-- Products Table -->
      <AdminTable
        :products="filteredProducts"
        @edit="openEditModal"
        @delete="deleteProduct"
        @toggle-active="toggleActive"
        @toggle-price="toggleShowPrice"
        @toggle-featured="toggleFeatured"
      />
    </div>

    <!-- Product Modal (Create & Edit) -->
    <ProductModal
      :show="showModal"
      :isEditing="isEditing"
      :form="form"
      :saving="saving"
      :uploadingImage="uploadingImage"
      :modalError="modalError"
      @close="closeModal"
      @save="saveProduct"
      @file-upload="handleFileUpload"
      @remove-image="removeImage"
    />
  </div>
</template>

<script setup lang="ts">
import { PRODUCT_LIMITS } from '../lib/constants';
import { useAdminProducts } from '../composables/useAdminProducts';
import { useProductForm } from '../composables/useProductForm';
import AdminHeader from './admin/AdminHeader.vue';
import AdminFilters from './admin/AdminFilters.vue';
import AdminTable from './admin/AdminTable.vue';
import ProductModal from './admin/ProductModal.vue';
import IconBase from './IconBase.vue';

const {
  products,
  filterCategory,
  searchQuery,
  filteredProducts,
  countByCat,
  fetchProducts,
  toggleActive,
  toggleShowPrice,
  toggleFeatured,
  deleteProduct
} = useAdminProducts();

const {
  showModal,
  isEditing,
  saving,
  uploadingImage,
  modalError,
  form,
  openCreateModal,
  openEditModal,
  closeModal,
  handleFileUpload,
  removeImage,
  saveProduct
} = useProductForm(fetchProducts);

const handleLogout = async (): Promise<void> => {
  try {
    await fetch('/api/admin/logout', { method: 'POST' });
  } finally {
    window.location.href = '/admin/login';
  }
};
</script>
