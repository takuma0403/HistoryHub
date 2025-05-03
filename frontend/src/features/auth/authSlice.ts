import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  token: string | null;
  email: string | null;
}

const initialState: AuthState = {
  token: null,
  email: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      localStorage.setItem("token", state.token)
    },
    setEmail: (state, action: PayloadAction<string>) => {
      state.email = action.payload;
    },
    clearAuth: (state) => {
      state.token = null;
      state.email = null;
      localStorage.removeItem("token");
    },
  },
});

export const { setToken, setEmail, clearAuth } = authSlice.actions;
export default authSlice.reducer;
