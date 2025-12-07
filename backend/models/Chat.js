import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema(
  {
    chatName: {
      type: String,
      trim: true,
    },
    isGroupChat: {
      type: Boolean,
      default: false,
    },
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    latestMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Message',
    },
    groupAdmin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    groupAvatar: {
      type: String,
      default: '',
    },
    // Track unread messages per user
    unreadCount: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        count: {
          type: Number,
          default: 0,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
chatSchema.index({ users: 1 });
chatSchema.index({ updatedAt: -1 });

const Chat = mongoose.model('Chat', chatSchema);

export default Chat;

