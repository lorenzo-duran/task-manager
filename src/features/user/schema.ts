import type { UserAuthorization } from "@/features/auth/schema";

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  status: "active" | "inactive";
  roles: UserAuthorization[];
}
