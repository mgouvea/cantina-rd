import { SubCategories } from "@/types";
import { create } from "zustand";

interface SubCategoryStore {
  AllSubCategories: SubCategories[] | null;
  subCategoryToEdit: SubCategories | null;
  isEditing: boolean;
  updateAllSubCategories: (categories: SubCategories[] | null) => void;
  updateSubCategoryToEdit: (category: SubCategories | null) => void;
  updateIsEditing: (isEditing: boolean) => void;
}

export const useSubCategoryStore = create<SubCategoryStore>((set) => ({
  AllSubCategories: null,
  subCategoryToEdit: null,
  isEditing: false,
  updateAllSubCategories: (categories) => set({ AllSubCategories: categories }),
  updateSubCategoryToEdit: (category) => set({ subCategoryToEdit: category }),
  updateIsEditing: (isEditing) => set({ isEditing }),
}));
