# 💬 Real-Time Chat Application

A modern, full-stack real-time chat application built with the MERN stack (MongoDB, Express, React, Node.js) and Socket.io for real-time messaging.

## ✨ Features

### Authentication

- ✅ User signup and login with JWT authentication
- ✅ Secure password hashing with bcrypt
- ✅ Token refresh mechanism
- ✅ Protected routes

### Chat Features

- ✅ One-to-one messaging
- ✅ Group chat creation
- ✅ Real-time message delivery
- ✅ Typing indicators
- ✅ Online/Offline status
- ✅ Read receipts (seen by)
- ✅ Message timestamps
- ✅ Image upload support (Cloudinary)
- ✅ Message search
- ✅ User search

### UI/UX

- ✅ Modern, minimal design (Discord/Telegram-inspired)
- ✅ Dark/Light theme toggle
- ✅ Responsive design (mobile-friendly)
- ✅ Smooth animations (Framer Motion)
- ✅ Beautiful Shadcn UI components
- ✅ Toast notifications

## 🛠️ Tech Stack

### Frontend

- **React** - UI library
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Shadcn UI** - Component library
- **Zustand** - State management
- **Axios** - HTTP client
- **Socket.io Client** - Real-time communication
- **Framer Motion** - Animations
- **React Router** - Routing
- **React Hot Toast** - Notifications

### Backend

- **Node.js** - Runtime environment
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **Socket.io** - Real-time communication
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Cloudinary** - Image storage
- **Multer** - File upload

## 📁 Project Structure

```
chat-app-realtime/
├── backend/
│   ├── config/
│   │   ├── db.js
│   │   └── cloudinary.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── chatController.js
│   │   ├── messageController.js
│   │   └── userController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── error.js
│   │   └── upload.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Chat.js
│   │   └── Message.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── chatRoutes.js
│   │   ├── messageRoutes.js
│   │   └── userRoutes.js
│   ├── socket/
│   │   └── socket.js
│   ├── .env.example
│   ├── .gitignore
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/
│   │   │   │   ├── Avatar.jsx
│   │   │   │   ├── Button.jsx
│   │   │   │   ├── Input.jsx
│   │   │   │   └── ScrollArea.jsx
│   │   │   ├── ChatListItem.jsx
│   │   │   ├── ChatWindow.jsx
│   │   │   ├── CreateGroupModal.jsx
│   │   │   ├── Loading.jsx
│   │   │   ├── MessageInput.jsx
│   │   │   ├── MessageItem.jsx
│   │   │   ├── MessageList.jsx
│   │   │   ├── NewChatModal.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── TypingIndicator.jsx
│   │   │   └── UserProfileModal.jsx
│   │   ├── hooks/
│   │   │   └── useSocketListeners.js
│   │   ├── lib/
│   │   │   └── utils.js
│   │   ├── pages/
│   │   │   ├── Chat.jsx
│   │   │   ├── Login.jsx
│   │   │   └── Signup.jsx
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   └── socket.js
│   │   ├── store/
│   │   │   ├── authStore.js
│   │   │   ├── chatStore.js
│   │   │   ├── messageStore.js
│   │   │   ├── themeStore.js
│   │   │   └── userStore.js
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── .gitignore
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   └── vite.config.js
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- Cloudinary account (for image uploads)

### Installation

1. **Clone the repository**

```bash
git clone <repository-url>
cd chat-app-realtime
```

2. **Set up Backend**

```bash
cd backend
npm install


```

3. **Set up Frontend**

```bash
cd ../frontend
npm install

# Create .env file (optional, has defaults)
echo "VITE_API_URL=http://localhost:5000" > .env
echo "VITE_SOCKET_URL=http://localhost:5000" >> .env
```

4. **Start MongoDB**

```bash
# If using local MongoDB
mongod
```

5. **Run the Application**

In one terminal (backend):

```bash
cd backend
npm run dev
```

In another terminal (frontend):

```bash
cd frontend
npm run dev
```

6. **Access the Application**

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## 🔑 Environment Variables

### Backend (.env)

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/chat-app
JWT_SECRET=your_jwt_secret_key_here
JWT_REFRESH_SECRET=your_jwt_refresh_secret_key_here
JWT_EXPIRE=7d
JWT_REFRESH_EXPIRE=30d
NODE_ENV=development
CLIENT_URL=http://localhost:5173
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Frontend (.env)

```env
VITE_API_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000
```

## 📡 API Endpoints

### Authentication

- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile

### Users

- `GET /api/users` - Get all users
- `GET /api/users/search?query=` - Search users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/status` - Update user status

### Chats

- `GET /api/chats` - Get all chats
- `POST /api/chats` - Create or access one-to-one chat
- `POST /api/chats/group` - Create group chat
- `PUT /api/chats/group/rename` - Rename group
- `PUT /api/chats/group/add` - Add user to group
- `PUT /api/chats/group/remove` - Remove user from group

### Messages

- `GET /api/messages/:chatId` - Get messages for a chat
- `POST /api/messages` - Send a message
- `PUT /api/messages/seen` - Mark messages as seen
- `GET /api/messages/search/:chatId?query=` - Search messages
- `POST /api/messages/upload` - Upload image

## 🔌 Socket.io Events

### Client → Server

- `join-chat` - Join a chat room
- `leave-chat` - Leave a chat room
- `new-message` - Send a new message
- `typing` - Start typing
- `stop-typing` - Stop typing
- `update-status` - Update user status
- `message-seen` - Mark message as seen

### Server → Client

- `message-received` - Receive a new message
- `typing` - User is typing
- `stop-typing` - User stopped typing
- `user-online` - User came online
- `user-offline` - User went offline
- `user-status-changed` - User status changed
- `message-seen` - Message was seen
- `group-created` - Group was created
- `added-to-group` - Added to a group
- `removed-from-group` - Removed from a group
- `group-renamed` - Group was renamed

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt (10 rounds)
- Protected API routes
- Token refresh mechanism
- Input validation
- CORS configuration
- File upload validation
- XSS protection

## 📱 Responsive Design

- Mobile-first approach
- Breakpoint: `md:` for tablet and desktop
- Touch-friendly UI elements
- Optimized for all screen sizes

## 🌙 Theme Support

- Light theme (default)
- Dark theme
- Persistent theme selection
- Tailwind class-based theming

## 🤝 Contributing

Feel free to contribute to this project by:

1. Forking the repository
2. Creating a feature branch
3. Committing your changes
4. Opening a pull request

## 📄 License

This project is open source and available under the MIT License.

## 👨‍💻 Author

**Dinesh Nikum**
