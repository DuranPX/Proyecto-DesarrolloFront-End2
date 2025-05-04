import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define la interfaz para el estado del usuario
interface UserState {
  name: string | null;
  avatarUrl: string | null;
  login: string | null;
  // Puedes agregar otros campos relevantes del usuario de GitHub
}

// Define el estado inicial del usuario
const initialState: UserState = {
  name: null,
  avatarUrl: null,
  login: null,
};

// Crea el slice del usuario
export const userSlice = createSlice({
  name: 'user', // Un nombre para identificar este slice
  initialState,
  reducers: {
    // Define las acciones que pueden modificar el estado del usuario
    setUser: (state, action: PayloadAction<UserState>) => {
      state.name = action.payload.name;
      state.avatarUrl = action.payload.avatarUrl;
      state.login = action.payload.login;
      // Actualiza otros campos si es necesario
    },
    clearUser: (state) => {
      state.name = null;
      state.avatarUrl = null;
      state.login = null;
      // Limpia otros campos si es necesario
    },
  },
});

// Exporta las acciones generadas por createSlice
export const { setUser, clearUser } = userSlice.actions;

// Exporta el reducer del slice
export default userSlice.reducer;