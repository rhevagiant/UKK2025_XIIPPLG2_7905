import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { AppBar, Box, CssBaseline, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar, Typography, IconButton, Menu, MenuItem, Avatar } from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AssignmentIcon from "@mui/icons-material/Assignment";
import { bluegray } from "../../themes/color";
import { useState } from "react";
import { logout } from "../../store/endpoint/auth/authAPI";
import Swal from "sweetalert2";

const drawerWidth = 240;

const SidebarNavbar = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);

  const menuItems = [
    { text: "Dashboard", path: "/dashboard", icon: <DashboardIcon sx={{ color: bluegray[700] }}/> },
    { text: "Tasks", path: "/categories", icon: <AssignmentIcon sx={{ color: bluegray[700] }}/> },
  ];

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, logout!"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await logout();
          localStorage.removeItem("userId");
          navigate("/");
        } catch (error) {
          console.error("Logout error:", error);
        }
      }
    });
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: 1201, backgroundColor: bluegray[700] }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            To-Do List
          </Typography>
          <IconButton onClick={handleMenuOpen}>
            <Avatar />
          </IconButton>
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
            <MenuItem onClick={() => navigate("/profile")}>
              Profile
            </MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: "border-box" },
        }}
      >
        <Toolbar />
        <List>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton component={NavLink} to={item.path}>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};

export default SidebarNavbar;
