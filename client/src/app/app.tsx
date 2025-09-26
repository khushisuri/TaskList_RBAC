import { Routes, Route, Navigate } from 'react-router-dom';
import { Box, useTheme } from '@mui/material';
import Navbar from './shared/Navbar';
import Auth from './pages/Auth';
import Tasks from './pages/Tasks';
import { useSelector } from 'react-redux';
import { type RootState } from '../types';
import type { ReactNode } from 'react';

export function App() {
  const theme = useTheme();
  const token = useSelector((state: RootState) => state.app.token);

  const ProtectedRoute = ({ children }: { children: ReactNode }) => {
    return token ? <>{children}</> : <Navigate to="/" replace />;
  };

  const NonProtectedRoute = ({ children }: { children: ReactNode }) => {
    return token ? <Navigate to="/tasks" replace /> : <>{children}</>;
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: theme.palette.background.default }}>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={
            <NonProtectedRoute>
              <Auth />
            </NonProtectedRoute>
          }
        />
        <Route
          path="/tasks"
          element={
            <ProtectedRoute>
              <Tasks />
            </ProtectedRoute>
          }
        />
        <Route
          path="*"
          element={<Navigate to={token ? '/tasks' : '/'} replace />}
        />
      </Routes>
    </Box>
  );
}

export default App;
