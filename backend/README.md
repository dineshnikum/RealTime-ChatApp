# Backend - Chat App API

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```bash
cp .env.example .env
```

3. Configure environment variables in `.env`:
- Set your MongoDB URI
- Generate JWT secrets (use a strong random string)
- Add your Cloudinary credentials

4. Start the server:
```bash
# Development mode with auto-restart
npm run dev

# Production mode
npm start
```

## Environment Variables

Required variables:
- `PORT` - Server port (default: 5000)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `JWT_REFRESH_SECRET` - Secret key for refresh tokens
- `CLIENT_URL` - Frontend URL for CORS
- `CLOUDINARY_CLOUD_NAME` - Cloudinary cloud name
- `CLOUDINARY_API_KEY` - Cloudinary API key
- `CLOUDINARY_API_SECRET` - Cloudinary API secret

## API Documentation

### Authentication Endpoints
- POST `/api/auth/signup` - Register new user
- POST `/api/auth/login` - Login user
- POST `/api/auth/logout` - Logout user
- POST `/api/auth/refresh` - Refresh access token
- GET `/api/auth/me` - Get current user
- PUT `/api/auth/profile` - Update profile

### User Endpoints
- GET `/api/users` - Get all users
- GET `/api/users/search?query=` - Search users
- GET `/api/users/:id` - Get user by ID
- PUT `/api/users/status` - Update status

### Chat Endpoints
- GET `/api/chats` - Get all chats
- POST `/api/chats` - Create/access chat
- POST `/api/chats/group` - Create group
- PUT `/api/chats/group/rename` - Rename group
- PUT `/api/chats/group/add` - Add user
- PUT `/api/chats/group/remove` - Remove user

### Message Endpoints
- GET `/api/messages/:chatId` - Get messages
- POST `/api/messages` - Send message
- PUT `/api/messages/seen` - Mark as seen
- GET `/api/messages/search/:chatId?query=` - Search
- POST `/api/messages/upload` - Upload image

## Database Models

### User
- name, email, password
- avatar, bio
- status (online/offline/away)
- lastSeen

### Chat
- chatName, isGroupChat
- users[], groupAdmin
- latestMessage
- unreadCount[]

### Message
- sender, content, chat
- imageUrl
- seenBy[]
- messageType (text/image/system)

## Socket.io Events

### Client Events
- join-chat, leave-chat
- new-message
- typing, stop-typing
- update-status
- message-seen

### Server Events
- message-received
- typing, stop-typing
- user-online, user-offline
- user-status-changed
- message-seen
- group-created, added-to-group
- removed-from-group, group-renamed

