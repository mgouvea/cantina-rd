import { User } from "@/types";
import { create } from "zustand";

interface UserStore {
  allUsers: User[] | null;
  userToEdit: User | null;
  isEditing: boolean;
  updateAllUsers: (users: User[] | null) => void;
  updateUserToEdit: (user: User | null) => void;
  updateIsEditing: (isEditing: boolean) => void;
}

export const useUserStore = create<UserStore>((set) => ({
  allUsers: null,
  userToEdit: null,
  isEditing: false,
  updateAllUsers: (users) => set({ allUsers: users }),
  updateUserToEdit: (user) => set({ userToEdit: user }),
  updateIsEditing: (isEditing) => set({ isEditing }),
}));
