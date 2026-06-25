import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bus, User, LogOut, ChevronDown } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

const Navbar = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-primary-dark text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2 text-2xl font-bold">
          <Bus className="h-8 w-8" />
          <span>BusGo</span>
        </Link>
        <div className="flex items-center space-x-6">
          <Link to="/search" className="hover:text-gray-200">Search Buses</Link>
          <Link to="/contact" className="hover:text-gray-200">Contact</Link>
          
          {user ? (
            <div className="relative">
              <button 
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center space-x-1 hover:text-gray-200 transition"
              >
                <span>{user.name || 'Account'}</span>
                <ChevronDown className="h-4 w-4" />
              </button>
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 text-gray-800">
                  <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setShowDropdown(false)}>My Profile</Link>
                  <Link to="/profile/bookings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setShowDropdown(false)}>My Bookings</Link>
                  {user.role === 'admin' && (
                    <Link to="/admin" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setShowDropdown(false)}>Admin Dashboard</Link>
                  )}
                  <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Logout</button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="flex items-center space-x-1 hover:text-gray-200 bg-white/10 px-4 py-2 rounded-md transition">
              <User className="h-5 w-5" />
              <span>Login / Register</span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
