import { authApi } from "@/api/authApi";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: null,
} as { token: string | null };

const slice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      authApi.endpoints.login.matchFulfilled,
      (state, action) => {
        console.log("login.matchFulfilled");
        state.token = action.payload.token;
      }
    );
  },
});

export const { logout } = slice.actions;
export default slice.reducer;
