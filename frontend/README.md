# Frontend - Chat App

## Setup

1. Install dependencies:
```bash
npm install
```

2. (Optional) Create `.env` file:
```bash
echo "VITE_API_URL=http://localhost:5000" > .env
echo "VITE_SOCKET_URL=http://localhost:5000" >> .env
```

3. Start the development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

5. Preview production build:
```bash
npm run preview
```

## Environment Variables

Optional variables (have defaults):
- `VITE_API_URL` - Backend API URL (default: http://localhost:5000)
- `VITE_SOCKET_URL` - Socket.io server URL (default: http://localhost:5000)

## Tech Stack

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS
- **Zustand** - State management
- **Socket.io Client** - Real-time features
- **Axios** - HTTP client
- **Framer Motion** - Animations
- **React Router** - Navigation
- **React Hot Toast** - Notifications
- **Lucide React** - Icons

## Project Structure

```
src/
├── components/          # Reusable components
│   ├── ui/             # UI primitives (Button, Input, etc.)
│   ├── Sidebar.jsx     # Chat list sidebar
│   ├── ChatWindow.jsx  # Main chat interface
│   └── ...
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
├── pages/              # Page components
├── services/           # API and Socket services
├── store/              # Zustand stores
├── App.jsx             # Main app component
├── main.jsx            # Entry point
└── index.css           # Global styles
```

## State Management

### Stores (Zustand)
- `authStore` - Authentication state
- `chatStore` - Chat list and selected chat
- `messageStore` - Messages and typing status
- `userStore` - Users and online status
- `themeStore` - Theme preference

## Features

- ✅ Real-time messaging
- ✅ One-to-one and group chats
- ✅ Typing indicators
- ✅ Online/offline status
- ✅ Read receipts
- ✅ Image uploads
- ✅ Dark/light theme
- ✅ Responsive design
- ✅ Beautiful animations
- ✅ Toast notifications

## Customization

### Theme Colors
Edit `src/index.css` to customize theme colors.

### Components
All components are in `src/components/` and can be customized.

### Styling
Uses Tailwind CSS utility classes. Configure in `tailwind.config.js`.

