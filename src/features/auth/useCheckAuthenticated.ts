import { type UserAuthorization } from "./schema";

export const useCheckAuthenticated = () => {
  return {
    isSuccess: true,
    isLoading: false,
    isError: false,
    data: {
      isAuthenticated: true,
      authorizations: ["SUPER"] as UserAuthorization[],
    },
  };
};
