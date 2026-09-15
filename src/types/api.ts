import type { Product } from '../db/schema';

// Generic API response structure
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Auth Types
export interface LoginRequestBody {
  username?: string;
  password?: string;
}

export interface LoginResponseData {
  authenticated: boolean;
}

// Product Types
export interface CreateProductRequestBody {
  name: string;
  description?: string;
  price?: string;
  show_price?: boolean;
  category: 'ponquesitos' | 'otros_postres';
  image_url?: string;
  image_key?: string;
  image_size?: number;
  image_mime?: string;
  active?: boolean;
  order_index?: number;
}

export interface UpdateProductRequestBody {
  name?: string;
  description?: string;
  price?: string;
  show_price?: boolean;
  category?: 'ponquesitos' | 'otros_postres';
  image_url?: string;
  image_key?: string;
  image_size?: number;
  image_mime?: string;
  active?: boolean;
  order_index?: number;
}

export interface PatchProductRequestBody {
  active?: boolean;
  show_price?: boolean;
}

export interface ProductsListResponseData {
  products: Product[];
  total: number;
}

// Image Upload Types
export interface UploadResponseData {
  url: string;
  key: string;
  size: number;
  mimeType: string;
}
