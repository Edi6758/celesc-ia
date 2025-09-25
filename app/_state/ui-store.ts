import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UIState {
  darkMode: boolean;
  sidebarCollapsed: boolean;
  activeInvoiceId: string | null;
  toggleDarkMode: () => void;
  toggleSidebar: () => void;
  setActiveInvoice: (id: string | null) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      darkMode: false,
      sidebarCollapsed: false,
      activeInvoiceId: null,

      toggleDarkMode: () => {
        set(state => {
          const newDarkMode = !state.darkMode;
          // Update document class for Tailwind dark mode
          if (typeof document !== 'undefined') {
            document.documentElement.classList.toggle('dark', newDarkMode);
          }
          return { darkMode: newDarkMode };
        });
      },

      toggleSidebar: () => {
        set(state => ({ sidebarCollapsed: !state.sidebarCollapsed }));
      },

      setActiveInvoice: (id: string | null) => {
        set({ activeInvoiceId: id });
      }
    }),
    {
      name: 'ui-storage',
      onRehydrateStorage: () => (state) => {
        // Apply dark mode to document on hydration
        if (state?.darkMode && typeof document !== 'undefined') {
          document.documentElement.classList.add('dark');
        }
      }
    }
  )
);