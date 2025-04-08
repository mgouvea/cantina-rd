import { Categories } from "@/types";
import { create } from "zustand";

interface CategoryStore {
  category: Categories | null;
  update: (category: Categories | null) => void;
}

export const useCategoryStore = create<CategoryStore>((set) => ({
  category: null,
  update: (category) => set({ category }),
}));
