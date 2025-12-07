import User from '../models/User.js';

/**
 * @desc    Search users by name or email
 * @route   GET /api/users/search?query=searchTerm
 * @access  Private
 */
export const searchUsers = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ message: 'Search query required' });
    }

    // Search users by name or email (exclude current user)
    const users = await User.find({
      _id: { $ne: req.user._id },
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } },
      ],
    }).select('-password');

    res.json(users);
  } catch (error) {
    console.error('Search users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @desc    Get all users except current user
 * @route   GET /api/users
 * @access  Private
 */
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.user._id } }).select(
      '-password'
    );
    res.json(users);
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @desc    Get user by ID
 * @route   GET /api/users/:id
 * @access  Private
 */
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Get user by ID error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @desc    Update user status
 * @route   PUT /api/users/status
 * @access  Private
 */
export const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!['online', 'offline', 'away'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const user = await User.findById(req.user._id);

    if (user) {
      user.status = status;
      if (status === 'offline') {
        user.lastSeen = Date.now();
      }
      await user.save();

      res.json({ status: user.status, lastSeen: user.lastSeen });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

