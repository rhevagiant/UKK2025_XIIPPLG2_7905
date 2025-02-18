import {  BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./component/screen/auth/login";
import Register from "./component/screen/auth/register";
import Dashboard from "./component/screen/dashboard/dashboard";
import SidebarNavbar from "./component/sidebar/sidebar";
import Profile from "./component/screen/profile/profile";
import Tasks from "./component/screen/tasks/tasks";



export default function App() {
  return (
    <>
        <Router>
          <Routes>
            <Route path="/" element={<Login/>}/>
            <Route path="/register" element={<Register/>}/>
            <Route path="/*" element={<SidebarNavbar/>}>
             <Route path="dashboard" element={<Dashboard/>}/>
             <Route path="tasks" element={<Tasks />}/>
             <Route path="profile" element={<Profile/>}/>
            </Route>
          </Routes>
        </Router>
    </>
  )
}

