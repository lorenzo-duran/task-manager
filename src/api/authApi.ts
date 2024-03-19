import type {
  CheckAuthenticate,
  RequestLogin,
  SecurityCredentials,
} from "@/features/auth/schema";
import { api } from ".";

export const authApi = api.injectEndpoints({
  endpoints: (build) => ({
    checkAuthenticated: build.query<CheckAuthenticate, void>({
      query: () => `auth/check-authenticated`,
      providesTags: ["Auth"],
    }),
    login: build.mutation<SecurityCredentials, RequestLogin>({
      query: (credentials) => ({
        url: `auth/login`,
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["Auth"],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(authApi.util.resetApiState());
        } catch {
          // ignore
        }
      },
    }),
  }),
});

export const { useCheckAuthenticatedQuery, useLoginMutation } = authApi;
