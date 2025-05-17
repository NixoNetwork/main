const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const axios = require('axios');
const crypto = require('crypto');
const querystring = require('querystring');

require('dotenv').config();

const serverless = require('serverless-http')
const app = express();
const PORT = process.env.PORT || 5000;
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Add this to store state parameters temporarily (in production, use Redis or another store)
const pendingTwitterStates = new Map();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection with caching
let mongoConnection = null;

const connectToDatabase = async () => {
  if (mongoConnection) {
    return mongoConnection;
  }
  
  const connection = await mongoose.connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    connectTimeoutMS: 10000,
    // For better connection performance in serverless environments
    maxPoolSize: 10,
    minPoolSize: 0
  });
  
  console.log('MongoDB Connected');
  mongoConnection = connection;
  return connection;
};

// User Schema
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String
  },
  password: {
    type: String
  },
  provider: {
    type: String,
    enum: ['email', 'google', 'twitter'],
    default: 'email'
  },
  providerUserId: String,
  addresses: [{
    type: {
      type: String,
      default: 'Home',
      enum: ['Home', 'Work', 'Other']
    },
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
    isDefault: {
      type: Boolean,
      default: false
    }
  }],
  walletAddress: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Update User schema to include points
userSchema.add({
  rewardPoints: {
    type: Number,
    default: 0
  }
});

// Create schema for reward logs
const rewardLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  points: {
    type: Number,
    required: true
  },
  activity: {
    type: String,
    required: true
  },
  metadata: {
    type: Object
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const RewardLog = mongoose.model('RewardLog', rewardLogSchema);

const User = mongoose.model('User', userSchema);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    uptime: process.uptime(),      // seconds your process has been up
    timestamp: Date.now()
  });
});


// Check if email exists
app.post('/auth/check-email', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    
    res.status(200).json({ 
      exists: !!user,
      success: true
    });
  } catch (error) {
    console.error('Check email error:', error);
    res.status(500).json({ message: 'Server error', success: false });
  }
});

// Login with email and password
app.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find the user
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(400).json({ 
        message: 'User not found',
        success: false
      });
    }
    
    // Check if user has a password (email provider)
    if (user.provider !== 'email' || !user.password) {
      return res.status(400).json({ 
        message: `Please log in with ${user.provider}`,
        success: false
      });
    }
    
    // Verify password - trim the password to handle any accidental whitespace
    const isMatch = await bcrypt.compare(password.trim(), user.password);
    
    if (!isMatch) {
      console.log('Password comparison failed'); // Add logging
      return res.status(400).json({ 
        message: 'Invalid credentials',
        success: false
      });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user._id,
        name: user.name,
        email: user.email 
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.status(200).json({
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name
      },
      success: true
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error', success: false });
  }
});

// Register new user
app.post('/auth/register', async (req, res) => {
  try {
    const { email, name, password } = req.body;
    
    // Check if user already exists
    let user = await User.findOne({ email });
    
    if (user) {
      return res.status(400).json({ 
        message: 'User already exists',
        success: false
      });
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Create new user
    user = new User({
      email,
      name,
      password: hashedPassword,
      provider: 'email'
    });
    
    await user.save();
    
    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user._id,
        name: user.name,
        email: user.email 
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.status(201).json({
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name
      },
      success: true
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error', success: false });
  }
});

// Google Auth
app.post('/auth/google', async (req, res) => {
  try {
    const { token } = req.body;
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID
    });
    
    const { email, name, sub } = ticket.getPayload();
    
    // Find or create user
    let user = await User.findOne({ email });
    if (!user) {
      // Create new user from Google data
      user = new User({
        email,
        name, // Save the name from Google profile
        provider: 'google',
        providerUserId: sub
      });
      await user.save();
    } else if (user.provider !== 'google') {
      // Update the user to add Google as a login method
      user.provider = 'google';
      user.providerUserId = sub;
      await user.save();
    }
    
    // Generate JWT token
    const authToken = jwt.sign(
      { 
        userId: user._id,
        name: user.name,
        email: user.email 
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.status(200).json({ 
      token: authToken, 
      user: {
        id: user._id,
        email: user.email,
        name: user.name
      },
      success: true 
    });
  } catch (error) {
    console.error('Google auth error:', error);
    res.status(500).json({ message: 'Server error', success: false });
  }
});

// Twitter/X Auth
app.post('/auth/twitter', async (req, res) => {
  try {
    const { token } = req.body;
    
    // In a real implementation, you would validate the token with Twitter's API
    // and extract user information from the response
    
    // This is just a placeholder - implement proper Twitter OAuth in production
    const { email, name, id } = { 
      email: 'user@example.com', // This would come from Twitter's response
      name: 'Twitter User',      // This would come from Twitter's response
      id: '12345'                // This would be the Twitter user ID
    };
    
    // Find or create user
    let user = await User.findOne({ email });
    if (!user) {
      user = new User({
        email,
        name,  // Save the name from Twitter profile
        provider: 'twitter',
        providerUserId: id
      });
      await user.save();
    } else if (user.provider !== 'twitter') {
      // Update the user to add Twitter as a login method
      user.provider = 'twitter';
      user.providerUserId = id;
      await user.save();
    }
    
    // Generate JWT token
    const authToken = jwt.sign(
      { 
        userId: user._id,
        name: user.name,
        email: user.email 
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.status(200).json({ 
      token: authToken, 
      user: {
        id: user._id,
        email: user.email,
        name: user.name
      },
      success: true 
    });
  } catch (error) {
    console.error('Twitter auth error:', error);
    res.status(500).json({ message: 'Server error', success: false });
  }
});

// Twitter OAuth 2.0 initialization endpoint
app.post('/auth/twitter/init', async (req, res) => {
  try {
    // Generate random state parameter to prevent CSRF attacks
    const state = crypto.randomBytes(16).toString('hex');
    const codeVerifier = crypto.randomBytes(32).toString('hex');
    
    // Store state and code verifier (in production use Redis or another store)
    pendingTwitterStates.set(state, {
      codeVerifier,
      createdAt: Date.now()
    });
    
    // Generate code challenge (S256 method)
    const codeChallenge = crypto
      .createHash('sha256')
      .update(codeVerifier)
      .digest('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
    
    // Build authorization URL
    const authUrl = 'https://twitter.com/i/oauth2/authorize?' + 
      querystring.stringify({
        response_type: 'code',
        client_id: process.env.TWITTER_CLIENT_ID,
        redirect_uri: process.env.TWITTER_REDIRECT_URI || `${process.env.FRONTEND_URL}/auth/twitter/callback`,
        scope: 'tweet.read users.read offline.access',
        state: state,
        code_challenge: codeChallenge,
        code_challenge_method: 'S256'
      });
    
    res.status(200).json({
      authUrl,
      state,
      success: true
    });
  } catch (error) {
    console.error('Twitter auth init error:', error);
    res.status(500).json({ message: 'Failed to initialize Twitter authentication', success: false });
  }
});

// Twitter OAuth 2.0 callback endpoint
app.post('/auth/twitter/callback', async (req, res) => {
  try {
    const { code, state } = req.body;
    
    // Verify state parameter to prevent CSRF attacks
    if (!pendingTwitterStates.has(state)) {
      return res.status(400).json({ message: 'Invalid or expired state parameter', success: false });
    }
    
    const stateData = pendingTwitterStates.get(state);
    pendingTwitterStates.delete(state); // Clean up
    
    // Check if state hasn't expired (30 minutes)
    if (Date.now() - stateData.createdAt > 30 * 60 * 1000) {
      return res.status(400).json({ message: 'State parameter expired', success: false });
    }
    
    // Exchange code for token
    const tokenResponse = await axios.post(
      'https://api.twitter.com/2/oauth2/token',
      querystring.stringify({
        code,
        grant_type: 'authorization_code',
        client_id: process.env.TWITTER_CLIENT_ID,
        redirect_uri: process.env.TWITTER_REDIRECT_URI || `${process.env.FRONTEND_URL}/auth/twitter/callback`,
        code_verifier: stateData.codeVerifier
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Basic ' + Buffer.from(
            `${process.env.TWITTER_CLIENT_ID}:${process.env.TWITTER_CLIENT_SECRET}`
          ).toString('base64')
        }
      }
    );
    
    const { access_token } = tokenResponse.data;
    
    // Get user info
    const userResponse = await axios.get('https://api.twitter.com/2/users/me', {
      headers: {
        'Authorization': `Bearer ${access_token}`
      },
      params: {
        'user.fields': 'name,username'
      }
    });
    
    const twitterUserId = userResponse.data.data.id;
    const twitterUsername = userResponse.data.data.username;
    const twitterName = userResponse.data.data.name;
    
    // In Twitter OAuth 2.0, email is not automatically provided, so we use the username
    // For a production app, you might want to use the username@twitter.com format or
    // implement an additional step to collect the user's email
    const email = `${twitterUsername}@twitter.com`;
    
    // Find or create user
    let user = await User.findOne({ 
      $or: [
        { email },
        { providerUserId: twitterUserId, provider: 'twitter' }
      ]
    });
    
    if (!user) {
      // Create new user
      user = new User({
        email,
        name: twitterName,
        provider: 'twitter',
        providerUserId: twitterUserId
      });
      await user.save();
    } else if (user.provider !== 'twitter') {
      // Update existing user to link Twitter account
      user.provider = 'twitter';
      user.providerUserId = twitterUserId;
      if (!user.name) {
        user.name = twitterName;
      }
      await user.save();
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user._id,
        name: user.name,
        email: user.email 
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      },
      success: true
    });
  } catch (error) {
    console.error('Twitter auth callback error:', error);
    res.status(500).json({ 
      message: 'Failed to complete Twitter authentication',
      error: error.message,
      success: false 
    });
  }
});

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'No token provided', success: false });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token', success: false });
  }
};

// Get user profile
app.get('/users/profile', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found', success: false });
    }
    
    res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        addresses: user.addresses || [],
        walletAddress: user.walletAddress,
        provider: user.provider
      },
      success: true
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Server error', success: false });
  }
});

// Update user profile
app.put('/users/profile', verifyToken, async (req, res) => {
  try {
    const { name, email } = req.body;
    console.log('Updating user profile:', req.body);
    // Check if email is already taken by another user
    if (email) {
      const existingUser = await User.findOne({ email, _id: { $ne: req.user.userId } });
      if (existingUser) {
        return res.status(400).json({ message: 'Email is already in use', success: false });
      }
    }
    
    // Only update the fields that are provided
    const updateFields = {};
    if (name) updateFields.name = name;
    if (email) updateFields.email = email;
    
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { $set: updateFields },
      { new: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found', success: false });
    }
    
    // Generate a new token with updated user info
    const token = jwt.sign(
      { userId: user._id, name: user.name, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        addresses: user.addresses || [],
        walletAddress: user.walletAddress,
        provider: user.provider
      },
      success: true
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ message: 'Server error', success: false });
  }
});

// Add new address
app.post('/users/addresses', verifyToken, async (req, res) => {
  try {
    const { type, street, city, state, zipCode, country, isDefault } = req.body;
    
    // Validate required fields
    if (!street || !city || !state || !zipCode || !country) {
      return res.status(400).json({ message: 'All address fields are required', success: false });
    }
    
    const user = await User.findById(req.user.userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found', success: false });
    }
    
    // If this is the first address or isDefault is true, unmark any existing default addresses
    if (isDefault || user.addresses.length === 0) {
      user.addresses.forEach(address => {
        address.isDefault = false;
      });
    }
    
    // Add the new address
    user.addresses.push({
      type: type || 'Home',
      street,
      city,
      state,
      zipCode,
      country,
      isDefault: isDefault || user.addresses.length === 0 // First address is default
    });
    
    await user.save();
    
    res.status(201).json({
      addresses: user.addresses,
      success: true
    });
  } catch (error) {
    console.error('Error adding address:', error);
    res.status(500).json({ message: 'Server error', success: false });
  }
});

// Update address
app.put('/users/addresses/:addressId', verifyToken, async (req, res) => {
  try {
    const { addressId } = req.params;
    const { type, street, city, state, zipCode, country, isDefault } = req.body;
    
    const user = await User.findById(req.user.userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found', success: false });
    }
    
    // Find the address to update
    const addressIndex = user.addresses.findIndex(addr => addr._id.toString() === addressId);
    
    if (addressIndex === -1) {
      return res.status(404).json({ message: 'Address not found', success: false });
    }
    
    // If setting this address as default, unmark any existing default addresses
    if (isDefault) {
      user.addresses.forEach(address => {
        address.isDefault = false;
      });
    }
    
    // Update the address fields
    if (type) user.addresses[addressIndex].type = type;
    if (street) user.addresses[addressIndex].street = street;
    if (city) user.addresses[addressIndex].city = city;
    if (state) user.addresses[addressIndex].state = state;
    if (zipCode) user.addresses[addressIndex].zipCode = zipCode;
    if (country) user.addresses[addressIndex].country = country;
    user.addresses[addressIndex].isDefault = !!isDefault;
    
    await user.save();
    
    res.status(200).json({
      addresses: user.addresses,
      success: true
    });
  } catch (error) {
    console.error('Error updating address:', error);
    res.status(500).json({ message: 'Server error', success: false });
  }
});

// Delete address
app.delete('/users/addresses/:addressId', verifyToken, async (req, res) => {
  try {
    const { addressId } = req.params;
    
    const user = await User.findById(req.user.userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found', success: false });
    }
    
    // Find the address to delete
    const addressIndex = user.addresses.findIndex(addr => addr._id.toString() === addressId);
    
    if (addressIndex === -1) {
      return res.status(404).json({ message: 'Address not found', success: false });
    }
    
    // Check if it's the default address
    const isDefault = user.addresses[addressIndex].isDefault;
    
    // Remove the address
    user.addresses.splice(addressIndex, 1);
    
    // If it was the default address and there are other addresses, make the first one default
    if (isDefault && user.addresses.length > 0) {
      user.addresses[0].isDefault = true;
    }
    
    await user.save();
    
    res.status(200).json({
      addresses: user.addresses,
      success: true
    });
  } catch (error) {
    console.error('Error deleting address:', error);
    res.status(500).json({ message: 'Server error', success: false });
  }
});

// Update wallet address
app.put('/users/wallet', verifyToken, async (req, res) => {
  try {
    const { walletAddress } = req.body;
    
    if (!walletAddress) {
      return res.status(400).json({ message: 'Wallet address is required', success: false });
    }
    
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { $set: { walletAddress } },
      { new: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found', success: false });
    }
    
    res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        walletAddress: user.walletAddress,
        addresses: user.addresses || [],
        provider: user.provider
      },
      success: true
    });
  } catch (error) {
    console.error('Error updating wallet address:', error);
    res.status(500).json({ message: 'Server error', success: false });
  }
});

// Get user's current reward points
app.get('/users/rewards', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found', success: false });
    }
    
    res.status(200).json({
      rewardPoints: user.rewardPoints || 0,
      success: true
    });
  } catch (error) {
    console.error('Error fetching user rewards:', error);
    res.status(500).json({ message: 'Server error', success: false });
  }
});

// Add reward points and log the activity
app.post('/users/rewards', verifyToken, async (req, res) => {
  try {
    const { points, activity, metadata } = req.body;
    
    if (!points || !activity) {
      return res.status(400).json({ message: 'Points and activity are required', success: false });
    }
    
    // Update user points
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { $inc: { rewardPoints: points } },
      { new: true }
    );
    
    if (!user) {
      return res.status(404).json({ message: 'User not found', success: false });
    }
    
    // Create reward log
    const rewardLog = new RewardLog({
      userId: user._id,
      points,
      activity,
      metadata
    });
    
    await rewardLog.save();
    
    res.status(200).json({
      rewardPoints: user.rewardPoints,
      success: true
    });
  } catch (error) {
    console.error('Error adding reward points:', error);
    res.status(500).json({ message: 'Server error', success: false });
  }
});

app.listen(PORT, async () => {
  try {
    await connectToDatabase();
    console.log(`Server running on port ${PORT}`);
  } catch (error) {
    console.error('Failed to connect to database:', error);
    process.exit(1);
  }
});

module.exports = serverless(app)