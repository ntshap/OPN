import { createTheme, ThemeProvider } from "@mui/material/styles"
import CssBaseline from "@mui/material/CssBaseline"

// Custom theme options
const themeOptions = {
  palette: {
    primary: {
      main: "#1976d2",
      light: "#42a5f5",
      dark: "#1565c0",
      contrastText: "#fff",
    },
    secondary: {
      main: "#3f51b5",
      light: "#7986cb",
      dark: "#303f9f",
      contrastText: "#fff",
    },
    background: {
      default: "#f5f5f5",
      paper: "#ffffff",
    },
    text: {
      primary: "#212121",
      secondary: "#757575",
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 500,
      fontSize: "2rem",
      lineHeight: 1.2,
    },
    h2: {
      fontWeight: 500,
      fontSize: "1.75rem",
      lineHeight: 1.2,
    },
    h3: {
      fontWeight: 500,
      fontSize: "1.5rem",
      lineHeight: 1.2,
    },
    h4: {
      fontWeight: 500,
      fontSize: "1.25rem",
      lineHeight: 1.2,
    },
    h5: {
      fontWeight: 500,
      fontSize: "1.1rem",
      lineHeight: 1.2,
    },
    h6: {
      fontWeight: 500,
      fontSize: "1rem",
      lineHeight: 1.2,
    },
    button: {
      textTransform: "none",
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          boxShadow: "none",
          "&:hover": {
            boxShadow: "0px 2px 4px -1px rgba(0,0,0,0.2)",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: "0px 2px 4px -1px rgba(0,0,0,0.1)",
          borderRadius: "8px",
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          padding: "12px 16px",
        },
      },
    },
  },
}

const ThemeCustomization = ({ children }) => {
  const theme = createTheme(themeOptions)

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  )
}

export default ThemeCustomization

