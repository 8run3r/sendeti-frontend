import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UIState {
  recentlyViewed: string[];
  addRecentlyViewed: (id: string) => void;
  exitIntentShown: boolean;
  setExitIntentShown: () => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set, get) => ({
      recentlyViewed: [],
      addRecentlyViewed: (id) => {
        const current = get().recentlyViewed.filter((i) => i !== id);
        set({ recentlyViewed: [id, ...current].slice(0, 4) });
      },
      exitIntentShown: false,
      setExitIntentShown: () => set({ exitIntentShown: true }),
    }),
    { name: "sendeti-ui" }
  )
);
