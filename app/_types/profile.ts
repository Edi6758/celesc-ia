export type UserRole = "LEITURISTA" | "ANALISTA" | "ADMIN" | "GESTOR";

export interface UserProfile {
  id: string;
  name: string;
  email?: string;
  role: UserRole;
  region?: string;
  avatar?: string;
}