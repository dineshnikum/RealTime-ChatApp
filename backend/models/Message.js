import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    content: {
      type: String,
      trim: true,
    },
    chat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Chat',
      required: true,
    },
    imageUrl: {
      type: String,
      default: '',
    },
    // Track who has seen this message
    seenBy: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        seenAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    // Message type: text, image, file, system
    messageType: {
      type: String,
      enum: ['text', 'image', 'system'],
      default: 'text',
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
messageSchema.index({ chat: 1, createdAt: -1 });
messageSchema.index({ content: 'text' }); // Text search index

const Message = mongoose.model('Message', messageSchema);

export default Message;

