"use client";

import { User } from "@/prisma/generated/client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type UserType = Pick<User, "createdAt" | "email" | "id" | "name">;

interface UserStore {
  user: UserType | null;
  setUser: (user: UserType) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,

      setUser: (user) => set({ user }),

      clearUser: () => set({ user: null }),
    }),
    { name: "user-store" }
  )
);
