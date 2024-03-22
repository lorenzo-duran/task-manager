import type {
  CheckUserEmailResponse,
  CreateUser,
  EditUser,
  User,
} from "../features/user/schema";
import { api } from ".";

export const usersApi = api.injectEndpoints({
  endpoints: (build) => ({
    getUsers: build.query<User[], void>({
      query: () => `users`,
      providesTags: [{ type: "User", id: "PARTIAL-LIST" }],
    }),
    getUser: build.query<User, number>({
      query: (id) => `users/${id}`,
      providesTags: (_, __, id) => [{ type: "User" as const, id }],
    }),
    checkUserEmail: build.mutation<CheckUserEmailResponse, string>({
      query: (email) => ({
        url: `users/email-check/${email}`,
        method: "POST",
      }),
    }),
    editUser: build.mutation<void, { userId: number; editUser: EditUser }>({
      query: ({ userId, editUser }) => ({
        url: `users/${userId}`,
        method: "PUT",
        body: editUser,
      }),
      invalidatesTags: (_, __, { userId }) => [
        { type: "User", id: "PARTIAL-LIST" },
        { type: "User", id: userId },
      ],
    }),
    deleteUser: build.mutation<void, number>({
      query: (userId) => ({
        url: `users/${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_, __, id) => [
        { type: "User", id: "PARTIAL-LIST" },
        { type: "User", id },
      ],
    }),
    createUser: build.mutation<void, CreateUser>({
      query: (createUser) => ({
        url: `users`,
        method: "POST",
        body: createUser,
      }),
      invalidatesTags: [{ type: "User", id: "PARTIAL-LIST" }],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserQuery,
  useEditUserMutation,
  useDeleteUserMutation,
  useCreateUserMutation,
  useCheckUserEmailMutation,
} = usersApi;

export const {
  endpoints: { getUsers },
} = usersApi;
