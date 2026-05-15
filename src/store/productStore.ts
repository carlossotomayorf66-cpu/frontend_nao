import { create } from 'zustand';
import api from '../services/api';

export interface Product {
  id?: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  image_url?: string;
}

interface ProductState {
  products: Product[];
  isLoading: boolean;
  fetchProducts: () => Promise<void>;
  addProduct: (product: Product) => Promise<void>;
  updateProduct: (id: number, product: Product) => Promise<void>;
  deleteProduct: (id: number) => Promise<void>;
}

export const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  isLoading: false,
  fetchProducts: async () => {
    set({ isLoading: true });
    try {
      const response = await api.get('/products');
      set({ products: response.data, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      console.error(error);
    }
  },
  addProduct: async (product) => {
    await api.post('/products', product);
    get().fetchProducts();
  },
  updateProduct: async (id, product) => {
    await api.put(`/products/${id}`, product);
    get().fetchProducts();
  },
  deleteProduct: async (id) => {
    await api.delete(`/products/${id}`);
    get().fetchProducts();
  },
}));
