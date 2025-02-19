import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./store/context/authContext";
import ProtectedRoute from "./store/middleware/protectedRoute";
import SidebarNavbar from "./component/sidebar/sidebar";
import Dashboard from "./component/screen/dashboard/dashboard";
import Login from "./component/screen/auth/login";
import Register from "./component/screen/auth/register";
import Profile from "./component/screen/profile/profile";
import Tasks from "./component/screen/tasks/tasks";

export default function App() {
  return (
    <AuthProvider> 
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />

        
          <Route element={<ProtectedRoute />}>
            <Route path="/*" element={<SidebarNavbar />}>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="tasks" element={<Tasks />} />
              <Route path="profile" element={<Profile />} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}
