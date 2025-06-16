import { GroupFamily } from "@/types";
import { create } from "zustand";
import { GroupFamilyWithOwner } from "@/types";

interface GroupFamilyStore {
  allGroupFamilies: GroupFamily[] | null;
  groupFamilyToEdit: GroupFamily | null;
  groupFamiliesWithOwner: GroupFamilyWithOwner[] | null;
  isEditing: boolean;
  updateAllGroupFamilies: (groupFamilies: GroupFamily[] | null) => void;
  updateGroupFamilyToEdit: (groupFamily: GroupFamily | null) => void;
  updateGroupFamiliesWithOwner: (
    groupFamiliesWithOwner: GroupFamilyWithOwner[] | null
  ) => void;
  updateIsEditing: (isEditing: boolean) => void;
}

export const useGroupFamilyStore = create<GroupFamilyStore>((set) => ({
  allGroupFamilies: null,
  groupFamilyToEdit: null,
  groupFamiliesWithOwner: null,
  isEditing: false,
  updateAllGroupFamilies: (groupFamilies) =>
    set({ allGroupFamilies: groupFamilies }),
  updateGroupFamilyToEdit: (groupFamily) =>
    set({ groupFamilyToEdit: groupFamily }),
  updateGroupFamiliesWithOwner: (groupFamiliesWithOwner) =>
    set({ groupFamiliesWithOwner: groupFamiliesWithOwner }),
  updateIsEditing: (isEditing) => set({ isEditing }),
}));
