import React, { useState, useMemo } from 'react';
import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import ThemeContext from '../contexts/ThemeContext';

function ThemeWrapper({ children }) {
  const [mode, setMode] = useState('light');

  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          ...(mode === 'light'
            ? {
                // Palette values for light mode
                primary: { main: '#1976d2' },
                background: {
                  default: '#f4f6f8',
                  paper: '#ffffff',
                },
              }
            : {
                // Palette values for dark mode
                primary: { main: '#90caf9' },
                background: {
                  default: '#121212',
                  paper: '#1e1e1e',
                },
              }),
        },
      }),
    [mode]
  );

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
    </ThemeContext.Provider>
  );
}

export default ThemeWrapper;
