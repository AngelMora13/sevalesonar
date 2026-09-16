import type { Product as DbProduct, InsertProduct as DbInsertProduct } from '../db/schema';

export type Product = DbProduct;
export type InsertProduct = DbInsertProduct;

export type CategoryId = 'ponquesitos' | 'otros_postres';

export interface ProductFormData {
  name: string;
  description: string;
  price: string;
  show_price: boolean;
  category: CategoryId;
  image_url: string;
  image_key: string;
  image_size: number;
  image_mime: string;
  active: boolean;
  is_featured: boolean;
  featured_label: string;
  featured_description: string;
}
