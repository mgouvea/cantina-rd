import { Categories } from "@/types";
import { create } from "zustand";

interface CategoryStore {
  AllCategories: Categories[] | null;
  category: Categories | null;
  categoryToEdit: Categories | null;
  isEditing: boolean;
  update: (category: Categories | null) => void;
  updateAllCategories: (categories: Categories[] | null) => void;
  updateCategoryToEdit: (category: Categories | null) => void;
  updateIsEditing: (isEditing: boolean) => void;
}

export const useCategoryStore = create<CategoryStore>((set) => ({
  AllCategories: null,
  category: null,
  categoryToEdit: null,
  isEditing: false,
  update: (category) => set({ category }),
  updateAllCategories: (categories) => set({ AllCategories: categories }),
  updateCategoryToEdit: (category) => set({ categoryToEdit: category }),
  updateIsEditing: (isEditing) => set({ isEditing }),
}));
