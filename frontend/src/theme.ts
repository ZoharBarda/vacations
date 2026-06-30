import { createTheme } from "@mui/material/styles";

export const createAppTheme = (darkMode: boolean) =>
  createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
      primary: {
        main: "#127475",
      },
      secondary: {
        main: "#ff6f3c",
      },
      background: {
        default: darkMode ? "#11161f" : "#f7f7f5",
        paper: darkMode ? "#1a2230" : "#ffffff",
      },
    },
    shape: {
      borderRadius: 16,
    },
    typography: {
      fontFamily: '"Poppins", "Assistant", "Segoe UI", sans-serif',
      h4: {
        fontWeight: 800,
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: "none",
            fontWeight: 700,
          },
        },
      },
    },
  });
