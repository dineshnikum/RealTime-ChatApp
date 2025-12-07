import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuthStore } from './store/authStore';
import { useThemeStore } from './store/themeStore';

// Pages
import Login from './pages/Login';
import Signup from './pages/Signup';
import Chat from './pages/Chat';
import Loading from './components/Loading';

function App() {
    const { user, isLoading, checkAuth } = useAuthStore();
    const { theme } = useThemeStore();

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    useEffect(() => {
        // Apply theme to document
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [theme]);

    if (isLoading) {
        return <Loading />;
    }

    return (
        <Routes>
            <Route
                path="/"
                element={user ? <Navigate to="/chat" /> : <Navigate to="/login" />}
            />
            <Route
                path="/login"
                element={!user ? <Login /> : <Navigate to="/chat" />}
            />
            <Route
                path="/signup"
                element={!user ? <Signup /> : <Navigate to="/chat" />}
            />
            <Route
                path="/chat"
                element={user ? <Chat /> : <Navigate to="/login" />}
            />
        </Routes>
    );
}

export default App;

