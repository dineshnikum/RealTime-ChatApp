import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, MessageCircle } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, isLoading } = useAuthStore();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = await login(email, password);
        if (success) {
            navigate('/chat');
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                <div className="rounded-2xl bg-card p-8 shadow-2xl border border-border">
                    {/* Logo */}
                    <div className="mb-8 flex justify-center">
                        <motion.div
                            className="flex h-16 w-16 items-center justify-center rounded-full bg-primary"
                            whileHover={{ scale: 1.1, rotate: 360 }}
                            transition={{ duration: 0.5 }}
                        >
                            <MessageCircle className="h-8 w-8 text-primary-foreground" />
                        </motion.div>
                    </div>

                    {/* Title */}
                    <div className="mb-8 text-center">
                        <h1 className="text-3xl font-bold text-foreground">Welcome Back</h1>
                        <p className="mt-2 text-muted-foreground">
                            Sign in to continue to your chats
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Email */}
                        <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-medium text-foreground">
                                Email
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="pl-10"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="space-y-2">
                            <label htmlFor="password" className="text-sm font-medium text-foreground">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="pl-10"
                                    required
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Signing in...' : 'Sign In'}
                        </Button>
                    </form>

                    {/* Sign up link */}
                    <p className="mt-6 text-center text-sm text-muted-foreground">
                        Don't have an account?{' '}
                        <Link
                            to="/signup"
                            className="font-medium text-primary hover:underline"
                        >
                            Sign up
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;

