import { createTheme } from '@mui/material/styles';

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2196f3',
    },
    background: {
      default: '#ffffff',
      paper: '#f8f9fa'
    },
    text: {
      primary: 'rgba(0, 0, 0, 0.87)',
      secondary: 'rgba(0, 0, 0, 0.6)'
    }
  },
  typography: {
    fontFamily: "'Poppins', 'Inter', sans-serif",
    h6: {
      fontWeight: 700,
      letterSpacing: 0.5
    }
  }
});

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#121212',
      paper: '#1e1e1e'
    },
    text: {
      primary: 'rgba(255, 255, 255, 0.87)',
      secondary: 'rgba(255, 255, 255, 0.6)'
    }
  },
  typography: {
    fontFamily: "'Poppins', 'Inter', sans-serif",
    h6: {
      fontWeight: 700,
      letterSpacing: 0.5
    }
  }
}); 