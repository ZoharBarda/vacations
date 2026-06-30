import { useMemo, useState } from "react";
import { Box, Button, Paper, Stack, TextField, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks/reduxHooks";
import { registerThunk } from "../redux/authSlice";
import authService from "../services/authService";
import ErrorMessage from "../components/ErrorMessage";

const RegisterPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error } = useAppSelector((state) => state.auth);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  const emailValid = useMemo(() => /\S+@\S+\.\S+/.test(email), [email]);

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setFormError(null);

    if (!firstName || !lastName || !email || !password) {
      setFormError("All fields are required");
      return;
    }

    if (!emailValid) {
      setFormError("Invalid email format");
      return;
    }

    if (password.length < 4) {
      setFormError("Password must be at least 4 characters");
      return;
    }

    try {
      const available = await authService.checkEmailAvailability(email);
      if (!available) {
        setFormError("Email is already taken");
        return;
      }
    } catch {
      setFormError("Could not validate email availability");
      return;
    }

    const result = await dispatch(
      registerThunk({ firstName, lastName, email, password, role: "user" })
    );

    if (registerThunk.fulfilled.match(result)) {
      navigate("/vacations");
    }
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
      <Paper sx={{ p: 4, width: "100%", maxWidth: 500, borderRadius: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 2 }}>
          Create Account
        </Typography>

        <Stack component="form" spacing={2} onSubmit={onSubmit}>
          <TextField label="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
          <TextField label="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
          <TextField label="Email" value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
          <TextField label="Password" value={password} onChange={(e) => setPassword(e.target.value)} type="password" required />

          <ErrorMessage message={formError || error} />

          <Button type="submit" variant="contained" color="secondary" disabled={loading}>
            Register
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
};

export default RegisterPage;
