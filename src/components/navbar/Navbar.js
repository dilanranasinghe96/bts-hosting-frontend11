// import "bootstrap/dist/css/bootstrap.min.css";
// import "bootstrap/dist/js/bootstrap.bundle.min";
// import {
//   LayoutDashboard,
//   LogOut,
//   Package,
//   Plus,
//   QrCode,
//   UserPlus,
//   Users
// } from "lucide-react";
// import React, { useState } from "react";
// import Button from "react-bootstrap/Button";
// import Container from "react-bootstrap/Container";
// import Nav from "react-bootstrap/Nav";
// import NavDropdown from "react-bootstrap/NavDropdown";
// import Navbar from "react-bootstrap/Navbar";
// import { useLocation, useNavigate } from "react-router-dom";
// import logo from "../../Assets/logo.png";
// import AddItemDialog from "../AddItemDialog/AddItemDialog";
// import ManualAddItems from "../ManuallAddItems/ManualAddItems";
// import QRCodeScanner from "../QrCodeScanner/QrCodeScanner";

// const NavbarStyles = {
//   background: 'linear-gradient(to right, #2c3e50, #3498db)',
//   boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
// };

// const CustomNavbar = ({ children }) => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [openScanner, setOpenScanner] = useState(false);
//   const [openDialog, setOpenDialog] = useState(false);
//   const [bNumber, setBNumber] = useState(null);
//   const [showManualDialog, setShowManualDialog] = useState(false);

//   const user = JSON.parse(localStorage.getItem("user"));
//   const userRole = user?.role;
//   const userName = user?.username;

//   const isAuthPage = ["/login", "/register", "/"].includes(location.pathname);

//   if (isAuthPage) {
//     return children;
//   }

//   const handleLogout = () => {
//     localStorage.removeItem("user");
//     navigate("/login");
//   };

//   const handleAddClick = () => {
//     setOpenScanner(true);
//   };

//   const handleScannerClose = () => {
//     setOpenScanner(false);
//   };

//   const handleDialogClose = () => {
//     setOpenDialog(false);
//   };

//   const handleScanComplete = (scannedBNumber) => {
//     setBNumber(scannedBNumber);
//     setOpenScanner(false);
//     setOpenDialog(true);
//   };

//   const handleManualAdd = () => {
//     setShowManualDialog(true);
//   };

//   const closeManualAdd = () => {
//     setShowManualDialog(false);
//   };

//   const PlantUserNavbar = () => (
//     <Navbar style={NavbarStyles} variant="dark" expand="lg" sticky="top" className="py-3">
//       <Container fluid>
//         <Navbar.Brand href="/cadmindashboard" className="fw-bold fs-3">
//           <img src={logo} width="50" height="50" className="d-inline-block align-top me-2" alt="Logo" />
//           BTS
//         </Navbar.Brand>
//         <Navbar.Toggle aria-controls="plant-navbar-nav" />
//         <Navbar.Collapse id="plant-navbar-nav">
//           <Nav className="ms-auto align-items-center">
//             <div className="d-flex flex-column flex-md-row gap-3 p-2">
//               <Button variant="outline-light" className="px-3 py-2 d-flex align-items-center gap-2" onClick={handleAddClick}>
//                 <QrCode size={20} />
//                 Add Item
//               </Button>
//               <Button variant="warning" className="px-3 py-2 d-flex align-items-center gap-2" onClick={handleLogout}>
//                 <LogOut size={20} />
//                 Logout
//               </Button>
//             </div>
//           </Nav>
//         </Navbar.Collapse>
//       </Container>
//     </Navbar>
//   );

//   //cutin navbar
//   const CutInNavbar = () => (
//     <Navbar style={NavbarStyles} variant="dark" expand="lg" sticky="top" className="py-3">
//       <Container fluid>
//         <Navbar.Brand href="/cutintag" className="fw-bold fs-3">
//           <img src={logo} width="50" height="50" className="d-inline-block align-top me-2" alt="Logo" />
//           BTS
//         </Navbar.Brand>
//         <Navbar.Toggle aria-controls="plant-navbar-nav" />
//         <Navbar.Collapse id="plant-navbar-nav">
//           <Nav className="ms-auto align-items-center">
//             <div className="d-flex flex-column flex-md-row gap-3 p-2">
              
//               <Button variant="warning" className="px-3 py-2 d-flex align-items-center gap-2" onClick={handleLogout}>
//                 <LogOut size={20} />
//                 Logout
//               </Button>
//             </div>
//           </Nav>
//         </Navbar.Collapse>
//       </Container>
//     </Navbar>
//   );

//   const CompanyAdminNavbar = () => (
//     <Navbar style={NavbarStyles} variant="dark" expand="lg" sticky="top" className="py-3">
//       <Container fluid>
//         <Navbar.Brand href="/cadmindashboard" className="fw-bold fs-3">
//           <img src={logo} width="50" height="50" className="d-inline-block align-top me-2" alt="Logo" />
//           BTS
//         </Navbar.Brand>
//         <Navbar.Toggle aria-controls="company-admin-nav" />
//         <Navbar.Collapse id="company-admin-nav">
//           <Nav className="ms-auto align-items-center">
//             <div className="d-flex flex-column flex-md-row gap-2 p-2">
//               <Button variant="outline-light" className="px-3 py-2 d-flex align-items-center gap-2" onClick={() => navigate("/cadmindashboard")}>
//                 <LayoutDashboard size={20} />
//                 Dashboard
//               </Button>
//               <Button variant="outline-light" className="px-3 py-2 d-flex align-items-center gap-2" onClick={handleManualAdd}>
//                 <Plus size={20} />
//                 Add Item
//               </Button>
//               <Button variant="outline-light" className="px-3 py-2 d-flex align-items-center gap-2" onClick={() => navigate("/home")}>
//                 <Package size={20} />
//                 Finish Goods
//               </Button>
//               <NavDropdown 
//                 title={
//                   <span className="text-white align-items-center gap-2 ">
//                     <Users size={20} className="me-2 "/>
//                     {userName}
//                   </span>
//                 } 
//                 id="users-dropdown" 
//                 className="me-2 border-0"
//               >
//                 <NavDropdown.Item onClick={() => navigate("/manageusers")} className="d-flex align-items-center gap-2">
//                   <Users size={20}/>
//                   Manage Users
//                 </NavDropdown.Item>
//                 <NavDropdown.Item onClick={() => navigate("/createusers")} className="d-flex align-items-center gap-2">
//                   <UserPlus  size={20}/>
//                   Create Users
//                 </NavDropdown.Item>
//               </NavDropdown>
//               <Button variant="warning" className="px-3 py-2 d-flex align-items-center gap-2" onClick={handleLogout}>
//                 <LogOut size={20}/>
//                 Logout
//               </Button>
//             </div>
//           </Nav>
//         </Navbar.Collapse>
//       </Container>
//     </Navbar>
//   );

//   const MainAdminNavbar = () => (
//     <Navbar style={NavbarStyles} variant="dark" expand="lg" sticky="top" className="py-3">
//       <Container fluid>
//         <Navbar.Brand href="/manageallusers" className="fw-bold fs-3">
//           <img src={logo} width="50" height="50" className="d-inline-block align-top me-2" alt="Logo" />
//           BTS
//         </Navbar.Brand>
//         <Navbar.Toggle aria-controls="main-admin-nav" />
//         <Navbar.Collapse id="main-admin-nav">
//           <Nav className="ms-auto align-items-center">
//             <div className="d-flex flex-column flex-md-row gap-2 p-2">
//               <NavDropdown 
//                 title={
//                   <span className="fs-5 text-white align-items-center gap-2">
//                     <Users size={20} className="me-2"/>
//                     {userName}
//                   </span>
//                 } 
//                 id="users-dropdown" 
//                 className="me-2"
//               >
//                 <NavDropdown.Item onClick={() => navigate("/manageallusers")} className="d-flex align-items-center gap-2">
//                   <Users size={20} />
//                   Manage Users
//                 </NavDropdown.Item>
//                 <NavDropdown.Item onClick={() => navigate("/createallusers")} className="d-flex align-items-center gap-2">
//                   <UserPlus size={20} />
//                   Create Users
//                 </NavDropdown.Item>
//               </NavDropdown>
//               <Button variant="warning" className="px-3 py-2 d-flex align-items-center gap-2" onClick={handleLogout}>
//                 <LogOut size={20} />
//                 Logout
//               </Button>
//             </div>
//           </Nav>
//         </Navbar.Collapse>
//       </Container>
//     </Navbar>
//   );

//   return (
//     <>
//       {userRole === "company admin" && <CompanyAdminNavbar />}
//       {(userRole === "plant user" || userRole === "user") && <PlantUserNavbar />}
//       {userRole === "main admin" && <MainAdminNavbar />}
//       {userRole === "cut in" && <CutInNavbar />}
//       {children}
//       {openScanner && (
//         <QRCodeScanner onScanComplete={handleScanComplete} onClose={handleScannerClose} />
//       )}
//       {openDialog && (
//         <AddItemDialog onClose={handleDialogClose} bNumber={bNumber} />
//       )}
//       {showManualDialog && (
//         <ManualAddItems onClose={closeManualAdd} />
//       )}
//     </>
//   );
// };

// export default CustomNavbar;





import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import {
  LayoutDashboard,
  LogOut,
  Package,
  Plus,
  QrCode,
  UserPlus,
  Users
} from "lucide-react";
import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import Navbar from "react-bootstrap/Navbar";
import { useLocation, useNavigate } from "react-router-dom";
import logo from "../../Assets/logo.png";
import ScannerWithForm from '../ScannerWithForm';
import ManualAddItems from "../ManuallAddItems/ManualAddItems";



const NavbarStyles = {
  background: 'linear-gradient(to right, #2c3e50, #3498db)',
  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
};

const CustomNavbar = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showManualDialog, setShowManualDialog] = useState(false);

  const [showScanner, setShowScanner] = useState(false);


  const user = JSON.parse(localStorage.getItem("user"));
  const userRole = user?.role;
  const userName = user?.username;

  const isAuthPage = ["/login", "/register", "/"].includes(location.pathname);

  if (isAuthPage) {
    return children;
  }

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleAddClick = () => {
    setShowScanner(true);
  };


  const handleScannerClose = () => {
    setShowScanner(false);
  };




  const handleManualAdd = () => {
    setShowManualDialog(true);
  };

  const closeManualAdd = () => {
    setShowManualDialog(false);
  };

  const PlantUserNavbar = () => (
    <Navbar style={NavbarStyles} variant="dark" expand="lg" sticky="top" className="py-3">
      <Container fluid>
        <Navbar.Brand href="/cadmindashboard" className="fw-bold fs-3">
          <img src={logo} width="50" height="50" className="d-inline-block align-top me-2" alt="Logo" />
          BTS
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="plant-navbar-nav" />
        <Navbar.Collapse id="plant-navbar-nav">
          <Nav className="ms-auto align-items-center">
            <div className="d-flex flex-column flex-md-row gap-3 p-2">
              <Button variant="outline-light" className="px-3 py-2 d-flex align-items-center gap-2" onClick={handleAddClick}>
                <QrCode size={20} />
                Add Item
              </Button>
              <Button variant="warning" className="px-3 py-2 d-flex align-items-center gap-2" onClick={handleLogout}>
                <LogOut size={20} />
                Logout
              </Button>
            </div>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );

  //cutin navbar
  const CutInNavbar = () => (
    <Navbar style={NavbarStyles} variant="dark" expand="lg" sticky="top" className="py-3">
      <Container fluid>
        <Navbar.Brand href="/cutintag" className="fw-bold fs-3">
          <img src={logo} width="50" height="50" className="d-inline-block align-top me-2" alt="Logo" />
          BTS
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="plant-navbar-nav" />
        <Navbar.Collapse id="plant-navbar-nav">
          <Nav className="ms-auto align-items-center">
            <div className="d-flex flex-column flex-md-row gap-3 p-2">
              
              <Button variant="warning" className="px-3 py-2 d-flex align-items-center gap-2" onClick={handleLogout}>
                <LogOut size={20} />
                Logout
              </Button>
            </div>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );

  const CompanyAdminNavbar = () => (
    <Navbar style={NavbarStyles} variant="dark" expand="lg" sticky="top" className="py-3">
      <Container fluid>
        <Navbar.Brand href="/cadmindashboard" className="fw-bold fs-3">
          <img src={logo} width="50" height="50" className="d-inline-block align-top me-2" alt="Logo" />
          BTS
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="company-admin-nav" />
        <Navbar.Collapse id="company-admin-nav">
          <Nav className="ms-auto align-items-center">
            <div className="d-flex flex-column flex-md-row gap-2 p-2">
              <Button variant="outline-light" className="px-3 py-2 d-flex align-items-center gap-2" onClick={() => navigate("/cadmindashboard")}>
                <LayoutDashboard size={20} />
                Dashboard
              </Button>
              <Button variant="outline-light" className="px-3 py-2 d-flex align-items-center gap-2" onClick={handleManualAdd}>
                <Plus size={20} />
                Add Item
              </Button>
              <Button variant="outline-light" className="px-3 py-2 d-flex align-items-center gap-2" onClick={() => navigate("/home")}>
                <Package size={20} />
                Finish Goods
              </Button>
              <NavDropdown 
                title={
                  <span className="text-white align-items-center gap-2 ">
                    <Users size={20} className="me-2 "/>
                    {userName}
                  </span>
                } 
                id="users-dropdown" 
                className="me-2 border-0"
              >
                <NavDropdown.Item onClick={() => navigate("/manageusers")} className="d-flex align-items-center gap-2">
                  <Users size={20}/>
                  Manage Users
                </NavDropdown.Item>
                <NavDropdown.Item onClick={() => navigate("/createusers")} className="d-flex align-items-center gap-2">
                  <UserPlus  size={20}/>
                  Create Users
                </NavDropdown.Item>
              </NavDropdown>
              <Button variant="warning" className="px-3 py-2 d-flex align-items-center gap-2" onClick={handleLogout}>
                <LogOut size={20}/>
                Logout
              </Button>
            </div>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );

  const MainAdminNavbar = () => (
    <Navbar style={NavbarStyles} variant="dark" expand="lg" sticky="top" className="py-3">
      <Container fluid>
        <Navbar.Brand href="/manageallusers" className="fw-bold fs-3">
          <img src={logo} width="50" height="50" className="d-inline-block align-top me-2" alt="Logo" />
          BTS
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="main-admin-nav" />
        <Navbar.Collapse id="main-admin-nav">
          <Nav className="ms-auto align-items-center">
            <div className="d-flex flex-column flex-md-row gap-2 p-2">
              <NavDropdown 
                title={
                  <span className="fs-5 text-white align-items-center gap-2">
                    <Users size={20} className="me-2"/>
                    {userName}
                  </span>
                } 
                id="users-dropdown" 
                className="me-2"
              >
                <NavDropdown.Item onClick={() => navigate("/manageallusers")} className="d-flex align-items-center gap-2">
                  <Users size={20} />
                  Manage Users
                </NavDropdown.Item>
                <NavDropdown.Item onClick={() => navigate("/createallusers")} className="d-flex align-items-center gap-2">
                  <UserPlus size={20} />
                  Create Users
                </NavDropdown.Item>
              </NavDropdown>
              <Button variant="warning" className="px-3 py-2 d-flex align-items-center gap-2" onClick={handleLogout}>
                <LogOut size={20} />
                Logout
              </Button>
            </div>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );

  return (
    <>
      {userRole === "company admin" && <CompanyAdminNavbar />}
      {(userRole === "plant user" || userRole === "user") && <PlantUserNavbar />}
      {userRole === "main admin" && <MainAdminNavbar />}
      {userRole === "cut in" && <CutInNavbar />}
      {children}
      {showScanner && (
        <ScannerWithForm onClose={handleScannerClose} />
      )}
           {showManualDialog && (
        <ManualAddItems onClose={closeManualAdd} />
       )}
    </>
  );
};

export default CustomNavbar;