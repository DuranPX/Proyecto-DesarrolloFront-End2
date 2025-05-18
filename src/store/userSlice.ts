import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface UserState {
  id?: number | null;
  name?: string | null;
  email?: string | null;
  picture?: string | null;
  provider?: string | null;
  address?: string | null;
  token?: string | null;
  phone?: number | null;
}


// Recuperar del localStorage con manejo de errores
const loadInitialState = (): UserState | null => {
  try {
    const storedUser = localStorage.getItem("user");

    return storedUser ? JSON.parse(storedUser) : null;
  } catch (e) {
    console.error("Error al cargar el usuario desde localStorage:", e);
    return null;
  }
};

const initialState: UserState | null = loadInitialState();

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (_, action: PayloadAction<UserState>) => {
      const {
        id = null,
        name = null,
        email = null,
        picture = null,
        provider = null,
        address = null,
        token = null,
        phone = null,
      } = action.payload;

      const fullUser: UserState = {
        id,
        name,
        email,
        picture,
        provider,
        address,
        token,
        phone,
      };

      localStorage.setItem("user", JSON.stringify(fullUser));
      return fullUser;
    },
    logout: () => {
      localStorage.removeItem("user");
      return null;
    },
  },
});

export const { setUser, logout } = userSlice.actions;
export default userSlice.reducer;
