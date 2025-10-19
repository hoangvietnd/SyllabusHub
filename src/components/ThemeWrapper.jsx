import { ThemeProvider, CssBaseline } from '@mui/material';
import { useThemeWithPreference } from '../theme';

export default function ThemeWrapper({ children }) {
  const [theme, toggleTheme, mode] = useThemeWithPreference();

  // Expose theme toggle to other components
  window.toggleTheme = toggleTheme;
  window.currentTheme = mode;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}