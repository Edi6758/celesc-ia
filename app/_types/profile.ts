export type UserRole = "LEITURISTA" | "ANALISTA" | "ADMIN" | "GESTOR";

export interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  region?: string;
  avatar?: string;
}