import { AppBar, Box, Button, Stack, Toolbar, Typography, Switch } from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks/reduxHooks";
import { logout } from "../redux/authSlice";

interface NavbarProps {
  darkMode: boolean;
  onToggleTheme: () => void;
}

const Navbar = ({ darkMode, onToggleTheme }: NavbarProps) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);

  const isAdmin = user?.role === "admin" || user?.role === "manager";

  const onLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <AppBar position="sticky" color="transparent" elevation={0} sx={{ backdropFilter: "blur(8px)" }}>
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
          <Typography variant="h6" sx={{ fontWeight: 800 }}>
            VacationFlow
          </Typography>
        </Stack>

        <Stack direction="row" spacing={1} sx={{ alignItems: "center", flexWrap: "wrap", justifyContent: "flex-end" }}>
          <Button component={RouterLink} to="/about">About</Button>
          {user && <Button component={RouterLink} to="/vacations">Vacations</Button>}
          {user && <Button component={RouterLink} to="/ai">AI Recommendation</Button>}
          {user && <Button component={RouterLink} to="/mcp-chat">MCP Chat</Button>}
          {isAdmin && <Button component={RouterLink} to="/admin">Admin</Button>}
          {isAdmin && <Button component={RouterLink} to="/reports">Reports</Button>}
          {!user && <Button component={RouterLink} to="/login">Login</Button>}
          {!user && <Button component={RouterLink} to="/register" variant="contained" color="secondary">Register</Button>}
          {user && (
            <>
              <Typography variant="body2" sx={{ px: 1 }}>
                {user.email}
              </Typography>
              <Button onClick={onLogout} color="error">Logout</Button>
            </>
          )}
          <Box>
            <Switch checked={darkMode} onChange={onToggleTheme} />
          </Box>
        </Stack>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
