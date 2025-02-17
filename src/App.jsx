import {  BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./component/screen/auth/login";
import Register from "./component/screen/auth/register";



export default function App() {


  return (
    <>
      
        <Router>
          <Routes>
            <Route path="/" element={<Login/>}/>
            <Route path="/register" element={<Register/>}/>
          </Routes>
        </Router>
    </>
  )
}

