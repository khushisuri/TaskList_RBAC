import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { PaletteMode } from '@mui/material';
import { type User, type AppState, type Task } from './types';

const initialState: AppState = {
  mode: 'light',
  user: null,
  token: '',
  tasks: [],
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setMode(state, action: PayloadAction<PaletteMode>) {
      state.mode = action.payload;
    },
    setUser(state, action: PayloadAction<User | null>) {
      state.user = action.payload;
    },
    setToken(state, action: PayloadAction<string>) {
      state.token = action.payload;
    },
    setTasks(state, action: PayloadAction<Task[]>) {
      state.tasks = action.payload;
    },
    addTask(state, action: PayloadAction<Task>) {
      state.tasks.push(action.payload);
    },
    setLogout: (state) => {
      state.user = null;
      state.token = null;
    },
  },
});

export const { setMode, setUser, setTasks, addTask, setToken, setLogout } =
  appSlice.actions;
export default appSlice.reducer;
