import axios from 'axios';
import Cookies from 'js-cookie'; // Add this import

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const emailAuth = async (email: string) => {
  try {
    const response = await fetch(`${API_URL}/auth/email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });
    return await response.json();
  } catch (error) {
    console.error('Email auth error:', error);
    throw error;
  }
};

export const checkEmailExists = async (email: string) => {
  try {
    const response = await fetch(`${API_URL}/auth/check-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });
    return await response.json();
  } catch (error) {
    console.error('Check email error:', error);
    throw error;
  }
};

export const loginUser = async (email: string, password: string) => {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    return await response.json();
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const registerUser = async (email: string, name: string, password: string) => {
  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, name, password }),
    });
    return await response.json();
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

export const googleAuth = async (token: string) => {
  try {
    const response = await fetch(`${API_URL}/auth/google`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    });
    return await response.json();
  } catch (error) {
    console.error('Google auth error:', error);
    throw error;
  }
};

export const xAuth = async (token: string) => {
  try {
    const response = await fetch(`${API_URL}/auth/twitter`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    });
    return await response.json();
  } catch (error) {
    console.error('X auth error:', error);
    throw error;
  }
};

export const initTwitterAuth = async () => {
  try {
    const response = await fetch(`${API_URL}/auth/twitter/init`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Twitter auth init error:', error);
    return { success: false, message: 'Failed to initialize Twitter authentication' };
  }
};

export const completeTwitterAuth = async (code: string, state: string) => {
  try {
    const response = await fetch(`${API_URL}/auth/twitter/callback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code, state }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Twitter auth callback error:', error);
    return { success: false, message: 'Failed to complete Twitter authentication' };
  }
};

// User Profile Functions
export const fetchUserProfile = async (token: string) => {
  try {
    const response = await axios.get(`${API_URL}/users/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

export const updateUserProfile = async (data: { name?: string; email?: string }, token: string) => {
  try {
    const response = await axios.put(
      `${API_URL}/users/profile`, 
      data,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    console.error('Update profile error:', error);
    throw error;
  }
};

// Address Functions
export const addUserAddress = async (addressData: any, token: string) => {
  try {
    const response = await axios.post(
      `${API_URL}/users/addresses`,
      addressData,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    console.error('Add address error:', error);
    throw error;
  }
};

// Wallet Function
export const updateUserWallet = async (walletAddress: string, token: string) => {
  try {
    const response = await axios.put(
      `${API_URL}/users/wallet`,
      { walletAddress },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    console.error('Update wallet error:', error);
    throw error;
  }
};

// Reward Points Functions
export const getRewardPoints = async () => {
  try {
    const token = Cookies.get('authToken'); // Changed from localStorage
    
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    const response = await fetch(`${API_URL}/users/rewards`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch reward points');
    }
    
    return data;
  } catch (error) {
    console.error('Get rewards error:', error);
    throw error;
  }
};

export const addRewardPoints = async (points: number, activity: string, metadata?: any) => {
  try {
    const token = Cookies.get('authToken'); // Changed from localStorage
    
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    const response = await fetch(`${API_URL}/users/rewards`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        points,
        activity,
        metadata
      })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to add reward points');
    }
    
    return data;
  } catch (error) {
    console.error('Add rewards error:', error);
    throw error;
  }
};