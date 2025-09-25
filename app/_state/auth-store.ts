import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserProfile, UserRole } from '../_types/profile';
import { mockUsers } from '../_mocks/users';

interface AuthState {
  currentUser: UserProfile | null;
  isAuthenticated: boolean;
  login: (role: UserRole, region?: string) => void;
  logout: () => void;
  switchProfile: (userId: string) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      currentUser: null,
      isAuthenticated: false,

      login: (role: UserRole, region?: string) => {
        const user = mockUsers.find(u => u.role === role && (!region || u.region === region))
          || mockUsers.find(u => u.role === role)
          || mockUsers[0];

        set({
          currentUser: user,
          isAuthenticated: true
        });
      },

      logout: () => {
        set({
          currentUser: null,
          isAuthenticated: false
        });
      },

      switchProfile: (userId: string) => {
        const user = mockUsers.find(u => u.id === userId);
        if (user) {
          set({
            currentUser: user,
            isAuthenticated: true
          });
        }
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        currentUser: state.currentUser,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
);

// Helper hooks for role-based access
export const useIsAdmin = () => {
  const currentUser = useAuthStore(state => state.currentUser);
  return currentUser?.role === 'ADMIN';
};

export const useIsAnalyst = () => {
  const currentUser = useAuthStore(state => state.currentUser);
  return currentUser?.role === 'ANALISTA';
};

export const useIsReader = () => {
  const currentUser = useAuthStore(state => state.currentUser);
  return currentUser?.role === 'LEITURISTA';
};

export const useIsManager = () => {
  const currentUser = useAuthStore(state => state.currentUser);
  return currentUser?.role === 'GESTOR';
};

export const useUserRegion = () => {
  const currentUser = useAuthStore(state => state.currentUser);
  return currentUser?.region;
};