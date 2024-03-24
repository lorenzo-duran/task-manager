import { authApi } from "@/api/authApi";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  token: null,
} as { token: string | null };

const slice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: () => initialState,
    changeLoggedInUser: (state, payload: PayloadAction<{ email: string }>) => {
      state.token = payload.payload.email;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      authApi.endpoints.login.matchFulfilled,
      (state, action) => {
        state.token = action.payload.token;
      }
    );
  },
});

export const { logout, changeLoggedInUser } = slice.actions;
export default slice.reducer;
