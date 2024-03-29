import type { User } from "@/features/user/schema";

export const USER_AUTHORIZATIONS = [
  "VIEW_USERS",
  "EDIT_USERS",
  "DELETE_USERS",

  "VIEW_TASKS",
  "EDIT_TASKS",
  "DELETE_TASKS",

  "VIEW_PROJECTS",
  "EDIT_PROJECTS",
  "RUN_PROJECTS",
  "DELETE_PROJECTS",

  "SUPER",
] as const;
export type UserAuthorization = (typeof USER_AUTHORIZATIONS)[number];

export type CheckAuthenticate = {
  isAuthenticated: boolean;
  authorizations?: UserAuthorization[];
  user?: User;
};

export interface RequestLogin {
  email: string;
}

export interface SecurityCredentials {
  token: string;
}
