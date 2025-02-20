import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../../../store/endpoint/auth/authAPI";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  Link,
} from "@mui/material";
import { bluegray } from "../../../themes/color";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const [passwordError, setPasswordError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (e.target.name === "password") {
        validatePassword(e.target.value);
      }
  };

  const validatePassword = (password) => {
    const minLength = password.length >= 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);

    if (!minLength) {
      setPasswordError("Password must be at least 8 characters long.");
    } else if (!hasUppercase) {
      setPasswordError("Password must contain at least one uppercase letter.");
    } else if (!hasNumber) {
      setPasswordError("Password must contain at least one number.");
    } else {
      setPasswordError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if(passwordError) return;
    try {
      await register(formData);
      navigate("/"); 
    } catch (errMessage) {
      setError(errMessage);
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper
        elevation={4}
        sx={{
          p: 4,
          mt: 5,
          borderRadius: 3,
          textAlign: "center",
          backgroundColor: "#f9f9f9",
        }}
      >
        <Typography variant="h4" fontWeight="bold" gutterBottom sx={{color: bluegray[700]}}>
          Create Account
        </Typography>

        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}



        <form onSubmit={handleSubmit}>
          <Box display="flex" flexDirection="column" gap={2}>
            <TextField
              label="Username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              fullWidth
              variant="outlined"
            />
            <TextField
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              fullWidth
              variant="outlined"
            />
            <TextField
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              fullWidth
              variant="outlined"
            />
            <TextField
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              error={!!passwordError}
              helperText={passwordError}
              fullWidth
              variant="outlined"
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                mt: 1,
                py: 1.5,
                fontSize: "1rem",
                textTransform: "none",
                borderRadius: 2,
                backgroundColor: bluegray[700],
                ":hover": { backgroundColor: bluegray[500] },
              }}
            >
              Register
            </Button>
          </Box>
        </form>

        <Typography variant="body2" sx={{ mt: 3 }}>
          Already have an account?{" "}
          <Link href="/" underline="hover" sx={{color: bluegray[700]}}>
            <strong>Login here</strong>
          </Link>
        </Typography>
      </Paper>
    </Container>
  );
};

export default Register;
