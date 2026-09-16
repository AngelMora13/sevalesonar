import { ref, reactive } from 'vue';
import type { Product, ProductFormData } from '../types/product';
import type { ApiResponse, UploadResponseData } from '../types/api';
import { PRODUCT_LIMITS } from '../lib/constants';

export function useProductForm(onSuccess: () => Promise<void>) {
  const showModal = ref<boolean>(false);
  const isEditing = ref<boolean>(false);
  const currentEditingId = ref<string>('');
  const saving = ref<boolean>(false);
  const uploadingImage = ref<boolean>(false);
  const modalError = ref<string>('');

  const form = reactive<ProductFormData>({
    name: '',
    description: '',
    price: '',
    show_price: true,
    category: 'ponquesitos',
    image_url: '',
    image_key: '',
    image_size: 0,
    image_mime: '',
    active: true,
    is_featured: false,
    featured_label: 'Especialidad de la casa',
    featured_description: 'Horneados frescos cada mañana'
  });

  const openCreateModal = (currentProductCount: number): void => {
    if (currentProductCount >= PRODUCT_LIMITS.MAX_PRODUCTS) {
      alert(`Has alcanzado el límite máximo de ${PRODUCT_LIMITS.MAX_PRODUCTS} productos.`);
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
    form.is_featured = false;
    form.featured_label = 'Especialidad de la casa';
    form.featured_description = 'Horneados frescos cada mañana';
    showModal.value = true;
  };

  const openEditModal = (product: Product): void => {
    isEditing.value = true;
    currentEditingId.value = product.id;
    modalError.value = '';
    form.name = product.name;
    form.description = product.description;
    form.price = product.price;
    form.show_price = product.show_price;
    form.category = product.category as 'ponquesitos' | 'otros_postres';
    form.image_url = product.image_url;
    form.image_key = product.image_key || '';
    form.image_size = product.image_size || 0;
    form.image_mime = product.image_mime || '';
    form.active = product.active;
    form.is_featured = !!product.is_featured;
    form.featured_label = product.featured_label || 'Especialidad de la casa';
    form.featured_description = product.featured_description || 'Horneados frescos cada mañana';
    showModal.value = true;
  };

  const closeModal = (): void => {
    showModal.value = false;
    modalError.value = '';
  };

  const handleFileUpload = async (event: Event): Promise<void> => {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    if (file.size > PRODUCT_LIMITS.MAX_IMAGE_SIZE_BYTES) {
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

      const data: ApiResponse<UploadResponseData> = await res.json();
      if (!res.ok || !data.success || !data.data) {
        modalError.value = data.error || 'Error subiendo la imagen a Cloudflare R2.';
        return;
      }

      form.image_url = data.data.url;
      form.image_key = data.data.key;
      form.image_size = data.data.size;
      form.image_mime = data.data.mimeType;
    } catch {
      modalError.value = 'Error al conectar para subir la imagen.';
    } finally {
      uploadingImage.value = false;
    }
  };

  const removeImage = (): void => {
    form.image_url = '';
    form.image_key = '';
    form.image_size = 0;
    form.image_mime = '';
  };

  const saveProduct = async (): Promise<void> => {
    modalError.value = '';

    if (!form.name.trim()) {
      modalError.value = 'El nombre es obligatorio.';
      return;
    }
    if (form.name.trim().length > PRODUCT_LIMITS.MAX_NAME_LENGTH) {
      modalError.value = `El nombre no puede tener más de ${PRODUCT_LIMITS.MAX_NAME_LENGTH} caracteres.`;
      return;
    }
    if (form.description.trim().length > PRODUCT_LIMITS.MAX_DESCRIPTION_LENGTH) {
      modalError.value = `La descripción no puede tener más de ${PRODUCT_LIMITS.MAX_DESCRIPTION_LENGTH} caracteres.`;
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
          active: form.active,
          is_featured: form.is_featured,
          featured_label: form.featured_label.trim(),
          featured_description: form.featured_description.trim()
        })
      });

      const data: ApiResponse = await res.json();
      if (!res.ok || !data.success) {
        modalError.value = data.error || 'Error al guardar el producto.';
        return;
      }

      closeModal();
      await onSuccess();
    } catch {
      modalError.value = 'Error al comunicarse con el servidor.';
    } finally {
      saving.value = false;
    }
  };

  return {
    showModal,
    isEditing,
    currentEditingId,
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
  };
}
