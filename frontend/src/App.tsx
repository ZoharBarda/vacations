import { useMemo, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Box, Container, CssBaseline, ThemeProvider } from "@mui/material";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import { createAppTheme } from "./theme";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./routes/ProtectedRoute";
import AdminRoute from "./routes/AdminRoute";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import VacationsPage from "./pages/VacationsPage";
import AiRecommendationPage from "./pages/AiRecommendationPage";
import McpChatPage from "./pages/McpChatPage";
import AdminPage from "./pages/AdminPage";
import AddVacationPage from "./pages/AddVacationPage";
import EditVacationPage from "./pages/EditVacationPage";
import ReportsPage from "./pages/ReportsPage";
import AboutPage from "./pages/AboutPage";

const App = () => {
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("theme") === "dark");

  const theme = useMemo(() => createAppTheme(darkMode), [darkMode]);

  const toggleTheme = () => {
    const next = !darkMode;
    setDarkMode(next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <Box
            sx={{
              minHeight: "100vh",
              background: darkMode
                ? "radial-gradient(circle at 20% 10%, #25334a, #11161f 50%)"
                : "radial-gradient(circle at 20% 10%, #ffd9bf, #f7f7f5 50%)",
              transition: "all 0.3s ease",
            }}
          >
            <Navbar darkMode={darkMode} onToggleTheme={toggleTheme} />
            <Container maxWidth="lg" sx={{ py: 2 }}>
              <Routes>
                <Route path="/" element={<Navigate to="/vacations" replace />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                <Route element={<ProtectedRoute />}>
                  <Route path="/vacations" element={<VacationsPage />} />
                  <Route path="/ai" element={<AiRecommendationPage />} />
                  <Route path="/mcp-chat" element={<McpChatPage />} />
                </Route>

                <Route element={<AdminRoute />}>
                  <Route path="/admin" element={<AdminPage />} />
                  <Route path="/admin/vacations/new" element={<AddVacationPage />} />
                  <Route path="/admin/vacations/:id/edit" element={<EditVacationPage />} />
                  <Route path="/reports" element={<ReportsPage />} />
                </Route>

                <Route path="*" element={<Navigate to="/vacations" replace />} />
              </Routes>
            </Container>
            <Footer />
            <ToastContainer position="top-right" autoClose={2500} />
          </Box>
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  );
};

export default App;
