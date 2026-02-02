import React from 'react';
import { motion } from 'framer-motion';

const EyeScannerLoading = ({ size = 'medium', message = 'Processing...' }) => {
    const sizeMap = {
        small: { container: 80, iris: 60, pupil: 20, beam: 70 },
        medium: { container: 120, iris: 90, pupil: 30, beam: 105 },
        large: { container: 160, iris: 120, pupil: 40, beam: 140 }
    };

    const dimensions = sizeMap[size];

    return (
        <div className="eye-scanner-container" style={{ textAlign: 'center' }}>
            <div
                className="eye-scanner-wrapper"
                style={{
                    width: dimensions.container,
                    height: dimensions.container,
                    margin: '0 auto',
                    position: 'relative'
                }}
            >
                {/* Outer Glow Ring */}
                <motion.div
                    className="scanner-glow-ring"
                    animate={{
                        opacity: [0.3, 0.6, 0.3],
                        scale: [1, 1.1, 1]
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    style={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        borderRadius: '50%',
                        border: '3px solid #0066CC',
                        boxShadow: '0 0 20px rgba(0, 102, 204, 0.5)',
                        top: 0,
                        left: 0
                    }}
                />

                {/* Iris Circle */}
                <div
                    className="scanner-iris"
                    style={{
                        position: 'absolute',
                        width: dimensions.iris,
                        height: dimensions.iris,
                        borderRadius: '50%',
                        border: '4px solid #0066CC',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        background: 'radial-gradient(circle, rgba(0, 102, 204, 0.1) 0%, rgba(0, 168, 232, 0.05) 100%)'
                    }}
                >
                    {/* Iris Pattern Lines */}
                    {[...Array(12)].map((_, i) => (
                        <div
                            key={i}
                            style={{
                                position: 'absolute',
                                width: '2px',
                                height: '40%',
                                background: 'linear-gradient(to bottom, rgba(0, 102, 204, 0.3), transparent)',
                                top: '50%',
                                left: '50%',
                                transformOrigin: 'top center',
                                transform: `translate(-50%, 0) rotate(${i * 30}deg)`
                            }}
                        />
                    ))}

                    {/* Pupil */}
                    <motion.div
                        className="scanner-pupil"
                        animate={{
                            scale: [1, 0.85, 1]
                        }}
                        transition={{
                            duration: 2.5,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        style={{
                            position: 'absolute',
                            width: dimensions.pupil,
                            height: dimensions.pupil,
                            borderRadius: '50%',
                            background: 'radial-gradient(circle, #0066CC 0%, #0052A3 100%)',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            boxShadow: '0 0 15px rgba(0, 102, 204, 0.8)'
                        }}
                    />
                </div>

                {/* Rotating Scan Beam */}
                <motion.div
                    className="scanner-beam"
                    animate={{
                        rotate: 360
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                    style={{
                        position: 'absolute',
                        width: dimensions.beam,
                        height: dimensions.beam,
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)'
                    }}
                >
                    {/* Scan Arc */}
                    <svg
                        width={dimensions.beam}
                        height={dimensions.beam}
                        viewBox="0 0 100 100"
                        style={{ overflow: 'visible' }}
                    >
                        <defs>
                            <linearGradient id="scanGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="rgba(0, 168, 232, 0)" />
                                <stop offset="50%" stopColor="rgba(0, 168, 232, 0.8)" />
                                <stop offset="100%" stopColor="rgba(0, 102, 204, 0)" />
                            </linearGradient>
                        </defs>
                        <path
                            d="M 50 5 A 45 45 0 0 1 85 25"
                            fill="none"
                            stroke="url(#scanGradient)"
                            strokeWidth="3"
                            strokeLinecap="round"
                            filter="url(#glow)"
                        />
                        <filter id="glow">
                            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                            <feMerge>
                                <feMergeNode in="coloredBlur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </svg>
                </motion.div>

                {/* Corner Grid Lines */}
                <div className="scanner-grid" style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    top: 0,
                    left: 0
                }}>
                    {/* Top Left */}
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '20px',
                        height: '2px',
                        background: '#0066CC'
                    }} />
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '2px',
                        height: '20px',
                        background: '#0066CC'
                    }} />

                    {/* Top Right */}
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        width: '20px',
                        height: '2px',
                        background: '#0066CC'
                    }} />
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        width: '2px',
                        height: '20px',
                        background: '#0066CC'
                    }} />

                    {/* Bottom Left */}
                    <div style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        width: '20px',
                        height: '2px',
                        background: '#0066CC'
                    }} />
                    <div style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        width: '2px',
                        height: '20px',
                        background: '#0066CC'
                    }} />

                    {/* Bottom Right */}
                    <div style={{
                        position: 'absolute',
                        bottom: 0,
                        right: 0,
                        width: '20px',
                        height: '2px',
                        background: '#0066CC'
                    }} />
                    <div style={{
                        position: 'absolute',
                        bottom: 0,
                        right: 0,
                        width: '2px',
                        height: '20px',
                        background: '#0066CC'
                    }} />
                </div>
            </div>

            {/* Loading Message */}
            {message && (
                <motion.p
                    className="scanner-message"
                    animate={{
                        opacity: [0.6, 1, 0.6]
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    style={{
                        marginTop: '20px',
                        color: '#0066CC',
                        fontWeight: 600,
                        fontSize: size === 'small' ? '14px' : size === 'medium' ? '16px' : '18px',
                        letterSpacing: '0.5px'
                    }}
                >
                    {message}
                </motion.p>
            )}
        </div>
    );
};

export default EyeScannerLoading;
