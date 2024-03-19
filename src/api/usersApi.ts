import type { User } from "../features/user/schema";
import { api } from ".";

export const usersApi = api.injectEndpoints({
  endpoints: (build) => ({
    getUsers: build.query<User[], void>({
      query: () => `users`,
    }),
  }),
});

export const { useGetUsersQuery } = usersApi;

export const {
  endpoints: { getUsers },
} = usersApi;
