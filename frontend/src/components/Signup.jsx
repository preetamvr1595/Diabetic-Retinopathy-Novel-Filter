import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';

const Signup = ({ onClose, onSwitchToLogin }) => {
    const { signup } = useAuth();
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const getPasswordStrength = (pwd) => {
        if (pwd.length === 0) return { strength: 0, label: '' };
        if (pwd.length < 6) return { strength: 1, label: 'Weak', color: '#ff4444' };
        if (pwd.length < 10) return { strength: 2, label: 'Fair', color: '#ff9800' };
        if (pwd.length < 14) return { strength: 3, label: 'Good', color: '#4CAF50' };
        return { strength: 4, label: 'Strong', color: '#2196F3' };
    };

    const passwordStrength = getPasswordStrength(password);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validation
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (password.length < 8) {
            setError('Password must be at least 8 characters long');
            return;
        }

        setLoading(true);
        const result = await signup(email, password, username);
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
                    <h2>Create Account</h2>
                    <p>Join us to get started</p>
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
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder=" "
                            className="auth-input"
                            disabled={loading}
                        />
                        <label className="auth-label">Username (Optional)</label>
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
                        {password && (
                            <div className="password-strength-bar">
                                <div
                                    className="password-strength-fill"
                                    style={{
                                        width: `${(passwordStrength.strength / 4) * 100}%`,
                                        backgroundColor: passwordStrength.color
                                    }}
                                ></div>
                            </div>
                        )}
                        {password && (
                            <span className="password-strength-label" style={{ color: passwordStrength.color }}>
                                {passwordStrength.label}
                            </span>
                        )}
                    </div>

                    <div className="auth-input-group">
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder=" "
                            required
                            className="auth-input"
                            disabled={loading}
                        />
                        <label className="auth-label">Confirm Password</label>
                    </div>

                    <button
                        type="submit"
                        className="auth-submit-btn"
                        disabled={loading}
                    >
                        {loading ? (
                            <span className="auth-spinner"></span>
                        ) : (
                            'Create Account'
                        )}
                    </button>
                </form>

                <div className="auth-footer">
                    <p>
                        Already have an account?{' '}
                        <button
                            className="auth-link-btn"
                            onClick={onSwitchToLogin}
                        >
                            Sign In
                        </button>
                    </p>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default Signup;
