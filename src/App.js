import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Footer from "./components/Footer/Footer";
import PrivateRoute from "./components/PrivateRoute/PrivateRoute";
import Navbar from "./components/navbar/Navbar";
import CompanyAdminPage from "./pages/CompanyAdmin/CadminDashboard";
import CreatePlantUsers from "./pages/CompanyAdmin/Users/CreatePlantUsers";
import ManagePlantUsers from "./pages/CompanyAdmin/Users/ManagePlantUsers";
import CutInTag from "./pages/CutInTag/CutInTag";
import HomePage from "./pages/HomePage/HomePage";
import LoginPage from "./pages/LoginPage/LoginPage";
import CreateAllUsers from "./pages/MainAdmin/CreateAllUsers";
import MainAdminPage from "./pages/MainAdmin/MainAdminPage";
import ManageAllUsers from "./pages/MainAdmin/ManageAllUsers";
import RegisterPage from "./pages/RegisterPage/RegisterPage";
import AutoLogout from "./components/AutoLogout/AutoLogout";


function App() {
  // Get user role from localStorage
  // const user = JSON.parse(localStorage.getItem("user"));

  return (
    <Router>
      
      <div className="App" >
      <AutoLogout />
        <Navbar/>
    
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Protected routes */}
          <Route element={<PrivateRoute allowedRoles={["plant user", "company admin"]} />}>
            <Route path="/home" element={<HomePage />} />
          </Route>

          <Route element={<PrivateRoute allowedRoles={["company admin"]} />}>
            <Route path="/cadmindashboard" element={<CompanyAdminPage />} />
            <Route path="/createusers" element={<CreatePlantUsers />} />
            <Route path="/manageusers" element={<ManagePlantUsers />} />
          </Route>

          <Route element={<PrivateRoute allowedRoles={["main admin"]} />}>
            <Route path="/mainadmin" element={<MainAdminPage />} />
            <Route path="/manageallusers" element={<ManageAllUsers />} />
            <Route path="/createallusers" element={<CreateAllUsers />} />

          </Route>
          <Route element={<PrivateRoute allowedRoles={["cut in"]} />}>
            <Route path="/cutintag" element={<CutInTag />} />
           
          </Route>

        </Routes>
        <Footer/>
      </div>
    </Router>
  );
}

export default App;
