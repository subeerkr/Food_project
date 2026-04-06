import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Link,
  Alert,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { auth, signInWithGoogle, signInWithEmailAndPassword } from "../firebase";
import { useAuth } from "../context/AuthContext";
import { useLocation } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [message, setMessage] = useState(location.state?.message || "");

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!formData.email || !formData.password) {
      setError("Please fill in all fields");
      return;
    }

    try {
      // 1. Authenticate user
      const userCredential = await signInWithEmailAndPassword(
        auth,
        formData.email, 
        formData.password
      );
      const user = userCredential.user;

      // 2. Check if email is verified
      if (!user.emailVerified) {
        await logout(); // Log them out immediately
        setError("Please verify your email before logging in. A verification link was sent to your email.");
        return;
      }

      // 3. Navigate home (AuthContext will follow)
      navigate("/");

    } catch (err) {
      setError(err.message || "Login failed. Please check your credentials.");
    }
  };

  const handleGoogleSignIn = async () => {
    setError("");
    try {
      const user = await signInWithGoogle();
      if (user) {
        // AuthProvider handles the state via onAuthStateChanged
        navigate("/");
      }
    } catch (err) {
      setError(err.message || "Google sign-in failed");
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
          }}
        >
          <Box
            sx={{
              backgroundColor: "primary.main",
              borderRadius: "50%",
              p: 1,
              mb: 2,
            }}
          >
            <LockOutlinedIcon sx={{ color: "white" }} />
          </Box>
          <Typography component="h1" variant="h5" gutterBottom>
            Login
          </Typography>
          {error && (
            <Alert severity="error" sx={{ width: "100%", mb: 2 }}>
              {error}
            </Alert>
          )}
          {message && (
            <Alert severity="success" sx={{ width: "100%", mb: 2 }}>
              {message}
            </Alert>
          )}
          <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={formData.email}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Login 
            </Button>
            <Button
              fullWidth
              variant="outlined"
              onClick={handleGoogleSignIn}
              sx={{ mb: 2 }}
            >
              Sign in with Google
            </Button>
            <Box sx={{ textAlign: "center" }}>
              <Link
                component="button"
                variant="body2"
                onClick={() => navigate("/signup")}
              >
                {"Don't have an account? Sign Up"}
              </Link>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login;
