import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";

export const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("https://fakestoreapi.com/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username.trim(),
          password: password.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error("Invalid username or password credentials.");
      }

      const data = await response.json();

      if (data.token) {
        login(data.token);
        navigate("/products");
      } else {
        throw new Error("Token structure missing from API response context.");
      }
    } catch (err) {
      const errorObject = err as Error;
      setError(errorObject.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <Card sx={{ width: "100%", maxWidth: 450, borderRadius: 3, boxShadow: 6 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h4" fontWeight={700} textAlign="center">
            Welcome Back
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            textAlign="center"
            sx={{ mt: 1, mb: 3 }}
          >
            Sign in to your POC Dashboard
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={2}>
              <TextField
                label="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g., mor_2314"
                required
                fullWidth
              />

              <TextField
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                fullWidth
              />

              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={loading}
                startIcon={
                  loading ? <CircularProgress size={18} /> : <LoginIcon />
                }
              >
                {loading ? "Validating..." : "Sign In"}
              </Button>
            </Stack>
          </Box>

          <Box className="mt-6 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <Typography variant="caption" fontWeight={600}>
              💡 Required Test Credentials:
            </Typography>

            <Typography variant="caption" display="block" color="text.secondary">
              username: <strong>mor_2314</strong>
            </Typography>

            <Typography variant="caption" display="block" color="text.secondary">
              password: <strong>83r5^_</strong>
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};