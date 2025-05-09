import { createSlice, PayloadAction } from "@reduxjs/toolkit";

 export interface UserState {
  name: string;
  email: string;
  picture: string;
  provider: string;
}

const initialState: UserState | null = JSON.parse(localStorage.getItem("user") || "null");

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserState>) => {
      localStorage.setItem("user", JSON.stringify(action.payload));
      return action.payload;
    },
    logout: () => {
      localStorage.removeItem("user");
      return null;
    },
  },
});

export const { setUser, logout } = userSlice.actions;
export default userSlice.reducer;
