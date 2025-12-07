import Message from '../models/Message.js';
import Chat from '../models/Chat.js';
import User from '../models/User.js';
import cloudinary from '../config/cloudinary.js';

/**
 * @desc    Send a message
 * @route   POST /api/messages
 * @access  Private
 */
export const sendMessage = async (req, res) => {
  try {
    const { content, chatId, imageUrl } = req.body;

    if (!chatId) {
      return res.status(400).json({ message: 'Chat ID is required' });
    }

    if (!content && !imageUrl) {
      return res
        .status(400)
        .json({ message: 'Message content or image is required' });
    }

    const newMessage = {
      sender: req.user._id,
      content: content || '',
      chat: chatId,
      imageUrl: imageUrl || '',
      messageType: imageUrl ? 'image' : 'text',
    };

    let message = await Message.create(newMessage);

    // Populate sender and chat
    message = await message.populate('sender', 'name avatar');
    message = await message.populate('chat');
    message = await User.populate(message, {
      path: 'chat.users',
      select: 'name avatar email',
    });

    // Update chat's latest message
    await Chat.findByIdAndUpdate(chatId, { latestMessage: message._id });

    res.status(201).json(message);
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @desc    Get all messages for a chat
 * @route   GET /api/messages/:chatId
 * @access  Private
 */
export const getMessages = async (req, res) => {
  try {
    const { chatId } = req.params;

    const messages = await Message.find({ chat: chatId })
      .populate('sender', 'name avatar email')
      .populate('chat')
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @desc    Mark messages as seen
 * @route   PUT /api/messages/seen
 * @access  Private
 */
export const markAsSeen = async (req, res) => {
  try {
    const { messageIds } = req.body;

    if (!messageIds || messageIds.length === 0) {
      return res.status(400).json({ message: 'Message IDs are required' });
    }

    // Update all messages to add current user to seenBy
    await Message.updateMany(
      {
        _id: { $in: messageIds },
        'seenBy.user': { $ne: req.user._id },
      },
      {
        $push: {
          seenBy: {
            user: req.user._id,
            seenAt: Date.now(),
          },
        },
      }
    );

    res.json({ message: 'Messages marked as seen' });
  } catch (error) {
    console.error('Mark as seen error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @desc    Search messages in a chat
 * @route   GET /api/messages/search/:chatId?query=searchTerm
 * @access  Private
 */
export const searchMessages = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ message: 'Search query required' });
    }

    const messages = await Message.find({
      chat: chatId,
      content: { $regex: query, $options: 'i' },
    })
      .populate('sender', 'name avatar')
      .sort({ createdAt: -1 })
      .limit(50);

    res.json(messages);
  } catch (error) {
    console.error('Search messages error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @desc    Upload image to Cloudinary
 * @route   POST /api/messages/upload
 * @access  Private
 */
export const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image provided' });
    }

    // Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'chat-app',
          resource_type: 'auto',
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      uploadStream.end(req.file.buffer);
    });

    res.json({
      imageUrl: result.secure_url,
      publicId: result.public_id,
    });
  } catch (error) {
    console.error('Upload image error:', error);
    res.status(500).json({ message: 'Server error during upload' });
  }
};

