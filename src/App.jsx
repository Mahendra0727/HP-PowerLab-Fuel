import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { UserProvider, useUser } from './Context/UserContext'; // Import useUser for context
import Navbar from './Components/Navbar';
import Footer from './Components/Footer';
import LoginBox from './Page/Login';
import Signup from './Page/SignUp';
import Home from './Page/Home';
import FarmerOrder from './Page/FarmerOrder';
import FarmerProfile from './Page/FarmerProfile';
import DriverDeliver from './Page/DriverDeliver';
import AdminDashboard from './Page/AdminDashboard';
import AdminMangement from './Page/AdminMangement';
import FarmerCommunity from './Page/FarmerCommunity';
import Tips from './Page/Tips';
import Prices from './Page/Prices';


// Protected Route Component
const ProtectedRoute = ({ element, allowedRoles }) => {
  const { role, loading } = useUser(); // Use role and loading from UserContext

  if (loading) {
    // Show a loading indicator while fetching the role
    return <div className="text-center mt-10">Loading...</div>;
  }

  if (!role) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" />;
  }

  if (!allowedRoles.includes(role)) {
    // Redirect to home if the role is not authorized
    return <Navigate to="/" />;
  }

  // Render the route if authorized
  return element;
};

// Main App Component
const App = () => {
  return (
    <UserProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          {/* Navbar */}
          <Navbar />

          
          {/* Main Content */}
          <div className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<LoginBox />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/price" element={<Prices />} />
              <Route
                path="/farmerOrder"
                element={<ProtectedRoute element={<FarmerOrder />} allowedRoles={['Farmer']} />}
              />
              <Route
                path="/farmerProfile"
                element={<ProtectedRoute element={<FarmerProfile />} allowedRoles={['Farmer']} />}
              />
              <Route
                path="/farmerCommunity"
                element={<ProtectedRoute element={<FarmerCommunity />} allowedRoles={['Farmer']} />}
              />
              <Route
                path="/tips"
                element={<ProtectedRoute element={<Tips />} allowedRoles={['Farmer']} />}
              />
              <Route
                path="/driverDeliver"
                element={<ProtectedRoute element={<DriverDeliver />} allowedRoles={['Driver']} />}
              />
              <Route
                path="/adminDashboard"
                element={<ProtectedRoute element={<AdminDashboard />} allowedRoles={['Admin']} />}
              />
              <Route
                path="/adminManagement"
                element={<ProtectedRoute element={<AdminMangement />} allowedRoles={['Admin']} />}
              />
            </Routes>
          </div>
          {/* Footer */}
          <Footer />
        </div>
      </Router>
    </UserProvider>
  );
};

export default App;
