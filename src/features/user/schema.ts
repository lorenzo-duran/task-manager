import type { UserAuthorization } from "@/features/auth/schema";

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  status: "active" | "inactive";
  roles: UserAuthorization[];
}

export type EditUser = Omit<User, "id">;

export type CreateUser = Omit<User, "id">;

export interface CheckUserEmailResponse {
  emailDuplicated: boolean;
}
