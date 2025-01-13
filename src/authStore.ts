import { create } from "zustand";
import { auth } from "../lib/api";

export interface User {
  id: string;
  email: string;
  username: string;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  checkUser: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, username: string) => Promise<void>;
  signOut: () => Promise<void>;
  signInAsGuest: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,

  checkUser: async () => {
    set({ loading: true });
    try {
      const { user } = await auth.getMe();
      set({ user });
    } catch {
      set({ user: null });
    } finally {
      set({ loading: false });
    }
  },

  signIn: async (email: string, password: string) => {
    const { user } = await auth.login({ email, password });
    set({ user });
  },

  signUp: async (email: string, password: string, username: string) => {
    await auth.register({ email, password, username });
  },

  signInAsGuest: async () => {
    await useAuthStore.getState().signIn("guest@example.com", "guest123");
  },

  signOut: async () => {
    await auth.logout();
    set({ user: null });
  },
}));
