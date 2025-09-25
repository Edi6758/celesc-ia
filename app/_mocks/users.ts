import { UserProfile } from "../_types/profile";

export const mockUsers: UserProfile[] = [
  {
    id: "leit-001",
    name: "Carlos Silva",
    email: "carlos.silva@celesc.com.br",
    role: "LEITURISTA",
    region: "Norte",
    avatar: "https://ui-avatars.com/api/?name=Carlos+Silva&background=3b82f6&color=fff"
  },
  {
    id: "leit-002",
    name: "Ana Santos",
    email: "ana.santos@celesc.com.br",
    role: "LEITURISTA",
    region: "Sul",
    avatar: "https://ui-avatars.com/api/?name=Ana+Santos&background=ef4444&color=fff"
  },
  {
    id: "anal-001",
    name: "Pedro Oliveira",
    email: "pedro.oliveira@celesc.com.br",
    role: "ANALISTA",
    region: "Norte",
    avatar: "https://ui-avatars.com/api/?name=Pedro+Oliveira&background=10b981&color=fff"
  },
  {
    id: "anal-002",
    name: "Mariana Costa",
    email: "mariana.costa@celesc.com.br",
    role: "ANALISTA",
    region: "Sul",
    avatar: "https://ui-avatars.com/api/?name=Mariana+Costa&background=f59e0b&color=fff"
  },
  {
    id: "admin-001",
    name: "Roberto Admin",
    email: "roberto.admin@celesc.com.br",
    role: "ADMIN",
    avatar: "https://ui-avatars.com/api/?name=Roberto+Admin&background=8b5cf6&color=fff"
  },
  {
    id: "gestor-001",
    name: "Helena Gestora",
    email: "helena.gestora@celesc.com.br",
    role: "GESTOR",
    avatar: "https://ui-avatars.com/api/?name=Helena+Gestora&background=ec4899&color=fff"
  }
];

export const getCurrentUser = (roleFilter?: string): UserProfile => {
  if (roleFilter) {
    return mockUsers.find(user => user.role === roleFilter) || mockUsers[0];
  }
  return mockUsers[0]; // Default to first user
};