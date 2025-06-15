import { create } from "zustand";
import { auth } from "../lib/api";

export interface User {
  id: string;
  email: string;
  username: string;
}
export interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  category: string;
  createdBy: User;
  attendees: User[];
  maxAttendees: number;
  createdAt: string;
  image: string;
  completed?: boolean;
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
    const token = localStorage.getItem("authToken");
    console.log("token", token);
    if (!token) {
      set({ user: null, loading: false });
      return;
    }

    set({ loading: true });
    try {
      const { user } = await auth.getMe();
      console.log("user checkuser api ", user);
      set({ user });
      console.log("checkUser ,", user);
    } catch (error) {
      if (error instanceof Error) {
        console.error("Authentication error:", error.message);
      }

      // localStorage.removeItem("authToken");
      // set({ user: null });
    } finally {
      set({ loading: false });
    }
  },

  signIn: async (email: string, password: string) => {
    const { token } = await auth.login({ email, password });
    localStorage.setItem("authToken", token); // Save token
    await useAuthStore.getState().checkUser(); // Fetch and update user state
  },

  signUp: async (email: string, password: string, username: string) => {
    await auth.register({ email, password, username });
  },

  signInAsGuest: async () => {
    await useAuthStore.getState().signIn("guest@example.com", "guest123");
  },

  signOut: async () => {
    await auth.logout();
    localStorage.removeItem("authToken");
    set({ user: null });
  },
}));
