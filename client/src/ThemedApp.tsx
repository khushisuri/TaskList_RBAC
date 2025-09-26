import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';
import { useMemo } from 'react';
import {  useSelector } from 'react-redux';
import App from './app/app';
import { themeSettings } from './theme';
import type { RootState } from './types';

const ThemedApp = () => {
  const mode = useSelector((s: RootState) => s?.app.mode ?? 'light');
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  );
}

export default ThemedApp