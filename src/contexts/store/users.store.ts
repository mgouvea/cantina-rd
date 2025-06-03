import { User } from "@/types";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface UserStore {
  allUsers: User[] | null;
  userToEdit: User | null;
  isEditing: boolean;
  userLogged: User | null;
  updateAllUsers: (users: User[] | null) => void;
  updateUserToEdit: (user: User | null) => void;
  updateIsEditing: (isEditing: boolean) => void;
  updateUserLogged: (user: User | null) => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      allUsers: null,
      userToEdit: null,
      isEditing: false,
      userLogged: null,
      updateAllUsers: (users) => set({ allUsers: users }),
      updateUserToEdit: (user) => set({ userToEdit: user }),
      updateIsEditing: (isEditing) => set({ isEditing }),
      updateUserLogged: (user) => set({ userLogged: user }),
    }),
    {
      name: "user-storage", // unique name for localStorage key
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        userLogged: state.userLogged,
      }),
    }
  )
);
