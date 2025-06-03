import { GroupFamily } from "@/types";
import { create } from "zustand";

interface GroupFamilyStore {
  allGroupFamilies: GroupFamily[] | null;
  groupFamilyToEdit: GroupFamily | null;
  isEditing: boolean;
  updateAllGroupFamilies: (groupFamilies: GroupFamily[] | null) => void;
  updateGroupFamilyToEdit: (groupFamily: GroupFamily | null) => void;
  updateIsEditing: (isEditing: boolean) => void;
}

export const useGroupFamilyStore = create<GroupFamilyStore>((set) => ({
  allGroupFamilies: null,
  groupFamilyToEdit: null,
  isEditing: false,
  updateAllGroupFamilies: (groupFamilies) =>
    set({ allGroupFamilies: groupFamilies }),
  updateGroupFamilyToEdit: (groupFamily) =>
    set({ groupFamilyToEdit: groupFamily }),
  updateIsEditing: (isEditing) => set({ isEditing }),
}));
