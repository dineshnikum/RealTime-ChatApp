import Chat from '../models/Chat.js';
import User from '../models/User.js';
import Message from '../models/Message.js';

/**
 * @desc    Access or create a one-to-one chat
 * @route   POST /api/chats
 * @access  Private
 */
export const accessChat = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    // Check if chat already exists between these two users
    let chat = await Chat.find({
      isGroupChat: false,
      $and: [
        { users: { $elemMatch: { $eq: req.user._id } } },
        { users: { $elemMatch: { $eq: userId } } },
      ],
    })
      .populate('users', '-password')
      .populate('latestMessage');

    // Populate sender of latest message
    if (chat.length > 0) {
      chat = await User.populate(chat, {
        path: 'latestMessage.sender',
        select: 'name avatar email',
      });

      return res.json(chat[0]);
    }

    // Create new chat if doesn't exist
    const chatData = {
      chatName: 'sender',
      isGroupChat: false,
      users: [req.user._id, userId],
    };

    const createdChat = await Chat.create(chatData);
    const fullChat = await Chat.findById(createdChat._id).populate(
      'users',
      '-password'
    );

    res.status(201).json(fullChat);
  } catch (error) {
    console.error('Access chat error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @desc    Get all chats for logged in user
 * @route   GET /api/chats
 * @access  Private
 */
export const fetchChats = async (req, res) => {
  try {
    const chats = await Chat.find({
      users: { $elemMatch: { $eq: req.user._id } },
    })
      .populate('users', '-password')
      .populate('groupAdmin', '-password')
      .populate('latestMessage')
      .sort({ updatedAt: -1 });

    // Populate sender of latest message
    const results = await User.populate(chats, {
      path: 'latestMessage.sender',
      select: 'name avatar email',
    });

    res.json(results);
  } catch (error) {
    console.error('Fetch chats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @desc    Create a group chat
 * @route   POST /api/chats/group
 * @access  Private
 */
export const createGroupChat = async (req, res) => {
  try {
    const { users, name } = req.body;

    if (!users || !name) {
      return res.status(400).json({ message: 'Please provide all fields' });
    }

    // Parse users if it's a string
    const parsedUsers = typeof users === 'string' ? JSON.parse(users) : users;

    if (parsedUsers.length < 2) {
      return res
        .status(400)
        .json({ message: 'Group chat requires at least 2 users' });
    }

    // Add current user to the group
    parsedUsers.push(req.user._id);

    const groupChat = await Chat.create({
      chatName: name,
      users: parsedUsers,
      isGroupChat: true,
      groupAdmin: req.user._id,
    });

    const fullGroupChat = await Chat.findById(groupChat._id)
      .populate('users', '-password')
      .populate('groupAdmin', '-password');

    res.status(201).json(fullGroupChat);
  } catch (error) {
    console.error('Create group chat error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @desc    Rename a group chat
 * @route   PUT /api/chats/group/rename
 * @access  Private
 */
export const renameGroup = async (req, res) => {
  try {
    const { chatId, chatName } = req.body;

    if (!chatId || !chatName) {
      return res.status(400).json({ message: 'Please provide all fields' });
    }

    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      { chatName },
      { new: true }
    )
      .populate('users', '-password')
      .populate('groupAdmin', '-password');

    if (!updatedChat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    res.json(updatedChat);
  } catch (error) {
    console.error('Rename group error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @desc    Add user to group chat
 * @route   PUT /api/chats/group/add
 * @access  Private
 */
export const addToGroup = async (req, res) => {
  try {
    const { chatId, userId } = req.body;

    if (!chatId || !userId) {
      return res.status(400).json({ message: 'Please provide all fields' });
    }

    const chat = await Chat.findByIdAndUpdate(
      chatId,
      { $push: { users: userId } },
      { new: true }
    )
      .populate('users', '-password')
      .populate('groupAdmin', '-password');

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    res.json(chat);
  } catch (error) {
    console.error('Add to group error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @desc    Remove user from group chat
 * @route   PUT /api/chats/group/remove
 * @access  Private
 */
export const removeFromGroup = async (req, res) => {
  try {
    const { chatId, userId } = req.body;

    if (!chatId || !userId) {
      return res.status(400).json({ message: 'Please provide all fields' });
    }

    const chat = await Chat.findByIdAndUpdate(
      chatId,
      { $pull: { users: userId } },
      { new: true }
    )
      .populate('users', '-password')
      .populate('groupAdmin', '-password');

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    res.json(chat);
  } catch (error) {
    console.error('Remove from group error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

