import User from '../models/User.js';
import { generateToken, generateRefreshToken } from '../middleware/auth.js';
import jwt from 'jsonwebtoken';
import cloudinary from '../config/cloudinary.js';

/**
 * @desc    Register a new user
 * @route   POST /api/auth/signup
 * @access  Public
 */
export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide all fields' });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        bio: user.bio,
        token: generateToken(user._id),
        refreshToken: generateRefreshToken(user._id),
      });
    }
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Server error during signup' });
  }
};

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide all fields' });
    }

    // Find user and include password for verification
    const user = await User.findOne({ email }).select('+password');

    if (user && (await user.matchPassword(password))) {
      // Update user status to online
      user.status = 'online';
      await user.save();

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        bio: user.bio,
        status: user.status,
        token: generateToken(user._id),
        refreshToken: generateRefreshToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

/**
 * @desc    Refresh access token
 * @route   POST /api/auth/refresh
 * @access  Public
 */
export const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({ message: 'Refresh token required' });
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    // Generate new access token
    const newToken = generateToken(decoded.id);

    res.json({
      token: newToken,
    });
  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(401).json({ message: 'Invalid refresh token' });
  }
};

/**
 * @desc    Logout user
 * @route   POST /api/auth/logout
 * @access  Private
 */
export const logout = async (req, res) => {
  try {
    // Update user status to offline
    const user = await User.findById(req.user._id);
    if (user) {
      user.status = 'offline';
      user.lastSeen = Date.now();
      await user.save();
    }

    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ message: 'Server error during logout' });
  }
};

/**
 * @desc    Get current user profile
 * @route   GET /api/auth/me
 * @access  Private
 */
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json(user);
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @desc    Update user profile
 * @route   PUT /api/auth/profile
 * @access  Private
 */
export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    let uploadedAvatarUrl = null;

    if (req.file) {
      // Check if Cloudinary is configured
      if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
        return res.status(500).json({ 
          message: 'Image upload is not configured. Please contact support.' 
        });
      }

      try {
        uploadedAvatarUrl = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              folder: 'chat-app/avatars',
              resource_type: 'image',
              transformation: [
                { width: 512, height: 512, crop: 'fill', gravity: 'face' },
              ],
            },
            (error, result) => {
              if (error) {
                reject(error);
              } else {
                resolve(result.secure_url);
              }
            }
          );

          uploadStream.end(req.file.buffer);
        });
      } catch (uploadError) {
        console.error('Cloudinary upload error:', uploadError);
        return res.status(500).json({ 
          message: 'Failed to upload image. Please try again or use a smaller image.' 
        });
      }
    }

    user.name = req.body.name || user.name;
    user.bio = req.body.bio || user.bio;

    if (uploadedAvatarUrl) {
      user.avatar = uploadedAvatarUrl;
    } else if (req.body.avatar) {
      user.avatar = req.body.avatar;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      avatar: updatedUser.avatar,
      bio: updatedUser.bio,
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error updating profile' });
  }
};

