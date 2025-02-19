import { useState } from "react";
import { TextField, Button, Container, Typography, Box, Paper, Alert, Collapse } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../store/context/authContext";
import { login } from "../../../store/endpoint/auth/authAPI";
import { bluegray } from "../../../themes/color";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login: setAuth } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError(""); 
    try {
      const response = await login({ email, password });

      if (response) {
        setAuth();
        console.log("Login sukses!");
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Login failed:", error);
      setError("Invalid email or password!"); 
    }
  };

  return (
    <Container maxWidth="xs">
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Paper elevation={3} sx={{ padding: 4, borderRadius: 2, width: "100%" }}>
          <Box textAlign="center" mb={2}>
            <Typography variant="h5" fontWeight="bold" sx={{ color: bluegray[700] }}>
              Welcome Back
            </Typography>
            <Typography variant="subtitle1" color="textSecondary">
              Login to your account
            </Typography>
          </Box>

          <Collapse in={Boolean(error)}>
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          </Collapse>

          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="Password"
            variant="outlined"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button
            variant="contained"
            fullWidth
            sx={{
              mt: 2,
              padding: 1,
              backgroundColor: bluegray[700],
              ":hover": { backgroundColor: bluegray[500] },
            }}
            onClick={handleLogin}
          >
            Login
          </Button>

          <Typography variant="body2" textAlign="center" mt={2}>
            Don’t have an account?{" "}
            <a href="/register" style={{ color: bluegray[700], textDecoration: "none", fontWeight: "bold" }}>
              Register
            </a>
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login;
