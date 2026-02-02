import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const AuthPage = () => {
    const { login, signup } = useAuth();
    const [isLogin, setIsLogin] = useState(true);
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
        setLoading(true);

        if (!isLogin) {
            // Signup validation
            if (password !== confirmPassword) {
                setError('Passwords do not match');
                setLoading(false);
                return;
            }
            if (password.length < 8) {
                setError('Password must be at least 8 characters long');
                setLoading(false);
                return;
            }

            const result = await signup(email, password, username);
            setLoading(false);
            if (!result.success) {
                setError(result.error);
            }
        } else {
            // Login
            const result = await login(email, password);
            setLoading(false);
            if (!result.success) {
                setError(result.error);
            }
        }
    };

    const toggleMode = () => {
        setIsLogin(!isLogin);
        setError('');
        setPassword('');
        setConfirmPassword('');
    };

    return (
        <div className="auth-page">
            {/* Animated Background */}
            <div className="auth-bg-animation">
                <div className="gradient-orb orb-1"></div>
                <div className="gradient-orb orb-2"></div>
                <div className="gradient-orb orb-3"></div>
            </div>

            <div className="auth-container">
                {/* Left Side - Branding */}
                <motion.div
                    className="auth-branding"
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="auth-logo-section">
                        {/* Animated Eye Scanner Graphic */}
                        <motion.div
                            className="retina-scan-graphic"
                            style={{ marginBottom: '30px' }}
                            animate={{
                                scale: [1, 1.02, 1],
                            }}
                            transition={{
                                duration: 4,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        >
                            <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                                {/* Outer eye circle */}
                                <circle cx="100" cy="100" r="90" stroke="rgba(255,255,255,0.3)" strokeWidth="2" fill="none" />

                                {/* Iris */}
                                <circle cx="100" cy="100" r="60" fill="rgba(255,255,255,0.1)" />

                                {/* Iris details - radial lines */}
                                {[...Array(16)].map((_, i) => {
                                    const angle = (i * 360) / 16;
                                    const rad = (angle * Math.PI) / 180;
                                    const x1 = 100 + 35 * Math.cos(rad);
                                    const y1 = 100 + 35 * Math.sin(rad);
                                    const x2 = 100 + 60 * Math.cos(rad);
                                    const y2 = 100 + 60 * Math.sin(rad);
                                    return (
                                        <line
                                            key={i}
                                            x1={x1}
                                            y1={y1}
                                            x2={x2}
                                            y2={y2}
                                            stroke="rgba(255,255,255,0.2)"
                                            strokeWidth="1.5"
                                        />
                                    );
                                })}

                                {/* Pupil */}
                                <motion.circle
                                    cx="100"
                                    cy="100"
                                    r="25"
                                    fill="rgba(255,255,255,0.9)"
                                    animate={{
                                        r: [25, 22, 25],
                                    }}
                                    transition={{
                                        duration: 3,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    }}
                                />

                                {/* Scanning beam */}
                                <motion.g
                                    animate={{
                                        rotate: 360
                                    }}
                                    transition={{
                                        duration: 4,
                                        repeat: Infinity,
                                        ease: "linear"
                                    }}
                                    style={{ transformOrigin: "100px 100px" }}
                                >
                                    <path
                                        d="M 100 10 A 90 90 0 0 1 145 30"
                                        stroke="rgba(255,255,255,0.6)"
                                        strokeWidth="3"
                                        fill="none"
                                        strokeLinecap="round"
                                    />
                                </motion.g>

                                {/* Corner brackets */}
                                <path d="M 10 10 L 10 30 M 10 10 L 30 10" stroke="rgba(255,255,255,0.5)" strokeWidth="2" strokeLinecap="round" />
                                <path d="M 190 10 L 190 30 M 190 10 L 170 10" stroke="rgba(255,255,255,0.5)" strokeWidth="2" strokeLinecap="round" />
                                <path d="M 10 190 L 10 170 M 10 190 L 30 190" stroke="rgba(255,255,255,0.5)" strokeWidth="2" strokeLinecap="round" />
                                <path d="M 190 190 L 190 170 M 190 190 L 170 190" stroke="rgba(255,255,255,0.5)" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                        </motion.div>

                        <h1 className="auth-brand-title">Diabetic Retinopathy</h1>
                        <h2 className="auth-brand-subtitle">Analysis Platform</h2>
                        <p className="auth-brand-description">
                            Advanced AI-powered diagnostic tool for early detection and classification of diabetic retinopathy
                        </p>
                    </div>

                    <div className="auth-features">
                        <div className="auth-feature">
                            <span className="feature-icon">🎯</span>
                            <span className="feature-text">High Accuracy AI Models</span>
                        </div>
                        <div className="auth-feature">
                            <span className="feature-icon">⚡</span>
                            <span className="feature-text">Real-time Analysis</span>
                        </div>
                        <div className="auth-feature">
                            <span className="feature-icon">🔒</span>
                            <span className="feature-text">Secure & Confidential</span>
                        </div>
                    </div>
                </motion.div>

                {/* Right Side - Form */}
                <motion.div
                    className="auth-form-section"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="auth-form-container">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={isLogin ? 'login' : 'signup'}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="auth-form-header">
                                    <h2>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
                                    <p>{isLogin ? 'Sign in to continue to your dashboard' : 'Join us to start analyzing retinal images'}</p>
                                </div>

                                <form onSubmit={handleSubmit} className="auth-form-main">
                                    {error && (
                                        <motion.div
                                            className="auth-error-full"
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                        >
                                            <span className="error-icon">⚠️</span>
                                            {error}
                                        </motion.div>
                                    )}

                                    <div className="form-group-full">
                                        <label className="form-label-full">Email Address</label>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            className="form-input-full"
                                            placeholder="you@example.com"
                                            disabled={loading}
                                        />
                                    </div>

                                    {!isLogin && (
                                        <div className="form-group-full">
                                            <label className="form-label-full">Username (Optional)</label>
                                            <input
                                                type="text"
                                                value={username}
                                                onChange={(e) => setUsername(e.target.value)}
                                                className="form-input-full"
                                                placeholder="Your name"
                                                disabled={loading}
                                            />
                                        </div>
                                    )}

                                    <div className="form-group-full">
                                        <label className="form-label-full">Password</label>
                                        <input
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                            className="form-input-full"
                                            placeholder="••••••••"
                                            disabled={loading}
                                        />
                                        {!isLogin && password && (
                                            <>
                                                <div className="password-strength-bar-full">
                                                    <div
                                                        className="password-strength-fill-full"
                                                        style={{
                                                            width: `${(passwordStrength.strength / 4) * 100}%`,
                                                            backgroundColor: passwordStrength.color
                                                        }}
                                                    ></div>
                                                </div>
                                                <span className="password-strength-text" style={{ color: passwordStrength.color }}>
                                                    {passwordStrength.label}
                                                </span>
                                            </>
                                        )}
                                    </div>

                                    {!isLogin && (
                                        <div className="form-group-full">
                                            <label className="form-label-full">Confirm Password</label>
                                            <input
                                                type="password"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                required
                                                className="form-input-full"
                                                placeholder="••••••••"
                                                disabled={loading}
                                            />
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        className="auth-submit-full"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <span className="auth-spinner-full"></span>
                                        ) : (
                                            isLogin ? 'Sign In' : 'Create Account'
                                        )}
                                    </button>
                                </form>

                                <div className="auth-toggle">
                                    <p>
                                        {isLogin ? "Don't have an account?" : "Already have an account?"}
                                        <button
                                            type="button"
                                            onClick={toggleMode}
                                            className="auth-toggle-btn"
                                        >
                                            {isLogin ? 'Sign Up' : 'Sign In'}
                                        </button>
                                    </p>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default AuthPage;
