import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, AlertCircle, Check, User, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { checkEmailExists, loginUser, registerUser, googleAuth, xAuth, initTwitterAuth, completeTwitterAuth } from '../utils/api';
import { useAuth } from '../context/AuthContext';

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          renderButton: (element: HTMLElement, options: any) => void;
          prompt: () => void;
        };
      };
    };
  }
}

const LoginSignupPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [showSignupForm, setShowSignupForm] = useState(false);
  const [showPasswordField, setShowPasswordField] = useState(false);
  const [isValid, setIsValid] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const { isAuthenticated, setToken } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  // Initialize Google Sign-In
  useEffect(() => {
    if (window.google?.accounts) {
      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || '',
        callback: handleGoogleResponse,
      });
    }
  }, []);

  // Handle Twitter OAuth callback
  useEffect(() => {
    const handleTwitterCallback = async () => {
      // Check if this is a Twitter callback (URL contains code and state parameters)
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      const state = urlParams.get('state');
      const storedState = localStorage.getItem('twitterAuthState');
      
      if (code && state && storedState && state === storedState) {
        setIsLoading(true);
        setErrorMessage('');
        
        try {
          // Clear the stored state
          localStorage.removeItem('twitterAuthState');
          
          // Remove the query parameters from the URL without refresh
          window.history.replaceState({}, document.title, window.location.pathname);
          
          // Exchange code for token and complete authentication
          const authResponse = await completeTwitterAuth(code, state);
          
          if (authResponse.success && authResponse.token) {
            setToken(authResponse.token);
            setSuccessMessage('Login successful!');
            setTimeout(() => navigate('/'), 1500);
          } else {
            throw new Error(authResponse.message || 'Twitter authentication failed');
          }
        } catch (error: any) {
          console.error('Twitter auth callback error:', error);
          setErrorMessage(error.message || 'Failed to complete Twitter authentication');
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    handleTwitterCallback();
  }, [navigate, setToken]);

  const validateEmail = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateEmail(email)) {
      setIsValid(false);
      setErrorMessage('Please enter a valid email address');
      return;
    }
    
    setIsValid(true);
    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');
    
    try {
      // Check if user exists (email only step)
      if (!showPasswordField && !showSignupForm) {
        // First step - check if email exists
        const checkResponse = await checkEmailExists(email);
        
        if (!checkResponse.exists) {
          // User doesn't exist, show signup form
          setShowSignupForm(true);
        } else {
          // User exists, show password field for login
          setShowPasswordField(true);
        }
        
        setIsLoading(false);
        return;
      }
      
      // Handle signup
      if (showSignupForm) {
        // This is a new user trying to sign up
        if (!name) {
          setErrorMessage('Please enter your name');
          setIsLoading(false);
          return;
        }
        
        if (!password || password.length < 6) {
          setErrorMessage('Password must be at least 6 characters');
          setIsLoading(false);
          return;
        }
        
        // Register the new user
        const registerResponse = await registerUser(email, name, password);
        
        if (registerResponse.success) {
          setToken(registerResponse.token);
          setSuccessMessage('Account created successfully!');
          setTimeout(() => navigate('/'), 1500);
        } else {
          throw new Error(registerResponse.message || 'Registration failed');
        }
      } 
      // Handle login
      else if (showPasswordField) {
        // This is an existing user trying to log in
        if (!password) {
          setErrorMessage('Please enter your password');
          setIsLoading(false);
          return;
        }
        
        const loginResponse = await loginUser(email, password);
        
        if (loginResponse.success) {
          setToken(loginResponse.token);
          setSuccessMessage('Login successful!');
          setTimeout(() => navigate('/'), 1500);
        } else {
          throw new Error(loginResponse.message || 'Invalid email or password');
        }
      }
    } catch (error: any) {
      console.error('Error:', error);
      setErrorMessage(error.message || 'Authentication failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    if (window.google?.accounts) {
      window.google.accounts.id.prompt();
    } else {
      setErrorMessage('Google authentication is not available');
    }
  };

  const handleGoogleResponse = async (response: any) => {
    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');
    
    try {
      const { credential } = response;
      const authResponse = await googleAuth(credential);
      
      if (authResponse.success && authResponse.token) {
        setToken(authResponse.token);
        setSuccessMessage('Login successful!');
        setTimeout(() => navigate('/'), 1500);
      } else {
        throw new Error(authResponse.message || 'Google authentication failed');
      }
    } catch (error: any) {
      console.error('Google auth error:', error);
      setErrorMessage(error.message || 'Google authentication failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleXSignIn = async () => {
    setErrorMessage('');
    setSuccessMessage('');
    setIsLoading(true);
    
    try {
      const response = await initTwitterAuth();
      
      if (response.success && response.authUrl) {
        // Store the state in localStorage for verification on return
        localStorage.setItem('twitterAuthState', response.state);
        
        // Open Twitter authorization in a new window
        const authWindow = window.open(
          response.authUrl,
          'twitterAuthWindow',
          'width=600,height=700,left=200,top=100'
        );
        
        // Setup a listener for messages from the popup
        window.addEventListener('message', function twitterAuthListener(event) {
          // Make sure the message is from our expected origin
          if (event.origin !== window.location.origin) return;
          
          // Check if this is our Twitter auth response
          if (event.data?.type === 'TWITTER_AUTH_CALLBACK' && event.data?.code && event.data?.state) {
            const { code, state } = event.data;
            const storedState = localStorage.getItem('twitterAuthState');
            
            // Clean up
            window.removeEventListener('message', twitterAuthListener);
            if (authWindow) authWindow.close();
            
            // Validate state parameter
            if (storedState && state === storedState) {
              // Process the Twitter auth callback
              handleTwitterCallback(code, state);
            } else {
              setErrorMessage('Invalid state parameter. Please try again.');
              setIsLoading(false);
            }
          }
        });
        
        // Set a timer to clean up if the popup is closed manually
        const checkPopupClosed = setInterval(() => {
          if (authWindow?.closed) {
            clearInterval(checkPopupClosed);
            setIsLoading(false);
          }
        }, 1000);
      } else {
        throw new Error(response.message || 'Failed to initialize Twitter authorization');
      }
    } catch (error: any) {
      console.error('Twitter auth error:', error);
      setErrorMessage('Twitter authentication failed. Please try again.');
      setIsLoading(false);
    }
  };

  const handleTwitterCallback = async (code: string, state: string) => {
    try {
      // Clear the stored state
      localStorage.removeItem('twitterAuthState');
      
      // Exchange code for token and complete authentication
      const authResponse = await completeTwitterAuth(code, state);
      
      if (authResponse.success && authResponse.token) {
        setToken(authResponse.token);
        setSuccessMessage('Login successful!');
        setTimeout(() => navigate('/'), 1500);
      } else {
        throw new Error(authResponse.message || 'Twitter authentication failed');
      }
    } catch (error: any) {
      console.error('Twitter auth callback error:', error);
      setErrorMessage(error.message || 'Failed to complete Twitter authentication');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setShowSignupForm(false);
    setShowPasswordField(false);
    setEmail('');
    setName('');
    setPassword('');
    setErrorMessage('');
  };

  return (
    <div className="max-w-md mx-auto relative">
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat opacity-40 z-[-1]"
        style={{
          backgroundImage: `url('https://raw.githubusercontent.com/stackblitz/stackblitz-images/main/nixo-space.jpg')`,
          backgroundAttachment: "fixed",
          filter: "brightness(0.6) contrast(1.2)",
        }}
      ></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="space-y-6 relative z-10 mt-20"
      >
        <div className="glass-panel p-8 backdrop-blur-lg bg-space-black/40">
          <div className="text-center mb-8">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.7 }}
              className="text-4xl md:text-5xl font-display text-white"
            >
              Welcome to <span className="text-nixo-green glow-text">Nixo</span>
            </motion.h1>
            <p className="text-xl text-gray-300 mt-2">
              {showSignupForm ? 'Create your account' : 'Login or create your account'}
            </p>
          </div>

          {successMessage && (
            <div className="mb-6 bg-nixo-green/20 border border-nixo-green/30 p-4 rounded-lg">
              <div className="flex items-center">
                <Check className="h-5 w-5 text-nixo-green mr-2" />
                <p className="text-nixo-green">{successMessage}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="block text-lg text-gray-300">
                Email address
              </label>
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  value={email}
                  disabled={showSignupForm || showPasswordField}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setIsValid(true);
                    setErrorMessage('');
                  }}
                  className={`w-full bg-space-black/50 border ${
                    isValid ? 'border-nixo-green/30' : 'border-red-500'
                  } rounded-lg py-3 px-4 text-white appearance-none focus:outline-none focus:ring-2 focus:ring-nixo-green/50 pl-10 ${
                    showSignupForm || showPasswordField ? 'opacity-75' : ''
                  }`}
                  placeholder="Enter your email"
                />
                <Mail className="absolute left-3 top-3.5 h-5 w-5 text-nixo-green" />
              </div>
            </div>

            {showSignupForm && (
              <>
                <div className="space-y-2">
                  <label htmlFor="name" className="block text-lg text-gray-300">
                    Full Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-space-black/50 border border-nixo-green/30 rounded-lg py-3 px-4 text-white appearance-none focus:outline-none focus:ring-2 focus:ring-nixo-green/50 pl-10"
                      placeholder="Enter your full name"
                    />
                    <User className="absolute left-3 top-3.5 h-5 w-5 text-nixo-green" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="password" className="block text-lg text-gray-300">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-space-black/50 border border-nixo-green/30 rounded-lg py-3 px-4 text-white appearance-none focus:outline-none focus:ring-2 focus:ring-nixo-green/50 pl-10"
                      placeholder="Create a password"
                    />
                    <Lock className="absolute left-3 top-3.5 h-5 w-5 text-nixo-green" />
                  </div>
                </div>
              </>
            )}

            {/* Show password field for login */}
            {showPasswordField && !showSignupForm && (
              <div className="space-y-2">
                <label htmlFor="password" className="block text-lg text-gray-300">
                  Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-space-black/50 border border-nixo-green/30 rounded-lg py-3 px-4 text-white appearance-none focus:outline-none focus:ring-2 focus:ring-nixo-green/50 pl-10"
                    placeholder="Enter your password"
                  />
                  <Lock className="absolute left-3 top-3.5 h-5 w-5 text-nixo-green" />
                </div>
              </div>
            )}

            {!isValid && (
              <div className="flex items-center text-red-500 mt-1 text-sm">
                <AlertCircle className="h-4 w-4 mr-1" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
              {(showSignupForm || showPasswordField) && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 text-nixo-green border border-nixo-green/30 py-3 rounded-lg hover:bg-nixo-green/10 transition-colors"
                  disabled={isLoading}
                >
                  Back
                </button>
              )}
              
              <button
                type="submit"
                disabled={isLoading}
                className={`${showSignupForm || showPasswordField ? 'flex-1' : 'w-full'} glass-button py-3 flex items-center justify-center`}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-nixo-green" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  showSignupForm ? 'Create Account' : 
                  showPasswordField ? 'Log In' : 
                  'Continue with Email'
                )}
              </button>
            </div>
          </form>

          {errorMessage && !successMessage && (
            <div className="mt-4 text-red-500 text-sm flex items-center">
              <AlertCircle className="h-4 w-4 mr-1" />
              <span>{errorMessage}</span>
            </div>
          )}

          {!showSignupForm && !showPasswordField && (
            <>
              <div className="my-6 flex items-center">
                <div className="flex-grow h-px bg-gray-600"></div>
                <span className="px-4 text-gray-400">OR</span>
                <div className="flex-grow h-px bg-gray-600"></div>
              </div>

              <div className="space-y-4">
                <button 
                  className="w-full bg-white hover:bg-gray-100 text-space-black font-medium py-3 px-4 rounded-lg flex items-center justify-center transition-colors"
                  onClick={handleGoogleSignIn}
                  disabled={isLoading}
                >
                  <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  Continue with Google
                </button>
                
                <button 
                  className="w-full bg-black hover:bg-gray-900 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center transition-colors"
                  onClick={handleXSignIn}
                  disabled={isLoading}
                >
                  <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="white">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                  Continue with X
                </button>
              </div>
            </>
          )}

          <p className="text-center text-gray-400 mt-6">
            By continuing, you agree to our{' '}
            <a href="/terms" className="text-nixo-green hover:underline">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="/privacy" className="text-nixo-green hover:underline">
              Privacy Policy
            </a>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginSignupPage;