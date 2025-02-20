import { useEffect, useState } from "react";
import { Container, Card, CardContent, Typography, Grid, TextField, InputAdornment, IconButton } from "@mui/material";
import { getUserProfile } from "../../../store/endpoint/auth/authAPI";
import { bluegray } from "../../../themes/color";
import { Visibility, VisibilityOff } from "@mui/icons-material";


const Profile = () => {
  const [user, setUser] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) {
          console.error("User ID not found in localStorage");
          return;
        }

        const data = await getUserProfile(userId);
        setUser(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  if (!user) {
    return <Typography variant="h6" align="center">Loading...</Typography>;
  }

  const passwordVisibility = () => {
    setShowPassword((prev) => !prev);
    console.log("password:", showPassword, user.password);
  }

  return (
    <Container
      maxWidth="sm"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "80vh",
      }}
    >
      <Card elevation={3} style={{ padding: 20, width: "100%", backgroundColor: bluegray[700], color: 'white' }}>
        <CardContent>
          <Typography variant="h5" gutterBottom style={{ fontWeight: "bold", textAlign: "center", color: "white" }}>
            Profile Information
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField fullWidth label="Username" value={user.username} InputProps={{ readOnly: true, style: { color: "white" } }} variant="outlined" margin="dense" sx={{ '& .MuiInputLabel-root': { color: 'white' }, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'white' } } }} />
              <TextField fullWidth label="Name" value={user.name} InputProps={{ readOnly: true, style: { color: "white" } }} variant="outlined" margin="dense" sx={{ '& .MuiInputLabel-root': { color: 'white' }, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'white' } } }} />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth label="Email" value={user.email} InputProps={{ readOnly: true, style: { color: "white" } }} variant="outlined" margin="dense" sx={{ '& .MuiInputLabel-root': { color: 'white' }, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'white' } } }} />
              <TextField
                fullWidth
                type={showPassword ? "text" : "password"}
                label="Password"
                value={user?.password || "**********" }
                InputProps={{
                  readOnly: true,
                  style: { color: "white" },
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={passwordVisibility} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
                variant="outlined"
                margin="dense"
                sx={{ '& .MuiInputLabel-root': { color: 'white' }, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'white' } } }} />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Container>
  );
};

export default Profile;