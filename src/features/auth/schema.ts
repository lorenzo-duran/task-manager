export const USER_AUTHORIZATIONS = [
  "VIEW_USERS",
  "EDIT_USERS",
  "DELETE_USERS",

  "VIEW_TASKS",
  "EDIT_TASKS",
  "DELETE_TASKS",

  "VIEW_PROJECTS",
  "EDIT_PROJECTS",
  "DELETE_PROJECTS",

  "SUPER",
] as const;
export type UserAuthorization = (typeof USER_AUTHORIZATIONS)[number];

export interface CheckAuthenticate {
  isAuthenticated: boolean;
  authorizations: UserAuthorization[];
}

export interface RequestLogin {
  email: string;
}

export interface SecurityCredentials {
  token: string;
}
