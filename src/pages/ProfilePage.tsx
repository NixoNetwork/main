import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Settings, User as UserIcon, Mail, Home, Plus, X } from 'lucide-react';
import { fetchUserProfile, updateUserProfile, addUserAddress } from '../utils/api';

const ProfilePage: React.FC = () => {
  const { user, setUser, token } = useAuth();
  
  // Personal information states
  const [editingPersonalInfo, setEditingPersonalInfo] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [personalInfoUpdating, setPersonalInfoUpdating] = useState(false);
  const [personalInfoError, setPersonalInfoError] = useState('');
  
  // Address form states
  const [addingAddress, setAddingAddress] = useState(false);
  const [addressType, setAddressType] = useState('Home');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [country, setCountry] = useState('');
  const [isDefault, setIsDefault] = useState(false);
  const [addressSubmitting, setAddressSubmitting] = useState(false);
  const [addressError, setAddressError] = useState('');
  
  // User addresses
  const [addresses, setAddresses] = useState<any[]>([]);
  
  // Load user profile data including addresses
  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        if (!token) return;
        
        const data = await fetchUserProfile(token);
        if (data.success) {
          setAddresses(data.user.addresses || []);
        }
      } catch (error) {
        console.error('Error loading user profile:', error);
      }
    };
    
    loadUserProfile();
  }, [token]);
  
  // Handle personal information update
  const handlePersonalInfoUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setPersonalInfoUpdating(true);
    setPersonalInfoError('');
    
    try {
      if (!token) throw new Error('No authentication token');
      
      const data = await updateUserProfile({ name, email }, token);
      
      if (data.success) {
        // Update user in context
        setUser(data.user);
        setEditingPersonalInfo(false);
      }
    } catch (error: any) {
      setPersonalInfoError(
        error.response?.data?.message || 'Failed to update profile'
      );
    } finally {
      setPersonalInfoUpdating(false);
    }
  };
  
  // Handle address submission
  const handleAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddressSubmitting(true);
    setAddressError('');
    
    try {
      if (!token) throw new Error('No authentication token');
      
      const addressData = { 
        type: addressType, 
        street, 
        city, 
        state, 
        zipCode, 
        country, 
        isDefault 
      };
      
      const data = await addUserAddress(addressData, token);
      
      if (data.success) {
        setAddresses(data.addresses);
        // Reset form
        setAddingAddress(false);
        setAddressType('Home');
        setStreet('');
        setCity('');
        setState('');
        setZipCode('');
        setCountry('');
        setIsDefault(false);
      }
    } catch (error: any) {
      setAddressError(
        error.response?.data?.message || 'Failed to add address'
      );
    } finally {
      setAddressSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="space-y-8"
      >
        <div className="text-center">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="text-3xl md:text-4xl font-display text-white"
          >
            My <span className="text-nixo-green glow-text">Profile</span>
          </motion.h1>
          <p className="text-gray-300 mt-2">Manage your account information</p>
        </div>
        
        <div className="glass-panel p-8 backdrop-blur-lg bg-space-black/40">
          <div className="flex items-center space-x-4 mb-8 pb-6 border-b border-nixo-green/20">
            <div className="w-16 h-16 bg-nixo-green/20 rounded-full flex items-center justify-center border border-nixo-green/30">
              <UserIcon className="h-8 w-8 text-nixo-green" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">{user?.name}</h2>
              <p className="text-gray-400">{user?.email}</p>
            </div>
          </div>
          
          <div className="space-y-8">
            {/* Personal Information Section */}
            <div className="bg-space-black/30 p-5 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <UserIcon className="h-5 w-5 text-nixo-green" />
                  <h3 className="text-lg font-medium text-white">Personal Information</h3>
                </div>
                {!editingPersonalInfo ? (
                  <button 
                    onClick={() => setEditingPersonalInfo(true)} 
                    className="text-nixo-green text-sm hover:text-nixo-green/80"
                  >
                    Edit
                  </button>
                ) : (
                  <button 
                    onClick={() => setEditingPersonalInfo(false)} 
                    className="text-red-500 text-sm hover:text-red-400 flex items-center"
                  >
                    <X className="h-4 w-4 mr-1" /> Cancel
                  </button>
                )}
              </div>
              
              {editingPersonalInfo ? (
                <form onSubmit={handlePersonalInfoUpdate} className="mt-4 space-y-4">
                  <div>
                    <label className="block text-gray-400 text-sm mb-1">Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-space-black/60 border border-nixo-green/30 rounded p-2 text-white"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-400 text-sm mb-1">Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-space-black/60 border border-nixo-green/30 rounded p-2 text-white"
                      required
                    />
                  </div>
                  
                  {personalInfoError && (
                    <p className="text-red-500 text-sm">{personalInfoError}</p>
                  )}
                  
                  <button
                    type="submit"
                    disabled={personalInfoUpdating}
                    className="bg-nixo-green/80 hover:bg-nixo-green text-white px-4 py-2 rounded transition-colors disabled:opacity-50"
                  >
                    {personalInfoUpdating ? 'Updating...' : 'Save Changes'}
                  </button>
                </form>
              ) : (
                <div className="text-gray-300 space-y-2">
                  <p><span className="text-gray-400">Name:</span> {user?.name}</p>
                  <p><span className="text-gray-400">Email:</span> {user?.email}</p>
                </div>
              )}
            </div>
            
            {/* Addresses Section */}
            <div className="bg-space-black/30 p-5 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <Home className="h-5 w-5 text-nixo-green" />
                  <h3 className="text-lg font-medium text-white">Addresses</h3>
                </div>
                {!addingAddress ? (
                  <button 
                    onClick={() => setAddingAddress(true)} 
                    className="text-nixo-green text-sm hover:text-nixo-green/80 flex items-center"
                  >
                    <Plus className="h-4 w-4 mr-1" /> Add Address
                  </button>
                ) : (
                  <button 
                    onClick={() => setAddingAddress(false)} 
                    className="text-red-500 text-sm hover:text-red-400 flex items-center"
                  >
                    <X className="h-4 w-4 mr-1" /> Cancel
                  </button>
                )}
              </div>
              
              {addingAddress ? (
                <form onSubmit={handleAddressSubmit} className="mt-4 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-400 text-sm mb-1">Address Type</label>
                      <select
                        value={addressType}
                        onChange={(e) => setAddressType(e.target.value)}
                        className="w-full bg-space-black/60 border border-nixo-green/30 rounded p-2 text-white"
                      >
                        <option value="Home">Home</option>
                        <option value="Work">Work</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-gray-400 text-sm mb-1">Street</label>
                      <input
                        type="text"
                        value={street}
                        onChange={(e) => setStreet(e.target.value)}
                        className="w-full bg-space-black/60 border border-nixo-green/30 rounded p-2 text-white"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-gray-400 text-sm mb-1">City</label>
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full bg-space-black/60 border border-nixo-green/30 rounded p-2 text-white"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-gray-400 text-sm mb-1">State/Province</label>
                      <input
                        type="text"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        className="w-full bg-space-black/60 border border-nixo-green/30 rounded p-2 text-white"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-gray-400 text-sm mb-1">ZIP/Postal Code</label>
                      <input
                        type="text"
                        value={zipCode}
                        onChange={(e) => setZipCode(e.target.value)}
                        className="w-full bg-space-black/60 border border-nixo-green/30 rounded p-2 text-white"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-gray-400 text-sm mb-1">Country</label>
                      <input
                        type="text"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        className="w-full bg-space-black/60 border border-nixo-green/30 rounded p-2 text-white"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isDefault"
                      checked={isDefault}
                      onChange={(e) => setIsDefault(e.target.checked)}
                      className="mr-2 accent-nixo-green"
                    />
                    <label htmlFor="isDefault" className="text-gray-300 text-sm">Set as default address</label>
                  </div>
                  
                  {addressError && (
                    <p className="text-red-500 text-sm">{addressError}</p>
                  )}
                  
                  <button
                    type="submit"
                    disabled={addressSubmitting}
                    className="bg-nixo-green/80 hover:bg-nixo-green text-white px-4 py-2 rounded transition-colors disabled:opacity-50"
                  >
                    {addressSubmitting ? 'Adding...' : 'Add Address'}
                  </button>
                </form>
              ) : (
                <div className="space-y-4">
                  {addresses.length > 0 ? (
                    addresses.map((address, index) => (
                      <div key={index} className="bg-space-black/40 p-3 rounded border border-nixo-green/20">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-nixo-green font-medium">{address.type}</span>
                          {address.isDefault && (
                            <span className="text-xs bg-nixo-green/20 text-nixo-green px-2 py-0.5 rounded">Default</span>
                          )}
                        </div>
                        <p className="text-gray-300 text-sm">
                          {address.street}, {address.city}, {address.state} {address.zipCode}, {address.country}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-400 italic">No addresses added yet.</p>
                  )}
                </div>
              )}
            </div>

          </div>
          
          <div className="mt-8 pt-6 border-t border-nixo-green/20">
            <p className="text-gray-400 text-sm">
              Account created: {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ProfilePage;