import React, { useEffect, useState } from 'react';
import { Routes, Route, useLocation, Link } from 'react-router-dom';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';
// Import the background image
import nixoBg from './assets/NIXO-BG.png';
import nixoMobileBg from './assets/NIXO-mobile2.png';

// Import the default styles
import '@solana/wallet-adapter-react-ui/styles.css';

import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import HowItWorksPage from './pages/HowItWorksPage';
import ContactPage from './pages/ContactPage';
import NotFoundPage from './pages/NotFoundPage';
import LoginSignupPage from './pages/LoginSignupPage';
import ProfilePage from './pages/ProfilePage';
import RewardsPage from './pages/RewardsPage'; // Add this import
import TwitterCallback from './pages/TwitterCallback';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import NixoTagPage from './pages/NixoTagPage';
import NixoNodePage from './pages/NixoNodePage';
import NixoClusterPage from './pages/NixoClusterPage';

function App() {
  const location = useLocation();
  const isHomePage = location.pathname === '/' ;
  const isHowitWorksPage = location.pathname === '/how-it-works' ;
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  
  // Can be set to 'devnet', 'testnet', or 'mainnet-beta'
  const network = WalletAdapterNetwork.Devnet;
  
  // You can also provide a custom RPC endpoint
  const endpoint = clusterApiUrl(network);
  
  // @solana/wallet-adapter-wallets includes all the adapters but supports tree shaking
  // You can also import specific wallets
  const wallets = [
    new PhantomWalletAdapter(),
    // Add other wallet adapters here
  ];

  useEffect(() => {
    // Handle responsive behavior
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    // Create particle animation
    const createParticles = () => {
      const cosmicParticles = document.querySelector('.cosmic-particles');
      if (!cosmicParticles) return;
      
      // Clear existing particles
      cosmicParticles.innerHTML = '';
      
      const colors = ['#3CCD3A', '#2BFFE2', '#FFFFFF', '#6A45D1'];
      const particleCount = window.innerWidth < 768 ? 30 : 50;
      
      for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('span');
        particle.classList.add('particle');
        
        // Random position, size, and color
        const size = Math.random() * 5 + 1;
        const posX = Math.random() * 100;
        const delay = Math.random() * 15;
        const duration = Math.random() * 20 + 10;
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${posX}%`;
        particle.style.top = `-${size}px`;
        particle.style.backgroundColor = color;
        particle.style.color = color;
        particle.style.animationDuration = `${duration}s`;
        particle.style.animationDelay = `${delay}s`;
        
        cosmicParticles.appendChild(particle);
      }
    };
    
    createParticles();
    window.addEventListener('resize', createParticles);
    
    return () => {
      window.removeEventListener('resize', createParticles);
    };
  }, []);

  return (
    <AuthProvider>
      <ConnectionProvider endpoint={endpoint}>
        <WalletProvider wallets={wallets} autoConnect>
          <WalletModalProvider>
            <div className="min-h-screen bg-space-black relative overflow-hidden">
              <div className="cosmic-particles"></div>
              
              {/* Add the NIXO background image for homepage only */}
              {isHomePage && (
                <div 
                  className="fixed top-0 left-0 w-full h-screen z-0"
                  style={{
                    backgroundImage: `url(${windowWidth < 768 ? nixoMobileBg : nixoBg})`,
                    backgroundSize: `${windowWidth<768? "auto 1080px" : "auto 1280px"}`,
                    backgroundPosition: 'center top',
                    backgroundRepeat: 'no-repeat',
                  }}
                />
              )}
              {/* Add the NIXO background image for howitworks only */}
              {isHowitWorksPage && (
                <div 
                  className="fixed top-0 left-0 w-full h-screen z-0"
                  style={{
                    backgroundImage: `url(${windowWidth < 768 ? nixoMobileBg : nixoBg})`,
                    backgroundSize: `${windowWidth<768? "auto 1080px" : "auto 1280px"}`,
                    backgroundPosition: 'center top',
                    backgroundRepeat: 'no-repeat',
                  }}
                />
              )}
              
              <div className="min-h-screen flex flex-col relative z-10">
                <Routes>
                  <Route path="/" element={<Layout />}>
                    <Route index element={<HomePage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/how-it-works" element={<HowItWorksPage />} />
                    <Route path="/contact" element={<ContactPage />} />
                    <Route path="/login" element={<LoginSignupPage />} />
                    <Route path="/nixotag" element={<NixoTagPage />} />
                    <Route path="/nixonode" element={<NixoNodePage />} />
                    <Route path="/nixocluster" element={<NixoClusterPage />} />
                    <Route 
                      path="/profile" 
                      element={
                        <ProtectedRoute>
                          <ProfilePage />
                        </ProtectedRoute>
                      }
                    />
                    {/* Add the new rewards route */}
                    <Route 
                      path="/rewards" 
                      element={
                        <ProtectedRoute>
                          <RewardsPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route path="/auth/twitter/callback" element={<TwitterCallback />} />
                    <Route path="*" element={<NotFoundPage />} />
                  </Route>
                </Routes>
              </div>
            </div>
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </AuthProvider>
  );
}

export default App;