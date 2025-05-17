import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, User, LogOut, Settings } from 'lucide-react';
import { MdQrCode2 } from "react-icons/md";
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import NixoLogo from '../assets/Nixo_Logo_White.png';
import { useAuth } from '../context/AuthContext';
import { updateUserWallet } from '../utils/api';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const { isAuthenticated, user, logout, token } = useAuth();
  const navigate = useNavigate();
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const wallet = useWallet();

  // Handle scroll event to change header appearance
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Update user document when wallet is connected
  useEffect(() => {
    const saveWalletAddress = async () => {
      if (isAuthenticated && wallet.connected && wallet.publicKey && token) {
        try {
          await updateUserWallet(wallet.publicKey.toString(), token);
        } catch (error) {
          console.error('Failed to update wallet address:', error);
        }
      }
    };
    
    saveWalletAddress();
  }, [isAuthenticated, wallet.connected, wallet.publicKey, token]);

  const handleLogout = () => {
    logout();
    setIsProfileMenuOpen(false);
    navigate('/');
  };

  return (
    <header 
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-space-black/80 backdrop-blur-md shadow-md' : 'bg-transparent'
      }`}
    >
      <div className="max-w-[80vw] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/"  className="flex items-center">
            <img src={NixoLogo} alt="Nixo Logo" className="h-8 w-auto" />
          </Link>
          {/* Desktop Navigation */}
          <nav className="hidden xl:block">
            <ul className="flex space-x-4">
              <li>
                <Link to="/" className="text-white hover:text-nixo-green transition duration-200 px-3 py-2 rounded-md 2xl:text-2xl font-medium">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-white hover:text-nixo-green transition duration-200 px-3 py-2 rounded-md 2xl:text-2xl font-medium">
                  About
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="text-white hover:text-nixo-green transition duration-200 px-3 py-2 rounded-md 2xl:text-2xl font-medium">
                  How It Works
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-white hover:text-nixo-green transition duration-200 px-3 py-2 rounded-md 2xl:text-2xl font-medium">
                  Contact Us
                </Link>
              </li>
              {isAuthenticated && (
                <li>
                  <Link to="/rewards" className="text-white align-middle hover:text-nixo-green transition duration-200 px-3 py-2 rounded-md 2xl:text-2xl font-medium  items-center">
                    <MdQrCode2 className="mr-1 inline-block" />
                    <span className='align-middle'>Rewards</span>
                  </Link>
                </li>
              )}
              {!isAuthenticated && (
                <li>
                  <Link to="/login" className="text-white hover:text-nixo-green transition duration-200 px-3 py-2 rounded-md 2xl:text-2xl font-medium">
                    Login/Signup
                  </Link>
                </li>
              )}
            </ul>
          </nav>
          
          <div className="flex items-center space-x-4">
            {/* Profile Icon (when logged in) */}
            {isAuthenticated && (
              <div className="relative" ref={profileMenuRef}>
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center space-x-2 text-white hover:text-nixo-green transition duration-200 p-2 rounded-full hover:bg-nixo-green/10"
                >
                  <div className="w-8 h-8 rounded-full bg-nixo-green/30 border border-nixo-green flex items-center justify-center">
                    <User className="h-5 w-5 text-white" />
                  </div>
                </button>
                
                {/* Profile Dropdown Menu */}
                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-space-black/90 backdrop-blur-md border border-nixo-green/20 rounded-md shadow-xl py-1 z-50">
                    <div className="px-4 py-2 border-b border-nixo-green/20">
                      <p className="text-white text-sm font-medium truncate">{user?.name || 'User'}</p>
                      <p className="text-gray-400 text-xs truncate">{user?.email}</p>
                    </div>
                    <Link 
                      to="/profile" 
                      className="block px-4 py-2 text-sm text-white hover:bg-nixo-green/20 transition duration-200"
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      <div className="flex items-center">
                        <Settings className="h-4 w-4 mr-2" />
                        Profile
                      </div>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-white hover:bg-nixo-green/20 transition duration-200"
                    >
                      <div className="flex items-center">
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                      </div>
                    </button>
                  </div>
                )}
              </div>
            )}
            
            {/* Connect Wallet Button - Custom Styled */}
            {isAuthenticated && <div className="hidden xl:block">
              <WalletMultiButton className="glass-button" />
            </div>}
            
            {/* Mobile Menu Button */}
            <div className="xl:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-white p-2 rounded-md hover:bg-nixo-green/20 transition duration-200"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="xl:hidden bg-space-black/90 backdrop-blur-md">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link 
              to="/" 
              className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-nixo-green/20 transition duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/about" 
              className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-nixo-green/20 transition duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <Link 
              to="/how-it-works" 
              className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-nixo-green/20 transition duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              How It Works
            </Link>
            <Link 
              to="/contact" 
              className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-nixo-green/20 transition duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
            {!isAuthenticated && (
              <Link 
                to="/login" 
                className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-nixo-green/20 transition duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Login/Signup
              </Link>
            )}
            {isAuthenticated && (
              <>
                <Link 
                  to="/rewards" 
                  className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-nixo-green/20 transition duration-200  items-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {/* <MdQrCode2 className="mr-2"/> */}
                  Rewards
                </Link>
                <Link 
                  to="/profile" 
                  className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-nixo-green/20 transition duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Profile
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-white hover:bg-nixo-green/20 transition duration-200"
                >
                  Logout
                </button>
              </>
            )}
            {isAuthenticated && <div className="mt-3">
              <WalletMultiButton className="w-full glass-button" />
            </div>}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;