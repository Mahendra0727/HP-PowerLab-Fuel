import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { useUser } from '../Context/UserContext';
import { supabase } from '../utils/supabaseClient';

const Navbar = () => {
  const { role, loading, setRole } = useUser();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Logout Error:', error.message);
    } else {
      setRole(null);
      navigate('/login');
    }
  };

  const links = {
    Farmer: [
      { to: '/farmerProfile', label: 'Farmer Profile' },
      { to: '/farmerOrder', label: 'Place Order' },
      { to: '/farmerCommunity', label: 'Community' },
      { to: '/tips', label: 'Tips' },
      { to: '/price', label: 'Prices' },
    ],
    Driver: [
      { to: '/driverDeliver', label: 'Delivery' },
      { to: '/tips', label: 'Tips' },
    ],
    Admin: [
      { to: '/adminDashboard', label: 'Dashboard' },
      { to: '/adminManagement', label: 'Management' },
    ],
    Guest: [
      { to: '/', label: 'Home' },
      { to: '/about', label: 'About Us' },
    ],
  };

  const currentLinks = role ? links[role] : links['Guest'];

  return (
    <nav className="bg-gradient-to-br from-blue-50 to-green-50 sticky top-0 z-50 border-b border-slate-100">
      <div className="max-w-[88rem] mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <img
              src="/small.png"
              alt="HP Logo"
              className="h-12 w-12 rounded-full object-contain"
            />
          </Link>
          <div className="hidden md:flex space-x-6">
            {loading ? (
              <div>Loading...</div>
            ) : (
              currentLinks.map((link, index) => (
                <Link key={index} to={link.to} className="text-gray-700 hover:text-blue-600">
                  {link.label}
                </Link>
              ))
            )}
          </div>
          <div className="hidden md:flex space-x-3">
            {role ? (
              <button
                onClick={handleLogout}
                className="border border-gray-300 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded"
              >
                Logout
              </button>
            ) : (
              <>
                <Link to="/login" className="border border-gray-300 text-gray-800 py-2 px-4 rounded">
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="bg-gradient-to-r from-blue-600 to-green-600 text-white py-2 px-4 rounded"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
        {isMenuOpen && (
          <div className="md:hidden">
            <ul className="space-y-4 mt-4">
              {currentLinks.map((link, index) => (
                <li key={index}>
                  <Link to={link.to} onClick={() => setIsMenuOpen(false)}>
                    {link.label}
                  </Link>
                </li>
              ))}
              {role && (
                <li>
                  <button onClick={handleLogout}>Logout</button>
                </li>
              )}
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
