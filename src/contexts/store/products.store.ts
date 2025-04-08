import { Products } from "@/types";
import { create } from "zustand";

interface ProductStore {
  allProducts: Products[] | null;
  productToEdit: Products | null;
  isEditing: boolean;
  update: (products: Products[] | null) => void;
  updateProductToEdit: (product: Products | null) => void;
  updateIsEditing: (isEditing: boolean) => void;
}

export const useProductStore = create<ProductStore>((set) => ({
  allProducts: null,
  productToEdit: null,
  isEditing: false,
  update: (products) => set({ allProducts: products }),
  updateProductToEdit: (product) => set({ productToEdit: product }),
  updateIsEditing: (isEditing) => set({ isEditing }),
}));
