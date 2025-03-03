import { createTheme } from '@mui/material/styles';

// Apple-inspired theme with enhanced color palette
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#0071e3', // Apple blue
      light: '#47a9ff',
      dark: '#0058b0',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#5e5ce6', // Apple purple
      light: '#8280ff',
      dark: '#4a48b9',
      contrastText: '#ffffff',
    },
    error: {
      main: '#ff453a', // Apple red
      light: '#ff6b63',
      dark: '#d50000',
    },
    warning: {
      main: '#ff9f0a', // Apple orange
      light: '#ffb340',
      dark: '#c67600',
    },
    info: {
      main: '#64d2ff', // Apple teal
      light: '#9fe7ff',
      dark: '#0091c8',
    },
    success: {
      main: '#30d158', // Apple green
      light: '#4ce277',
      dark: '#00a02e',
    },
    background: {
      default: '#f5f5f7', // Light gray background
      paper: '#ffffff',
    },
    text: {
      primary: '#1d1d1f', // Almost black
      secondary: '#6e6e73', // Dark gray
    },
    divider: '#d2d2d7', // Light gray divider
    // For custom use
    accent1: '#ff375f', // Pink
    accent2: '#00c7be', // Mint
    accent3: '#ffd60a', // Yellow
  },
  typography: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "San Francisco", "Helvetica Neue", Helvetica, Arial, sans-serif',
    h1: {
      fontWeight: 600,
      fontSize: '2.5rem',
      letterSpacing: '-0.015em',
    },
    h2: {
      fontWeight: 600,
      fontSize: '2rem',
      letterSpacing: '-0.01em',
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.75rem',
      letterSpacing: '-0.005em',
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem',
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.25rem',
    },
    h6: {
      fontWeight: 600,
      fontSize: '1rem',
    },
    subtitle1: {
      fontSize: '1.125rem',
      fontWeight: 400,
      letterSpacing: '0.01em',
    },
    subtitle2: {
      fontSize: '0.875rem',
      fontWeight: 500,
      letterSpacing: '0.02em',
    },
    body1: {
      fontSize: '1rem',
      letterSpacing: '0.01em',
      lineHeight: 1.5,
    },
    body2: {
      fontSize: '0.875rem',
      letterSpacing: '0.01em',
      lineHeight: 1.43,
    },
    button: {
      fontWeight: 500,
      fontSize: '0.875rem',
      textTransform: 'none',
      letterSpacing: '0.02em',
    },
    caption: {
      fontSize: '0.75rem',
      letterSpacing: '0.02em',
    },
  },
  shape: {
    borderRadius: 12, // Consistent border radius
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '8px 16px',
          boxShadow: 'none',
          transition: 'all 0.2s ease-in-out',
          fontWeight: 500,
          '&:hover': {
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
            transform: 'translateY(-1px)',
          },
        },
        contained: {
          backgroundImage: 'linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(0,0,0,0.05) 100%)',
          '&:hover': {
            backgroundImage: 'linear-gradient(180deg, rgba(255,255,255,0.12) 0%, rgba(0,0,0,0.08) 100%)',
          },
        },
        containedPrimary: {
          backgroundImage: 'linear-gradient(145deg, #47a9ff 0%, #0058b0 100%)',
          '&:hover': {
            backgroundImage: 'linear-gradient(145deg, #5cb3ff 0%, #0065ca 100%)',
          },
        },
        containedSecondary: {
          backgroundImage: 'linear-gradient(145deg, #8280ff 0%, #4a48b9 100%)',
          '&:hover': {
            backgroundImage: 'linear-gradient(145deg, #9490ff 0%, #5652c7 100%)',
          },
        },
        outlined: {
          borderWidth: '1px',
          '&:hover': {
            borderWidth: '1px',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.05)',
        },
        rounded: {
          borderRadius: 12,
        },
        elevation1: {
          boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.05), 0px 1px 2px rgba(0, 0, 0, 0.03)',
        },
        elevation2: {
          boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.06), 0px 1px 2px rgba(0, 0, 0, 0.03)',
        },
        elevation3: {
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.08), 0px 2px 4px rgba(0, 0, 0, 0.04)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.05)',
          overflow: 'hidden',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0px 6px 12px rgba(0, 0, 0, 0.08)',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
          transition: 'all 0.2s ease',
          '&:hover': {
            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
          },
        },
        colorPrimary: {
          backgroundImage: 'linear-gradient(135deg, #47a9ff 0%, #0071e3 100%)',
        },
        colorSecondary: {
          backgroundImage: 'linear-gradient(135deg, #8280ff 0%, #5e5ce6 100%)',
        },
        colorSuccess: {
          backgroundImage: 'linear-gradient(135deg, #4ce277 0%, #30d158 100%)',
        },
        colorError: {
          backgroundImage: 'linear-gradient(135deg, #ff6b63 0%, #ff453a 100%)',
        },
        colorWarning: {
          backgroundImage: 'linear-gradient(135deg, #ffb340 0%, #ff9f0a 100%)',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          padding: '12px 16px',
          borderBottom: '1px solid #d2d2d7',
        },
        head: {
          fontWeight: 600,
          backgroundColor: '#f5f5f7',
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          transition: 'background-color 0.2s ease',
          '&:hover': {
            backgroundColor: 'rgba(0, 113, 227, 0.04)',
          },
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.05)',
        },
        standardSuccess: {
          backgroundColor: 'rgba(48, 209, 88, 0.1)',
          color: '#1d1d1f',
          border: '1px solid rgba(48, 209, 88, 0.3)',
        },
        standardWarning: {
          backgroundColor: 'rgba(255, 159, 10, 0.1)',
          color: '#1d1d1f',
          border: '1px solid rgba(255, 159, 10, 0.3)',
        },
        standardError: {
          backgroundColor: 'rgba(255, 69, 58, 0.1)',
          color: '#1d1d1f',
          border: '1px solid rgba(255, 69, 58, 0.3)',
        },
        standardInfo: {
          backgroundColor: 'rgba(0, 113, 227, 0.1)',
          color: '#1d1d1f',
          border: '1px solid rgba(0, 113, 227, 0.3)',
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        'html, body': {
          background: '#f5f5f7',
        },
      },
    },
  },
});

export default theme;
