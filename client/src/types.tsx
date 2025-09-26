import type { PaletteMode } from '@mui/material';

export interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  createdAt: string;
  updatedAt: string;
  orgId: string;
  __v?: number;
}

export interface Task {
  _id: string;
  title: string;
  description: string;
  completedStatus: boolean;
  userId: string;
  orgId: string;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

export interface Org {
  _id: string;
  name: string;
  parentOrgId: string;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}
export interface AppState {
  mode: PaletteMode; // 'light' | 'dark'
  user: User | null;
  token: string | null;
  tasks: Task[];
}

export interface RootState {
  app: AppState;
}

export interface TaskFormValues {
  title: string;
  description: string;
  completedStatus: boolean;
}
