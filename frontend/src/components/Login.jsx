import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const Login = ({ onClose, onSwitchToSignup }) => {
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const result = await login(email, password);
        setLoading(false);

        if (result.success) {
            onClose();
        } else {
            setError(result.error);
        }
    };

    return (
        <motion.div
            className="auth-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
        >
            <motion.div
                className="auth-modal-content"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
            >
                <button className="auth-close-btn" onClick={onClose}>×</button>

                <div className="auth-header">
                    <h2>Welcome Back</h2>
                    <p>Sign in to your account</p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    {error && (
                        <motion.div
                            className="auth-error"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            {error}
                        </motion.div>
                    )}

                    <div className="auth-input-group">
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder=" "
                            required
                            className="auth-input"
                            disabled={loading}
                        />
                        <label className="auth-label">Email Address</label>
                    </div>

                    <div className="auth-input-group">
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder=" "
                            required
                            className="auth-input"
                            disabled={loading}
                        />
                        <label className="auth-label">Password</label>
                    </div>

                    <button
                        type="submit"
                        className="auth-submit-btn"
                        disabled={loading}
                    >
                        {loading ? (
                            <span className="auth-spinner"></span>
                        ) : (
                            'Sign In'
                        )}
                    </button>
                </form>

                <div className="auth-footer">
                    <p>
                        Don't have an account?{' '}
                        <button
                            className="auth-link-btn"
                            onClick={onSwitchToSignup}
                        >
                            Sign Up
                        </button>
                    </p>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default Login;
